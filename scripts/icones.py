#!/usr/bin/env python3
"""
Gera favicon e icones do app a partir do mesmo desenho de public/favicon.svg.

    python3 scripts/icones.py

Por que nao usar a rosacea original: o traco dela tem 1,64% da largura da
marca. Num icone de 32px isso vira meio pixel e o desenho vira mancha. Aqui a
rosacea e redesenhada com traco grosso, mantendo a leitura da marca.
"""

from pathlib import Path
import math

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "site" / "public"

VERDE = (36, 45, 33)
DOURADO = (229, 182, 78)
CREME = (247, 235, 210)

BASE = 512  # desenha grande e reduz, para o traco ficar limpo


def desenhar(tamanho: int, com_fundo: bool = True) -> Image.Image:
    img = Image.new("RGBA", (BASE, BASE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = BASE / 2

    if com_fundo:
        raio_canto = round(BASE * 0.22)
        d.rounded_rectangle([0, 0, BASE - 1, BASE - 1], radius=raio_canto, fill=VERDE)

    # Quatro circulos entrelacados, o gesto que sobra da mandala original.
    r = BASE * 0.164
    deslocamento = BASE * 0.082
    traco = max(2, round(BASE * 0.0205))
    for dx, dy in [(0, -deslocamento), (0, deslocamento), (-deslocamento, 0), (deslocamento, 0)]:
        d.ellipse([c + dx - r, c + dy - r, c + dx + r, c + dy + r], outline=DOURADO, width=traco)

    # Estrela de oito pontas por cima, que e o miolo do simbolo.
    raio_externo = BASE * 0.305
    raio_interno = BASE * 0.152
    pontos = []
    for i in range(16):
        angulo = math.pi / 2 * -1 + i * math.pi / 8
        raio = raio_externo if i % 2 == 0 else raio_interno
        pontos.append((c + raio * math.cos(angulo), c + raio * math.sin(angulo)))
    d.polygon(pontos, outline=CREME, width=max(2, round(BASE * 0.0172)))

    return img.resize((tamanho, tamanho), Image.LANCZOS)


def main() -> None:
    for tamanho, nome in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"),
                          (192, "favicon-192.png"), (512, "favicon-512.png")]:
        icone = desenhar(tamanho)
        caminho = DESTINO / nome
        icone.convert("RGB").save(caminho, optimize=True)
        print(f"  {nome:24} {tamanho}x{tamanho}  {caminho.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
