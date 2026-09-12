# Referência: Woolmers Estate

Medições feitas direto no CSS computado de https://www.woolmers.com.au em
11/09/2026, numa janela de 1280px. Não é chute nem leitura de screenshot:
cada número aqui saiu de `getComputedStyle`.

O site é WordPress com Elementor, e o tema tem componentes próprios com
prefixo `c-` (`c-hero-banner`, `c-estate-carousel`, `c-search-fs`).

## O que faz ele ser bonito

Não é movimento. Essa foi a primeira surpresa: procurei biblioteca de scroll,
atributo de AOS, GSAP, Lenis, Locomotive, e não existe nenhuma. As únicas
animações da página inteira são quatro, todas pequenas:

| Animação | O que faz |
| --- | --- |
| `chbFadeUp` | 0.6s ease-out, entrada do slide do hero |
| `chbDotProgress` | barra de progresso do carrossel |
| `chbBounce` | 2s ease-in-out, a seta de rolagem quicando |
| `chbScrollThumb` | 2s ease-in-out, o polegar da trilha de rolagem |

Nenhum reveal por scroll. Nenhum parallax. O resto é padrão do Elementor
(spinner de carregamento, abertura de menu).

Ele é bonito por **tipografia, foto e espaço**. Isso muda o que vale copiar:
copiar o movimento dele seria copiar quase nada.

## Tipografia

| Papel | Fonte | Corpo | Entrelinha | Detalhe |
| --- | --- | --- | --- | --- |
| Display | Libre Baskerville 400 | 72px | 72px | entrelinha 1.0, colada |
| Destaque no display | Playfair Display 400 itálico | 72px | 72px | cor bronze |
| Olho | Inter | 16px | | caixa alta, espacejamento 4.8px (0.3em) |
| Corpo | Inter 400 | 20px | 33px | 1.65 |

O truque do título: três linhas no mesmo corpo, e a **última** em itálico
numa fonte diferente e numa cor diferente. Não é uma palavra destacada no
meio da frase, é a linha inteira, o que dá para a frase um fecho cantado.

```
Two World
Heritage Sites,          ← Libre Baskerville, branco
One Convict Walk         ← Playfair itálico, bronze
```

## Cor

| Token | Valor | Uso |
| --- | --- | --- |
| Fundo | `#FAF8F5` | branco quente, nunca branco puro |
| Tinta | `#4A3E36` | marrom acinzentado, nunca preto |
| Bronze | `#B89E6C` | acento, a linha itálica do display |
| Faixa escura | `#4A3E36` | a tira de cartões, 360px de altura |

Não existe preto e não existe branco puro em lugar nenhum. É isso que dá o
ar caro.

## O hero, anatomia

```
section.c-hero-banner            1280 x 820   (NÃO é tela cheia)
├── .c-hero-banner__backgrounds
│   └── .c-hero-banner__bg--active
│       ├── img                  object-fit: cover, filter: NONE
│       ├── .overlay-v           véu vertical
│       └── .overlay-h           véu horizontal
├── .c-hero-banner__container    1280 x 708,  padding 0 48px 96px
│   ├── .c-hero-banner__content  768 x 483    ← 60% da largura, não 100%
│   └── .c-hero-banner__info-bar 1184 x 65    ← faixa de fatos DENTRO do hero
└── .c-hero-banner__scroll
```

### Os dois véus, que é a parte que importa

Esta é a técnica mais útil da página inteira, e resolve o problema de foto
que parece escura:

```css
/* Sobe do marrom sólido na base até quase limpo no topo.
   O céu fica com apenas 10% de véu, então continua luminoso. */
.overlay-v {
  background: linear-gradient(to top,
    rgb(84, 70, 56)        0%,
    rgba(74, 62, 54, 0.4) 50%,
    rgba(74, 62, 54, 0.1) 100%);
}

/* Escurece só a esquerda, onde o texto vive, e some na metade.
   A direita da foto fica intocada. */
.overlay-h {
  background: linear-gradient(to right,
    rgba(74, 62, 54, 0.4)  0%,
    rgba(0, 0, 0, 0)      50%,
    rgba(0, 0, 0, 0)     100%);
}
```

Duas decisões dentro disso:

1. **São dois véus cruzados, não um.** Um escurece de baixo para cima (para
   o texto e os botões), o outro da esquerda para a direita (para a coluna
   de texto). Onde eles não se cruzam, a foto aparece inteira.

2. **O véu é marrom, não preto.** `rgb(74,62,54)` é a própria tinta da
   paleta. Véu preto suja a foto e faz parecer que tem filtro em cima. Véu
   na cor da marca escurece o que precisa e mantém a foto quente.

A foto em si não leva `filter` nenhum. Nada de `brightness()`.

### A faixa de fatos

Fica encostada no rodapé do hero, dentro dele, separada por uma linha:

```css
border-top: 1px solid rgba(250, 248, 245, 0.2);
padding-top: 32px;
```

Três itens em `flex` com `gap: 64px`, cada um com um ícone de 20px em traço
e um texto Inter 16px em `rgba(250,248,245,.8)`. No Woolmers são:

```
20 minutes from Launceston  ·  Open Daily from 8am  ·  1 of 11 Australian Convict Sites
```

Distância, horário e uma credencial. Fatos secos, nenhum adjetivo.

## Ritmo e estrutura

- Container `1280px`, respiro de `112px` no topo das seções
- Página inteira com `7996px` de altura, 31 blocos, **22 imagens**
- Uma faixa escura de `360px` no meio, com a tira de cartões rolável

A ordem das seções:

1. Barra de aviso no topo, uma linha
2. Cabeçalho: logo à esquerda, busca e sanduíche à direita. Navegação mínima
3. Hero, com a faixa de fatos embutida
4. Tira horizontal de cartões de categoria (11 deles) sobre fundo escuro
5. Proposta combinada: olho, título em duas linhas, parágrafo, botão
6. Três cartões grandes, cada um com olho, título, parágrafo e seta
7. Bloco de experiência com preço, duração e horários
8. Hospedagem: título, lista de cinco inclusões, dois botões, cartões
9. Planeje a visita: horários, localização, tabela de preços
10. Fecho editorial longo, dois parágrafos de texto corrido

## O que não dá para copiar

O Woolmers tem **22 fotos**, e boa parte é de dentro: casa, jardins,
quartos, chá da tarde. Metade da força daquele layout vem de mostrar o
lugar por dentro.

A Green Beach tem só aéreas de drone da cidade. Isso não é detalhe de
execução, é restrição de arquitetura: os blocos que dependem de foto de
interior precisam ser substituídos, não preenchidos com aérea repetida.
