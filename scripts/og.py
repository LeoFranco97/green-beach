#!/usr/bin/env python3
"""
Gera a imagem de compartilhamento (Open Graph) em 1200x630.

    python3 scripts/og.py

Usa a foto de capa real mais o lockup da marca sobre um veu verde, seguindo
os mesmos tokens da direcao de arte. Rode de novo se a foto de capa mudar.
"""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
FOTO = RAIZ / "assets-raw" / "originais" / "praia-itapema-aerea.jpg"
LOGO = RAIZ / "site" / "public" / "marca" / "green-beach-logo-clara.png"
SAIDA = RAIZ / "site" / "public" / "og-green-beach.jpg"

LARGURA, ALTURA = 1200, 630
VERDE = (20, 26, 18)


def main() -> None:
    foto = Image.open(FOTO).convert("RGB")

    # Recorte "cover" centrado, sem deformar a foto.
    escala = max(LARGURA / foto.width, ALTURA / foto.height)
    nova = (round(foto.width * escala), round(foto.height * escala))
    foto = foto.resize(nova, Image.LANCZOS)
    esq = (foto.width - LARGURA) // 2
    topo = round((foto.height - ALTURA) * 0.42)
    base = foto.crop((esq, topo, esq + LARGURA, topo + ALTURA))

    # Veu vertical, o mesmo desenho do hero: escuro em cima e embaixo, aberto
    # no meio para a foto respirar.
    veu = Image.new("L", (1, ALTURA))
    for y in range(ALTURA):
        t = y / (ALTURA - 1)
        if t < 0.18:
            a = 0.46 - (0.46 - 0.16) * (t / 0.18)
        elif t < 0.34:
            a = 0.16
        else:
            a = 0.16 + (0.86 - 0.16) * ((t - 0.34) / 0.66) ** 1.35
        veu.putpixel((0, y), round(a * 255))
    veu = veu.resize((LARGURA, ALTURA))

    # Mancha oval por tras da marca, para o lockup nao brigar com os predios.
    halo = Image.new("L", (LARGURA, ALTURA), 0)
    ImageDraw.Draw(halo).ellipse(
        [LARGURA // 2 - 330, ALTURA - 470, LARGURA // 2 + 330, ALTURA - 10],
        fill=120,
    )
    halo = halo.filter(ImageFilter.GaussianBlur(90))
    veu = ImageChops.lighter(veu, halo)

    camada = Image.new("RGB", (LARGURA, ALTURA), VERDE)
    base = Image.composite(camada, base, veu)

    # Lockup da marca, centrado na metade de baixo.
    logo = Image.open(LOGO).convert("RGBA")
    altura_logo = 300
    logo = logo.resize((round(logo.width * altura_logo / logo.height), altura_logo), Image.LANCZOS)
    base_rgba = base.convert("RGBA")
    base_rgba.alpha_composite(logo, ((LARGURA - logo.width) // 2, ALTURA - altura_logo - 96))

    # Filete dourado e a linha de endereco.
    desenho = ImageDraw.Draw(base_rgba)
    desenho.line([(LARGURA // 2 - 120, ALTURA - 64), (LARGURA // 2 + 120, ALTURA - 64)],
                 fill=(229, 182, 78, 210), width=2)

    base_rgba.convert("RGB").save(SAIDA, quality=88, optimize=True, progressive=True)
    print(f"{SAIDA}  {LARGURA}x{ALTURA}  {SAIDA.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
