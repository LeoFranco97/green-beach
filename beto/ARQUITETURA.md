# Landing de ingressos do Beto Carrero World
## Pousada & Hotel Green Beach | out/2026

Esta página tem **um** objetivo: fazer o visitante mandar, pelo WhatsApp, um
pedido de ingresso completo o suficiente para ser orçado na primeira resposta.
Tudo que não serve a isso sai.

Decisões já fechadas com o Leonardo em 14/10/2026:

| Questão | Decisão |
|---|---|
| O que vende | Ingresso **mais transfer** saindo de Itapema e região, e os adicionais do parque (fila rápida, extras) |
| Como fecha | **WhatsApp com o pedido já montado**. Sem checkout, sem gateway |
| Preço | **"A partir de R$ X"** como âncora. Valor fechado sai no atendimento |
| Vínculo | **Revendedor autorizado** do parque |

Sistema visual: o mesmo da `direcao-de-arte-v3.md`, tokens em
`src/styles/tokens.css`. Esta página **não** inventa paleta nem tipografia.

---

## 1. A pessoa que chega aqui

Três entradas, e a página precisa servir as três sem virar três páginas.

**A. O turista que já está no litoral.** Está em Itapema, Bombinhas, Porto
Belo ou Balneário Camboriú, decidiu ontem à noite que vai ao parque, e o
problema dele não é o ingresso: é **como chegar lá**. Ele não tem carro, ou
tem e não quer dirigir e estacionar. Para ele o transfer é o produto e o
ingresso é o acessório.

**B. O hóspede da Green Beach.** Já está na casa. Para ele a página é a prova
de que dá para resolver na recepção, sem app, sem fila e sem sair.

**C. Quem está planejando a viagem.** Pesquisa de casa, semanas antes. Para
ele a página precisa de preço, data e política de cancelamento, senão ele
compra no site oficial e nunca aparece.

A ordem das seções abaixo atende A primeiro, porque é quem converte no mesmo
dia, e entrega B e C no caminho.

---

## 2. A objeção que decide a venda

O visitante sabe que o ingresso existe no site oficial. Comprar com a pousada
só faz sentido se ele ganhar alguma coisa. A página precisa responder, **acima
da dobra**, qual é essa coisa. Em ordem de força:

1. **Transporte resolvido.** Ida e volta, com horário, sem dirigir, sem
   estacionamento, sem GPS. Isso o site oficial não vende.
2. **Atendimento humano que responde em minutos**, em português, por WhatsApp,
   antes e durante o passeio.
3. **Uma pessoa que já fez isso mil vezes** dizendo a que horas sair, o que
   levar e o que ver primeiro.

O que a página **não** promete: ser mais barata que o site oficial, a não ser
que exista condição real de revenda que permita isso. Prometer desconto que
não existe queima a venda no primeiro contato.

---

## 3. Arquitetura da página

Numeração = ordem de rolagem. Cada bloco tem um trabalho; bloco sem trabalho
não entra.

### 3.1 Cabeçalho
Transparente sobre o hero, vira sólido na rolagem (mesmo comportamento do
site da pousada). Símbolo da Green Beach à esquerda, um link de volta para
`greenbeach.com.br`, e o botão de WhatsApp à direita, sempre visível.

### 3.2 Hero
Foto de largura total. Texto no terço esquerdo, sem cartão flutuando.

- olho: a linha que diz de onde sai e para onde vai
- título em três linhas, a terceira em itálico dourado
- apoio: uma frase que entrega ingresso + transfer + preço âncora
- **um** botão primário, que rola até o configurador, não que abre o WhatsApp
  direto. Mandar para o WhatsApp antes de ele escolher data e quantidade
  produz lead sem informação, que é o lead que ninguém responde.
- abaixo do botão, uma linha de prova: distância e tempo até o parque.

Sem contagem regressiva, sem selo de desconto, sem "últimas vagas". A casa é
premium e não grita.

### 3.3 Faixa de fatos
Quatro números em linha, tipografia grande, sem ícone de banco de imagens:
tempo de viagem, quilômetros, horário de saída, pessoas por van. É o bloco que
responde "é longe?" em dois segundos.

### 3.4 O configurador (o coração da página)
É aqui que a venda acontece. Precisa estar **alto**, logo depois dos fatos, e
ser alcançável pelo botão do hero.

Passos, todos na mesma tela em desktop e empilhados em mobile:

1. **Dia da visita.** Calendário que bloqueia dia em que o parque não abre.
   Dia fechado precisa estar visivelmente desabilitado, não só recusado no
   clique.
2. **Quem vai.** Adultos e crianças com seletor de quantidade. Criança pede
   idade, porque idade muda o preço e evita a discussão no embarque.
3. **Qual ingresso.** Cartões com nome, o que inclui, e preço "a partir de".
   Um cartão recomendado, marcado, porque escolha sem recomendação trava.
4. **Transfer.** Ponto de embarque numa lista (Itapema, Meia Praia, Balneário
   Camboriú, Porto Belo, Bombinhas, "sou hóspede da Green Beach"), ou "vou por
   conta".
5. **Adicionais.** Fila rápida e extras, em caixas de marcar.
6. **Resumo colado na tela** com a conta "a partir de" somando o que foi
   escolhido, e o botão de WhatsApp. Em mobile vira barra fixa no rodapé.

Regra de UX inegociável: **o botão de WhatsApp nunca fica desabilitado.** Se
faltar data, a mensagem vai com "não informada" e o atendente pergunta. Botão
cinza é desistência programada.

O preço mostrado é sempre rotulado "a partir de", e o resumo diz, em letra de
apoio, que o valor final é confirmado no atendimento. Isso é honestidade e
também é proteção: preço de parque muda.

### 3.5 Como funciona, em três passos
Pedido pelo WhatsApp, pagamento combinado, ingresso e horário do transfer no
celular. Numeração grande, texto curto. Tira o medo de comprar fora do site
oficial.

### 3.6 O dia no parque
Bloco editorial, não catálogo. Uma foto grande, duas menores, e um roteiro de
horário: que horas sai, que horas chega, o que fazer primeiro, que horas volta.
É o conteúdo que diferencia de qualquer revendedor e é o que o turista
realmente não sabe.

**Pendência de material:** a página não pode usar foto do parque sem o material
oficial de parceiro. Até chegar, este bloco usa foto do acervo da pousada e da
região, e a seção fica tipográfica. Nenhuma foto de brinquedo vem de busca.

### 3.7 Faixa de respiro
Uma única faixa escura na página inteira, com uma frase. É a pausa que o
sistema v3 pede. Não é mais um bloco de venda.

### 3.8 Hospedagem
O cross-sell. Quem vem de longe para o parque precisa dormir. Duas ou três
linhas, uma foto da casa, e um botão que leva para `greenbeach.com.br`. Discreto:
esta página vende ingresso, a pousada é a oferta de segunda ordem.

### 3.9 Perguntas
FAQ real, feita das dúvidas que travam a compra, não das que enchem a página:
cancelamento, remarcação, chuva, altura mínima, criança, o que levar, como
recebe o ingresso, se é o mesmo ingresso do site oficial. Vai em `<details>`
nativo e em `FAQPage` no Schema.org.

### 3.10 Fechamento
Repete o configurador de forma curta: data, pessoas e botão. Quem rolou até o
fim não deve ter que subir.

### 3.11 Rodapé
Quem é a Green Beach, endereço, WhatsApp, Instagram, link do site da pousada, e
a **linha de transparência**: que a Green Beach é revendedora e que Beto
Carrero World é marca do parque, não da pousada.

---

## 4. Regras de conversão que valem mais que o layout

1. **Um só CTA.** Tudo que é botão primário na página leva ao mesmo lugar: o
   pedido pelo WhatsApp. Nada de "saiba mais" competindo.
2. **O WhatsApp acompanha a rolagem.** Botão flutuante em mobile desde o
   primeiro scroll, e barra de resumo quando o configurador já foi tocado.
3. **Nada de formulário de e-mail.** Campo a mais é conversão a menos, e o
   WhatsApp já identifica a pessoa.
4. **A mensagem vai pronta.** Data, pessoas, ingresso, transfer, adicionais,
   protocolo e origem. O cliente só aperta enviar.
5. **Protocolo em toda mensagem** (`BC-XXXX-XXXX`), para cruzar lead com venda
   e medir a página de verdade.
6. **Preço só com fonte e data.** Todo valor no código carrega a data da
   coleta. Preço sem fonte entra como `confirmado: false` e **não renderiza**.
7. **Velocidade é conversão.** Sem biblioteca de componente, sem carrossel, sem
   vídeo de fundo. Foto em WebP com `srcset` e miniatura borrada.
8. **Acessível de verdade.** Alvo de toque de 44 px, foco visível, calendário
   navegável por teclado, contraste mínimo 4,5:1.

---

## 5. O que esta página não faz

- Não processa pagamento. Decisão do Leonardo, e está certa para a primeira
  versão: valida demanda sem custo de integração.
- Não mostra disponibilidade real do parque em tempo real. Não há API pública.
- Não usa a identidade visual do Beto Carrero World além da citação nominal do
  produto, enquanto o material oficial de parceiro não estiver em mãos.
- Não exibe avaliação do Google. A nota do endereço é da gestão anterior.

---

## 6. Pendências antes de publicar

Lista viva. Cada item que fica aberto é um bloco que não renderiza.

- [ ] Material oficial de parceiro: logo, fotos do parque e regras de uso
- [ ] Tabela de preço de revenda e o que entra na margem
- [ ] Preço do transfer por trecho e lotação da van, e quem opera
- [ ] Horário de saída e de retorno, por cidade
- [ ] Política de cancelamento que a Green Beach vai praticar, que pode ser
      mais restritiva que a do parque
- [ ] Número de WhatsApp: mesmo da pousada ou um só para ingresso
- [ ] Endereço final da página e publicação
