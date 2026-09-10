# Pousada & Hotel Green Beach
## Sistema visual digital v1.0 | set/2026

Este documento é o sistema, não a peça. Ele define cor, tipo, espaço, foto,
uso de marca e movimento para a landing page de reservas e para qualquer tela
futura da Green Beach. Os tokens executáveis estão em
`site/src/styles/tokens.css`. Este arquivo explica cada decisão e dá as
receitas de componente.

Base normativa: Manual de Marca do Grupo Green (paleta `#3a452b`, `#242d21`,
`#d3b9a4`, `#e5b64e`; Playfair Display + Source Sans; regra explícita de
evitar preto). A Green Beach herda o sistema do grupo e recebe uma extensão
litorânea documentada aqui. Onde eu estendi o manual, está marcado como
EXTENSÃO. Onde eu precisei decidir sem o manual falar, está na lista de
confirmação no fim.

---

## 1. Leitura da marca antes de decidir qualquer coisa

Medi o arquivo `logo-green-beach-sem-fundo-3000px.png` (3000 x 2548 px) e a
versão chapada preto e branco. Números reais, não impressão:

| Elemento | Medida no arquivo | Proporção da altura do lockup |
|---|---|---|
| Lockup completo | 2157 x 2341 px | proporção 0,921 (quase quadrado) |
| Mandala isolada | 974 x 956 px | 40,8% da altura, proporção 1,019 |
| "POUSADA & HOTEL" (caixa alta) | cap 121 px | 5,17% |
| "GREEN" (caixa alta display) | cap 354 px | 15,12% |
| "Beach" (script, com swash) | 552 px de altura | 23,58% |
| "GRUPO GREEN" entre filetes | cap 74 px | 3,16% |
| Filete lateral | 16 px de espessura, 477 e 488 px de comprimento | |
| Traço da mandala | mediana 26 px, partes finas 16 px | 2,67% e 1,64% da largura da mandala |
| Contraste do lettering "GREEN" | haste 52 px x fina 14 px | razão 3,7 : 1 |

Três conclusões que mandam no resto do projeto:

**a) O lockup é quase quadrado.** Proporção 0,92. Isso significa que ele não
cabe em barra de topo. Num header de 96 px, o logo teria no máximo 64 px de
altura e 59 px de largura, presença nenhuma. A solução está na seção 6, e ela
não é espremer o logo.

**b) As duas linhas de apoio morrem cedo.** Com cap de 5,17% e 3,16% da altura
do lockup, "POUSADA & HOTEL" só chega a 7 px de altura de letra quando o
lockup tem 135 px, e "GRUPO GREEN" só chega a 6 px quando o lockup tem 190 px.
Abaixo disso viram sujeira cinza, não texto. Esse número define os tamanhos
mínimos.

**c) O lettering é uma serifada de alto contraste, transicional puxando para
Didone.** Razão haste/fina de 3,7:1, serifas finas e retas com bracketing
curto, G sem espora com barra reta, R de bojo pequeno e perna reta com leve
flare. A Google Font mais próxima disso, e que por sorte já é a fonte oficial
do Grupo Green, é **Playfair Display**. A escolha é a mesma por dois caminhos
independentes, o que a torna a decisão mais defensável do projeto.

O gradiente metálico da versão dourada varia de `#c08820` na sombra a
`#e0b050` no meio e `#f8f0c0` no brilho. O meio tom bate com o `#e5b64e` do
manual, o que confirma que a versão chapada em `#e5b64e` é a tradução digital
correta da versão metálica.

---

## 2. Cor

### 2.1 Ideia da paleta

O Grupo Green é oliva profundo, dourado e nude. Isso é sala de estar. Para a
Green Beach eu inverti a proporção sem inventar cor nova: **a areia sobe para
fundo, o oliva desce para âncora, o dourado continua sendo só acento.**

Proporção alvo na página, 60/30/10:

- 60% família areia (`--bg`, `--bg-alt`, `--surface`) mais foto
- 30% verde profundo (rodapé, barra de reserva, uma ou duas seções de
  contraste, véu das fotos)
- 10% dourado, e olhe lá. Fio, ícone, botão principal, número. Bloco grande de
  dourado vira bijuteria.

O branco da página não é `#ffffff`. É `#fbf8f4`, um branco de areia. O branco
puro fica reservado para a superfície elevada (card, dropdown, campo), e é
essa diferença de 1,06:1 entre fundo e card que cria elevação sem sombra
pesada.

### 2.2 Tokens de cor e contraste calculado

Todos os valores abaixo foram calculados em WCAG 2.1 (fórmula de luminância
relativa). Contexto claro:

| Token | Valor | Papel | Contraste |
|---|---|---|---|
| `--bg` | `#fbf8f4` | fundo primário, branco de areia | base |
| `--bg-alt` | `#f4ebde` | fundo de seção alternada | base |
| `--surface` | `#ffffff` | card, dropdown, campo | base |
| `--surface-sunken` | `#f4ebde` | campo desabilitado, faixa interna | base |
| `--surface-accent` | `#f7ebd2` | destaque discreto, badge de tarifa | texto forte 12,07:1 |
| `--border-hairline` | `#e7ddce` | divisor decorativo | não carrega informação |
| `--border-control` | `#8c7c64` | borda de campo e botão fantasma | 3,83:1 sobre `--bg`, 3,43:1 sobre `--bg-alt`, passa no critério 1.4.11 de componente |
| `--border-strong` | `#3a452b` | campo em foco, ênfase | 9,60:1 |
| `--text-strong` | `#242d21` | títulos e números | 13,47:1 sobre `--bg`, 12,51:1 sobre `--bg-alt`, 14,26:1 sobre `--surface` |
| `--text` | `#414b39` | corpo | 8,66:1 / 8,04:1 / 9,17:1 |
| `--text-soft` | `#5e6857` | legenda, meta, apoio | 5,52:1 sobre `--bg`, 4,95:1 sobre `--bg-alt`, 5,84:1 sobre `--surface` |
| `--accent` | `#e5b64e` | superfície dourada, fio, ícone grande | ver 2.3 |
| `--accent-hover` | `#d3a238` | hover do botão dourado | texto `#242d21` a 6,11:1 |
| `--accent-pressed` | `#b8882a` | pressed | texto `#242d21` a 4,48:1, só em rótulo de 18px ou 14px bold |
| `--accent-text` | `#85641b` | dourado quando vira TEXTO ou LINK | 5,17:1 sobre `--bg`, 4,64:1 sobre `--bg-alt`, 5,47:1 sobre branco |
| `--accent-text-hover` | `#6b4f12` | link em hover | 7,21:1 sobre `--bg` |
| `--green-brand` | `#3a452b` | verde institucional do manual | branco de areia sobre ele 9,60:1 |
| `--green-deep` | `#242d21` | âncora escura: rodapé, barra de reserva | texto claro 12,45:1 |
| `--green-deepest` | `#141a12` | base do véu de foto e rodapé profundo | texto claro 15,46:1 |
| `--success` | `#2e6b4f` | validação positiva | 5,95:1 sobre `--bg` |
| `--success-text` / `--success-bg` | `#26604a` / `#eaf3ed` | mensagem de sucesso | 6,50:1 |
| `--danger` | `#a33b2a` | erro de formulário | 6,17:1 sobre `--bg`, branco sobre ele 6,53:1 |
| `--danger-text` / `--danger-bg` | `#8e3324` / `#fbede9` | mensagem de erro | 6,94:1 |
| `--focus-ring` | `#3a452b` | anel de foco no claro | 9,60:1 |

O sucesso e o erro são EXTENSÃO: o manual não prevê cor de sistema. Escolhi um
verde-mar dessaturado e um terracota, os dois de fora da paleta institucional
de propósito, para que ninguém confunda "campo validado" com "cor da marca", e
os dois em família quente para não brigarem com a areia. Vermelho puro de
alerta de sistema (`#ff0000` e primos) está proibido nesta marca.

### 2.3 O dourado: onde pode e onde não pode

Este é o ponto mais importante da paleta e o que mais estraga site de hotel.

`#e5b64e` sobre `#ffffff` dá **1,89:1**. Sobre `#fbf8f4` dá **1,78:1**.
Isso reprova em qualquer critério, inclusive em texto grande. O dourado do
manual, sobre fundo claro, é uma cor de superfície, não de tinta.

**Pode, com `--accent` `#e5b64e` puro:**
- fundo de botão primário, com o rótulo em `--text-on-accent` `#242d21` (7,56:1)
- fio, filete e divisor de 1 a 2 px sobre fundo claro (elemento decorativo,
  não carrega informação)
- ícone decorativo grande, acompanhado de rótulo em texto legível
- texto **sobre verde**: `#e5b64e` sobre `#242d21` dá 7,56:1, sobre `#3a452b`
  dá 5,39:1, sobre `#141a12` dá 9,38:1. No contexto escuro o dourado é
  legítimo como tinta, e é por isso que `.gb-dark` redefine `--accent-text`
  para o dourado puro.
- número grande de destaque (48px ou mais) sobre verde profundo

**Não pode, nunca:**
- texto de qualquer tamanho em `#e5b64e` sobre fundo claro
- link em `#e5b64e` sobre fundo claro
- rótulo de botão em `#e5b64e`
- texto branco sobre botão `#e5b64e` (1,89:1, é o erro clássico de site de
  hotel)
- olho de boi (overline 12px) em dourado sobre foto: sobre o véu, o dourado só
  bate 4,5:1 com alpha 0,80, e 3:1 com alpha 0,66. Em cima de foto, texto
  pequeno é `#f4efe6`, ponto.

**Substituto obrigatório para texto:** `--accent-text` `#85641b`. É o mesmo
matiz (HSB 41,3 graus, o matiz exato do `#e5b64e`), só com saturação 0,80 e
valor 0,52. Continua lendo como dourado envelhecido, e bate 5,17:1 sobre o
fundo primário. Em hover vai para `#6b4f12` (7,21:1).

### 2.4 Contexto escuro

`.gb-dark` (ou `[data-surface="dark"]`) troca só os tokens. Nenhum componente
precisa de variante própria: card, botão, campo e link continuam com o mesmo
CSS. Use no rodapé, na barra de reserva fixa, na seção de contato e no máximo
em mais uma seção de respiro. Verificado: texto `#f4efe6` 12,45:1, texto suave
`#b9bfac` 7,55:1, dourado como link 7,56:1, borda de controle `#7b8a6c`
3,87:1, anel de foco dourado 7,56:1.

Regra dura do contexto escuro: campo de formulário só sobre `#242d21` ou
`#141a12`. Sobre `#3a452b` a borda de controle não alcança 3:1, e aí o campo
deixa de ser identificável.

### 2.5 Véu sobre foto

Calculado no pior caso possível: **o pixel da foto estourado em branco puro**
embaixo do texto. Sobre branco, o véu `#141a12` precisa de:

| Alpha do véu | Cor resultante | Texto `#f4efe6` | Dourado `#e5b64e` |
|---|---|---|---|
| 0,50 | `#8a8c88` | 2,96:1 reprova | 1,80:1 reprova |
| 0,55 | `#7e817d` | 3,44:1 só display | 2,09:1 reprova |
| 0,65 | `#666a65` | 4,81:1 aprova corpo | 2,92:1 reprova |
| 0,75 | `#4f534d` | 6,85:1 | 4,16:1 só display |
| 0,80 | `#434841` | 8,18:1 | 4,97:1 aprova |

Daí saem os tokens `--overlay-hero-v` e `--overlay-hero-h`. Eles se somam:
alpha efetivo = 1 menos (1 - a1)(1 - a2). Onde o texto do hero senta (canto
inferior esquerdo), o vertical vale cerca de 0,62 e o lateral cerca de 0,50,
dando 0,81 de alpha efetivo, ou 8,4:1. Verificado em render contra uma imagem
de teste propositalmente estourada.

O véu é verde `20 26 18`, nunca preto. Preto puro sobre foto de praia mata o
rosado da areia e deixa a imagem com cara de fotografia de segurança. Verde
profundo escurece e mantém o calor.

O topo do hero leva 0,50 de véu nos primeiros 20% de altura. Isso não é
enfeite: é o que garante 3:1 para a marca branca em cima de um céu estourado,
e visualmente é o mesmo efeito de um filtro degradê ND, coisa que fotógrafo de
paisagem usa.

---

## 3. Tipografia

### 3.1 As duas famílias e mais nada

**Display: Playfair Display.** Escolhida por medição (razão de contraste 3,7:1
igual à do lettering, serifa fina e reta, mesma estrutura de G e R) e por
mandato do manual do grupo. Usar em **peso 400**. Playfair em 700 fica gorda,
perde o contraste fino que é justamente o que conecta com a logo, e é o
atalho mais rápido para cara de template. O 500 existe no sistema só para o
display do hero, se o fundo pedir mais corpo.

**Texto: Source Sans 3.** É a "Source Sans" do manual, na versão que está no
Google Fonts. Estrutura humanista, altura de x compatível com a Playfair, e
excelente em corpo pequeno de interface. Pesos 400, 400 itálico (o manual usa
muito itálico) e 600.

**A terceira fonte não existe.** O script de "Beach" pertence à logo e só à
logo. Reproduzir "Beach" em Great Vibes, Allura, Tangerine ou qualquer script
do Google Fonts é falsificação de assinatura e o erro número um em site de
pousada. Se precisar do nome escrito, use a imagem da logo.

Carregar exatamente isto, nada além:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap">
```

Em produção, prefira self-host dos 5 arquivos woff2 com `font-display: swap` e
`<link rel="preload">` só no Playfair 400 e no Source Sans 400, que são os que
aparecem acima da dobra. E ajuste o fallback para o salto de fonte não empurrar
o layout:

```css
@font-face{
  font-family:"Playfair fallback";
  src:local("Georgia");
  size-adjust:105%; ascent-override:95%; descent-override:22%;
}
```

### 3.2 Escala fluida

Escala fluida entre viewport de 380 px e 1440 px. Cinco níveis de voz visível
por página, no máximo três por seção.

| Token | px min / max | line-height | letter-spacing | medida |
|---|---|---|---|---|
| `--fs-display-xl` | 44 / 104 | 0,98 | -0,022em | `--measure-display` 16ch |
| `--fs-display-l` | 36 / 68 | 1,04 | -0,016em | 16ch a 22ch |
| `--fs-h2` | 28 / 44 | 1,12 | -0,010em | `--measure-h2` 22ch |
| `--fs-h3` | 21 / 27 | 1,28 | -0,004em | `--measure-card` 38ch |
| `--fs-lead` | 18 / 22 | 1,48 | 0 | `--measure-lead` 48ch |
| `--fs-body` | 17 / 19 | 1,62 | 0 | `--measure-body` 66ch |
| `--fs-body-s` | 15 / 16 | 1,55 | 0,004em | 60ch |
| `--fs-caption` | 13 / 14 | 1,45 | 0,010em | `--measure-caption` 52ch |
| `--fs-overline` | 12 / 13 | 1,20 | **0,180em** | 30ch |

Por que tracking negativo no display: a Playfair em 104 px tem espaçamento
desenhado para corpo de texto. Sem -0,022em ela fica frouxa e amadora. Por que
0,180em no overline: caixa alta sem entreletra gruda, e essa é a regra que
mais separa peça profissional de peça caseira.

Medida em `ch` e não em `px` porque `ch` acompanha a fonte real e mantém os 45
a 75 caracteres por linha mesmo se a fonte cair para o fallback.

Armadilha de implementação: os tokens `--measure-*` são **max-width**, não
width. Aplique sempre junto de `width:100%` ou dentro de uma coluna do grid,
senão no celular o bloco estoura a lateral, porque 66ch é maior que 390 px.

Números (diária, telefone, data, CNPJ) sempre com
`font-variant-numeric: tabular-nums lining-nums`, via `--numeric-tabular`.
Sem isso as colunas de preço desalinham.

### 3.3 Hierarquia

Dois recursos por nível, nunca cinco. O sistema inteiro se resolve com:

- **Nível 1**: Playfair 400 em `--fs-display-xl`, caixa baixa, `--text-strong`
- **Nível 2**: Playfair 400 em `--fs-h2`, caixa baixa, `--text-strong`
- **Nível 3**: Source Sans 600 em `--fs-overline`, caixa alta, `--text-soft`,
  tracking 0,18em (o olho de boi que abre a seção)
- **Corpo**: Source Sans 400 em `--fs-body`, `--text`
- **Apoio**: Source Sans 400 em `--fs-caption`, `--text-soft`

Título em caixa alta, centralizado, dourado e em negrito ao mesmo tempo é
hierarquia gritada. Nesta marca, título é caixa baixa, alinhado à esquerda,
grande, em peso normal. O tamanho faz o trabalho.

---

## 4. Espaço, grade, raio e sombra

### 4.1 Grade

12 colunas, medianiz fluida de 16 a 32 px, contêiner de 1200 px para conteúdo
e 1500 px para mídia larga. Margem lateral de 20 a 40 px.

```css
.gb-grid{
  display:grid;
  grid-template-columns:repeat(var(--grid-cols),minmax(0,1fr));
  gap:var(--grid-gap);
  max-width:var(--container);
  margin-inline:auto;
  padding-inline:var(--gutter);
}
/* padrões editoriais permitidos, todos assimétricos */
.gb-7-5 > :first-child{grid-column:1 / span 7}
.gb-7-5 > :last-child {grid-column:9 / span 4}
.gb-5-7 > :first-child{grid-column:1 / span 5}
.gb-5-7 > :last-child {grid-column:7 / span 6}
.gb-8-4 > :first-child{grid-column:1 / span 8}
.gb-8-4 > :last-child {grid-column:10 / span 3}
.gb-text-col{grid-column:2 / span 6}      /* texto corrido nunca começa na coluna 1 */
.gb-bleed{grid-column:1 / -1;width:100vw;margin-left:calc(50% - 50vw)}
```

A regra editorial da página: **nunca dividir a tela em duas metades iguais.**
7/5, 8/4 e 5/7 são os únicos pares. Meio a meio é layout de construtor de site.

Ritmo vertical: `--space-section` (72 a 160 px) entre seções, sempre o mesmo.
Espaço que se repete é respiro; espaço que aparece uma vez só é buraco.

### 4.2 Raio por componente

| Componente | Token | Valor | Por quê |
|---|---|---|---|
| Hero e faixa que sangra | `--radius-bleed` | 0 | sangrar é o gesto, arredondar mata |
| Filete, tag, barra de progresso | `--radius-xs` | 2 px | |
| Chip de amenidade, tooltip, badge | `--radius-sm` | 6 px | |
| Campo, select, datepicker | `--radius-field` | 8 px | |
| Botão | `--radius-button` | 10 px | |
| Foto dentro de grade e mosaico | `--radius-image` | 12 px | |
| Card de acomodação | `--radius-card` | 14 px | 2 px a mais que a foto interna, para a foto não vazar no canto |
| Modal, painel de reserva | `--radius-modal` | 18 px | |
| Avatar, contador | `--radius-pill` | 999 px | só isso |

Botão pílula (999 px) está fora. Pílula é a assinatura de template SaaS e briga
com a serifada de alto contraste.

### 4.3 Sombra

Três níveis, todos tingidos de `36 45 33` (o verde do manual), nunca preto.

- `--shadow-1`: card em repouso, campo em foco leve
- `--shadow-2`: card em hover, dropdown, barra de reserva colada
- `--shadow-3`: modal, painel de datas aberto

A sombra aqui é para dizer "isto flutua", não para criar hierarquia. Hierarquia
é espaço e tipografia. Se você precisou de `--shadow-3` num card, o problema é
de layout.

Sobre fundo escuro, sombra não existe: `.gb-dark` zera os níveis 1 e 2. Ali a
elevação se faz com `--surface` mais claro que o `--bg` e um `--border-hairline`
de 14% de branco.

---

## 5. Fotografia

A foto é 70% da credibilidade desta página. Tipografia boa com foto ruim
continua sendo página ruim.

### 5.1 Linguagem

- **Luz**: hora dourada e hora azul. Meio dia de sol a pino só embaixo d'água
  ou na sombra da varanda. Sem flash direto, sem HDR, sem céu saturado de
  filtro.
- **Cor**: areia quente, verde de mata atlântica real, mar verde-azulado de
  Santa Catarina. Não é Caribe. Turquesa forçado no mar de SC é mentira visual
  e o hóspede percebe na chegada.
- **Tratamento**: `--img-grade` (`saturate(1.02) contrast(1.02)`) e nada mais.
  Sem vinheta, sem preto esmagado, sem grão. Balanço de branco igual em toda a
  série, senão duas fotos lado a lado denunciam sessões diferentes.
- **Enquadramento**: horizonte reto, sempre. Terços. E o mais importante:
  **fotografar já deixando ar para a tipografia entrar**, um lado da imagem
  propositalmente vazio.
- **Pessoas**: sim, mas de costas, em gesto, em detalhe. Mão servindo o café,
  pé na areia, toalha na espreguiçadeira. Casal sorrindo de frente para a
  câmera é banco de imagens.
- **Repetição**: monte o mapa de fotos por seção antes de diagramar. Duas fotos
  do mesmo ambiente ou do mesmo ângulo na mesma página fazem a pousada parecer
  ter três quartos.
- **Escala**: em qualquer seção com mais de uma foto, tem que haver diferença
  clara de tamanho. Três fotos do mesmo tamanho é catálogo de estoque.

### 5.2 Proporção por contexto

| Contexto | Token | Proporção | Observação |
|---|---|---|---|
| Hero desktop | `--ratio-hero` | 16:9 | sangrando, `min-height:78svh`, `max-height:88svh` |
| Hero mobile | `--ratio-hero-mobile` | 4:5 | mesmo frame, recorte vertical, `object-position` ajustado por foto |
| Card de acomodação | `--ratio-room` | 3:2 | 3:2 deixa a cama inteira caber; 16:9 corta a cabeceira |
| Mosaico, peça paisagem | `--ratio-wide` | 3:2 | |
| Mosaico, peça vertical | `--ratio-portrait` | 4:5 | é aqui que a foto de Instagram entra inteira |
| Mosaico, detalhe | `--ratio-square` | 1:1 | textura, prato, detalhe de decoração |
| Faixa de localização, praia, mapa | `--ratio-pano` | 21:9 | sangrando de ponta a ponta |

Mosaico da galeria: 12 colunas, uma peça grande de 7 colunas em 3:2, uma
vertical de 5 colunas em 4:5 ao lado, e embaixo três peças de 4 colunas
alternando 3:2 e 1:1. Nunca uma grade de seis fotos idênticas.

### 5.3 Foto vertical de Instagram em espaço horizontal

Este caso vai aparecer, porque o acervo da pousada é de Instagram. Ordem de
solução:

1. **Use a foto vertical num slot vertical.** O mosaico tem slots 4:5
   exatamente para isso. Esta é a resposta certa em 80% dos casos.
2. **Se o espaço horizontal é obrigatório, corte com intenção** para 3:2 e
   trave o ponto focal por foto no arquivo de dados, nunca no CSS:
   `{ src, alt, focal: "62% 38%" }` aplicado como `object-position`. Para achar
   o valor sem chutar, gere a foto com uma grade numerada de 0 a 1 sobreposta,
   abra e leia a coordenada do assunto.
3. **Se o corte matou o assunto** (cabeça cortada, prato pela metade, sacada
   sem vista), a foto não serve para aquele espaço. Troque a foto ou mude o
   espaço. Não force.
4. **Composição editorial como saída melhor**: foto vertical em 5 colunas, texto
   em 6 colunas ao lado, muito ar entre os dois, foto sangrando na borda
   esquerda ou direita da tela. Isso vira uma decisão de design, não um remendo.
5. **Proibido**: esticar, achatar, preencher o vazio com cópia borrada da
   própria foto ao fundo, moldura branca ou faixa de cor tapando a diferença de
   proporção. Os três gritam amadorismo.

### 5.4 Resolução e entrega

Densidade 2x sobre a caixa em CSS:

| Uso | Largura CSS | Arquivo mínimo |
|---|---|---|
| Hero | até 1600 px | 3200 px |
| Faixa panorâmica | até 1500 px | 3000 px |
| Foto grande do mosaico | 700 px | 1400 px |
| Card de acomodação | 420 px | 900 px |
| Miniatura | 200 px | 400 px |

Entregar AVIF com fallback WebP, `srcset` em três larguras, `sizes` correto,
`width` e `height` declarados para não pular layout, `loading="lazy"` em tudo
menos no hero, e `fetchpriority="high"` no hero. Foto de Instagram costuma vir
com 1080 px de largura: ela serve para card e miniatura, **não serve para
hero**. Isso está na lista de pendências.

---

## 6. A logo no digital

### 6.1 O problema, com número

O lockup é quase quadrado (0,92) e tem duas linhas de microtipografia. Pelas
medições da seção 1, o lockup completo só é legível de verdade a partir de
**190 px de altura**, e o piso absoluto onde "POUSADA & HOTEL" ainda se lê é
**135 px**. Nenhum dos dois cabe em header.

Portanto o site precisa de três ativos, e hoje existe um só:

| Ativo | Existe? | Uso |
|---|---|---|
| Lockup vertical completo (SVG) | não, só PNG | hero, rodapé, página institucional |
| Versão reduzida horizontal: mandala à esquerda, "GREEN Beach" à direita | **não existe** | header, favicon grande, assinatura de e-mail |
| Símbolo isolado (mandala) redesenhado com traço engrossado | **não existe** | favicon 16 e 32 px, ícone de app, avatar social |

Peça esses dois ativos a quem tem o arquivo vetorial mestre do Grupo Green. A
versão horizontal deve seguir a mesma lógica já definida no manual do grupo
para a horizontal dele (símbolo à esquerda, respiro lateral de X, largura de
texto de 10X). **Eu não recomponho o lockup**, porque mover, redimensionar ou
rearranjar elementos separadamente está na lista de usos proibidos do manual.

### 6.2 Aplicação, com o que existe hoje e com o que vai existir

**Header transparente sobre o hero** (altura `--header-h` 96 px):
- Ideal: versão reduzida horizontal, monocromática em `#f4efe6`, altura de
  bloco 40 px, ancorada na coluna 1 do grid, menu à direita.
- Provisório, enquanto a horizontal não existe: lockup vertical completo em SVG
  monocromático `#f4efe6`, **altura 136 px**, ancorado à esquerda e
  ultrapassando a barra do header para dentro do hero. Fica maior que o header
  de propósito, é um gesto editorial e resolve a legibilidade. O véu do topo
  (0,50) garante 3:1 mesmo com céu estourado.
- Nunca centralizado.

**Header sólido depois do scroll** (altura `--header-h-scrolled` 68 px, fundo
`#fbf8f4` com `--shadow-header`):
- Ideal: versão reduzida horizontal em `#242d21`, altura de bloco 32 px.
- Provisório: mandala isolada 40 px em `#3a452b`, com "GREEN BEACH" ausente do
  header (o nome já está no título da página e no hero). Melhor um símbolo
  limpo do que um lockup ilegível de 44 px.

**Rodapé** (fundo `--green-deep` `#242d21`):
- Lockup vertical completo, monocromático em `--accent` `#e5b64e` chapado,
  altura **190 px**, alinhado à esquerda ou à direita do grid, nunca no centro.
  190 px é o número que faz "GRUPO GREEN" ter 6 px de cap e se sustentar.
- Contraste dourado sobre `#242d21`: 7,56:1.

**Favicon e ícone de app**: mandala redesenhada. Pelas medições, o traço fino da
mandala é 1,64% da largura dela: num favicon de 32 px isso dá 0,52 px, e a
mandala vira uma bolha cinza. Precisa de um desenho simplificado, com menos
anéis e traço proporcionalmente mais grosso. Reduzir o arquivo atual não
resolve.

### 6.3 Área de proteção

Módulo **X = altura da caixa alta de "GREEN" = 15,1% da altura do lockup**.

- Respiro mínimo: 1X livre nos quatro lados.
- No header: 1,5X entre o logo e o primeiro item de menu.
- Nada entra na área de proteção. Nem menu, nem botão de reserva, nem foto com
  detalhe, nem selo de Booking.

Na prática: lockup de 136 px de altura pede 20,5 px de respiro em volta; lockup
de 190 px pede 29 px.

### 6.4 Nunca, nesta marca

1. Recriar "Beach" com fonte de script de sistema ou do Google Fonts.
2. Usar o PNG dourado com gradiente metálico em tela. No digital a versão é
   chapada em `#e5b64e`, `#f4efe6` ou `#242d21`, em SVG. O gradiente metálico é
   de peça impressa grande. Em 40 px ele vira sujeira.
3. Sombra, glow, brilho, bisel ou contorno na logo.
4. Logo sobre foto sem véu garantindo 3:1.
5. Girar, inclinar, distorcer, espelhar, mudar o espaçamento entre as partes,
   trocar a cor de uma parte só (proibições do manual do grupo).
6. Colocar o lockup dentro de círculo, quadrado, moldura ou "selo".
7. Animar a mandala girando. Marca não é pião.
8. Usar o lockup completo abaixo de 135 px de altura.
9. Repetir a mandala como marca d'água gigante atrás das seções, ou como textura
   de fundo. Ornamento espalhado é o oposto de sistema.
10. Usar a mandala como bullet de lista ou separador entre seções.

---

## 7. Microinterações

Discreto. Hospedagem premium não pisca.

| O que | Duração | Curva | Propriedade |
|---|---|---|---|
| Cor de link e sublinhado | `--dur-fast` 160ms | `--ease-standard` | `color`, `background-size` |
| Botão: fundo e leve subida | `--dur-base` 220ms | `--ease-standard` | `background-color`, `transform` |
| Campo: borda e anel | `--dur-instant` 90ms | `--ease-standard` | `border-color`, `box-shadow` |
| Header sólido ao rolar | `--dur-base` 220ms | `--ease-standard` | `background-color`, `height`, `box-shadow` |
| Card: sombra 1 para 2 e foto ampliando | `--dur-slow` 420ms | `--ease-soft` | `box-shadow`, `transform` |
| Entrada de seção no scroll | `--dur-enter` 560ms | `--ease-out` | `opacity`, `translateY(16px)` |
| Escalonamento entre itens | `--dur-stagger` 70ms | | `transition-delay` |
| Modal e painel de datas | `--dur-slow` 420ms | `--ease-out` | `opacity`, `scale(0.98 para 1)` |

```css
.gb-link{
  color:var(--accent-text);
  text-decoration:none;
  background-image:linear-gradient(currentColor,currentColor);
  background-repeat:no-repeat;
  background-position:0 100%;
  background-size:0% 1px;
  transition:background-size var(--dur-fast) var(--ease-standard),
             color var(--dur-fast) var(--ease-standard);
}
.gb-link:hover{background-size:100% 1px;color:var(--accent-text-hover)}

.gb-btn{
  transition:background-color var(--dur-base) var(--ease-standard),
             transform var(--dur-base) var(--ease-standard);
}
.gb-btn:hover{background-color:var(--accent-hover);transform:translateY(var(--lift-card))}
.gb-btn:active{background-color:var(--accent-pressed);transform:translateY(0)}

.gb-card{transition:box-shadow var(--dur-slow) var(--ease-soft),
                    transform var(--dur-slow) var(--ease-soft)}
.gb-card:hover{box-shadow:var(--shadow-2);transform:translateY(var(--lift-card))}
.gb-card img{transition:transform var(--dur-slow) var(--ease-soft)}
.gb-card:hover img{transform:scale(var(--zoom-image))}

:where(a,button,input,select,summary):focus-visible{
  outline:var(--focus-ring-width) solid var(--focus-ring);
  outline-offset:var(--focus-ring-offset);
}
```

Nunca: parallax, carrossel em autoplay, contador animado de números, texto
aparecendo palavra por palavra, botão pulsando, cursor customizado, Ken Burns
infinito no hero, e qualquer animação disparada por scroll que se repita
quando o usuário volta.

### Movimento reduzido

O `tokens.css` já zera as durações na origem, então todo componente que usar os
tokens herda o comportamento. Some a isto no CSS global:

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:1ms !important;
    animation-iteration-count:1 !important;
    transition-duration:1ms !important;
    scroll-behavior:auto !important;
  }
  .gb-card:hover img{transform:none}
  .gb-reveal{opacity:1;transform:none}
}
```

---

## 8. O que faria esta página parecer template genérico de hotel

Lista de proibições concretas, não de gosto:

1. Carrossel de hero em autoplay com setas em círculo e bolinhas embaixo.
2. Caixa de busca branca, arredondada, centralizada e flutuando com sombra
   pesada em cima do hero. Todo motor de reserva vende isso pronto. A barra de
   reserva daqui é uma faixa em `--green-deep`, alinhada à grade, colada no
   topo ou no rodapé, com os campos em `--radius-field`.
3. Fila de ícones de amenidade, todos do mesmo pack de linha fina, dentro de
   círculos, centralizados. Se as amenidades importam, viram lista tipográfica
   em duas colunas, com o texto fazendo o trabalho.
4. Selos de Booking, TripAdvisor e estrelas empilhados no topo.
5. Tudo centralizado. Nesta página, texto é alinhado à esquerda, sempre. O
   centro é permitido uma vez, no máximo, numa página inteira.
6. Foto pequena dentro de moldura branca com sombra. Foto aqui sangra, ou vai
   até a borda da coluna, e não tem moldura nunca.
7. Gradiente azul turquesa, céu HDR, saturação puxada. Ver 5.1.
8. Playfair em negrito, caixa alta, centralizado e dourado, tudo junto.
9. Ornamento tapando buraco: fio dourado com losango no meio separando seções,
   cantoneira botânica em cada card, mandala em marca d'água atrás do texto.
   Buraco se resolve com conteúdo, com escala ou com redistribuição, nunca com
   enfeite.
10. Copy genérica: "descubra o paraíso", "conforto e requinte", "sua melhor
    experiência". A voz da Green Beach é curta, concreta e específica: distância
    da areia, horário do café, o que dá para ver da sacada.
11. Preço em vermelho, badge "OFERTA", contador regressivo, "só restam 2
    quartos". Isso derruba o posicionamento premium em um segundo.
12. Véu preto puro a 50% sobre a foto.
13. Botão dourado com rótulo branco (1,89:1).
14. Duas colunas exatamente iguais dividindo a tela ao meio.
15. Ícone de rede social em círculo cinza no rodapé.
16. Depoimento inventado, nota inventada, "mais de 500 hóspedes felizes" sem
    fonte. Ver seção 10.

---

## 9. Decisões de projeto, resumidas

| Decisão | Por quê |
|---|---|
| Fundo areia `#fbf8f4` no lugar de branco puro | traz o `#d3b9a4` do manual para o papel de neutro dominante e dá luz de praia sem sair da paleta |
| Verde do manual rebaixado a âncora | 30% da página, não 60%. O oliva cheio é a Green Decor, não a Green Beach |
| Dourado com dois valores (`--accent` e `--accent-text`) | o `#e5b64e` do manual reprova como texto em fundo claro; o `#85641b` mantém o matiz e passa 5,17:1 |
| Véu verde `#141a12` no lugar de preto | manual manda evitar preto, e verde preserva o rosado da areia |
| Playfair Display 400 | bate com o lettering medido (contraste 3,7:1) e é a fonte oficial do grupo |
| Source Sans 3 com itálico | fonte do manual, e o manual usa itálico como recurso |
| Nenhuma fonte script | "Beach" é assinatura, não tipografia de uso |
| Raio de 8 a 14 px, sem pílula | "suavemente arredondado" do brief, sem virar SaaS |
| Sombra tingida de `36 45 33` | preto puro sobre fundo quente cria uma borda acinzentada suja |
| Grade 12 colunas com pares 7/5 e 8/4 | assimetria controlada, herança suíça com calor |
| Contexto escuro por troca de token | uma implementação de componente serve para claro e escuro |

---

## 10. Confirmar antes de publicar

1. **Aprovação do manual**: a extensão da paleta (areias `#fbf8f4`, `#f4ebde`,
   `#e7ddce`, dourados `#85641b`, `#6b4f12`, `#d3a238`, `#b8882a`, verde
   `#141a12`, sucesso e erro) precisa do aval de quem guarda o manual do Grupo
   Green. Nada aqui contraria o manual, tudo é derivado dele, mas é extensão.
2. **Versão chapada da logo em SVG**: confirmar com o detentor do arquivo mestre
   que o uso monocromático chapado (dourado, areia ou verde) está liberado para
   tela. A existência do arquivo preto e branco chapado indica que sim, mas
   quero confirmado por escrito.
3. **Versão reduzida horizontal e símbolo isolado**: não existem. Sem eles, o
   header fica na solução provisória da seção 6.2.
4. **Fotos**: não há nenhuma foto em `site/public/fotos` até agora. Todo o
   sistema fotográfico está especificado, mas não testado contra o acervo real.
   Antes de fechar, preciso ver as fotos para dizer quais servem para hero.
5. **Resolução do acervo**: se as fotos vierem do Instagram (1080 px), elas não
   atendem o hero (3200 px). Isso é sessão nova de foto ou hero em vídeo curto.
6. **Conteúdo verificável**: nada de número de quartos, ano de fundação,
   distância da praia, horário do café, nota de avaliação ou depoimento sem
   confirmação da pousada. Se o layout pedir um número que não existe, muda o
   layout.
7. **Nome exato da razão social e endereço** para o rodapé.
8. **Motor de reserva**: se for um widget de terceiro (Booking Engine, Omnibees,
   HQBeds), ele traz CSS próprio e provavelmente não aceita esses tokens.
   Preciso saber qual é antes de desenhar a barra de reserva.

---

## 11. Limitações técnicas conhecidas

- `rgb(var(--veil-rgb) / 0.5)` usa a sintaxe de espaço do CSS Color 4. Funciona
  em Chrome, Safari 15+, Firefox 93+. Se precisar suportar navegador mais
  antigo, troque por valores `rgba()` literais.
- `clamp()` com `vw` não reage a zoom de texto em alguns navegadores. Os pisos
  da escala (17 px de corpo, 13 px de legenda) foram escolhidos já contando com
  isso.
- `svh` no hero (`--hero-min-h`) evita o pulo da barra de endereço no iOS.
  Fallback: declarar `vh` antes na mesma regra.
- Contraste sobre foto é sempre estimativa: o cálculo aqui é o pior caso (pixel
  branco puro). Verifique de novo com as fotos reais no lugar.
- Playfair Display não tem versão variável estável no Google Fonts para todos os
  eixos usados aqui; por isso a especificação é de dois pesos estáticos.

---

## 12. Como usar

```css
/* main.css */
@import "./tokens.css";
```

Regra de disciplina: **nenhum componente escreve valor de cor, tamanho, raio,
sombra ou duração direto.** Se um valor faltar, ele entra em `tokens.css` com
nome semântico e vira parte do sistema. Um hex solto num componente é o começo
da morte do sistema.

Arquivos:
- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/site/src/styles/tokens.css`
- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/direcao-de-arte.md`
