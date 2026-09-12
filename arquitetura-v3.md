# Green Beach v3: arquitetura de seções

Direção de arte, 11/09/2026. Referência estrutural: woolmers.com.au (Woolmers Estate, Tasmânia).

Este arquivo define **o que cada seção faz, o que ela diz e com que foto**. Não é o layout final nem o código: é o esqueleto que a arte final tem que obedecer.

Base de conteúdo: `site/src/data/pousada.js`, que separa `confirmado: true` de `confirmado: false`. **Nada aqui inventa dado.** Onde a v3 pede um número que não existe, a seção muda de forma, não ganha número.

---

## 1. O que foi lido antes de decidir

| Fonte | O que tirei dela |
|---|---|
| `site/src/data/pousada.js` | endereço, horários, comodidades, café incluso, pets, ausência de estacionamento próprio, avaliações desligadas, acomodações vazias |
| `site/public/fotos/fotos.json` mais as 16 fotos abertas e olhadas uma a uma | o acervo real, com os pares quase idênticos que ninguém tinha mapeado |
| `site/src/main.js` e `site/src/components/` | o que já existe pronto: busca com calendário e hóspedes, store compartilhado, mapa animado, lightbox, barra fixa, link de WhatsApp com protocolo |
| `PENDENCIAS.md` e `pesquisa/dossie-green-beach.md` | o que falta, o que é da gestão anterior e o que é autodeclarado |
| `direcao-de-arte.md` | paleta com contraste calculado, escala tipográfica, regra do dourado, véu sobre foto, proporção por contexto |

### As três restrições que mandam na arquitetura

**1. Não existe foto de dentro da pousada.** Nenhuma. Só a fachada, e ela tem 628 px de largura no original (o arquivo de 800 px é ampliação). A 2x isso dá uma caixa de **no máximo 320 px de CSS**. Ou seja: a única foto real da casa nunca pode ser grande. Toda seção que no Woolmers vive de foto de ambiente precisa virar outra coisa aqui.

**2. O acervo é repetitivo, e isso limita o número de cartões.** Abri as 16 fotos, uma a uma. Três grupos são praticamente a mesma imagem:

- `itapema-por-do-sol` e `itapema-entardecer`: as duas são céu vermelho sobre o morro com a cidade acesa. **Só uma pode aparecer na página.**
- `itapema-baia-aberta`, `itapema-meia-praia-aerea` e `itapema-faixa-de-areia`: as três são a curva da Meia Praia vista do alto, em ângulos vizinhos. **Uma na página, as outras no lightbox.**
- `itapema-canto-da-praia` e `itapema-barcos-de-pesca`: as duas são o canto com os barcos ancorados. **Uma só.**

Contado: são quatorze aéreas no disco, treze registradas em `pousada.js`, e **seis delas mostram a mesma baía**. Sobram dez assuntos distintos, e mesmo entre eles há vizinhança. Uma tira de onze cartões como a do Woolmers repetiria a mesma praia cinco ou seis vezes, e o efeito é o contrário do pretendido: em vez de fartura, lê como pousada que não tem o que mostrar.

**3. O site tem um trabalho só.** Fazer o visitante mandar mensagem com data de entrada, data de saída e número de hóspedes. No Woolmers isso é "Book Tickets" e vive em outra página, porque existe bilheteria. Aqui não existe motor de reserva nenhum: **o formulário é o herói, não um botão que leva a ele.**

---

## 2. O que transfere do Woolmers e o que não transfere

O que faz o Woolmers funcionar, e que vale copiar de verdade:

- **Cabeçalho quase vazio.** Logo e um gatilho. Sem menu horizontal de dez itens.
- **Display serifado enorme quebrado em três linhas, com a terceira em itálico de outra cor.** É a assinatura tipográfica da página inteira.
- **Fato antes de adjetivo.** A faixa de três fatos logo abaixo do hero responde "onde fica, quando abre, o que é" em quinze palavras.
- **Olho em caixa alta espaçada abrindo cada seção.** Sempre um fato ou uma categoria, nunca um adjetivo.
- **Fecho editorial longo, em texto corrido, desfazendo uma confusão.** A seção "NOT PORT ARTHUR" existe para dizer "não somos aquilo que você está pensando". É o bloco mais valioso do site deles e o que mais serve à Green Beach.
- **Bloco com números duros e borda.** No Woolmers é preço e horário de partida. A forma vale mesmo quando o conteúdo muda.

O que **não** transfere, e a razão está na seção 5 deste arquivo.

---

## 3. Mapa de fotos da página

Montado antes de diagramar, para conferir duplicidade no fim. Uma foto, um lugar.

| Posição | Arquivo | Papel | Por quê |
|---|---|---|---|
| Hero | `itapema-canto-da-praia` | foto de capa, sangrando, recorte à esquerda | **trocada em 11/09/2026 por medição.** Ver a nota abaixo da tabela |
| 4. A casa | `fachada-green-beach` | retrato pequeno, 4:5, máximo 320 px de CSS | única foto real da casa. Aparece **uma vez na página inteira** |
| 5. A diária | `cafe-da-manha` | vertical sangrando na borda | banco de imagem, entra com a etiqueta "foto ilustrativa" visível |
| 7. Faixa | `itapema-nascer-do-sol` | faixa sangrada, tinta clara | cinza prateado, baixa saturação, é a pausa da página |
| 8. Itapema, cartão 1 | `itapema-verao-na-praia` | cartão | a Meia Praia cheia, em escala fechada, contra a curva aberta do hero |
| 8. Itapema, cartão 2 | `itapema-barcos-de-pesca` | cartão | assume a vaga, porque a gêmea dela subiu para o hero |
| 8. Itapema, cartão 3 | `itapema-ilha-praia-grossa` | cartão | a ilhota, o outro lado do morro |
| 8. Itapema, cartão 4 | `itapema-baia-do-mirante` | cartão | a baía pelo lado oposto, com o mar em primeiro plano |
| 11. CTA final | `itapema-por-do-sol` (tem 2560) | fundo com véu | fim de tarde, fecha o dia que o hero abriu de manhã |

> **Por que o hero mudou.** A escolha original era `itapema-meia-praia-aerea`,
> pela razão certa: é a única que mostra a praia e o centro no mesmo quadro.
> Mas ela reprova na leitura. Varri 360 combinações de recorte, força de véu
> e largura de coluna, medindo duas coisas ao mesmo tempo: contraste no pior
> pixel da caixa de texto, e quanto brilho do quadro sobrava depois do véu.
>
> | Foto | Melhor contraste possível | Brilho que sobra |
> | --- | --- | --- |
> | `meia-praia-aerea` | 4,56:1 | **34%** |
> | `baia-aberta` | 4,51:1 | 40% |
> | `por-do-sol` | 4,59:1 | 52% |
> | `canto-da-praia` | **6,76:1** | **57%** |
>
> `meia-praia-aerea` só fica legível apagando a foto, e o resultado é
> exatamente a imagem com filtro escuro que o cliente já reclamou uma vez.
> `canto-da-praia` ganha nos dois eixos porque o texto cai sobre água funda,
> que já é escura: o véu trabalha em 0,10 na base e 0,40 na lateral, contra
> os 0,62 que o sistema previa.
>
> Ela também faz o trabalho do hero: tem os barcos, a marina, o skyline de
> Itapema e o morro no mesmo quadro. Não é a praia aberta, é o canto, que é
> mais reconhecível.

**Fora da página, só no lightbox:** `itapema-baia-aberta`, `itapema-faixa-de-areia`, `itapema-guarda-sois`, `itapema-praia-grossa`, `itapema-orla-a-noite`.

`itapema-entardecer` está no disco mas **não está registrada em `pousada.js`**, então hoje não existe para o site. Fica assim: ela é gêmea de `itapema-por-do-sol`, e as duas juntas não acrescentam nada. Se um dia entrar, precisa de `alt` e legenda escritos olhando a foto.

Conferido: nenhuma repetição de lugar nem de ângulo no fluxo da página. O acervo inteiro continua acessível, mas atrás de um clique, porque enfileirado ele vira repetição.

---

## 4. As seções, na ordem

Os títulos numerados abaixo são as seções da **v3**. Quando a linha começa com **Woolmers:**, o número que vem depois é o do levantamento do Woolmers, que tem outra contagem.

### 0. Barra de aviso
**Woolmers:** barra de aviso no topo, uma linha e um botão pequeno.

**Trabalho.** Dizer, antes de tudo, como a reserva funciona nesta casa, e empurrar para o formulário. É também o único lugar reservado para recado de temporada, quando existir um.

**Texto.**
> Reserva direto com a pousada, sem intermediário. **Consultar datas**

O botão **não** abre o WhatsApp. Ele rola até o formulário e dá foco no campo de check-in. Um atalho de WhatsApp aqui em cima só produziria mensagem sem data, que é o lead que a pousada menos quer.

Slot de recado sazonal, seguindo a convenção do projeto: `aviso: { texto: '', confirmado: false }`. Vazio não renderiza. Quando a pousada quiser anunciar alta temporada, feriado ou reforma, o texto entra ali e a barra troca de conteúdo sozinha.

**Confirmado.** Que a reserva é feita direto com a pousada: sim, é o modelo que o próprio site opera.
**Depende do cliente.** A frase mais forte, "não estamos em Booking, Airbnb nem Decolar", fica **fora** até o cliente confirmar. O dossiê tem confiança médio-alta nisso, não alta: o Booking bloqueou a verificação direta.

**Mobile.** A barra rola junto com a página, não fica fixa. Só o texto, sem botão: no celular quem faz esse trabalho é a barra fixa de baixo, e três camadas de interface presas na tela ao mesmo tempo é cerco, não navegação.

---

### 1. Cabeçalho
**Woolmers:** logo à esquerda, busca e sanduíche à direita, navegação mínima.

**Trabalho.** Sair da frente. Levar de volta ao topo, e manter um gatilho de consulta sempre alcançável.

**Conteúdo.** Logo à esquerda. À direita, um botão de contorno "Consultar" e o sanduíche. **Sem busca**: num site de uma página, lupa é promessa de profundidade que não existe.

Navegação dentro do painel, cinco itens: A pousada, A diária, Itapema, Como chegar, Contato.

**Marca.** Mantém a regra que já está no ar e que respeita o manual: sobre a foto do hero entra o lockup completo, porque só acima de 135 px de altura ele fica legível; depois do scroll o cabeçalho fica sólido e passa a exibir só a rosácea. Continua pendente a versão horizontal reduzida (item 13 do PENDENCIAS).

**Mobile.** Logo menor, o botão "Consultar" vira só o sanduíche a partir de 480 px, porque a barra fixa de baixo já carrega a ação. Alvo de toque de 44 px nos dois.

---

### 2. Hero, com o formulário dentro
**Woolmers:** foto aérea, olho em caixa alta, display serifado em três linhas com a terceira em itálico bronze, parágrafo curto, dois botões.

**Trabalho.** Em uma tela: dizer o que é, onde fica, e começar a consulta.

**Texto.**

Olho:
> CENTRO DE ITAPEMA, SANTA CATARINA

Título, três linhas, Playfair Display 400, caixa baixa, alinhado à esquerda:
> A praia de Itapema
> e uma casa
> *logo atrás*

A terceira linha em itálico e em dourado `#e5b64e`, exatamente como a linha bronze do Woolmers. Isso é permitido **só aqui**: o véu do hero tem alpha efetivo de 0,81 onde o texto senta, e nessa condição o dourado bate 4,97:1 (tabela 2.5 da direção de arte). Dourado como texto sobre fundo claro continua proibido em toda a página.

Parágrafo de apoio:
> Pousada e hotel numa rua paralela à orla, no centro. Café da manhã incluso na diária, piscina, e a reserva feita direto com a recepção, pelo WhatsApp.

Em vez dos dois botões do Woolmers: **o formulário inteiro**, com os três campos (check-in, check-out, hóspedes) e o botão "Consultar disponibilidade". Acima dele, a linha "Consulte as datas da sua estadia". Nenhum segundo botão de WhatsApp ao lado: ele canibalizaria o lead com data.

**Foto.** `itapema-meia-praia-aerea-2560.webp`, sangrando, 16:9 no desktop, `min-height: 78svh`. Véu verde `20 26 18` em gradiente vertical mais lateral, como já está calibrado. Alternativa para teste: `itapema-baia-aberta`, que tem mais mar limpo do lado direito.

**Confirmado.** Endereço, rua paralela à orla, café incluso, piscina, WhatsApp como canal.
**Depende do cliente.** Nada. Toda palavra deste hero já está confirmada em `pousada.js`.
**Nunca entra aqui.** Distância em metros até a areia (as fontes vão de 20 a 500 m) e nota de avaliação (a do Google é da gestão anterior).

**Mobile.** Muda de estrutura, não só de tamanho. A foto ocupa o topo em 4:5, e o texto mais o formulário descem para um bloco em fundo areia, tinta escura. Motivo medido na v2: no pior pixel da melhor aérea do acervo, texto sobre foto dá 1,87:1 na zona onde o hero escreve. No desktop o véu resolve; num retângulo de 375 px, véu mais formulário mais título empilhados viram papa. Separar as camadas é mais honesto e mais legível.
Título em `--fs-display-l` (36 px), as mesmas três linhas, que cabem: 18, 10 e 10 caracteres.
Formulário em três linhas empilhadas, botão de largura total, alvos de 44 px, e o primeiro campo visível sem rolar.

---

### 3. Faixa de três fatos
**Woolmers:** "20 minutes from Launceston", "Open Daily from 8am", "1 of 11 Australian Convict Sites".

**Trabalho.** Responder as três primeiras perguntas antes que o visitante precise rolar atrás delas.

**Texto.** Três colunas, tipografia só, filete dourado de 1 px entre elas:
> **Rua 141, no centro de Itapema**
> Rua paralela à orla, a pé da areia e do calçadão.

> **Café da manhã incluso**
> Já na diária, servido todos os dias.

> **Aceita animais de estimação**
> Confirme o porte do seu pet antes de reservar.

Os três são fatos, não adjetivos, e nenhum deles repete o que a barra de aviso e o hero acabaram de dizer. A reserva direta é assunto da seção 4, onde ela tem espaço para ser explicada: dizer a mesma coisa três vezes em duas telas não convence mais, cansa.

**Foto.** Nenhuma. É a pausa tipográfica entre duas superfícies com imagem.

**Confirmado.** Os três. Pets tem três fontes independentes.
**Candidato a substituir o terceiro:** "Reserva direto com a recepção", se o cliente achar que pet fala com uma fatia pequena demais do público. Minha posição: para quem viaja com cachorro, essa é a primeira pergunta e ela decide a escolha, enquanto reserva direta já foi dita duas vezes acima.
**Depende do cliente.** Horário do café da manhã. Se vier, vira a segunda linha do fato 2 e ganha muito.

**Mobile.** Empilha em três blocos, filete vira linha horizontal. Não vira carrossel: três itens em carrossel escondem dois terços da informação.

---

### 4. A casa, e por que a reserva é direta
**Woolmers:** seção 6, a proposta combinada (olho, título em duas linhas, parágrafo, botão), somada ao miolo dos três cartões de destaque da seção 7.

**Trabalho.** Explicar em que tipo de lugar a pessoa vai dormir e por que o caminho é o WhatsApp. É aqui que a ausência de motor de reservas deixa de ser falta e vira argumento.

**Texto.**

Olho:
> A POUSADA

Título, duas linhas:
> Sem central de reservas.
> Você fala com a casa.

Parágrafos:
> A Green Beach fica na Rua 141, no centro de Itapema, numa rua paralela à orla. É o tipo de endereço em que o dia começa na praia, o almoço é ali na esquina e ninguém precisa pegar o carro para nada.

> Aqui não tem intermediário nem formulário que cai numa caixa de entrada. As datas que você escolher vão direto para o WhatsApp da recepção, e quem responde é quem vai te receber na chegada.

Abaixo, a fileira de quatro destaques, tipográfica, sem ícone dentro de círculo (o manual proíbe, e círculo de ícone em fila é o visual mais genérico que existe em site de hotel): **Perto da praia**, **Piscina**, **Café da manhã incluso**, **Conforto para a família**, cada um com uma linha de apoio, como já está em `destaques`.

Gatilho de texto, não botão cheio:
> Consultar as datas

**Foto.** `fachada-green-beach`, em retrato 4:5, coluna de 5 de 12, **largura máxima de 320 px**, com a legenda "A entrada da pousada, na Rua 141, número 58". Essa é a aparição única dela na página. Repetir a única foto real da casa é a forma mais rápida de anunciar que só existe uma.

**Confirmado.** Endereço, rua paralela, os quatro destaques (todos declarados pela própria pousada).
**Depende do cliente.** O vínculo com o Grupo Green, que aparece no rodapé e na seção 10: o logo declara, mas o dossiê não achou fonte pública ligando a pousada a um grupo com esse nome. Continua no site porque a própria marca afirma, e fica na lista de conferir.
**Não entra.** "Refúgio de exclusividade" e parentes, que é a linguagem da bio do Instagram. O dossiê é claro: o imóvel é classificado como econômico e a expectativa quebrada na chegada vira avaliação ruim nova.

**Mobile.** A fachada vai para o topo do bloco, em 4:5 de largura total (aí ela ganha os 375 px e continua dentro da resolução, porque o dispositivo é 2x sobre uma caixa menor). Texto embaixo. Os quatro destaques viram lista de duas colunas.

---

### 5. O que já está na diária
**Woolmers:** seção 9, hospedagem: título grande, lista de inclusões com marcador, dois botões, e os cartões das cabanas embaixo.

**Trabalho.** Responder "o que eu recebo pelo que eu pago" sem ter preço para mostrar.

**Texto.**

Olho:
> A DIÁRIA

Título:
> O que já está incluso

Lista, com marcador, na tipografia de corpo, nunca em grade de ícones miúdos:
> Café da manhã, todos os dias, já na diária
> Piscina
> Wi-Fi gratuito
> Ar-condicionado, frigobar e TV no apartamento
> Recepção e atendimento direto

Cinco linhas, como no Woolmers. Pets é fato confirmado e importante, mas é assunto de combinar antes, então vive na seção 6 e não aqui: repetir o mesmo item em duas seções seguidas enfraquece as duas.

E, logo abaixo, no mesmo peso de corpo, o que a casa **não** tem:
> A pousada não tem estacionamento próprio. Se você vem de carro, combine antes pelo WhatsApp onde deixar o veículo.

Dizer o que falta, no mesmo tamanho do que sobra, é o que separa uma casa que sabe o que é de um anúncio. E evita a reclamação de janeiro.

Dois gatilhos, como no Woolmers: **Consultar as datas** (primário) e **O que combinar antes** (rola para a seção 6).

**Foto.** `cafe-da-manha`, vertical, sangrando na borda direita, com **etiqueta visível "foto ilustrativa"**. Hoje ela é banco de imagem e o site já a marca como `tipo: 'ilustracao'` no código, fora do lightbox e fora do Schema.org. Faltava a etiqueta na cara do visitante. Quando a foto do café real chegar, a etiqueta sai e o tipo vira `pousada`, sem mexer no layout.

**Confirmado.** Todos os itens da lista têm duas ou mais fontes. A ausência de estacionamento próprio está confirmada pela própria pousada.
**Depende do cliente.** Horário do café. Sauna e churrasqueira aparecem em relato de hóspede de 2023 e ninguém confirma se ainda funcionam: **ficam de fora** até alguém dizer que sim.

**Mobile.** Foto de largura total em 4:5 antes do texto, lista em uma coluna, os dois gatilhos empilhados com o primário em cima.

---

### 6. O que combinar antes de chegar
**Woolmers:** seção 8, o bloco de experiência com preço, duração, limite de pessoas e horários de partida.

**Trabalho.** Fazer o que o bloco de preço do Woolmers faz: dar números duros, numa caixa com borda, para a pessoa sentir que a operação é organizada. Como não temos preço nem tour, os números são os da operação.

**Texto.** Caixa em superfície branca sobre o fundo areia, filete dourado, numerais tabulares.

Coluna esquerda, **o que já está combinado**:
> Check-in: a partir das 14h
> Check-out: até as 12h
> Café da manhã: incluso na diária
> Pets: aceitos, confirmando o porte
> Estacionamento: não há vaga própria

Coluna direita, **o que a recepção confirma na hora da reserva**:
> Formas de pagamento, parcelamento e sinal
> Prazo de cancelamento
> Crianças: berço, cama extra e idade de cortesia
> Horário do café da manhã

Fecho da caixa:
> A pousada confirma esses quatro pontos na hora da consulta. Pergunte junto com as datas, que vem tudo na mesma resposta.

Gatilho: **Perguntar pelo WhatsApp**, marcado na mensagem como origem "combinado", para a pousada distinguir dúvida de reserva no atendimento.

**Foto.** Nenhuma. A caixa é o objeto.

**Isto substitui a seção de perguntas frequentes da v1.** Sanfona de oito perguntas em que metade responde "confirme pelo WhatsApp" lê como site que não sabe das coisas. Duas colunas, uma com o que está resolvido e outra com o que se resolve na conversa, diz a mesma verdade e soa como operação em dia. O Schema.org de FAQPage continua sendo emitido a partir dos mesmos dados, então o ganho de busca não se perde.

**Confirmado.** Os cinco da esquerda.
**Depende do cliente.** Os quatro da direita. Assim que qualquer um vier, ele atravessa a caixa da direita para a esquerda e a seção fica mais forte sozinha.

**Mobile.** As duas colunas empilham, a da esquerda primeiro. Cada linha vira rótulo em cima e valor embaixo, para o valor não espremer.

---

### 7. Faixa de respiro
**Woolmers:** não tem equivalente. Vem da v1 e fica.

**Trabalho.** Trocar o ritmo. Depois de dois blocos densos de texto, uma foto de ponta a ponta acorda a página. Sem CTA, sem link: é pausa, não é venda.

**Texto.**
> De manhã cedo, a praia ainda é de quem acorda primeiro.
> O amanhecer em Itapema, visto do alto.

**Foto.** `itapema-nascer-do-sol`, sangrando, 21:9, tinta escura sobre véu claro (a variante `faixa--clara`, porque véu escuro em cima de amanhecer mata justamente a luz que é o assunto). Foco em `50% 64%`, senão sobra só céu cinza e o molhe some.

**Confirmado.** A legenda descreve o que a foto mostra, e só.

**Mobile.** Altura reduzida, proporção 3:2, frase em duas linhas. O apoio some.

---

### 8. Itapema
**Woolmers:** seção 5, a tira horizontal de onze cartões de categoria com rolagem lateral.

**Trabalho.** Vender o destino, não a cama. Quem procura pousada em Itapema muitas vezes ainda está escolhendo a cidade. E é aqui que o acervo de drone pode brilhar sem que ninguém confunda a vista com o jardim do hotel.

**Texto.**

Olho:
> EM VOLTA

Título:
> Itapema não acaba na areia

Apoio:
> A Meia Praia é a praia larga do centro, a que aparece nas fotos do alto. Do outro lado do morro estão as praias menores, e no canto ficam os barcos de pesca. Tudo isso cabe num fim de semana.

Abre com o **mapa animado**, que já existe e é o elemento mais autoral do site: a câmera parte do Brasil inteiro, fecha em Santa Catarina, fecha em Itapema e larga o alfinete. Ele muda de lugar em relação à v1, onde era a segunda seção: agora o endereço já foi dito três vezes antes (hero, faixa de fatos e seção 4), então o mapa deixa de ser "onde fica isso" e passa a ser o que sempre foi melhor, o argumento de destino.

Depois do mapa, **quatro cartões**, não onze:
> **A Meia Praia.** A praia larga do centro, a que enche de guarda-sol em dezembro.
> **O Canto da Praia.** A ponta onde os barcos de pesca ficam ancorados, na água calma.
> **A Praia Grossa.** Água clara e uma ilhota logo em frente, do outro lado do morro.
> **Do alto.** A baía inteira vista do mirante, com o mar aberto até o horizonte.

Cada cartão abre o lightbox com o acervo inteiro. É a válvula: as treze aéreas e a fachada ficam atrás de um clique, em vez de empilhadas na página.

**Fotos.** `itapema-verao-na-praia`, `itapema-canto-da-praia`, `itapema-ilha-praia-grossa`, `itapema-baia-do-mirante`. Quatro lugares diferentes, quatro enquadramentos diferentes, e contraste de escala contra a curva aberta do hero.

**Superfície.** Esta é a única seção em contexto escuro da página, além do rodapé e da barra fixa, como o manual determina. A aérea ganha muito sobre verde profundo.

**Confirmado.** Cada frase descreve o que a foto realmente mostra. Nenhuma distância, nenhum superlativo.
**Depende do cliente.** Nada. Se vierem distâncias medidas até Ponte dos Suspiros, Praça da Paz e Monumento O Caminhante, elas entram como uma quinta linha de fatos, nunca como cartão.

**Mobile.** O mapa ocupa a largura inteira em proporção 1:1, e o rótulo de Itapema entra abaixo do alfinete, não ao lado. Com movimento reduzido ligado no sistema, ele nasce no estado final, com o alfinete já visível. Os quatro cartões viram rolagem lateral com um cartão e um pedaço do seguinte à mostra, que é o único lugar da página onde o carrossel do Woolmers faz sentido: aqui a foto é o conteúdo, e o corte na borda convida a arrastar.

---

### 9. Como chegar
**Woolmers:** seção 10, "Plan your visit": horários, localização, tabela de preços de entrada, botão.

**Trabalho.** Tirar a última dúvida logística de quem já decidiu: onde é a porta, e como eu chego nela.

**Texto.**

Olho:
> COMO CHEGAR

Título:
> Rua 141, no centro

Endereço:
> Rua 141, 58, Centro, Itapema, SC

Nota:
> A pousada fica em uma rua paralela à orla, no centro. Do quarteirão dá para ir a pé até a areia, até o comércio e até os restaurantes do calçadão.

Horários repetidos em miúdo (check-in 14h, check-out 12h), porque quem chega nesta seção pode ter pulado a caixa da seção 6.

Botão: **Abrir rota no Google Maps**, ancorado no Place ID, para o pino cair certo.

**Foto.** Nenhuma. O mapa de rua incorporado do Google é o objeto visual, e ele faz um trabalho diferente do mapa animado da seção 8: lá a pergunta é "onde fica Itapema", aqui é "qual é a rua e como eu chego".

**Confirmado.** Endereço com quatro fontes independentes, coordenadas, Place ID.
**Depende do cliente, e vale dinheiro:**
- **Distância medida até a areia.** Hoje o site não crava número de propósito. Medido na rua, é o dado que mais converte nesta página.
- **Distância dos aeroportos.** O TripAdvisor lista 25,9 km até Navegantes e 63,9 km até Florianópolis. Texto pronto, para publicar **só depois de conferir**: "Cerca de 26 km do aeroporto de Navegantes e 64 km do de Florianópolis." Enquanto não conferir, não entra.
- **Onde os hóspedes estacionam de verdade** (conveniado, rotativo na rua, ou nada).

**Mobile.** Mapa primeiro em 4:3, texto embaixo, botão de rota de largura total. O iframe entra com `loading="lazy"`, senão come o carregamento inicial no 4G.

---

### 10. O nome é novo
**Woolmers:** seção 11, o fecho editorial "NOT PORT ARTHUR": olho, título em duas linhas, dois parágrafos de texto corrido, link.

**Trabalho.** O mesmo do Woolmers: desfazer, com a própria voz, a confusão que o visitante vai encontrar sozinho se procurar. Quem pesquisa a pousada no Google acha o nome antigo, uma nota que não é dela e avaliações de outra gestão. Chegar na frente disso é a jogada mais forte do site inteiro.

**Texto, versão aberta.**

Olho:
> ANTES DE VOCÊ PROCURAR NO GOOGLE

Título:
> A casa é a mesma.
> O nome é novo.

Parágrafos:
> O prédio da Rua 141 recebe hóspede há muitos anos, com outro nome e outra administração. Desde agosto de 2026 ele é a Pousada & Hotel Green Beach, do Grupo Green, com telefone novo e atendimento novo. A esquina é a mesma, a operação não.

> Por isso você não vai achar nota de avaliação neste site. As estrelas que aparecem hoje no Google foram escritas sobre a operação anterior, e usar aquilo como recomendação nossa seria mentira. Quando existir avaliação escrita sobre a Green Beach, ela entra aqui, com nome e data.

Link: **Falar com a recepção**.

**Texto, versão fechada** (se o cliente não quiser tocar no passado):

Olho:
> POR QUE NÃO TEM NOTA AQUI

Título:
> A Green Beach
> começou em agosto de 2026.

> Este site não exibe nota nem número de avaliações. A marca é nova e as avaliações que circulam na internet sobre este endereço foram escritas antes dela. Preferimos não pendurar na parede um elogio que não é nosso.

> O que dá para prometer é o que está escrito aqui em cima: café da manhã incluso, piscina, uma rua paralela à orla, e uma pessoa de verdade respondendo no WhatsApp. O resto a gente combina antes de você reservar.

**Foto.** Nenhuma. É bloco de texto corrido, medida de 66 caracteres por linha, muito ar em volta, sobre fundo areia. No Woolmers este bloco também é só tipografia, e é justamente isso que faz ele parecer conversa e não anúncio.

**Confirmado.** Que a marca Green Beach passou a operar em agosto de 2026, que a nota do Google é da gestão anterior e que o site não exibe nota. Tudo isso já está registrado no projeto.
**Depende do cliente, e é obrigatório.** **Nenhuma das duas versões vai ao ar sem aprovação.** Citar publicamente a operação anterior é decisão de negócio, não de design. Minha recomendação é a versão aberta: ela responde a objeção antes que ela nasça, e quem pesquisa vai descobrir de qualquer jeito.
**Não entra em hipótese nenhuma.** O nome do hotel anterior escrito na página. Dizer "outro nome e outra administração" resolve, e não empurra o visitante para uma busca com reclamações.

**Mobile.** Sem mudança de estrutura, só de medida: 60 caracteres por linha e mais espaço entre os parágrafos. Este é o bloco onde a leitura em celular é mais longa, então entrelinha folgada de 1,62.

---

### 11. CTA final
**Woolmers:** os botões "Book Tickets" do "Plan your visit" mais o lugar que lá é ocupado pela assinatura de newsletter.

**Trabalho.** Fechar. Quem rolou até aqui leu tudo e ainda não pediu. Este é o último pedido, e é o mais completo.

**Texto.**

Título:
> Suas datas ainda estão livres?

Apoio:
> Escolha o período e mande. A recepção responde com o que está livre para essas datas.

O formulário completo, agora com os dois campos opcionais que o hero não mostra: **seu nome** e **alguma observação** ("Chego tarde, preciso de berço, vou de carro"). Botão "Consultar disponibilidade".

**Foto.** `itapema-por-do-sol-2560.webp` com véu, foco em `58% 52%`. Fim de tarde fechando o dia que o hero abriu com a praia cheia de sol. `itapema-entardecer` fica de fora: é quase a mesma imagem, e duas quase iguais na mesma página é o erro que faz a casa parecer pequena.

**Confirmado.** Tudo.

**Mobile.** Foto acima, formulário sobre fundo areia abaixo, pela mesma razão do hero. A barra fixa se recolhe quando este formulário entra na tela, para não haver dois botões de consulta ao mesmo tempo na mesma dobra.

---

### 12. Rodapé
**Woolmers:** rodapé de sete colunas de links.

**Trabalho.** Contato, e só. Sete colunas pressupõem quarenta páginas.

**Conteúdo.** Verde profundo. Logo em versão clara. Três blocos: **Contato** (endereço, WhatsApp (47) 99794-8332, telefone (47) 3368-2466, Instagram @pousadagreenbeach), **Navegar** (os cinco itens do menu) e a linha de base com o ano e o Grupo Green.

**Depende do cliente.** E-mail novo (o antigo perdeu o domínio), CNPJ e razão social para a linha de base e para o Schema.org. E **conferir o telefone fixo**: o (47) 3368-2466 saiu da ficha do Google, que ainda não foi reivindicada pela nova gestão e continua exibindo dado da operação anterior. Se esse número não toca mais na recepção, ele sai do rodapé.

**Mobile.** Blocos empilhados, logo menor, contatos como alvos de 44 px, porque no rodapé o toque em telefone e WhatsApp é o uso principal.

---

### Barra fixa, no celular
Já existe na v1 e fica: aparece quando o formulário do hero sai da tela, mostra o estado ("Consulte as datas" quando vazia, "12 a 15 de jan, 3 noites, 2 hóspedes" quando preenchida) e recolhe por classe, não por `hidden`, com `inert` e `aria-hidden`, para sumir também para teclado e leitor de tela.

**Uma mudança em relação à v1:** hoje ela só observa o formulário do hero. Na v3 ela também precisa se recolher quando o formulário final entra na tela, senão os dois botões de consulta disputam a mesma dobra.

---

## 5. O que estou descartando do Woolmers, e por quê

| Bloco do Woolmers | Decisão | Razão |
|---|---|---|
| Busca no cabeçalho | **Fora** | Uma página de dez blocos não tem o que buscar. Lupa promete profundidade que não existe e vira clique perdido |
| Tira de **onze** cartões de categoria | **Reduzida a quatro** | Das quatorze aéreas, seis mostram a mesma baía e três delas são quase intercambiáveis. Onze cartões repetiriam a mesma praia cinco ou seis vezes. Fartura fingida lê como escassez |
| Dois botões no hero ("Book Tickets" e "Book Accommodation") | **Fora, virou o formulário** | No Woolmers existe bilheteria online. Aqui o único canal é o WhatsApp, então o formulário tem que estar na primeira dobra, não atrás de um clique |
| Três cartões grandes com foto e "Discover more" | **Sem foto e sem link** | Não há foto de ambiente para colocar dentro deles, e "saiba mais" numa página única não leva a lugar nenhum. Viraram a fileira tipográfica de quatro destaques |
| Bloco de experiência com **preço**, duração e limite de pessoas | **Fora o preço, fica a forma** | Não existe preço público e não existe passeio. A caixa com borda e números duros continua, com os números que são verdade: horários, café, pets, estacionamento |
| Cartões das cabanas, com nome e foto de cada uma | **Fora** | `acomodacoes: []`. Não há nome de apartamento, capacidade, metragem nem foto de quarto em nenhuma fonte confiável. Os nomes que circulam em agregador se contradizem entre a versão em inglês e a em português |
| Tabela de preços de entrada (adulto, criança, família, grupo) | **Fora** | Não existe diária pública, e inventar faixa de preço é o tipo de mentira que o hóspede cobra na chegada |
| Assinatura de newsletter | **Fora** | Não há lista, não há e-mail ativo e não há quem opere. Um campo de e-mail que não vai a lugar nenhum rouba atenção do único formulário que importa |
| Rodapé de sete colunas | **Reduzido a três blocos** | Sete colunas de links pressupõem um site de quarenta páginas |
| Selo UNESCO e a autoridade institucional | **Sem equivalente** | Green Beach não tem prêmio, certificação nem registro CADASTUR verificado. Não existe selo para colocar, e desenhar um é falsificação |
| Nota e número de avaliações | **Fora, e explicado na seção 10** | A nota 4,4 com 287 avaliações é da gestão anterior. Exibir seria falso e mandaria o visitante para uma página com reclamação sobre os antigos donos |

**Não descartei, e vale registrar:** o olho em caixa alta abrindo cada seção, o display serifado em três linhas com a terceira em itálico colorido, a faixa de três fatos, a caixa com números duros e o fecho editorial longo. São cinco dispositivos, e são eles que fazem o Woolmers parecer instituição em vez de folheto.

---

## 6. Onde o formulário entra, e como ele sobrevive

**Duas instâncias completas, uma barra fixa, e uma regra única.**

1. **No hero**, três campos e o botão. É o coração.
2. **No CTA final**, os mesmos três campos mais nome e observação.
3. **Barra fixa no celular**, entre uma e outra.

As duas instâncias **compartilham o mesmo store**. Quem escolhe a data em cima e rola até embaixo encontra os campos já preenchidos. Isso não é economia de digitação: é a página mostrando que prestou atenção.

**Por que não uma terceira instância.** Três formulários iguais na mesma página leem como insistência, e diluem a primeira. Os outros pontos de contato ao longo da página (barra de aviso, seções 4 e 5) são **gatilhos de texto que levam ao formulário**, nunca cópias dele. O gatilho da seção 6 é o único que sai para o WhatsApp sem data, e ele é rotulado como pergunta, não como reserva.

**A regra única, e é ela que segura quem rolou até o fim sem preencher:**

> Todo controle de consulta, em qualquer lugar da página, sem data preenchida, **não abre o WhatsApp**. Ele rola até o formulário mais próximo, marca os campos como tocados e dá foco no check-in.

Isso vale para o botão da barra de aviso, para os gatilhos das seções 4 e 5, e principalmente para a barra fixa. O motivo é comercial, não estético: mensagem sem data obriga a recepção a começar de novo pelo "para quando?", e é justamente aí que a conversa esfria. Com data, a recepção já responde com o que tem livre.

**Quem rola até o fim sem preencher, então, encontra:**
- a barra fixa acompanhando a tela inteira no celular, sempre com o resumo do que falta;
- a caixa de números da seção 6, que responde as dúvidas de logística que costumam travar o preenchimento;
- o fecho editorial da seção 10, que responde a objeção de confiança;
- e o formulário completo, com nome e observação, na última dobra.

**Quem prefere só perguntar** tem uma saída explícita e separada: o gatilho "Perguntar pelo WhatsApp" da seção 6 e o "Falar com a recepção" da seção 10 abrem a conversa marcada como dúvida, com o protocolo `GB-XXXX-XXXX` na mensagem. Assim a pousada distingue, no próprio WhatsApp, quem está perguntando de quem está reservando, e o analytics fecha o ciclo entre o clique e a reserva confirmada.

---

## 7. Ritmo de cor da página

Alternância conferida contra a proporção 60/30/10 do manual:

| Seção | Superfície |
|---|---|
| 0 barra de aviso | verde profundo, uma linha só |
| 1 cabeçalho | transparente sobre a foto do hero, sólido depois do scroll |
| 2 hero | foto com véu verde |
| 3 três fatos | areia `#fbf8f4` |
| 4 a casa | areia |
| 5 a diária | areia alternada `#f4ebde` |
| 6 combinado | caixa branca `#ffffff` sobre areia, filete dourado |
| 7 faixa | foto, véu claro, tinta escura |
| 8 Itapema | verde profundo, a única seção escura do miolo |
| 9 como chegar | areia |
| 10 o nome é novo | areia, só tipografia |
| 11 CTA final | foto com véu verde |
| 12 rodapé | verde profundo |

Dourado aparece em: filete da faixa de fatos, filete da caixa da seção 6, a terceira linha do hero, e o fundo do botão primário. Em nenhum outro lugar. Dourado como texto sobre fundo claro continua proibido: quando precisar, `--accent-text` `#85641b`.

---

## 8. Confirmar antes de publicar

**Bloqueia a v3:**
1. **Aprovação do texto da seção 10.** Versão aberta ou versão fechada. Sem escolha, a seção não vai ao ar.
2. **Foto do café da manhã servido.** Enquanto não chegar, a seção 5 roda com banco de imagem e a etiqueta "foto ilustrativa" na cara. É a foto mais urgente do projeto.

**Melhora muito, e cada uma resolve uma seção inteira:**
3. Distância medida na rua até a areia (seção 9, e também o hero se vier um número bom).
4. Horário do café da manhã (seção 3 e seção 6).
5. Formas de pagamento, prazo de cancelamento e regra de crianças (atravessam a caixa da seção 6 da direita para a esquerda).
6. Onde os hóspedes estacionam de fato (seção 5).
7. Fotos de piscina, apartamento, banheiro e área comum, em pelo menos 2400 px de largura. Com elas, a seção 5 ganha mosaico e a seção de acomodações pode voltar a existir.
8. Tipos de apartamento: nome, capacidade, camas, metragem. Sem isso, a seção de acomodações do Woolmers continua descartada.
9. Distâncias dos aeroportos e dos pontos próximos, conferidas (hoje só há o que o TripAdvisor declara).
10. E-mail novo, CNPJ e razão social, para o rodapé e para o Schema.org, e a confirmação de que o fixo (47) 3368-2466 ainda toca na recepção.
11. Versão horizontal reduzida da logo e um símbolo redesenhado para ícone (item 13 do PENDENCIAS).
12. O vínculo formal com o Grupo Green, que a marca declara e o dossiê não conseguiu verificar em fonte pública.

---

## 9. Limitações técnicas conhecidas

**Fonte.** O itálico da terceira linha do hero exige carregar **Playfair Display 400 itálico**, que hoje não está no `<link>` do site (só 400 e 500 romanos). É um arquivo woff2 a mais acima da dobra. Esta é uma extensão declarada da direção de arte, que limita a família a cinco arquivos: registro aqui em vez de fazer em silêncio. Se o custo de carregamento não for aceito, a alternativa é a terceira linha em Playfair 400 romano, só com a troca de cor, que perde parte do gesto do Woolmers mas mantém a hierarquia.

**Fachada.** 628 px de original. Serve para uma caixa de 320 px no desktop e para largura total no celular, e mais nada. Ampliar ela para meia página é o tipo de defeito que só aparece na tela do cliente.

**Aéreas.** Quatro arquivos têm 2560 px (`itapema-meia-praia-aerea`, `itapema-por-do-sol`, `itapema-orla-a-noite`, `itapema-baia-do-mirante`). A direção de arte pede 3200 px para hero em tela de 1600 px a 2x. Em monitor grande e denso, o hero vai amaciar um pouco. Os originais do acervo têm 4032 px de largura, então isso se resolve rodando `scripts/preparar-fotos.py` com uma largura de 3200 a mais, sem depender do cliente.

**Contraste sobre foto.** Medido na v2: no pior pixel da melhor aérea, a zona onde o hero escreve dá 1,87:1. Por isso o desktop usa véu calibrado com alpha efetivo de 0,81 e o celular separa as camadas. Nenhum texto desta arquitetura fica sobre foto sem véu.

**Mapa de rua.** O cartão do iframe do Google exibe "4,4 (287)" porque é o que está na ficha, que ainda não foi reivindicada. O site não afirma nada, mas o número aparece. Reivindicar a ficha do Google é o que dá controle sobre isso, e é de graça.

**Sem motor de reservas.** A página não sabe se a data está livre. Toda a linguagem foi escrita em torno de "consultar", nunca de "reservar" ou "garantir", para não prometer confirmação que só a recepção pode dar.
