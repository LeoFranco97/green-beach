# Material bruto

Nada aqui vai para o site direto. É o material de origem.

**As fotos originais não estão versionadas.** Elas pesavam 85 dos 95 MB do repositório, e existe cópia do acervo inteiro em outro lugar. O que o site realmente usa, as versões otimizadas em WebP, está versionado em `site/public/fotos`, então clonar e rodar funciona sem baixar nada.

Para regerar as fotos a partir do original, copie o acervo de volta:

```bash
# as 75 aéreas de Itapema, do acervo do Grupo Green
cp "green-decor/fotos itapema"/*/*.JPG assets-raw/originais/
python3 scripts/preparar-fotos.py
```

Os nomes que o site espera estão listados em `site/src/data/pousada.js`, no campo `arquivo` de cada foto.

## originais/

As fotos que alimentam o site. Coloque aqui o arquivo novo, com nome semântico, e rode:

```bash
python3 ../scripts/preparar-fotos.py
```

O script gera as versões otimizadas em `site/public/fotos/` e o manifesto que o site lê. Depois é só registrar a foto em `site/src/data/pousada.js`.

Hoje tem duas, e as duas saíram de posts do Instagram da pousada:

- `praia-itapema-aerea.jpg`: vista aérea da praia de Itapema, recortada da parte limpa do post de 03/09/2026. 1080x745, que é o máximo que o Instagram entrega. Para o hero o ideal seriam 2400px de largura.
- `fachada-green-beach.jpg`: a fachada da pousada com a placa, recortada da metade direita do post de 30/08/2026. 628x910.

## instagram/

Os seis posts baixados do @pousadagreenbeach em 10/09/2026, como vieram. São peças gráficas de marketing, com texto e selo por cima, não fotografia. Guardados porque as legendas trazem dados que o site usa: o WhatsApp (47) 99794-8332, a piscina, o café da manhã, a proximidade da praia e o endereço em Itapema.

## marca/

A logo oficial em PNG, nas três versões, em tamanho grande. O site usa as versões em WebP, que ficam em `site/src/assets/`. Estas aqui servem para impressão e para outras peças.
