# Material bruto

Nada aqui vai para o site direto. É o material de origem.

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
