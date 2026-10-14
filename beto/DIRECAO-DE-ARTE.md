# Sistema visual da landing de ingressos
## v2, out/2026 | referência: betocarrero.com.br/atracoes

## 1. A decisão que governa tudo

A v1 desta página aplicou o **Manual de Marca do Grupo Green**: oliva, creme,
Playfair, pouca foto, muito respiro. Está certo para a pousada e está errado
aqui, e o motivo é simples: o cliente não está comprando a Green Beach, está
comprando a montanha-russa. Uma página sóbria vendendo parque de diversões
entrega a promessa errada antes da primeira palavra.

**Esta página deixa de ser uma página da Green Beach com assunto Beto
Carrero, e passa a ser uma página do Beto Carrero assinada pela Green Beach.**

Isso quebra o manual do Grupo Green de propósito. A quebra está escrita aqui
para que seja decisão e não acidente, e para que ninguém "conserte" de volta
daqui a três meses. A Green Beach aparece onde importa: cabeçalho, rodapé,
bloco de hospedagem e toda mensagem de WhatsApp.

O sistema da pousada continua válido e intocado em
`green-beach/direcao-de-arte-v3.md`. Os dois convivem, em páginas diferentes.

## 2. O que foi medido na referência

Captura de `www2.betocarrero.com.br/atracoes` em 14/10/2026, página inteira a
1280 px de largura, 11.749 px de altura. As cores abaixo saíram de contagem
de pixel na captura, não de estimativa.

**Papel** `#F9F7F4`, um off-white quente, e não branco puro. É o fundo da
página inteira e é a cor mais presente da captura.

**Cabeçalho** `#002552`, azul-marinho quase preto. É a única superfície
escura fixa.

**A paleta de festa**, que é o que dá a cara da página. Cada cartão de
atração pega uma cor, e a variedade é o ponto: uma grade de dezesseis
cartões em duas cores parece erro, em dez cores parece parque.

| Cor | Hex | Onde apareceu |
|---|---|---|
| vermelho | `#CA293E` | faixa do topo e cartões |
| vermelho escuro | `#A9272D` | cartões |
| magenta | `#BC1469` | cartões |
| rosa | `#D1348B` | selos |
| roxo | `#7B4692` | cartões |
| roxo escuro | `#662D80` | cartões |
| azul-violeta | `#475491` | cartões |
| azul | `#006EB2` | cartões |
| azul céu | `#53B3DE` | cartões |
| verde-água | `#4ECCA8` | cartões |
| esmeralda | `#0FB98B` | cartões |
| verde | `#57A118` | cartões |
| amarelo | `#DDB833` | selos e cartões |
| laranja | `#F9A91F` | selos |
| laranja queimado | `#E7791D` | cartões |

**Tipografia.** O site usa Helios Antique, que é fonte proprietária e não está
no Google Fonts, mais Lato em peso 700 nos selos. A substituta de Helios é
**Nunito**: grotesca geométrica de terminais arredondados, com 800 e 900
disponíveis, que é o que a referência pede. **Lato** entra como está, porque
é literalmente uma das fontes que eles carregam.

- display e rótulo: Nunito 800 e 900
- corpo: Lato 400 e 700

**Forma.** Foto sem raio nenhum, colada na borda do cartão e colada na coluna
vizinha, sem medianiz. O corpo colorido do cartão tem raio grande, na casa
dos 16 px. Os selos são pílulas de raio total.

## 3. A peça central: o cartão de atração

É o componente que carrega a página. Anatomia, de cima para baixo:

1. **Foto sangrando**, proporção larga, sem raio, sem moldura, sem véu.
2. **Pílula branca com o nome da atração**, sobreposta na junção entre a foto
   e o corpo. Texto em Nunito 800, na cor do cartão. Essa pílula é a
   assinatura do sistema: é ela que amarra foto e cor.
3. **Corpo na cor do cartão**, com a descrição em CAIXA ALTA branca, curta e
   truncada. Caixa alta aqui funciona porque o texto é de três linhas, não de
   três parágrafos.
4. **Dois selos à direita**, empilhados: altura mínima, em pílula branca com
   seta vertical, e restrições, em pílula escura com ponto de exclamação.

A altura mínima é o dado mais valioso da grade e nenhum revendedor mostra.
Pai de criança procura exatamente isso antes de comprar, e quem responde
primeiro ganha a venda.

## 4. O que muda em relação à v1

| v1 | v2 |
|---|---|
| creme e oliva | papel quente e dez cores saturadas |
| Playfair + Source Sans | Nunito + Lato |
| raio zero em tudo | raio zero na foto, raio grande no cartão, pílula nos selos |
| fio em vez de sombra | cor chapada em vez de fio |
| uma faixa escura na página | cabeçalho navy fixo, resto colorido |
| foto escassa, muito respiro | foto em toda parte, respiro apertado |
| título longo em três linhas, itálico dourado | título curto, caixa alta, peso 900 |

O que **não** muda, e é por isso que esta virada é barata: o motor. Cálculo de
preço por data, as três faixas de criança, o calendário com as datas
fechadas, a mensagem pronta do WhatsApp com protocolo, o Schema, os preços
apurados e o FAQ continuam exatamente como estão. A v2 troca a pele, não o
esqueleto.

## 5. O que continua proibido

Mesmo numa página colorida, três coisas seguem fora, e as três são as que
fazem peça parecer amadora:

- Foto de banco de imagem ilustrando serviço real.
- Imagem gerada por IA no lugar de foto de atração. Numa página de produto
  isso não é estética, é propaganda enganosa.
- Puxar imagem direto do servidor do parque. Some quando eles trocarem o
  arquivo, e é uso de banda e de imagem alheia.

## 6. A pendência que trava metade do sistema

A grade de atrações precisa de foto de atração, e não existe nenhuma em mãos.
Até o material oficial de parceiro chegar, o cartão renderiza em **estado de
cor**: o bloco da foto vira a cor do cartão com o nome em tipo grande. Fica
intencional em vez de quebrado, e trocar depois é soltar o arquivo na pasta
`public/fotos/atracoes/` com o nome que está no dado.

Canal para pedir: `pacotes@betocarrero.com.br`, central (47) 3261-2222, e o
portal do agente, que é a via oficial para conseguir artes com permissão.
