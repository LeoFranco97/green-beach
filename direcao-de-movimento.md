# Pousada & Hotel Green Beach
## Sistema de movimento e refinamento visual, v1.0 | set/2026

Este documento é a continuação da `direcao-de-arte.md`. Aquele define cor, tipo,
espaço, foto e marca. Este define **como as coisas entram, saem e reagem**, e o
que ainda precisa mudar de estrutura na página que está no ar.

O CSS executável está em `site/src/styles/movimento.css`, importado por último
em `styles/index.css`. Cada número deste documento existe no arquivo, e cada
número do arquivo tem a razão escrita ao lado.

O cliente pediu "bastante motion". A régua desta entrega:

> **Movimento aqui serve para dizer que a página está viva e para guiar o
> olho. Não serve para mostrar que o designer sabe animar.**
> Nada se move por mais de 900ms. Nada se move sem ter chegado a algum lugar.
> Nada pisca, nada gira, nada repete em laço, e o formulário de reserva nunca
> espera coreografia nenhuma.

---

## 1. O acervo novo, medido antes de qualquer decisão

Chegaram 75 arquivos de drone em oito pastas, dez/2023 e jan/2024. Do acervo
bruto, **14 fotos foram processadas** para o site. Números reais, do manifesto
`site/public/fotos/fotos.json`:

| | |
|---|---|
| Arquivos originais | 4032 x 2268 px (12 fotos) e 8064 x 4536 px (2 fotos) |
| Proporção de **todas** as 14 | 1,7778, ou seja **16:9, sem exceção** |
| Fotos verticais no acervo | **zero** |
| Foto da própria pousada | uma, `fachada-green-beach`, 628 x 910 px |

Três consequências que mandam no resto:

**a) Resolução deixou de ser problema.** A `direcao-de-arte.md` listava como
pendência número 5 que o acervo de 1080 px não servia para hero. Resolvido: com
4032 px de largura o hero pode ir até 2560 px de arquivo com folga, e as duas
fotos de 8064 px (`praia-grossa` e `ilha-praia-grossa`) aguentariam impressão.

**b) Não existe foto vertical, e isso quebra o mosaico previsto.** A seção 5.2
da direção de arte previa slots 4:5 no mosaico. Testei recortes reais de todas
as candidatas. **Três aéreas sobrevivem a um corte 4:5** e três só:

| Foto | 4:5 | Por quê |
|---|---|---|
| `itapema-guarda-sois` | **sim, e fica melhor** | é um plano de cima para baixo, o assunto é a textura dos guarda-sóis e a diagonal da areia. Vertical valoriza |
| `itapema-ilha-praia-grossa` | sim | a ilha, o molhe e a água turquesa cabem inteiros |
| `itapema-praia-grossa` | sim | mata, pedra e água em faixas horizontais, corta em qualquer lugar |
| curvas de baía (5 fotos) | **não** | o assunto é a curva de ponta a ponta. Cortar para 4:5 tira 58% da largura e mata o motivo da foto |
| `fachada-green-beach` | nativa 0,69 | é a única vertical do projeto, e a única foto da casa |

**c) Repetição é o risco real do acervo, e ele é mensurável.** Calculei a
distância perceptual (dHash 16x16) entre todos os pares. Média geral 124 de 256.
Os pares mais próximos:

| Distância | Par | Leitura |
|---|---|---|
| 77 | `baia-aberta` x `faixa-de-areia` | praticamente o mesmo enquadramento |
| 94 | `barcos-de-pesca` x `faixa-de-areia` | mesmo ângulo, altura diferente |
| 97 | `entardecer` x `por-do-sol` | o mesmo pôr do sol, dois cliques seguidos |
| 100 | `faixa-de-areia` x `meia-praia-aerea` | mesma curva, mesma hora |
| 105 | `baia-aberta` x `meia-praia-aerea` | idem |

Em famílias, as 14 fotos são **8 assuntos**:

1. curva da Meia Praia de dia, do alto: `baia-aberta`, `faixa-de-areia`,
   `meia-praia-aerea`, `verao-na-praia`, `baia-do-mirante` (**cinco fotos, um assunto**)
2. entardecer vermelho sobre a cidade: `entardecer`, `por-do-sol` (duas, uma)
3. canto com barcos de pesca: `barcos-de-pesca`, `canto-da-praia` (duas, uma)
4. península verde e água turquesa: `praia-grossa`, `ilha-praia-grossa` (duas, uma)
5. orla à noite, curva de luzes: `orla-a-noite` (única)
6. nascer do sol, mar prateado: `nascer-do-sol` (única)
7. guarda-sóis de cima: `guarda-sois` (única)
8. a fachada da pousada: `fachada-green-beach` (única)

**Recomendação dura: o lightbox mostra 9 fotos, não 15.** Uma por assunto, mais
uma segunda da família 1 se ela for muito diferente em hora do dia. O botão hoje
diz "Ver as 15 fotos" e isso é uma promessa de variedade que o acervo não
cumpre: o visitante clica esperando conhecer a pousada e passa por cinco vezes a
mesma baía. Repetição de enquadramento em catálogo é falha grave (direção de
arte, seção 5.1) e aqui ela está medida, não achada.

### 1.1 Qual foto aguenta texto por cima

Medi a luminância na zona exata onde o texto do hero senta (44% da largura à
esquerda, de 30% a 95% da altura), peguei a média dos 5% de pixels mais claros
dessa zona, apliquei o véu do sistema e calculei o contraste com
`--text-inverse` `#f4efe6`:

| Foto | RGB do pior caso | Contraste com véu 0,62 | Com véu 0,81 | Desvio |
|---|---|---|---|---|
| `canto-da-praia` | 98,123,139 | 9,58:1 | 12,48:1 | **0,049** |
| `praia-grossa` | 148,169,166 | 7,32:1 | 11,05:1 | 0,094 |
| `orla-a-noite` | 160,159,132 | 7,64:1 | 11,27:1 | 0,090 |
| `entardecer` | 161,148,123 | 8,03:1 | 11,54:1 | 0,098 |
| `baia-do-mirante` | 153,187,215 | 6,57:1 | 10,50:1 | 0,142 |
| `por-do-sol` | 212,208,182 | 5,68:1 | 9,78:1 | 0,151 |
| `verao-na-praia` | 211,218,219 | 5,37:1 | 9,50:1 | 0,129 |
| `baia-aberta` | 231,226,222 | 5,07:1 | 9,24:1 | 0,176 |
| `guarda-sois` | 247,245,238 | 4,59:1 | 8,76:1 | **0,229** |
| `meia-praia-aerea` | 251,250,249 | 4,44:1 | 8,61:1 | **0,254** |
| `barcos-de-pesca` | 252,250,244 | 4,46:1 | 8,63:1 | **0,258** |

**Conclusão que muda a escolha da foto do hero: contraste não é o problema.**
Com o véu do sistema (0,81 efetivo onde o texto senta) até a pior foto entrega
8,61:1. O problema é o **desvio**, isto é, o quanto o fundo é picotado. Texto
grande sobre um fundo com desvio 0,25 tem contraste sobrando e mesmo assim lê
mal, porque a borda de cada letra encontra ora prédio, ora areia, ora sombra.

Regra: **hero e faixa com frase só usam foto de desvio abaixo de 0,15 na zona do
texto.** Isso aprova `canto-da-praia`, `praia-grossa`, `orla-a-noite`,
`entardecer`, `baia-do-mirante`, `por-do-sol` e `verao-na-praia`. Reprova
`meia-praia-aerea`, `barcos-de-pesca` e `guarda-sois` para esse uso. As
reprovadas continuam ótimas dentro do mosaico, onde não há texto por cima.

---

## 2. A camada técnica, e as armadilhas reais deste código

### 2.1 Duas implementações, uma para cada mundo

| Caminho | Onde funciona | Usado para |
|---|---|---|
| `animation-timeline: view()` e `scroll()` | Chrome, Edge e Safari | tudo que reage à rolagem |
| IntersectionObserver com a classe `.is-dentro` | todo lugar, inclusive Firefox | o mesmo, como rede de segurança |

Scroll-driven animation **não é baseline**: Chromium e Safari entregam, Firefox
ainda mantém atrás de preferência. Por isso as duas existem, e por isso a nativa
está trancada em `@supports (animation-timeline: view())`, vencendo a do
observador por ordem de cascata.

Por que insistir na nativa se a do observador funciona em todo lugar: a nativa
roda **fora da thread principal**. Numa rolagem por inércia de iPhone, um
`transform` escrito por JavaScript a cada evento de scroll está sempre um quadro
atrasado, e é isso que faz parallax barato parecer borracha. A nativa não tem
esse atraso porque nem passa pela thread principal.

### 2.2 A armadilha do `overflow: hidden` (a que derruba 90% das tentativas)

`view()` resolve contra o **scrollport ancestral mais próximo**. Um elemento com
`overflow: hidden` **é** um scrollport, mesmo sem rolar nunca.

Nesta página, têm `overflow: hidden`: `.hero`, `.faixa`, `.fechamento`,
`.mosaico__celula`, `.acomodacao__foto`, `.acomodacao`, `.recorte__foto`.

Consequência: uma animação `view()` declarada **dentro** de qualquer um deles
nunca anda, porque o scrollport dela não rola. Não dá erro, não avisa: fica
parada no primeiro quadro para sempre.

As duas saídas, e as duas estão no CSS:

```css
/* Hero: scroll(root) ignora ancestral e mede o documento. */
.hero__fundo { animation-timeline: scroll(root block); animation-range: 0 100svh; }

/* Faixa: a timeline nasce NO CONTÊINER (que é medido contra o documento)
   e é consumida por nome lá dentro. */
.faixa { view-timeline-name: --m-faixa; view-timeline-axis: block; }
.faixa__fundo { animation-timeline: --m-faixa; animation-range: cover 0% cover 100%; }
```

### 2.3 A armadilha do `animation` como abreviação

Cada elemento tem **uma** lista `animation`. A abreviação `animation:` zera tudo,
inclusive `animation-timeline`. Duas regras diferentes declarando `animation` no
mesmo elemento não somam: a de maior especificidade apaga a outra.

Isso apareceu duas vezes na construção deste sistema, com a página no ar:

1. A foto do hero era dona do parallax **e** do Ken Burns. Uma sumia.
   **Correção:** o contêiner `.hero__fundo` ficou dono de `translate` (parallax)
   e a foto `.hero__imagem` ficou dona de `scale` (Ken Burns). `translate`,
   `rotate` e `scale` são propriedades independentes no CSS moderno, então elas
   compõem sozinhas, sem nenhuma matriz somada à mão.
2. O motor de JS marca `.mosaico` como `.m-cascata` e cada célula como
   `.m-revela`. A regra da máscara vencia a regra de opacidade, e a célula
   principal do mosaico ficava **invisível para sempre**. Estava no ar assim.
   **Correção:** os quadros de `m-revela` prendem `opacity: 1` no início e no
   fim. Uma peça que está sendo descoberta por máscara não pode estar
   transparente ao mesmo tempo, senão a máscara descobre o nada.

### 2.4 O defeito do `tokens.css` v1 no movimento reduzido

O bloco `@media (prefers-reduced-motion: reduce)` do `tokens.css` zera as
durações. **Isso não desliga animação dirigida por rolagem.** Numa animação com
`animation-timeline`, a duração declarada é ignorada: quem manda é a barra de
rolagem. Zerar `--dur-enter` para 1ms não faz nada.

O único desligamento que funciona é `animation: none`, e é o que o
`movimento.css` faz. O `tokens.css` continua correto para tudo que é baseado em
tempo; ele só não alcança o que é baseado em rolagem.

### 2.5 O que precisa existir em JavaScript

O `movimento.css` é desenhado para pedir o mínimo. O contrato inteiro cabe aqui:

| Classe | Quem põe | Quando |
|---|---|---|
| `.js` no `<html>` | `main.js` | antes de montar. **Sem ela nada fica escondido** |
| `.is-pronto` no `<html>` | `lib/movimento.js` | depois de `document.fonts.ready`, teto de 900ms |
| `.is-dentro` | IntersectionObserver | em `.m-entra`, `.m-cascata`, `.m-revela`, `.m-numero` |
| `.is-carregada` | evento `load` da `<img>` | em toda `.m-foto` |
| `.m-linha` | fatiador do título | no `.hero__titulo` |
| `data-sentido` e `.is-trocando` | lightbox | a cada troca de foto |

O teto de 900ms em `document.fonts.ready` não é detalhe: se o título animar
antes de a Playfair chegar, ele anima em Georgia e depois reflui para Playfair no
meio do caminho. É o defeito mais visível que existe numa primeira dobra.

**O que ainda falta no JS** (não está feito): `data-sentido` e `.is-trocando` no
lightbox. Sem isso a troca de foto continua sendo um corte seco.

---

## 3. O sistema, item por item

Cada linha tem duração, curva, deslocamento e razão. Valor sem razão é chute.

### 3.1 Entrada de seção na rolagem

| | |
|---|---|
| O que anima | opacidade 0 para 1 e `translate` de 18px para 0 |
| Duração | 560ms (`--dur-enter`, já existia) |
| Curva | `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)` |
| Faixa nativa | `entry 5%` até `cover 28%` |
| Escalonamento | 45ms entre itens de grade, 70ms entre itens grandes, teto no oitavo |

**Por que 18px e não 40.** A entrelinha do corpo é 19px x 1,62 = 30,8px. Um
percurso maior que uma linha faz o texto **voar**; menor que meia linha ninguém
percebe. 18px é pouco mais de meia entrelinha: chega, não voa. À velocidade
média de 32px/s fica abaixo do limiar em que o movimento periférico rouba o olho
de quem já começou a ler.

**Por que `entry 5% até cover 28%` e não uma faixa em pixels.** Essa dupla é
segura tanto para um item de 60px quanto para uma seção mais alta que a tela: no
item pequeno a entrada se completa depois de ~270px de rolagem, na seção alta
depois de ~590px. Nos dois casos ela termina quando o bloco cruza o terço
inferior, que é onde o olho chega.

**Por que 45ms de escalonamento em grade e não 120.** Abaixo de 50ms o olho lê
como simultâneo. Acima de 120ms, com 8 itens, o último chega 1 segundo depois e
o visitante já leu. 45ms x 8 = 360ms de cascata inteira, menos que os 560ms de
um item: a lista chega como **um gesto**, não como uma fila.

**Por que o escalonamento vira deslocamento de faixa e não atraso de tempo, no
caminho nativo.** `animation-range-start: entry calc(5% + var(--m-i) * 3%)`. Se o
visitante rolar rápido, a lista inteira chega junto, em vez de enfileirar oito
atrasos que ele vai assistir depois de já ter passado. Movimento dirigido por
rolagem tem que obedecer à rolagem.

**Por que nunca com blur.** `filter: blur()` é a propriedade mais cara por quadro
que existe numa entrada. Em Android intermediário derruba quadros de forma
visível. Opacidade e transformação são de compositor e custam quase nada.

**Regra de aplicação:** `.m-entra` vai no **conteúdo**, nunca na `<section>` que
tem cor de fundo. Uma faixa inteira de cor aparecendo por opacidade lê como
falha de carregamento.

### 3.2 Parallax do hero

| | |
|---|---|
| Deslocamento | 12svh (108px numa tela de 900px) |
| Faixa | do topo até 100svh de rolagem |
| Fator | a foto anda a 88% da velocidade da página |
| Técnica | `animation-timeline: scroll(root block)`, CSS puro |
| Excedente | `.hero__fundo` fica 12svh mais alto que o hero, exatamente o percurso |

**Por que 12% e não 30%.** Abaixo de 8% de diferencial ninguém percebe e o custo
não se paga. Acima de 20% a foto escorrega visivelmente atrás do texto e o texto
passa a parecer colado num vidro. Em foto aérea o problema é pior, porque a linha
do horizonte é uma régua: qualquer diferencial grande faz o horizonte viajar e o
olho lê como inclinação. 12% é onde site de hotelaria e de moda se estabilizou.

**Vale a pena `scroll()` puro em CSS? Sim, e é a resposta certa aqui.** Medido na
página no ar: `translate` de 0 no topo, -30px em y=250 (12% de 250), -72px em
y=600 (12% de 600), travando em -108px, que é o excedente exato. Zero JavaScript,
zero listener de scroll, roda no compositor. Um handler de `scroll` em JS
entregaria o mesmo desenho com um quadro de atraso no iOS.

**Desligado no celular abaixo de 768px.** Motivo técnico, não de gosto: o recorte
4:5 do hero mobile já é apertado, e a barra de endereço do iOS muda a altura
visível durante a rolagem, o que faz o percurso saltar no meio.

### 3.3 Parallax das faixas sangradas

| | |
|---|---|
| Deslocamento | 6svh para cada lado no desktop, 4svh no celular (percurso total 12svh) |
| Faixa | `cover 0%` a `cover 100%`, ou seja a travessia inteira da tela |
| Técnica | `view-timeline-name` no contêiner, consumida por nome |

**Por que simétrico.** A foto começa 6svh abaixo do neutro e termina 6svh acima.
Isso significa que **no instante em que a faixa está centrada na tela, a foto
está no enquadramento neutro**, o que o diretor de arte escolheu. O momento de
atenção máxima recebe o quadro correto, e não um quadro qualquer no meio do
percurso. Medido: +54px, +38,7px, -7px, -45,1px conforme a faixa atravessa.

**Por que só 12svh de percurso numa travessia de ~1220px de rolagem.** Dá 7,4% de
diferencial, metade do hero. A faixa é curta (42svh) e cruza a tela inteira; com
o mesmo 12% do hero ela pareceria um vídeo passando.

### 3.4 Ken Burns

| | |
|---|---|
| Escala | 1,00 para 1,05 |
| Duração | 28 segundos |
| Repetições | **uma**, e acaba |
| Curva | `linear`, obrigatoriamente |
| Onde | hero e faixas, só a partir de 992px |
| Alterna | `.m-kenburns--inversa` inverte o sentido em fotos vizinhas |

**Por que 5% em 28s.** Dá 0,18% por segundo. Num hero de 1600px de largura são
3px por segundo de crescimento de borda: abaixo do limiar em que o olho
acompanha o movimento, acima do limiar em que a imagem parece congelada. Acima de
0,5%/s já lê como zoom, e zoom em foto de hotel parece apresentação de PowerPoint.

**Por que `linear` e nunca `ease`.** Num movimento de 28 segundos, qualquer curva
vira aceleração perceptível, e aceleração é exatamente o que denuncia o efeito.
Deriva boa é deriva de velocidade constante.

**Por que uma vez só, e não em laço.** A `direcao-de-arte.md` v1 proibia Ken Burns
no hero. A proibição estava certa **contra o laço**: laço infinito é protetor de
tela e é o que faz o efeito virar clichê. Uma deriva única de 28 segundos que
termina é outra coisa: é o gesto de "a página está viva quando você chega", e
depois de meio minuto ela não custa mais nada. Contrarío a v1 aqui, de propósito,
e está registrado na seção 7 deste documento.

**Desligado abaixo de 992px.** Bateria, e o recorte vertical não tem folga.

### 3.5 Revelação de imagem

Três camadas, da mais barata para a mais cara. Use a mais barata que resolver.

**a) Blur-up (padrão, em toda foto).** A miniatura de 24px já existe no projeto,
já é `background-image` da `<img>` (`lib/imagens.js`). Faltava a foto grande
entrar por cima em vez de trocar em corte seco. A foto entra em 420ms de
opacidade mais `scale` de 1,015 para 1.

- Por que 420ms: menos que isso é corte, mais que isso numa conexão ruim parece
  defeito de carregamento.
- Por que não borrar a foto que chega: a miniatura de 24px **já está borrada**
  pela própria ampliação do navegador. Aplicar `blur()` na foto que chega seria
  borrar de novo o que já está nítido, e pagar o custo de filtro por quadro.

**b) Limpeza editorial, o wipe (reservada).** `clip-path` de
`inset(0 0 100% 0)` para `inset(0 0 0 0)`, 900ms, `--ease-out`, descobrindo de
cima para baixo.

- Por que limpeza e não fade: a foto fica em densidade cheia o tempo inteiro,
  então nunca parece lavada no meio do caminho. E o gesto lê como impressão, que
  é vocabulário editorial.
- Por que de cima para baixo: concorda com a direção de leitura e com a direção
  da rolagem. Uma limpeza que sobe briga com a página.
- Por que `round var(--m-raio)` nos dois quadros: sem isso a máscara corta em
  quadrado por cima de um card de raio 12px e aparece um canto vivo.
- **Teto de três por página.** Se toda foto se revela assim, a página vira
  slideshow. O CSS aplica o teto sozinho: só a peça principal do mosaico e o
  primeiro recorte de Itapema levam máscara, o resto só aparece. Isso está no CSS
  de propósito, porque o motor de JS marca todas as células e o sistema tem que
  segurar mesmo quando quem chama pede demais.

**c) Assentamento por dentro (só em peça inerte).** A foto entra em `scale` 1,06
e assenta em 1, terminando **220ms depois** da máscara. É esse atraso que faz o
conjunto parecer um objeto só, e não duas animações somadas.

- **Só em peça não clicável.** Em `<button>` e `<a>` o `scale` já pertence ao
  zoom de hover, e uma animação com preenchimento trava a propriedade e mataria
  o hover para sempre. Entre um floreio de 900ms uma vez e o retorno de hover em
  toda visita, o hover ganha. O seletor faz isso sozinho: `:not(button):not(a)`.

**d) `clip-path` corta o anel de foco.** Corrigido com
`.m-revela:focus-visible { clip-path: none }`. Como a animação já terminou quando
alguém chega ali pelo teclado, soltar o recorte não muda nada visualmente e
devolve o anel inteiro.

### 3.6 Título do hero

Entrada **por linha**, não por palavra.

| | |
|---|---|
| Percurso | de `translate: 0 125%` para 0, dentro de máscara |
| Duração | 800ms por linha |
| Curva | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Atraso entre linhas | 90ms |
| Primeira linha começa em | 200ms |

**Por que 800ms e não os 560ms do resto.** A linha do display tem 104px de corpo
e percorre cerca de 115px. A 560ms isso são 205px/s, que lê como estalo. A 800ms
são 143px/s, que lê como peso. **Coisa grande se move mais devagar** e essa é
uma regra de física, não de gosto: se o objeto grande e o objeto pequeno se
movem na mesma velocidade, o grande parece leve e falso.

**Por que 125% de percurso e não 100%.** Com `line-height: 0.98`, a caixa de linha
da Playfair é 0,18em **menor** que a área de conteúdo da fonte. A perna do "p" de
"poucos" e de "passos" fica fora da caixa de linha. A 100% a máscara ainda deixa
a perna aparecendo embaixo. Daí também o
`padding-block: 0.22em; margin-block: -0.22em` na máscara: ela ganha a folga
exata para descendente e acento sem mexer no layout.

**Por que por linha e não por palavra, e como isso resolve o leitor de tela.**
Entrada palavra a palavra exige `display: inline-block` em cada palavra, e é
justamente isso que faz o VoiceOver comer os espaços e ler "Itapemainteiraa".
Cortando por **linha**, com espaço de verdade no HTML entre as caixas, o problema
não existe. O `<h1>` continua com o texto completo, `<span>` genérico não tem
papel de acessibilidade e some na árvore, e o nome acessível do cabeçalho
continua sendo a frase inteira. **Nenhum atributo ARIA é necessário, e é melhor
assim:** `aria-label` num heading é uma segunda fonte de verdade que alguém vai
esquecer de atualizar.

**A caixa de consulta nunca espera.** Ela entra em 420ms de opacidade pura,
começando em 0ms, antes de qualquer linha do título. É o elemento de conversão:
página de hotel que faz o formulário chegar por último está otimizando para o
portfólio do designer, não para o hóspede.

Coreografia completa do hero: caixa de consulta 0ms, selo 120ms, linha 1 em
200ms, linha 2 em 290ms, linha 3 em 380ms, parágrafo em 560ms, endereço em 640ms.
A foto não tem animação de tempo nenhuma: quem a faz aparecer é o blur-up, no
instante honesto em que ela termina de baixar.

### 3.7 Micro-interações

**Botão.** Cor em 160ms (já existia). O que foi acrescentado é a física: sobe 1px
ao aproximar (`--ease-out`) e **comprime** para `scale(0.985)` em 90ms ao apertar
(`--ease-in`). É a compressão que faz um botão parecer objeto e não retângulo
colorido. A seta anda 3px para a direita: 3px são 17% da largura do glifo, o
suficiente para ler como intenção. A 6px ela se descola do rótulo.

**Campo.** Borda em 90ms mais um halo de 3px (`--green-wash`) crescendo do zero
em 220ms. Duas pistas em vez de uma ajudam quem enxerga pouco, e o halo aparece
mesmo quando a borda já era escura. O rótulo escurece junto.

**Erro de formulário.** Tremor de 3px, 260ms, uma vez. Não é enfeite: é a maneira
mais rápida de dizer "olhe aqui" sem depender de cor, o que importa para
daltônico. Amplitude pequena de propósito: a 8px vira alarme, e alarme derruba
posicionamento premium.

**Card de acomodação.** O card inteiro responde como **um objeto**: sobe 2px,
sombra vai de 1 para 2, a foto amplia para 1,045 em 420ms com `--ease-soft`, e o
`:focus-within` dispara o mesmo estado. Card em que só a foto reage parece dois
elementos empilhados por acaso.

**Item de comodidade.** Zero reação a hover, e isso é regra: **retorno de hover
só em coisa clicável**. Um item de comodidade é texto. Reação em elemento inerte
é o que faz a página parecer inquieta. O que ele ganha é entrada: o filete de
baixo cresce da esquerda em 520ms, com 120ms de atraso sobre o texto, então a
lista parece **ser escrita**, não empilhada.

**FAQ abrindo.** `grid-template-rows` de `0fr` para `1fr` em 320ms, que é a única
forma de animar até altura automática sem medir nada em JavaScript. O texto entra
com 60ms de atraso, para não borrar enquanto a caixa cresce. O `+` vira `-`
girando só o traço vertical, então o traço horizontal fica parado e o olho segue
uma coisa só.

- Por que 320ms: as respostas têm 1 a 3 linhas. 220ms é estalo; 420ms cansa quando
  o visitante está comparando oito respostas seguidas.
- O `padding-bottom` foi movido do contêiner para o `<p>`. Se ficasse no
  contêiner, os 24px apareceriam já no primeiro quadro e a resposta abriria com
  um degrau.
- Usa `@starting-style`, então **funciona com o atributo `[hidden]` que o
  componente já usa**, sem reescrever a `duvidas.js`. Abrir anima, fechar corta
  seco. Fechar seco não incomoda; abrir seco incomoda.

**Setas da galeria.** O glifo anda 2px na direção dele, o botão comprime para
0,94 ao apertar.

**Troca de foto no lightbox.** A foto que chega entra de 24px do lado de onde
veio, 260ms.

- Por que 260ms: o visitante segura a seta. Acima de 300ms as trocas enfileiram e
  a galeria fica devendo quadros.
- Por que 24px e não 60: a 60px a repetição rápida vira borrão.
- **Isto ainda não funciona:** precisa de `data-sentido` e `.is-trocando` no
  `lightbox.js`. Está na lista de pendências.

**Abertura do lightbox.** Fundo escurece em 220ms, painel cresce de 0,985 em
420ms com `--ease-out`.

**Barra fixa do celular.** Ela já entrava; faltava sair. Agora sai por
`translate` em 360ms e some quando o formulário de fechamento está na tela,
porque duas chamadas iguais visíveis ao mesmo tempo competem entre si.

**Sublinhado do menu.** Cresce da esquerda e **desfaz pela direita**
(`transform-origin` invertido nos dois estados). É o detalhe que dá direção ao
menu: sem ele o sublinhado volta por onde veio e o gesto fica sem sentido.

### 3.8 Cabeçalho

O estado continua **binário** (`.is-solido`), e isso é decisão, não preguiça: a
cor do texto tem que virar de claro para escuro, e interpolar cor de texto
continuamente **enquanto o fundo também interpola** passa por um meio termo em
que nenhum dos dois lados tem contraste. Contraste ganha de suavidade.

O que ficou mais refinado:

**a) A barra sólida desce, não aparece.** Um `::before` com o fundo desliza de
`translate: -100%` para 0 em 300ms, `--ease-out`. Objeto que chega, não bug que
pisca. Na volta ele sobe em 220ms com curva de saída, mais seca.

**b) Vidro em vez de placa.** O fundo é `rgb(251 248 244 / 0.86)` mais
`backdrop-filter: blur(14px) saturate(1.06)`. Uma barra 100% opaca lê como placa
colada por cima da página; uma translúcida lê como camada da mesma página. É
onde mora a diferença entre "tem header sticky" e "é refinado".

**c) Troca de assinatura assimétrica.** Este era o defeito mais visível do
cabeçalho: o lockup e a rosácea dividem a mesma célula de grade e faziam
crossfade nos mesmos 220ms, então existia um intervalo em que **duas versões da
marca apareciam meio transparentes, em tamanhos diferentes, uma dentro da
outra**. Agora o lockup sai em 120ms e a rosácea só começa a entrar aos 120ms.
Nunca há dois logotipos no ar ao mesmo tempo. O redimensionamento saiu de
`height` (que reflui) para `scale` (que não).

**d) Régua de progresso de leitura.** 2px na base da barra sólida, em `--accent`,
`scaleX` de 0 a 1 dirigido por `scroll(root block)`. É o único elemento
decorativo permitido nesta página, porque não é decorativo: **carrega
informação**, que é quanto falta. 2px e não 1px porque 1px some em tela de baixa
densidade. Com movimento reduzido ela **desaparece**, e isso é honestidade: sem
timeline viva ela ficaria travada em 100% já no alto da página, informando o
contrário do que acontece.

**e) O cabeçalho nunca se esconde na rolagem para baixo.** Numa página de
reserva, o botão de consulta no topo é a segunda porta de conversão. Esconder
para "dar mais tela" troca conversão por estética.

### 3.9 Contador de número

Está pronto no CSS (`@property --m-n` mais `counter()`), e **não deve ser ligado
nesta versão da página.**

O único número grande do projeto seria a nota do Google. Ela é da gestão
anterior, o `data/pousada.js` desligou a seção de avaliações por isso, e animar
de 0 até um número que a própria página decidiu não afirmar seria enfeitar um
dado que não se sustenta. Contador é um recurso que chama atenção para o número:
usá-lo num número frágil é apontar o holofote para o ponto fraco.

Condições para ligar, todas juntas: número confirmado por escrito pela pousada,
inteiro, no máximo 1,2s, e **nunca em preço nem em contagem regressiva**.

O que **pode** e faz sentido agora, se as distâncias forem confirmadas: os
números da lista de proximidades entram tabulares, subindo 8px junto com a linha
inteira. É a linha que se move, não o número sozinho.

### 3.10 Movimento reduzido

Regra dura: com movimento reduzido a página fica **utilizável e ainda bonita**,
não quebrada.

Verificado na página no ar com `prefers-reduced-motion: reduce` emulado: 60
elementos animáveis testados, **zero com opacidade abaixo de 1, zero deslocados,
zero com máscara sobrando, zero animações em execução**.

O que o bloco faz:

1. `animation: none !important` e `animation-timeline: none !important` em tudo
   que este arquivo anima. Zerar duração não bastaria (ver 2.4).
2. Zera os tokens de percurso, escala e parallax.
3. **Devolve a geometria.** `.hero__fundo`, `.faixa__fundo` e
   `.fechamento__fundo` voltam a `top: 0; height: 100%`. Este é o detalhe que
   quase ninguém faz: sem esse reset a foto fica congelada no **primeiro quadro
   do parallax**, que é um enquadramento diferente do que o diretor de arte
   escolheu. Medido: a altura do fundo do hero volta a bater exatamente com a
   altura do hero (872px = 872px).
4. Some com a régua de progresso, pelo motivo da seção 3.8d.

O que **sobrevive de propósito**, porque tirar seria pior:

- mudança de **cor** em hover e foco. Cor não é movimento, e tirar destruiria a
  pista de que o elemento é clicável.
- o `+` virando `-` no FAQ. É estado, precisa continuar legível.
- o anel de foco, integralmente.

Existe ainda um bloco `@media (prefers-reduced-data: reduce)`: sem parallax, sem
Ken Burns, sem limpeza editorial. Quem está no 4G do quarto de hotel quer a foto,
não o efeito.

---

## 4. Refinamento visual, seção por seção

Ordem de impacto. As quatro primeiras mudam a percepção da página inteira; as
últimas são acabamento.

Estado da página conferido em 1440x900 e em 390x844, com a página no ar, em
11 e 16 capturas respectivamente.

### 4.1 A galeria: trocar 5 fotos parecidas por 6 peças com escala e assunto

**O que está errado hoje.** O mosaico traz uma peça grande e quatro de apoio, e
as quatro de apoio **têm exatamente o mesmo tamanho**. Isso é catálogo de
estoque, não editorial (direção de arte, 5.1: "três fotos do mesmo tamanho é
catálogo de estoque"). Pior: quatro das cinco fotos escolhidas pertencem à mesma
família de assunto, com distância perceptual entre 77 e 105 numa média de 124.
O visitante vê a mesma baía quatro vezes e conclui que a pousada tem pouco o que
mostrar.

**A estrutura proposta.** 12 colunas, três fileiras, seis peças, três proporções:

| Peça | Colunas | Proporção | Foto | Por quê |
|---|---|---|---|---|
| 1 | 1 a 7 | 16:9 | `itapema-baia-aberta` | a curva inteira. É a foto que vende Itapema |
| 2 | 8 a 12 | **4:5** | `itapema-guarda-sois` | a única aérea que **melhora** na vertical: plano de cima, textura de guarda-sóis, diagonal da areia |
| 3 | 1 a 4 | 3:2 | `itapema-barcos-de-pesca` | assunto diferente: trabalho, barco, gente |
| 4 | 5 a 8 | **1:1** | `fachada-green-beach` | a casa. Verifiquei o corte 1:1: a placa cabe inteira |
| 5 | 9 a 12 | 3:2 | `itapema-ilha-praia-grossa` | turquesa e península, o outro lado do morro |
| 6 | 1 a 12, sangrando | **21:9** | `itapema-orla-a-noite` | pano de saída. Verifiquei o corte 21:9: a curva de luzes e a textura das ondas cabem |

Três proporções na mesma grade, três escalas bem diferentes, e a peça 6 sangrando
de ponta a ponta como gesto de fechamento da seção. **Nenhuma peça repete
assunto.**

O botão "Ver as fotos" vai no canto inferior direito da peça 6, sobre a parte
escura da foto da noite, onde ele tem contraste garantido sem precisar de caixa
branca.

**Legenda obrigatória em toda peça.** Hoje as tags dizem "Meia Praia", "Praia
Grossa", "Canto da Praia" e isso está certo e deve continuar. É honestidade:
doze fotos aéreas da cidade e uma da placa não são "fotos da pousada", e um
hóspede olhando a ilha da Praia Grossa precisa saber que aquilo não é o jardim do
hotel. O `aria-label` da seção deve deixar de ser "Fotos da pousada" e passar a
ser "Fotos da pousada e de Itapema".

**E o contador.** "Ver as 15 fotos" promete variedade que o acervo não tem.
Reduza a coleção do lightbox para as 9 fotos de assunto distinto e o botão passa
a dizer a verdade.

### 4.2 "A pousada": tirar os ícones em círculo

**O que está errado hoje.** Os quatro destaques aparecem como ícone branco dentro
de um **círculo verde escuro de 3,25rem**, em fila, com o texto ao lado. Isso é
literalmente o item 3 da lista de proibições da própria `direcao-de-arte.md`:
"fila de ícones de amenidade, todos do mesmo pack de linha fina, dentro de
círculos". Está no ar contrariando o sistema.

**A correção.** Os destaques viram **fileira tipográfica**, quatro colunas:

- o rótulo em Playfair 400, `--fs-h3`, `--green-deep`
- a frase em `--fs-body-s`, `--text`
- um filete de 1px em `--border-hairline` **acima** de cada coluna, não em volta
- ícone: ou sai, ou vira um glifo de 1rem em `--accent-text` alinhado à linha de
  base do rótulo, sem círculo, sem fundo, sem cor de bloco

O texto faz o trabalho. É o mesmo raciocínio de por que o título é caixa baixa e
grande em vez de caixa alta e dourado: o tamanho e o espaço é que criam
hierarquia, não o adorno.

A foto da fachada continua onde está, sangrando na coluna da direita. Ela está
funcionando bem e é a única foto da casa que existe.

### 4.3 A localização: tapar o buraco com conteúdo, e tirar a moldura do mapa

**O que está errado hoje.** A coluna da esquerda tem olho, título, endereço e
botão, e acaba. A coluna da direita tem o mapa. Sobra um vazio grande e
irregular embaixo do botão, que aparece **uma vez só na página inteira**: pela
definição da seção 3 da direção de arte, isso é buraco, não respiro. E o mapa
está dentro de um retângulo branco com borda e sombra, ou seja, uma **moldura**,
que é o item 6 das proibições.

**A correção, na ordem de preferência da própria direção de arte (conteúdo
primeiro, ornamento nunca).**

1. **Traga conteúdo real para a coluna da esquerda.** A lista `proximidades` já
   existe no arquivo de dados e está vazia. Preencher com o que for verificável:
   distância a pé até a areia, ao calçadão, ao terminal, a Balneário Camboriú, a
   Florianópolis, ao aeroporto de Navegantes. Isso é exatamente o que quem
   reserva quer saber, e é o tipo de dado que não pode ser inventado: **ou vem
   confirmado pela pousada, ou a lista não entra.**
2. **Some o check-in e o check-out** ali, que já são dados confirmados
   (`14h` e `12h`). Chegar e sair é informação de localização tanto quanto
   distância.
3. **Tire a moldura do mapa.** O mapa passa a sangrar até a borda direita da
   tela, com raio 0 do lado que sangra. Sem borda, sem sombra, sem fundo branco.
4. **Melhor ainda, se houver confirmação:** uma faixa 21:9 de
   `itapema-baia-do-mirante` sangrando acima do mapa, com a frase de localização
   por cima. Verifiquei o corte: a foto tem mar e céu abertos de sobra e o texto
   entra com 10,50:1. Marcar a posição da pousada nessa foto **exige confirmação
   da pousada sobre qual prédio é**, e sem isso não se marca nada.

### 4.4 Ritmo de claro e escuro: usar o `.gb-dark` que já existe

**Estado atual.** hero (foto) / galeria (claro) / a pousada (claro) / faixa
(foto escura) / comodidades (claro) / Itapema (escuro) / localização (claro alt)
/ dúvidas (claro) / fechamento (foto) / rodapé (escuro).

Já melhorou muito com a seção Itapema em `.gb-dark` e com a faixa sangrada. O que
falta é que **galeria e "a pousada" são dois blocos claros seguidos**, e
**comodidades e dúvidas também**. Quatro seções claras seguidas em dois pontos da
página é onde o ritmo cai.

**Proposta de sequência:**

| Seção | Fundo | Observação |
|---|---|---|
| Hero | foto | dia |
| Galeria | `--bg` | fecha com a peça 6 sangrando (a foto da noite) |
| A pousada | `--bg-alt` | a alternância separa da galeria |
| Faixa `guarda-sois` | foto | frase curta sobre o verão |
| Comodidades | `--bg` | ver 4.5 |
| Itapema | `.gb-dark` | tarde e noite |
| Localização | `--bg-alt` | mapa sangrando |
| Dúvidas | `--bg` | |
| Fechamento | foto | `por-do-sol` |
| Rodapé | `.gb-dark` | |

Assim a página anda: dia, claro, claro alternado, foto, claro, **escuro**, claro
alternado, claro, foto, escuro. Duas âncoras escuras e três momentos
fotográficos, distribuídos.

**E a narrativa de luz acompanha:** hero de dia, faixa de verão, Itapema
entardecendo, fechamento no pôr do sol. A página percorre um dia. Isso não é
enfeite: é o que dá razão para a alternância claro e escuro existir, em vez de
ela ser só zebra.

**Regra que precisa ser respeitada:** hero e fechamento **nunca** usam a mesma
foto. Estava assim até há pouco e é o erro que faz a página parecer ter duas
imagens.

### 4.5 Comodidades: a seção mais plana da página

**O que está errado hoje.** Dez itens em cinco colunas, ícone de 1,5rem mais
texto de 15px, filete embaixo, fundo liso, e um vazio grande depois da nota. Não
tem foto, não tem escala, não tem contraste. É a seção que mais parece template.

**Correção, em ordem de esforço.**

1. **Barata e boa:** duas colunas de tipografia nas colunas 1 a 5 da grade
   (cinco itens em cada), e uma foto **alta** sangrando na borda direita, nas
   colunas 7 a 12, em 3:4. `itapema-praia-grossa` no corte 4:5 funciona, e eu
   verifiquei. O texto respira, a seção ganha peso, e o vazio some porque a foto
   ocupa a altura toda.
2. **Se a foto não puder entrar:** troque as cinco colunas por duas colunas
   largas, aumente o corpo do item para `--fs-body`, tire os ícones e deixe só o
   filete. Uma lista tipográfica bem espaçada é sempre melhor que uma grade de
   ícones apertada.
3. **O que resolve de verdade, mas depende do cliente:** foto da piscina, do café
   da manhã e do apartamento. A pousada afirma que tem piscina e café incluso, e
   não existe nenhuma foto dos dois. Uma seção chamada "o que a pousada oferece"
   ilustrada por fotos aéreas da cidade é uma contradição que o hóspede sente
   sem saber nomear.

### 4.6 Dúvidas: o mesmo buraco da localização

A coluna da esquerda tem olho, título e um link, e acaba a 1/4 da altura da
lista. Mesma correção, mesma ordem: conteúdo primeiro.

O que cabe ali sem inventar nada: o telefone fixo, o WhatsApp e o horário de
atendimento (se confirmado), como um bloco de contato. Quem está no FAQ é quem
tem uma pergunta que a lista não responde; ter o canal ao lado é útil, não é
enchimento.

Se não houver conteúdo, então **a coluna some** e o FAQ passa a ocupar as colunas
2 a 11 com o título em cima. Buraco se resolve com conteúdo, com escala ou com
redistribuição, nunca com enfeite.

### 4.7 Os quatro recortes de Itapema

A seção nova está boa: contexto escuro, foto grande, texto curto e concreto,
nomes reais de praia. Dois ajustes:

1. **As quatro fotos são quase do mesmo tamanho.** O CSS já alterna 3:4 e 4:5 e
   desloca as pares para baixo, mas a diferença é pequena demais para ler como
   escala. Aumente para 1 peça grande (colunas 1 a 5, 4:5) e três menores em
   coluna (colunas 7 a 12), ou mantenha a fileira e faça a primeira peça ocupar
   duas colunas.
2. **`entardecer` e `por-do-sol` são o mesmo pôr do sol** (distância 97). Só uma
   das duas pode estar na página. A outra sai também do lightbox.

### 4.8 Acabamentos menores

- **A foto do hero.** A escolha atual (`verao-na-praia`, desvio 0,129,
  9,50:1) passa na régua da seção 1.1 e está boa. Se um dia trocar, as opções
  seguras são `baia-do-mirante`, `praia-grossa`, `canto-da-praia` e
  `por-do-sol`. Não use `meia-praia-aerea` nem `barcos-de-pesca` com texto por
  cima: desvio 0,25.
- **O mosaico no celular** é uma faixa que rola com encaixe. Funciona, mas a
  primeira célula não fica encaixada no carregamento e o visitante vê meia foto.
  Encaixe inicial em `scroll-snap-align: start` na primeira célula resolve.
- **`itapema-nascer-do-sol`** é a foto mais fraca do acervo como venda (cinza,
  nublado, baixo contraste) e a mais forte como **textura**. Ela é o fundo ideal
  de uma faixa escura com frase, porque é quase um campo liso. Não a use como
  peça de galeria disputando com as coloridas.

---

## 5. O que NÃO fazer

Erros de movimento que fariam esta página parecer amadora. Lista concreta, não de
gosto.

1. **Ken Burns em laço infinito.** Deriva que nunca acaba é protetor de tela.
   Aqui ela roda uma vez, 28s, e para.
2. **Parallax em texto.** Título com parallax é o efeito de portfólio de motion
   designer. Aqui só foto que sangra se move, e só ela.
3. **Parallax acima de 20% de diferencial.** A partir daí a foto escorrega
   visivelmente e o texto parece colado num vidro por cima.
4. **Entrada palavra por palavra.** Além de quebrar o leitor de tela (espaços
   comidos com `inline-block`), transforma uma frase de venda em um exercício de
   caligrafia. Por linha, e só no `<h1>` do hero.
5. **Animar o formulário de reserva por último.** É o elemento de conversão. Ele
   entra primeiro ou junto, nunca depois de coreografia nenhuma.
6. **Toda foto se revelando com máscara.** Três por página, no máximo, e sempre a
   primeira foto da seção. Nove limpezas seguidas viram slideshow.
7. **Escalonamento com atraso maior que 120ms.** Numa lista de 10 itens o último
   chega mais de um segundo depois e o visitante assiste em vez de ler.
8. **Reação de hover em elemento que não é clicável.** Item de comodidade,
   número, legenda, filete. Se não clica, não reage.
9. **Girar a mandala.** Está na direção de arte v1 e continua valendo: marca não
   é pião. Vale também para pulsar, brilhar, respirar e desenhar traço a traço.
10. **Carrossel em autoplay.** Nem no hero, nem na galeria, nem em depoimento.
11. **Contador subindo num número frágil.** Contador aponta o holofote para o
    número. Se o número é da gestão anterior, o holofote está no lugar errado.
12. **Contagem regressiva, "restam 2 quartos", badge piscando.** Derruba
    posicionamento premium em um segundo.
13. **Cabeçalho que some ao rolar para baixo.** Numa página de reserva o CTA do
    topo é a segunda porta de conversão.
14. **Cursor customizado, bolinha que segue o mouse, imã em botão.** É
    vocabulário de estúdio de motion, não de hospedagem.
15. **Animar `filter: blur()` numa entrada.** É a propriedade mais cara por
    quadro. Opacidade e transformação são de compositor.
16. **`will-change` espalhado.** Só em animação contínua, no máximo quatro
    elementos por página. Em elemento que anima uma vez, ele segura uma camada de
    composição para sempre.
17. **Animação disparada por rolagem que roda de novo quando o visitante volta.**
    O observador aqui desliga o elemento depois da primeira vez.
18. **Deixar `opacity: 0` no CSS sem JavaScript garantido.** Todo estado inicial
    invisível deste sistema está atrás de `.js`. Sem JavaScript, sem observador,
    sem suporte a scroll-driven, a página aparece inteira.
19. **Resolver buraco de layout com movimento.** Um vazio que "ganha vida" com
    uma animação continua sendo um vazio. Buraco se resolve com conteúdo.
20. **Movimento reduzido tratado como versão inferior.** Com `reduce`, a página
    tem que ficar bonita e inteira, com o enquadramento correto das fotos, não
    congelada no primeiro quadro do parallax.

---

## 6. Marcação que ainda precisa entrar

O CSS já está ligado no `index.css` e o motor `lib/movimento.js` já aplica quase
tudo. Falta:

| Onde | O que | Estado |
|---|---|---|
| `lightbox.js` | `data-sentido="proximo"` ou `"anterior"` no `.lightbox__palco`, e `.is-trocando` por 260ms a cada troca | **pendente**, a troca ainda é corte seco |
| `lightbox.js` | chamar `registrarFotos()` na foto criada, para o blur-up valer lá dentro | **pendente** |
| `galeria.js` | reduzir a coleção do lightbox para as 9 fotos de assunto distinto | **pendente** |
| `secoes.js` | destaques sem círculo (ver 4.2) | **pendente** |
| `duvidas.js` | se quiser o fechamento animado também, trocar o atributo `hidden` por uma classe | opcional |
| `movimento.js` | não marcar `.m-revela` em todas as células do mosaico. O CSS já segura, mas marcar menos é mais barato | opcional |

---

## 7. Onde eu contrario a direção de arte v1, e por quê

Registro explícito, porque contrariar o próprio sistema em silêncio é o começo da
morte dele.

| Regra da v1 | O que faço agora | Razão |
|---|---|---|
| "Nunca: parallax" (seção 7) | parallax de 12% no hero e 7% nas faixas | a v1 foi escrita com duas fotos de Instagram de 1080px. Com aéreas de 4032px o parallax deixa de ser efeito e vira o que dá profundidade a uma foto de drone, que é justamente o assunto dela. E o custo é zero, porque roda no compositor |
| "Nunca: Ken Burns infinito no hero" (seção 7) | deriva única de 5% em 28s, sem laço | a proibição era **contra o laço**, e continua valendo. Uma deriva que termina não é protetor de tela |
| "Nunca: texto aparecendo palavra por palavra" (seção 7) | entrada **por linha** no `<h1>` do hero, só ali | palavra por palavra quebra o leitor de tela e vira caligrafia. Por linha não tem nenhum dos dois problemas, e o `<h1>` do hero é o único lugar da página onde o gesto se paga |
| "Nunca: contador animado de números" (seção 7) | mantido proibido nesta versão | o recurso está escrito no CSS, desligado, com as condições de uso. Não é liberação |
| Mosaico com slots 4:5 (seção 5.2) | mantido, mas com o aviso de que só três fotos do acervo sobrevivem ao corte | medição, não opinião |

---

## 8. Confirmar antes de publicar

1. **Distâncias e proximidades.** A lista existe no dado e está vazia. Nada de
   "300 metros da praia" sem a pousada confirmar. Sem isso, a seção de
   localização continua com o buraco da 4.3.
2. **Fotos da casa.** Piscina, café da manhã, apartamento, área comum. Hoje existe
   **uma** foto da pousada, a fachada. Uma página de hospedagem ilustrada só com
   fotos da cidade tem um limite de credibilidade que nenhum layout resolve.
3. **Direitos das fotos de drone.** Quem fez, quando, e se há autorização de uso
   comercial. As fotos são de dez/2023 e jan/2024 e mostram terceiros
   identificáveis na praia em plano aberto. Precisa de confirmação por escrito
   antes de publicar.
4. **A data das fotos.** Dezembro de 2023 e janeiro de 2024. Não afirme na página
   que são de agora. Legenda neutra resolve, e as atuais já estão corretas.
5. **A nota do Google.** Continua desligada e deve continuar até a pousada ter
   avaliações da gestão nova. Nenhum contador, nenhuma estrela, nenhum selo.
6. **Horário de atendimento** para o bloco de contato proposto na 4.6.
7. **Aprovação do movimento pelo cliente em tela real.** Parallax, Ken Burns e
   limpeza de imagem são coisas que se decidem olhando, não lendo. Mostre a
   página rolando, não uma captura.

---

## 9. Limitações técnicas conhecidas

1. **Scroll-driven animation não é baseline.** Chromium e Safari entregam,
   Firefox ainda não por padrão. No Firefox tudo continua funcionando pelo
   IntersectionObserver, mas **parallax e régua de progresso simplesmente não
   aparecem** ali, porque estão dentro de `@supports`. É perda de refinamento,
   não de função, e foi decisão consciente: emular parallax com listener de
   scroll no Firefox custaria mais em quadro perdido do que entrega.
2. **`captureBeyondViewport` quebra qualquer captura de página inteira.** Toda
   animação dirigida por rolagem volta ao primeiro quadro quando o Chrome
   re-renderiza a página fora da viewport, e o resultado é uma captura em branco.
   Os scripts `scripts/capturar.mjs`, `provas.mjs` e `qa.mjs` precisam passar a
   capturar por viewport, rolando progressivamente, ou vão gerar provas vazias.
   Descoberto na marra durante esta entrega. O mesmo vale, de forma
   intermitente, para peça com `clip-path` animado: ela ganha camada própria de
   composição e o Chrome sem cabeça às vezes captura a camada antes de pintá-la,
   devolvendo um retângulo vazio numa peça que na tela está perfeita. Conferido:
   a cor média no miolo da peça principal do mosaico é `132,134,131`, ou seja
   foto, e não o `251,248,244` do fundo. **Não corrija layout com base numa
   captura em branco: meça o valor computado antes.**
3. **`@starting-style` no FAQ** funciona em Chrome 117+, Safari 17.5+ e
   Firefox 129+. Fora disso a resposta abre sem animação, que é o
   comportamento de hoje. Nada quebra.
4. **`backdrop-filter` no cabeçalho** está dentro de `@supports`. Onde não houver,
   o fundo a 86% continua legível porque o texto é `--green-deep` sobre areia.
5. **`body { overflow-x: hidden }`** no `base.css` é um vizinho perigoso de
   `view()`: o `overflow` do body propaga para a viewport e por isso não
   quebra hoje, mas se algum dia alguém mover essa declaração para o `<html>` ou
   para um wrapper, todas as animações de rolagem param de andar de uma vez, sem
   erro no console. Fica registrado.
6. **`svh` no parallax.** Escolhido em vez de `vh` justamente para não saltar
   quando a barra de endereço do iOS recolhe. Ainda assim, o parallax do hero
   está desligado abaixo de 768px.
7. **Ken Burns e blur-up disputam `scale`** na mesma foto. Onde os dois existem,
   Ken Burns vence e o blur-up entra só por opacidade. É o comportamento
   desejado, mas é bom saber por que a foto do hero não tem o micro-zoom de
   chegada.
8. **A régua de progresso mede o documento inteiro**, incluindo o rodapé. Se um
   dia entrar um bloco muito alto no fim, ela vai parecer travada perto do
   final. Não tem correção em CSS puro.

---

## 10. Arquivos

- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/site/src/styles/movimento.css`
- `/Users/leonardofranco/Library/Mobile Documents/com~apple~CloudDocs/Claude/green-beach/direcao-de-movimento.md`
- Sistema visual base: `green-beach/direcao-de-arte.md`
- Tokens: `green-beach/site/src/styles/tokens.css`

Disciplina que continua valendo: **nenhum componente escreve duração, curva ou
percurso direto.** Se um valor faltar, ele entra no bloco de extensão do
`movimento.css` com nome semântico e vira parte do sistema. Um `400ms` solto num
componente é o começo da morte do sistema.
