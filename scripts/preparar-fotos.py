#!/usr/bin/env python3
"""
Prepara as fotos do site.

Le tudo que estiver em assets-raw/originais e gera, em site/public/fotos:
  - ate quatro larguras em WebP (800, 1280, 1920, 2560), para o srcset
  - uma miniatura de 24px borrada, usada como fundo no carregamento
  - o manifesto fotos.json, que o site le para montar srcset e proporcao

Rode de novo sempre que chegar foto nova da pousada:

    python3 scripts/preparar-fotos.py

Nomeie o original de forma semantica, porque o nome do arquivo vira a chave
usada em site/src/data/pousada.js. Exemplos:

    piscina.jpg
    apartamento-casal.jpg
    cafe-da-manha.jpg

O script nao amplia alem de 2x o original, para nao entregar foto borrada.
Se uma largura nao puder ser gerada, ela simplesmente nao entra no manifesto
e o navegador usa a maior disponivel.
"""

from pathlib import Path
import json
import sys

try:
    from PIL import Image, ImageFilter
except ImportError:
    sys.exit("Falta o Pillow. Instale com: python3 -m pip install Pillow")

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets-raw" / "originais"
DESTINO = RAIZ / "site" / "public" / "fotos"
MANIFESTO = DESTINO / "fotos.json"

LARGURAS = (800, 1280, 1920, 2560)
QUALIDADE = 78
AMPLIACAO_MAXIMA = 2.0

# 2560px so faz sentido para foto que sangra a tela inteira em monitor grande.
# Para foto de mosaico e de card, 1920 ja e mais do que suficiente, e cada
# arquivo de 2560 custa meio mega. Liste aqui, sem extensao, quem merece.
EXTRA_LARGAS = {
    "itapema-meia-praia-aerea",   # hero
    "itapema-por-do-sol",         # faixa de fechamento
    "itapema-orla-a-noite",       # faixa da secao de Itapema
    "itapema-baia-do-mirante",    # faixa larga
}
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}


def gerar(caminho: Path) -> dict:
    nome = caminho.stem
    imagem = Image.open(caminho).convert("RGB")
    original_w, original_h = imagem.size
    limite = int(original_w * AMPLIACAO_MAXIMA)

    teto = 2560 if nome in EXTRA_LARGAS else 1920

    larguras_geradas = []
    for largura in LARGURAS:
        if largura > limite or largura > teto:
            continue
        # Evita gerar duas vezes praticamente a mesma coisa.
        if larguras_geradas and largura > original_w and larguras_geradas[-1] >= original_w:
            continue

        altura = round(original_h * largura / original_w)
        saida = imagem.resize((largura, altura), Image.LANCZOS)
        # Ampliar pede mais nitidez, reduzir pede um toque leve.
        forca = 75 if largura > original_w else 55
        saida = saida.filter(ImageFilter.UnsharpMask(radius=0.8, percent=forca, threshold=3))

        destino = DESTINO / f"{nome}-{largura}.webp"
        saida.save(destino, "WEBP", quality=QUALIDADE, method=6)
        larguras_geradas.append(largura)
        print(f"  {destino.name:44} {largura}x{altura}  {destino.stat().st_size / 1024:.0f} KB")

    mini_h = max(1, round(original_h * 24 / original_w))
    mini = imagem.resize((24, mini_h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    destino_mini = DESTINO / f"{nome}-mini.webp"
    mini.save(destino_mini, "WEBP", quality=60, method=6)
    print(f"  {destino_mini.name:44} {24}x{mini_h}  {destino_mini.stat().st_size / 1024:.1f} KB")

    return {
        "larguras": larguras_geradas,
        "w": original_w,
        "h": original_h,
        "proporcao": round(original_w / original_h, 4),
    }


def main() -> None:
    if not ORIGEM.exists():
        sys.exit(f"Pasta nao encontrada: {ORIGEM}")
    DESTINO.mkdir(parents=True, exist_ok=True)

    arquivos = sorted(p for p in ORIGEM.iterdir() if p.suffix.lower() in EXTENSOES)
    if not arquivos:
        sys.exit(f"Nenhuma imagem em {ORIGEM}")

    manifesto = {}
    for arquivo in arquivos:
        print(f"\n{arquivo.name}")
        manifesto[arquivo.stem] = gerar(arquivo)

    MANIFESTO.write_text(json.dumps(manifesto, indent=2, ensure_ascii=False) + "\n")
    print(f"\n{len(arquivos)} foto(s) em {DESTINO}")
    print(f"Manifesto: {MANIFESTO}")


if __name__ == "__main__":
    main()
