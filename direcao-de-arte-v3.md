# Pousada & Hotel Green Beach
## Sistema visual v3 | set/2026

Referência de layout: **Woolmers Estate** (woolmers.com.au).
Base normativa: **Manual de Marca do Grupo Green** (`#3a452b`, `#242d21`,
`#d3b9a4`, `#e5b64e`, Playfair Display + Source Sans, proibição explícita do
preto).
Sistema anterior: `green-beach/direcao-de-arte.md` (v1).
Tokens executáveis desta versão: `green-beach/site-v3/src/styles/tokens.css`.

Este documento **decide**. Onde ele contraria a v1, diz por quê. Onde ele
estende o manual, marca EXTENSÃO. Onde ele assume algo que não pôde verificar,
a linha vai para a seção 12.

Todo número de contraste aqui foi calculado em WCAG 2.1. Toda métrica de fonte
foi medida no Chrome com as fontes reais carregadas do Google Fonts, não
estimada. Toda luminância de foto foi medida pixel a pixel nos arquivos que
estão em `site/public/fotos`.

---

## 1. O diagnóstico: por que a v1 parece amadora

A v1 tem um sistema correto e uma página que não entrega esse sistema. Abri a
captura `capturas/desktop.png` (1440 x 8426 px) e medi. São cinco defeitos, e
os cinco são de execução, não de conceito.

**1.1 O cartão branco flutuando sobre o hero.** Um bloco de 432 x 537 px,
branco puro, raio de 16 px, sombra pesada, ancorado no meio direito da foto.
É exatamente o item 2 da lista de proibições que a própria v1 escreveu:
"caixa de busca branca, arredondada, flutuando com sombra pesada em cima do
hero. Todo motor de reserva vende isso pronto." A regra foi escrita e depois
descumprida. Esse cartão é, sozinho, a maior fonte de cara de template da
página, porque ele é a peça mais clara e mais contrastada da tela inteira e
rouba a atenção do título.

**1.2 Toda seção é uma laje de canto arredondado.** O token
`--radius-secao: clamp(20px, 2.4vw, 36px)` arredonda a quebra de cada seção.
O resultado é uma pilha de cartões. Nenhuma página editorial faz isso. O
Woolmers tem raio zero em seção e em foto.

**1.3 Quatro fotos do mesmo tamanho lado a lado.** Na seção "Itapema não acaba
na areia", quatro imagens de largura igual, proporção igual, raio igual,
legenda igual. É grade de estoque, não editorial. Falta contraste de escala, e
esse é o item que mais denuncia amadorismo em página de hospedagem.

**1.4 Tipografia grande em corpo, pequena em presença.** O H1 está em torno de
100 px, ou seja, não é tímido em medida. Mas divide a tela com o cartão branco
e com um parágrafo de 17 px em coluna estreita. O título perde a briga que
deveria ganhar sozinho. Presença tipográfica não é tamanho, é isolamento.

**1.5 Escuro demais, e espalhado.** A v1 alterna creme e verde escuro várias
vezes ao longo da rolagem. O Woolmers usa **uma** faixa escura de 360 px em
7996 px de página. Alternância frequente pica a leitura e faz cada seção
parecer um bloco independente comprado de um tema.

Além disso, um defeito de sistema que não aparece na tela mas erra a conta:
`--measure-body: 66ch` está documentado na v1 como "alvo de 45 a 75
caracteres". Medi: em Source Sans 3, o avanço do "0" é 0,497em e a média real
de caractere em português é 0,418em. **66ch entrega 79 caracteres por linha**,
acima do teto. Corrigido na seção 4.6.

---

## 2. O que a referência realmente faz

Os números do Woolmers vieram medidos no encargo e eu os tomo como verdade:
display Libre Baskerville 400 em 72/72, linha de destaque em Playfair itálico
72 px `#B89E6C`, corpo Inter 20/33, fundo `#FAF8F5`, tinta `#4A3E36`, acento
`#B89E6C`, container 1280, hero de 820 px, respiro de 112 px, uma faixa escura
de 360 px, 7996 px de página em 31 blocos e 22 imagens, movimento quase
inexistente.

Abri o site e olhei a estrutura do hero, que é a parte que o encargo não
descreve. O que eu vi e que importa copiar:

- A foto **sangra de ponta a ponta** e ocupa os 820 px inteiros. Não há
  moldura, não há raio, não há cartão em cima dela.
- Todo o texto do hero mora no **terço esquerdo**, alinhado à esquerda,
  ancorado na margem do container. A metade direita da foto fica vazia de
  propósito. Esse vazio é respiro, não buraco: se você mover o texto para o
  centro, a composição morre.
- A ordem é olho em caixa alta espacejada, título em duas linhas com a segunda
  em itálico bronze, parágrafo curto, dois botões lado a lado.
- **Não existe widget de reserva no hero.** A ação é um botão de rótulo, e só.
- A faixa de doação no topo é uma tarja fina de uma linha, não um banner.

Três coisas que o Woolmers faz e que eu **não** vou copiar, com o motivo:

| O que ele faz | Por que não copio |
|---|---|
| Bronze `#B89E6C` como tinta sobre o papel claro | dá **2,43:1** sobre `#FAF8F5`. Reprova até no critério de texto grande, que é 3:1. A linha de destaque dele é bonita e inacessível. Corrijo na seção 3.4 |
| Libre Baskerville no display | o manual da Green manda Playfair, e a medição (seção 4.2) mostra que Playfair resolve melhor o português |
| Corpo em Inter | Source Sans 3 é a do manual e é 13% mais estreita por caractere, que é exatamente o que o português precisa (seção 4.3) |

---

## 3. Cor

### 3.1 A ideia da reconciliação, em uma frase

O Woolmers é quente porque o **papel** é quente e o **acento** é quente, não
porque a tinta é marrom. Então eu compro o calor dele no papel e no bronze, e
mantenho a tinta no verde do manual. Nada de cor nova: o papel é um tinto do
`#d3b9a4` do manual, e o bronze é o `#e5b64e` do manual escurecido no mesmo
matiz.

Há uma coincidência que fecha o argumento. A luminância relativa da tinta do
Woolmers, `#4A3E36`, é **0,0517**. A do oliva institucional da Green,
`#3a452b`, é **0,0533**. Diferença de 3%. Trocar uma pela outra **muda o
matiz e não muda a leitura**: os dois dão praticamente o mesmo contraste sobre
o mesmo papel (9,74:1 lá, 9,45:1 aqui). A tinta desta página é verde e tem
exatamente o peso da tinta da referência.

Proporção alvo, 60/30/10:
- **60%** papel quente mais foto
- **30%** verde profundo, concentrado em **duas** áreas na página inteira: uma
  faixa de contraste e o rodapé
- **10%** bronze e dourado, em fio, olho, número, botão e a linha itálica do
  título. Nunca em bloco grande

### 3.2 O papel

`#d3b9a4` do manual é `hsl(26,8 / 34,8% / 73,5%)`. Todos os papéis desta
paleta são tintos desse mesmo matiz, o que faz o creme, a areia e o nude do
manual pertencerem à mesma família sem nenhuma invenção.

| Token | Valor | L* | Papel |
|---|---|---|---|
| `--papel` | `#FAF6F2` | 0,9265 | fundo primário da página |
| `--papel-areia` | `#F1E7DF` | 0,8118 | seção alternada, uma ou duas por página |
| `--papel-campo` | `#FFFFFF` | 1,0000 | **só** campo de formulário |
| `--filete` | `#E8DCCE` | 0,7043 | fio decorativo, 1 px, não carrega informação |

`#FAF6F2` é um passo mais quente e 1,5% mais escuro que o `#FAF8F5` do
Woolmers (L* 0,9405). De propósito: o papel da Green vem de um nude rosado, o
do Woolmers vem de um off white neutro.

Branco puro só existe dentro de campo de formulário, e é a diferença de 1,08:1
entre `--papel` e `--papel-campo` que marca o campo sem precisar de sombra.

### 3.3 A tinta

| Token | Valor | sobre `--papel` | sobre `--papel-areia` | Papel |
|---|---|---|---|---|
| `--tinta-titulo` | `#242D21` (manual) | **13,26:1** | **11,71:1** | display, H2, números grandes |
| `--tinta` | `#3A452B` (manual) | **9,45:1** | **8,34:1** | corpo, o padrão da página |
| `--tinta-suave` | `#5C6553` | **5,67:1** | **5,01:1** | legenda, meta, apoio |

As duas primeiras são valores literais do manual, sem extensão. `--tinta-suave`
é EXTENSÃO: é o oliva do manual puxado para o cinza, calibrado para passar
4,5:1 no **fundo mais escuro** do contexto claro, que é a areia. Por isso
5,01:1 e não 4,6:1: quero margem para quando o token trocar de fundo.

Preto puro não existe nesta paleta. É proibição do manual.

### 3.4 A escada do dourado

Este é o ponto onde o Woolmers reprova e onde a v1 já tinha acertado. Um só
matiz, **41,3 graus**, que é o matiz exato do `#e5b64e` do manual, em quatro
valores com papel definido.

| Token | Valor | HSV relativo ao `#e5b64e` | Onde pode | Contraste |
|---|---|---|---|---|
| `--ouro` | `#E5B64E` | o próprio manual | **superfície** no claro (preenchimento de botão, fio de 1 a 2 px, ícone grande) e **tinta** no escuro | 1,75:1 sobre papel, portanto **nunca texto no claro**. 5,39:1 sobre oliva, 7,56:1 sobre verde fundo |
| `--bronze-display` | `#8B784E` | s 67%, v 61% | **só** a linha itálica do display e títulos de 28 px para cima, e **só sobre papel** | **3,99:1** sobre papel, **3,52:1** sobre areia |
| `--bronze` | `#75633B` | s 76%, v 51% | texto, link, olho, número, em qualquer tamanho | **5,42:1** sobre papel, **4,78:1** sobre areia |
| `--bronze-sobre-foto` | `#E5B64E` | o próprio manual | a mesma linha itálica do display, quando ela está **sobre foto com véu** | **9,38:1** sobre o véu |
| `--ouro` no escuro | `#E5B64E` | o próprio manual | texto de acento sobre verde | **5,39:1** sobre `#3A452B` |

A linha de destaque do display troca de cor conforme o fundo, e isso não é
inconsistência, é a mesma decisão aplicada duas vezes. Sobre papel ela é
`#8B784E`, um bronze **mais claro** que a tinta ao redor. Sobre foto com véu
ela precisa ser mais clara que um fundo escuro, e aí `#8B784E` daria 4,12:1 e
ficaria barrenta: entra o `#E5B64E` do manual, a 9,38:1. Bronze escuro em cima
de fundo escuro é contradição.

O gesto do Woolmers preservado, com a conta certa: `#B89E6C` sobre `#FAF8F5`
dá 2,43:1 e não pode carregar texto. `#8B784E` é o mesmo tipo de bronze
empoeirado, escurecido até **3,99:1**, que passa o critério de texto grande
com margem. A relação óptica se mantém: o bronze continua sendo mais claro que
a tinta ao redor (L* 0,1947 contra 0,0533), então a linha itálica continua
recuando em relação à linha romana, que é o efeito que faz aquele hero
funcionar.

**Proibido, sem exceção:** `#E5B64E` como texto sobre qualquer papel claro,
`#E5B64E` como rótulo de botão, texto branco sobre botão `#E5B64E` (1,89:1, o
erro clássico de site de hotel), `--bronze-display` abaixo de 28 px.

### 3.5 O escuro

| Token | Valor | Papel |
|---|---|---|
| `--verde` | `#3A452B` (manual) | a faixa de contraste, uma por página |
| `--verde-fundo` | `#242D21` (manual) | o rodapé |
| `--verde-veu` | `#141A12` (EXTENSÃO) | véu sobre foto, e só isso |

Texto sobre escuro:

| Token | Valor | sobre `--verde` | sobre `--verde-fundo` |
|---|---|---|---|
| `--tinta-clara` | `#F4EFE6` | **8,87:1** | **12,45:1** |
| `--tinta-clara-suave` | `#D3B9A4` (manual) | **5,44:1** | **7,64:1** |
| acento no escuro | `#E5B64E` (manual) | **5,39:1** | **7,56:1** |

O texto secundário sobre escuro é o **nude do manual**, sem nenhuma extensão.
E ele não se confunde com o dourado porque são matizes diferentes (26,8 contra
41,3 graus): o nude puxa para rosa, o dourado para amarelo.

**Regra dura, e é uma correção da v1: no máximo duas áreas escuras na página
inteira.** Uma faixa de contraste de 280 a 360 px e o rodapé. Mais que isso
pica a leitura.

### 3.6 Bordas, foco, estado

| Token | Valor | Contraste |
|---|---|---|
| `--filete-forte` | `#7E6F5B` | 4,53:1 papel, 4,00:1 areia. Borda de campo e de botão fantasma, passa folgado o 3:1 de componente |
| `--filete-escuro` | `#A8B199` | 4,56:1 sobre `--verde`. Mesma função no contexto escuro |
| `--foco` | `#3A452B` no claro, `#E5B64E` no escuro | 9,45:1 e 5,39:1 |
| `--erro` | `#8E3324` | 7,37:1 papel, 6,51:1 areia |
| `--ok` | `#26604A` | 6,84:1 papel, 6,04:1 areia |

Erro e acerto são EXTENSÃO: o manual não prevê cor de sistema. Terracota e
verde mar dessaturados, os dois de fora da paleta institucional de propósito,
para ninguém confundir "campo validado" com "cor da marca". Vermelho puro de
alerta está proibido nesta marca.

`--filete-forte` sobe de `#8C7C64` (v1) para `#7E6F5B` porque o `#8C7C64` dava
só 3,33:1 sobre a areia. Passava raspando; agora passa com folga.

---

## 4. Tipografia

### 4.1 As famílias, e por que Libre Baskerville ficou de fora

Carreguei Playfair Display, Libre Baskerville, Source Sans 3 e Inter no Chrome
e medi as quatro. Números reais, em em por 100 px de corpo:

| Métrica | Playfair Display 400 | Libre Baskerville 400 | Source Sans 3 400 | Inter 400 |
|---|---|---|---|---|
| Altura de maiúscula | 70,8 | **77,0** | 65,6 | 72,8 |
| Altura de x | 51,5 | 53,0 | 48,6 | 54,6 |
| x / maiúscula | 0,727 | 0,688 | 0,741 | 0,750 |
| Contraste de traço (240 px, letra "o") | **4,80:1** (grossa 24, fina 5) | **2,33:1** (grossa 28, fina 12) | 1,24:1 | 1,16:1 |
| Avanço médio em frase portuguesa | **0,474em** | 0,544em | 0,442em | 0,509em |

**Decisão: Playfair Display 400 no display, romano e itálico. Libre
Baskerville não entra.** Quatro razões, nesta ordem de peso:

1. **O manual manda.** Playfair é a serifada oficial do Grupo Green. Contrariar
   isso precisaria de motivo forte, e não há.
2. **Ela é a que mais se parece com o lettering da logo.** A v1 mediu o
   lettering de "GREEN" no arquivo mestre: haste 52 px contra fina 14 px,
   razão **3,7:1**. Playfair dá 4,80:1, Libre Baskerville dá 2,33:1. Playfair
   erra por 1,30x, Libre erra por 1,59x. Playfair está mais perto.
3. **Português precisa de largura, e Playfair é 13% mais estreita.** 0,474em
   contra 0,544em por caractere. Numa coluna de 840 px a 72 px, Libre
   Baskerville coloca 21,4 caracteres por linha e Playfair coloca 24,6. Três
   caracteres a mais por linha é a diferença entre um título de duas linhas e
   um de três.
4. **A única vantagem real da Libre Baskerville eu eliminei em vez de comprar.**
   A vantagem dela é aguentar corpo pequeno: com a fina em 12/240, a 20 px o
   traço fino mede 1,0 px e desenha. A Playfair, com 5/240, a 20 px mede
   **0,42 px** e vira borrão cinza em tela de 1x. Em vez de trazer uma terceira
   família para resolver um caso, eu **proibi o caso**: nesta página nenhuma
   serifada aparece abaixo de 30 px. Tudo abaixo disso é Source Sans 3.

   O piso de 30 px não é arbitrário. A 30 px o traço fino da Playfair mede
   0,63 px, que em tela de 2x (celular e notebook retina, a maioria do
   tráfego) desenha limpo, e em tela de 1x fica claro mas legível, o que é
   aceitável em título e inaceitável em corpo.

**Texto: Source Sans 3, 400, 400 itálico e 600.** É a Source Sans do manual.
Contra a Inter do Woolmers ela ganha por dois números:

- **É 13% mais estreita por caractere** (0,442em contra 0,509em), e português
  é cerca de 12% mais longo que inglês na mesma mensagem. A fonte mais estreita
  devolve exatamente o que o idioma cobra.
- **A altura de x dela combina com a Playfair** (48,6 contra 51,5, razão
  0,944), que é a condição do par serifada mais sem serifa.

Consequência prática de calibragem: a altura de x da Source Sans 3 é 11% menor
que a da Inter. Para que o corpo pareça do mesmo tamanho do corpo do Woolmers,
**Source Sans 3 a 22 px iguala Inter a 20 px** (48,6 x 22 = 1069 contra
54,6 x 20 = 1092, diferença de 2%). É por isso que meu `--fs-lead` termina em
22 px e não em 20.

**A terceira fonte não existe**, e isso vem inteiro da v1: o script de "Beach"
pertence à logo. Reproduzir "Beach" em qualquer script de sistema ou do Google
Fonts é falsificação de assinatura.

Carregar exatamente cinco arquivos: Playfair Display 400 e 400 itálico,
Source Sans 3 400, 400 itálico e 600. Nada além.

### 4.2 A conta que calibra o display para o português

O Woolmers usa 72 px de Libre Baskerville. Se eu escrever 72 px de Playfair, o
título **encolhe**, porque a altura de maiúscula da Playfair é 8% menor
(70,8 contra 77,0).

Faço a conta pela altura de maiúscula, que é o que o olho mede:

- Libre Baskerville a 72 px: maiúscula de **55,4 px**
- Playfair a 80 px: maiúscula de **56,6 px**

Diferença de **2%**. Então **80 px de Playfair tem a mesma presença óptica que
72 px de Libre Baskerville**. E, de quebra, a 80 px a Playfair ainda é 3,3%
mais estreita por caractere que a Libre a 72 px (37,9 px contra 39,2 px), ou
seja, mesmo tamanho aparente e mais caracteres por linha. É exatamente o que o
português precisa.

**`--fs-display` máximo = 80 px.** Não é "um pouco maior que a referência", é o
valor que reproduz a referência com outra fonte.

### 4.3 A entrelinha do display, e o problema do acento

O Woolmers usa 72/72, entrelinha 1,0, colada. Medi o que acontece com isso em
português. Playfair Display, por 100 px de corpo:

| Glifo | Sobe acima da base | Desce abaixo da base |
|---|---|---|
| `H` | 70,8 | 0 |
| `Ã` | **90,2** | 0 |
| `É` e `Í` | **93,9** | 0 |
| `Ç` | 72,2 | 18,8 |
| `g` e `p` | - | 18,8 e 18,1 |

**O acento numa maiúscula sobe 32,6% acima da altura de maiúscula.** Isso muda
a conta da entrelinha:

- Em inglês, pior caso é maiúscula contra descendente: folga de
  `(1,0 - 0,708) + 0,188 = 0,480em`, que a 80 px dá **38,4 px**.
- Em português, pior caso é `É` ou `Á` contra descendente: folga de
  `(1,0 - 0,939) + 0,188 = 0,249em`, que a 80 px dá **19,9 px**.

**O português perde 48% da folga entre linhas.** Entrelinha 1,0 num título
português não colide tecnicamente, mas fecha visualmente, e fechar por acidente
é diferente de fechar por decisão.

**Decisão: `--el-display: 1.06`.** Folga no pior caso: `(1,06 - 0,939) + 0,188
= 0,309em`, ou **24,7 px a 80 px**. É o menor valor que devolve folga suficiente
mantendo a distância de 6% em relação ao 1,0 da referência, ou seja, o gesto
colado continua lá.

**Regra de conteúdo que acompanha:** escreva o título do hero de modo que as
maiúsculas acentuadas caiam na **primeira** linha, onde não há linha acima.
Quando isso não for possível, existe `--el-display-folgado: 1.14`, e é para
isso que ele existe.

### 4.4 A escala

Fluida entre 380 px e **1280 px** de viewport. Acima de 1280 a tipografia
**para de crescer**, porque o container também para. Página editorial não
aumenta o corpo num monitor de 27 polegadas; ela ganha margem.

| Token | px mín / máx | Família | Entrelinha | Entreletra | Uso |
|---|---|---|---|---|---|
| `--fs-display` | 40 / **80** | Playfair 400 | 1,06 | -0,018em | H1 do hero, e no máximo mais um por página |
| `--fs-h2` | 30 / 48 | Playfair 400 | 1,12 | -0,012em | título de seção |
| `--fs-h3` | 21 / 26 | **Source Sans 600** | 1,30 | -0,004em | subtítulo, nome de bloco, item de lista |
| `--fs-lead` | 18 / **22** | Source Sans 400 | 1,65 | 0 | parágrafo de abertura, o "corpo grande" do Woolmers |
| `--fs-corpo` | 17 / 19 | Source Sans 400 | 1,62 | 0 | texto corrido |
| `--fs-apoio` | 15 / 16 | Source Sans 400 | 1,50 | 0,004em | legenda, meta, rodapé |
| `--fs-olho` | 12 / 13 | Source Sans 600 | 1,20 | **0,180em** | olho em caixa alta |

São **sete tokens e cinco vozes por tela**. A regra de "no máximo cinco
tamanhos" é de peça impressa; uma página com formulário e legenda precisa de
mais degraus. O limite que vale aqui é: **numa mesma dobra, no máximo cinco
desses sete aparecem.**

Saltos: 80 para 48 é 1,67x. 48 para 26 é 1,85x. 26 para 22 é 1,18x, e esses
dois nunca aparecem no mesmo bloco (um é Playfair de seção, o outro é Source
Sans de parágrafo, e a diferença de família faz o trabalho que o tamanho não
faz). 22 para 19 é 1,16x, e são vozes diferentes pela cor e pela posição.

Entreletra negativa no display porque a Playfair a 80 px foi desenhada com
espacejamento de corpo de texto: sem os -0,018em ela fica frouxa. Entreletra de
**0,180em no olho** porque caixa alta sem entreletra gruda, e é a regra que mais
separa peça profissional de peça caseira. Nunca aplicar entreletra positiva em
caixa baixa corrida.

Números de diária, telefone, data e CNPJ sempre com
`font-variant-numeric: tabular-nums lining-nums`.

### 4.5 Hierarquia, dois recursos por nível

- **Display**: Playfair 400 + tamanho. Só isso. Caixa baixa, alinhado à
  esquerda, `--tinta-titulo`.
- **Linha de destaque dentro do display**: Playfair 400 **itálico** +
  `--bronze-display`. Dois recursos, estilo e cor, e nenhum a mais. Não
  aumentar, não mudar o peso, não centralizar.
- **H2**: Playfair 400 + tamanho, `--tinta-titulo`.
- **Olho**: Source Sans 600 + caixa alta com 0,18em, `--bronze`.
- **Corpo**: Source Sans 400, `--tinta`.
- **Apoio**: Source Sans 400, `--tinta-suave`.

Título em caixa alta, centralizado, dourado e negrito ao mesmo tempo é
hierarquia gritada. Nesta marca título é caixa baixa, alinhado à esquerda,
grande, em peso normal. O tamanho faz o trabalho.

### 4.6 A medida, corrigida

`ch` é o avanço do algarismo "0", não a média do alfabeto. Medi a diferença:

| Fonte | avanço do "0" | média real em português | `ch` infla |
|---|---|---|---|
| Source Sans 3 | 0,497em | 0,418em | **1,19x** |
| Playfair Display | 0,600em | 0,485em | **1,24x** |

Por isso os `66ch` da v1 entregam **79 caracteres**, acima do teto de 75. Os
valores corretos:

| Token | Valor | Caracteres reais | Largura a 19 px / a 80 px |
|---|---|---|---|
| `--medida-display` | **18ch** | ~22 | 864 px a 80 px |
| `--medida-h2` | **20ch** | ~25 | 600 px a 48 px |
| `--medida-lead` | **46ch** | ~55 | 476 px a 22 px |
| `--medida-corpo` | **58ch** | ~69 | 548 px a 19 px |
| `--medida-apoio` | **44ch** | ~52 | 335 px a 16 px |

`--medida-h2` existe porque eu renderizei a prova e vi o defeito: com medida
larga demais, "Itapema não acaba na faixa de areia" quebra deixando "areia"
sozinha na segunda linha. Palavra sozinha fechando um título é órfã, e em
título ela é o defeito tipográfico mais visível que existe. Resolva por medida,
por reescrita da frase ou por `<br>` deliberado, nunca deixando o navegador
decidir.

Os `--medida-*` são **max-width**, não width. Aplicar sempre junto de
`width:100%` ou dentro de uma coluna da grade, senão no celular o bloco estoura
a lateral, porque 58ch é maior que 390 px.

---

## 5. Grade e ritmo vertical

### 5.1 Grade

| Token | Valor | Por quê |
|---|---|---|
| `--medida-pagina` | 1280 px | o container do Woolmers, adotado sem alteração |
| `--medida-larga` | 1600 px | fila de mídia que passa do container sem sangrar inteiro |
| `--margem-lateral` | 20 px a 40 px | fluida |
| `--medianiz` | 16 px a 32 px | |
| colunas | 12 | |

A 1280 px com medianiz de 32 px, cada coluna tem **77,3 px**. Pares assimétricos
obrigatórios: **7/5** e **8/4**. Duas colunas exatamente iguais dividindo a tela
ao meio está proibido nesta página.

Foto alinha à grade como texto alinha. Foto que começa 2 px fora da coluna é o
que separa amador de profissional.

### 5.2 Ritmo vertical

O Woolmers respira 112 px no topo de seção. Adoto esse número como o topo da
escala de desktop.

| Token | Mobile (380 px) | Desktop (1280 px) | Uso |
|---|---|---|---|
| `--respiro-secao` | **72 px** | **112 px** | entre seções, o padrão |
| `--respiro-pausa` | **96 px** | **160 px** | antes e depois das 2 ou 3 viradas grandes da página |
| `--respiro-bloco` | **32 px** | **56 px** | entre blocos dentro da mesma seção |
| `--respiro-paragrafo` | 20 px | 24 px | entre parágrafos |
| `--respiro-titulo` | 20 px | 28 px | do título ao primeiro parágrafo |

O ritmo é **regular e repetido**. Se uma seção respira 112 px no topo, todas
respiram. Espaço que aparece em um lugar só e não se repete em nenhum outro é
buraco, não respiro, e se resolve com conteúdo, com escala ou com
redistribuição, nunca com ornamento.

### 5.3 Hero

**`--altura-hero`: 480 px no celular, 820 px no desktop. Não é `100vh`.**

Três motivos: o hero de tela cheia esconde que existe página abaixo, e a única
conversão desta landing é chegar no WhatsApp; `100vh` no iOS pula quando a
barra de endereço some; e 820 px é o número da referência.

A 480 px num celular de 820 px de altura, sobram 340 px da próxima seção
aparecendo, o que convida a rolar sem precisar de seta quicando.

### 5.4 Raio

| Elemento | v1 | **v3** |
|---|---|---|
| Quebra de seção | 20 a 36 px | **0** |
| Foto | 12 px | **0** |
| Cartão | 14 px | **0**, e o cartão sai da página |
| Botão | 10 px | **4 px** |
| Campo de formulário | 8 px | **4 px** |
| Pílula | 999 px | **proibido** |

Esta é a mudança de superfície mais visível da v3. Raio zero em seção e em foto
é o que tira a página da pilha de cartões e coloca ela na página editorial.
O raio de 4 px no botão e no campo existe só para o controle não parecer
recortado a faca; não é decoração.

### 5.5 Sombra

`--sombra-1` e `--sombra-2` existem para **menu suspenso e calendário**, e para
mais nada. Tingidas de `36 45 33`, nunca preto puro, porque preto sobre papel
quente cria uma borda acinzentada suja.

Foto não tem sombra. Seção não tem sombra. Botão não tem sombra. Se um bloco
precisa de sombra para se destacar, o problema é de hierarquia, não de
profundidade.

---

## 6. Como a foto entra

### 6.1 O acervo real, medido

`site/public/fotos` tem **16 arquivos**. Abri todos e medi.

**Resolução.** Quatorze aéreas nativas em 4032 x 2268 (16:9) e duas em
8064 x 4536. Para um hero de 1600 px de caixa a 2x é preciso 3200 px:
**as aéreas passam**. Duas exceções que mandam no layout:

- `fachada-green-beach`, **628 x 910**. É a **única** foto real da casa. A 2x
  ela só preenche uma caixa de **314 px** de largura. Nunca em hero, nunca em
  faixa, nunca em bloco grande. Retrato pequeno num mosaico, e só.
- `cafe-da-manha`, 4480 x 6720, **é foto de banco de imagem**, e isso está
  declarado no próprio arquivo de dados da v1 (`tipo: 'ilustracao'`). Minha
  recomendação para a v3 é **tirar da página**. Foto de banco de xícara azul
  com croissant é um dos sinais mais reconhecíveis de peça amadora, e ela está
  ilustrando justamente o café da manhã, que é um argumento de venda real. Ou
  entra a foto verdadeira, ou o café vira tipografia, sem foto.

**Luminância, e é isso que decide qual foto vai para o hero.** Para
`--tinta-clara` `#F4EFE6` carregar 4,5:1, o fundo precisa ficar abaixo de
**L* 0,1537**. Medi o percentil 90 da zona de texto (48% esquerdos, faixa
vertical de 34% a 90%) de cada aérea e calculei o véu necessário:

| Foto | L* p90 na zona de texto | Véu `#141A12` necessário |
|---|---|---|
| `itapema-entardecer` | 0,052 | **0,00** |
| `itapema-orla-a-noite` | 0,087 | **0,00** |
| `itapema-canto-da-praia` | 0,133 | **0,00** |
| `itapema-praia-grossa` | 0,169 | 0,06 |
| `itapema-por-do-sol` | 0,208 | 0,17 |
| `itapema-verao-na-praia` | 0,406 | 0,42 |
| `itapema-baia-do-mirante` | 0,428 | 0,44 |
| `itapema-ilha-praia-grossa` | 0,441 | 0,45 |
| `itapema-baia-aberta` | 0,465 | 0,46 |
| `itapema-faixa-de-areia` | 0,603 | 0,53 |
| `itapema-meia-praia-aerea` | 0,624 | 0,54 |
| `itapema-nascer-do-sol` | 0,625 | 0,54 |
| `itapema-guarda-sois` | 0,663 | **0,55** |

**Regra: a foto do hero tem que ter p90 abaixo de 0,30 na caixa de texto.**
Acima disso o véu passa de 0,40 e a foto deixa de ser foto e vira fundo
esverdeado. Candidatas legítimas: `itapema-canto-da-praia` (0,133),
`itapema-praia-grossa` (0,169), `itapema-por-do-sol` (0,208).

`itapema-meia-praia-aerea` é a foto mais bonita do acervo e **não serve para
hero com texto por cima**: ela exige véu 0,54. Ela serve para faixa sangrada
sem texto, ou com o texto no papel, embaixo dela.

### 6.2 O véu

| Token | Uso |
|---|---|
| `--veu-hero-lateral` | gradiente 90 graus, 0,62 na borda esquerda, 0,30 em 55%, 0 em 88% |
| `--veu-hero-topo` | gradiente 180 graus, 0,50 no topo, 0 em 22%, só para proteger a marca contra céu estourado |
| `--veu-faixa` | atrás de bloco de texto sobre foto quando não dá para controlar a imagem |
| `--veu-min` | **0,55**, o piso declarado |

Os dois gradientes do hero se somam: onde o lateral vale 0,62 e o vertical vale
0,30, o alfa efetivo é `1 - (1-0,62)(1-0,30) = 0,734`. Isso cobre até a foto
mais clara do acervo.

Véu em `#141A12` e nunca em preto. O manual proíbe preto, e o verde preserva o
rosado da areia em vez de esmagar em cinza.

**O contraste sobre foto se confere na foto escolhida, no pior pixel da caixa
de texto, não na média.** A tabela acima é o ponto de partida, não a prova.

### 6.3 Sangria, proporção e recorte

**Sangria.** A foto ou sangra de ponta a ponta da janela, ou alinha exatamente
a uma coluna da grade. Não existe estado intermediário. Nunca foto dentro de
caixa com margem e canto arredondado, que é o item 1.3 do diagnóstico.

Nota técnica herdada da v1, que custou caro: sangria com `translate` não move a
caixa de layout e estoura o documento na horizontal. Use margem negativa. E
`overflow-x: hidden` no body quebra `animation-timeline: view()`; use `clip`.

**Proporção.** O acervo inteiro é 16:9 nativo. Qualquer recorte para longe de
16:9 joga pixel fora.

| Contexto | Proporção | Observação |
|---|---|---|
| Hero desktop | 1280 x 820 (1,56:1) | sangrando |
| Hero mobile | **16:9 ou 3:2, com o texto no papel abaixo** | ver a regra do recorte |
| Faixa panorâmica | 21:9 | sangrando ponta a ponta |
| Peça grande do mosaico | 3:2 | |
| Peça vertical do mosaico | 4:5 | é aqui que a fachada entra |
| Detalhe | 1:1 | |

**Recorte, a regra que mais importa neste acervo.** Aérea de praia tem o
assunto numa **linha horizontal**: a curva da areia, o horizonte, a orla. Um
recorte 4:5 joga fora 55% da largura e transforma a curva da praia numa fatia
sem assunto. Então:

- Foto cujo assunto é linha horizontal (`meia-praia-aerea`, `faixa-de-areia`,
  `baia-aberta`, `verao-na-praia`, `guarda-sois`, `nascer-do-sol`): **nunca
  abaixo de 3:2.**
- Foto com massa vertical (`por-do-sol`, `orla-a-noite`, `entardecer`,
  `canto-da-praia`, `ilha-praia-grossa`): pode ir a 4:5.
- No celular, **o hero não tenta ser 4:5 com texto por cima.** A foto vira uma
  faixa 16:9 no topo e o texto desce para o papel. Isso resolve o recorte e o
  véu de uma vez, e é mais editorial que texto branco espremido.

Ponto focal por foto, no arquivo de dados, nunca no CSS:
`{ arquivo, alt, foco: "62% 38%" }` aplicado como `object-position`. Para achar
o valor sem chutar, gere a foto com uma grade numerada de 0 a 1 sobreposta,
abra e leia a coordenada.

**Proibido:** esticar, achatar, preencher o vazio com cópia borrada da própria
foto ao fundo, moldura branca, faixa de cor tapando diferença de proporção.

### 6.4 O mapa de fotos, e a repetição que vai acontecer

Este acervo tem **cinco quase duplicatas**. Se ninguém mapear antes de
diagramar, elas vão cair na mesma rolagem e a pousada vai parecer ter uma foto
só. Agrupei olhando as dezesseis:

| Família | Fotos | Quantas podem aparecer |
|---|---|---|
| **A. Curva da praia de dia, com prédios, vista do alto** | `meia-praia-aerea`, `baia-aberta`, `faixa-de-areia`, `verao-na-praia`, `guarda-sois` | **no máximo 2**, e em escalas muito diferentes |
| **B. Ponta, ilha e costão** | `canto-da-praia`, `ilha-praia-grossa`, `praia-grossa`, `barcos-de-pesca`, `baia-do-mirante` | no máximo 3 |
| **C. Fim de tarde e noite** | `por-do-sol`, `entardecer`, `orla-a-noite` | **no máximo 1**, porque `por-do-sol` e `entardecer` são praticamente o mesmo enquadramento |
| **D. Luz prateada, tempo fechado** | `nascer-do-sol` | 1, e ela é a única foto de clima diferente do acervo |
| **E. A casa** | `fachada-green-beach` | 1, pequena, por limite de resolução |
| **F. Ilustração** | `cafe-da-manha` | **0**, recomendo tirar |

### 6.5 Contraste de escala, com número

Renderizei a prova do sistema e caí na armadilha que eu mesmo listei no
diagnóstico. Num par assimétrico 7/5, coloquei uma peça 3:2 de 545 x 363 px e
uma 4:5 de 383 x 479 px. Larguras diferentes, proporções diferentes, e mesmo
assim as duas leem como do mesmo tamanho. O motivo está na área: 197.835 px²
contra 183.457 px², **razão de 1,08**.

Largura diferente não é contraste de escala. **Área** é.

**Regra, `--razao-escala-foto`: num bloco com mais de uma foto, a razão de área
entre a maior e a menor tem que ficar entre 2:1 e 6:1.** Confira a área, não a
largura. É a versão medível de "foto grande e foto pequena na mesma página".

O teto de 6:1 também saiu da prova renderizada. Refiz o par em 8/3 e a razão
subiu para 4,36:1, que funciona, mas testando mais longe a peça menor vira
selo perdido no branco. Junto com o teto vem a regra que o acompanha: **a foto
menor nunca fica sozinha no vazio.** Ela senta contra uma legenda, um bloco de
texto ou a borda da coluna. Foto pequena isolada com ar em volta dos quatro
lados não é respiro, é buraco, porque você poderia movê-la para qualquer outro
canto sem prejuízo nenhum.

### 6.6 Quantas fotos

**Teto de 9 fotos na página inteira.** O Woolmers tem 22 imagens em 7996 px
porque tem 22 assuntos distintos. Nós temos 5 assuntos distintos. Repetir para
encher página é o erro que faz a empresa parecer pequena.

`nascer-do-sol` merece tratamento próprio: é a única foto clara e de baixo
contraste do acervo (L* médio 0,524). Ela **não aceita texto branco por cima**
em lugar nenhum. Em compensação, ela é a única que aceita **tinta escura por
cima**, e uma página inteira de foto clara com título em `--tinta-titulo` é o
tipo de virada que quebra a monotonia sem ornamento nenhum.

### 6.5 Linguagem

Herdada da v1, sem alteração, porque está certa: hora dourada e hora azul,
horizonte reto, mar verde azulado de Santa Catarina e não turquesa de Caribe,
tratamento `saturate(1.02) contrast(1.02)` e nada mais, sem vinheta, sem grão,
sem HDR. Pessoas de costas, em gesto ou em detalhe, nunca casal sorrindo de
frente para a câmera.

Toda foto nova precisa ser fotografada **já deixando ar para a tipografia
entrar**: um lado do quadro propositalmente vazio e escuro.

---

## 7. A marca na página

A leitura da logo está feita na v1, seção 6, e continua valendo inteira:
o lockup é quase quadrado (proporção 0,921), só é legível a partir de 190 px de
altura, o piso onde "POUSADA & HOTEL" ainda se lê é 135 px, e o módulo de área
de proteção é X igual à altura de maiúscula de "GREEN", 15,1% da altura do
lockup, com 1X livre nos quatro lados e 1,5X entre logo e primeiro item de
menu.

Duas correções que a v3 faz:

**7.1 A captura da v1 mostra o cabeçalho sem logo nenhum**, só o menu e um
botão. Página de hospedagem sem assinatura no topo é erro básico. Enquanto a
versão reduzida horizontal não existir, o cabeçalho usa o lockup vertical em
SVG monocromático `--tinta-clara`, **136 px de altura**, ancorado à esquerda e
ultrapassando a barra para dentro do hero. Fica maior que o cabeçalho de
propósito: é gesto editorial e resolve a legibilidade. Nunca centralizado.

**7.2 Continuam faltando dois ativos**, e isso é pendência de arquivo, não de
design: a versão reduzida horizontal (mandala à esquerda, "GREEN Beach" à
direita) e o símbolo isolado redesenhado com traço engrossado para favicon. O
traço fino da mandala é 1,64% da largura dela: num favicon de 32 px isso dá
0,52 px e a mandala vira bolha. Reduzir o arquivo atual não resolve.

Proibições da marca, todas herdadas do manual do grupo e da v1: não recriar
"Beach" com fonte de script, não usar o PNG dourado com gradiente metálico em
tela (no digital a versão é chapada em `#E5B64E`, `#F4EFE6` ou `#242D21`, em
SVG), sem sombra, glow, bisel ou contorno, sem girar, inclinar, distorcer ou
espelhar, sem colocar dentro de círculo, quadrado, moldura ou selo, sem animar
a mandala girando, sem usar a mandala como marca d'água de fundo ou como bullet
de lista, e nunca o lockup completo abaixo de 135 px.

---

## 8. Movimento

O Woolmers tem um fade de 0,6 s no hero, uma barra de progresso de carrossel e
uma seta quicando. **Nenhum reveal por rolagem, nenhum parallax, nenhuma
biblioteca.** Ele é bonito por tipografia, foto e espaço.

A v1 tem 41 KB de `movimento.css` com animação dirigida por rolagem. **A v3
desliga isso.** Não porque o código seja ruim, mas porque revelação por rolagem
é o recurso que faz uma página parecer que está tentando impressionar, e a
Green Beach não precisa disso. E porque cada reveal é uma chance de a página
ficar em branco quando o observador não dispara, que é uma das três armadilhas
que o projeto já documentou.

O que fica:

| Token | Valor | Uso |
|---|---|---|
| `--dur-entrada` | 600 ms | **só** o fade do hero, uma vez, no carregamento |
| `--dur-rapida` | 160 ms | cor de link, sublinhado, ícone |
| `--dur-base` | 240 ms | botão, campo, cabeçalho ficando sólido |
| `--dur-lenta` | 400 ms | abrir modal, calendário, zoom de foto em hover |
| `--atraso-escada` | 80 ms | entre itens de uma lista, no máximo 4 itens |
| `--deslocamento-entrada` | 16 px | o "up" do fade up |
| `--zoom-foto` | 1,03 | escala da foto em hover |

Todos zeram em `prefers-reduced-motion: reduce`, na origem, dentro do próprio
`tokens.css`. Componente nenhum precisa escrever regra própria para isso.

**Proibido:** parallax, revelação por rolagem, contador animado, texto
aparecendo letra por letra, carrossel em autoplay, seta quicando (o hero de
820 px já mostra que há página abaixo, a seta é redundante).

---

## 9. O que não fazer, com nome

O cliente reconhece estes como amador. Cada item tem endereço.

1. **Moldura em volta de foto.** Foto com borda branca, foto com canto
   arredondado dentro de um cartão, foto com sombra. Nesta página foto sangra
   ou alinha à coluna, e tem raio zero.
2. **Cartão branco flutuando sobre o hero.** O widget de reserva sai do hero.
   A ação do hero é um botão de rótulo. A busca de datas, se existir, é uma
   faixa em `--verde` alinhada à grade, colada no topo ou no rodapé, com os
   campos em raio 4 px. Motor de reserva de terceiro vende o cartão pronto:
   não compre.
3. **Ornamento espalhado.** Fio dourado com losango no meio separando seções,
   cantoneira botânica em cada bloco, mandala em marca d'água atrás do texto,
   ícone de linha fina dentro de círculo. Buraco se resolve com conteúdo, com
   escala ou com redistribuição, nunca com enfeite. Ornamento tapando vazio é
   visível como tapa buraco.
4. **Tudo centralizado.** Texto nesta página é alinhado à esquerda, sempre. O
   centro é permitido **uma vez** na página inteira, e é preciso saber qual vez
   é.
5. **Tipografia tímida.** Título que divide a atenção com outra coisa é título
   tímido, mesmo com 100 px. Display mora sozinho, com respiro em volta, no
   terço esquerdo, e ganha a tela.
6. **Seções arredondadas empilhadas.** Raio zero na quebra de seção.
7. **Quatro fotos do mesmo tamanho lado a lado.** Em qualquer bloco com mais de
   uma foto tem que haver diferença clara de escala. Grade de peças iguais é
   catálogo de estoque.
8. **Alternância constante de fundo claro e escuro.** Duas áreas escuras na
   página inteira, e ponto.
9. **Playfair em negrito, caixa alta, centralizada e dourada, tudo junto.**
10. **Foto de banco de imagem ilustrando serviço real.** Ver 6.1.
11. **Selo de Booking ou TripAdvisor, estrelas, "mais de 500 hóspedes
    felizes".** A pousada não está em nenhuma OTA, e a nota 4,4 do Google é da
    gestão anterior (Hotel Recanto Natural). **Não pode aparecer.**
12. **Preço em vermelho, badge "OFERTA", contador regressivo, "só restam 2
    quartos".** Derruba o posicionamento premium em um segundo.
13. **Copy genérica:** "descubra o paraíso", "conforto e requinte", "sua melhor
    experiência". A voz da Green Beach é curta, concreta e específica:
    distância da areia, horário do café, o que dá para ver da janela.
14. **Botão dourado com rótulo branco** (1,89:1) e **texto dourado sobre papel
    claro** (1,75:1).
15. **Véu preto puro sobre a foto.**
16. **Duas colunas exatamente iguais dividindo a tela ao meio.**

---

## 10. As decisões, resumidas

| Decisão | Por quê |
|---|---|
| Papel `#FAF6F2`, um tinto do `#d3b9a4` do manual | traz o nude do manual para o papel de neutro dominante e fica um passo mais quente que o `#FAF8F5` do Woolmers |
| Tinta no verde do manual, não no marrom da referência | as duas têm a mesma luminância (0,0533 contra 0,0517), então a troca muda o matiz e não muda a leitura |
| Bronze `#8B784E` em vez do `#B89E6C` do Woolmers | o bronze da referência dá 2,43:1 e reprova até para texto grande; o meu dá 3,99:1 e mantém o mesmo gesto |
| Escada de um matiz só (41,3 graus) para todo o dourado | é o matiz exato do `#e5b64e`; quatro valores, cada um com um piso de contraste declarado |
| Playfair Display no display, Libre Baskerville fora | manual, proximidade com o lettering da logo (4,80:1 contra 3,7:1 medidos) e 13% mais estreita por caractere |
| Display máximo em 80 px e não 72 px | 80 px de Playfair tem a mesma altura de maiúscula que 72 px de Libre Baskerville, com 2% de diferença |
| Entrelinha do display em 1,06 e não 1,0 | acento em maiúscula sobe 32,6% acima do cap; 1,0 em português perde 48% da folga entre linhas |
| Source Sans 3 a 22 px no lead | iguala opticamente a Inter a 20 px do Woolmers, porque a altura de x é 11% menor |
| Medidas corrigidas de 66ch para 58ch | `ch` infla 1,19x em Source Sans; 66ch entregava 79 caracteres |
| Raio zero em seção e em foto | tira a página da pilha de cartões |
| Hero de 820 px, não `100vh` | mostra que existe página abaixo, e `100vh` pula no iOS |
| Duas áreas escuras na página inteira | o Woolmers tem uma faixa de 360 px em 7996 px |
| Movimento reduzido a um fade no hero | a página é bonita por tipografia, foto e espaço |
| Teto de 9 fotos e mapa por família | o acervo tem 5 quase duplicatas e só 5 assuntos distintos |
| Contraste de escala medido por área, 2:1 | largura diferente engana: na prova renderizada, um par 7/5 deu razão de área de 1,08 e leu como duas fotos iguais |
| `--medida-h2` de 20ch | sem ele o H2 quebra deixando uma palavra órfã na segunda linha |
| A linha itálica troca de bronze para dourado sobre foto | `#8B784E` sobre véu dá 4,12:1 e fica barrento; `#E5B64E` dá 9,38:1 |

---

## 11. Como usar

```css
/* main.css */
@import "./tokens.css";
```

**Disciplina:** nenhum componente escreve valor de cor, tamanho, raio, sombra
ou duração direto. Se um valor faltar, ele entra em `tokens.css` com nome
semântico e vira parte do sistema. Um hex solto num componente é o começo da
morte do sistema.

O contexto escuro se aplica pela classe `.gb-escuro` ou por
`[data-superficie="escuro"]` no elemento de seção. Ela **só troca token**.
Botão, campo, link e legenda continuam com o mesmo CSS.

Arquivos:
- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/site-v3/src/styles/tokens.css`
- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/direcao-de-arte-v3.md`

---

## 12. Confirmar antes de publicar

1. **Aval do manual sobre a extensão da paleta.** São extensão, e precisam do
   aval de quem guarda o manual do Grupo Green: os papéis `#FAF6F2`, `#F1E7DF`,
   `#E8DCCE`, os bronzes `#8B784E` e `#75633B`, a tinta suave `#5C6553`, o
   filete `#7E6F5B`, o véu `#141A12`, e as cores de sistema `#8E3324` e
   `#26604A`. Nada aqui contraria o manual e tudo é derivado dele, mas é
   extensão e vai declarado.
2. **Foto real do café da manhã.** Enquanto não chegar, a recomendação é tirar
   a foto de banco da página, não substituir por outra de banco.
3. **Fotos de dentro da casa.** Continuam não existindo: piscina, apartamento,
   banheiro, área comum. A `fachada-green-beach` de 628 px é a única foto real
   da pousada e não aguenta bloco grande. A v3 resolve o destino, não a casa,
   igual à v1.
4. **Versão reduzida horizontal da logo e símbolo isolado para favicon.** Não
   existem. Sem eles, o cabeçalho fica na solução da seção 7.1.
5. **Uso monocromático chapado da logo em tela** (dourado, areia ou verde),
   confirmar por escrito com quem tem o arquivo vetorial mestre.
6. **Motor de reserva.** Se a busca de datas virar widget de terceiro, ele traz
   CSS próprio e provavelmente ignora estes tokens. Precisa ser decidido antes
   de alguém desenhar a barra de reserva.
7. **Nada inventado.** Número de quartos, ano de fundação, distância exata até
   a areia, quantidade de hóspedes, nota, depoimento: nada disso entra sem
   confirmação da pousada. A convenção `confirmado: true/false` do arquivo de
   dados da v1 deve ser mantida na v3. Se o layout pedir um número que não
   existe, muda o layout.
8. **A nota 4,4 do Google é da gestão anterior** (Hotel Recanto Natural). Não
   pode ser exibida, e o Schema.org não pode declarar `aggregateRating`.

---

## 13. Limitações técnicas conhecidas

- **Contraste sobre foto é sempre estimativa.** A tabela da seção 6.1 mede o
  percentil 90 numa caixa de texto hipotética (48% esquerdos, 34% a 90% na
  vertical). Quando a caixa de texto real existir, refazer a medição no pior
  pixel dela, não na média.
- **Playfair Display não tem versão variável estável no Google Fonts** para
  todos os eixos usados aqui, por isso a especificação é de pesos estáticos.
- **`clamp()` com `vw` não reage a zoom de texto** em alguns navegadores. Os
  pisos da escala (17 px de corpo, 15 px de apoio, 12 px de olho) foram
  escolhidos já contando com isso.
- **`rgb(var(--x) / 0.5)`** é sintaxe do CSS Color 4. Chrome, Safari 15+,
  Firefox 93+. Para navegador mais antigo, trocar por `rgba()` literal.
- **As métricas de fonte foram medidas via `measureText` no Chrome**, com as
  fontes carregadas do Google Fonts. Elas descrevem o desenho real, mas o
  arredondamento de subpixel varia por navegador e por densidade de tela. Os
  números de traço fino (0,42 px a 20 px na Playfair) são o caso de tela 1x.
- **Não existe versão impressa deste sistema.** Se a Green Beach pedir folder
  ou placa, a conversão de CMYK das cores precisa ser feita a partir dos
  valores do manual, não destes hex de tela.
