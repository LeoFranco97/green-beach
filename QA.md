# Relatório de QA

Pousada & Hotel Green Beach. Verificação de 10/09/2026, depois do mapa animado entrar no lugar da galeria.

**125 de 125 verificações passaram. Nenhuma falha em aberto.**

Os testes não são checklist escrito à mão: são um script que sobe o Chrome, navega na página de verdade, clica no calendário, mexe no seletor de hóspedes, tenta enviar formulário inválido e lê a URL do WhatsApp que sai no fim. Roda com o site no ar:

```bash
node scripts/qa.mjs
```

Sai com código 1 se algo falhar, então serve para travar um deploy quebrado. Não precisa de dependência de npm.

## Bugs encontrados e corrigidos durante o QA

**A barra de consulta do mobile nunca ficava escondida.** O componente declara `display: flex`, e isso vence a regra do navegador que esconde elementos com o atributo `hidden`. Resultado: a barra aparecia por cima do formulário do hero já na primeira tela, competindo com ele. Corrigido com uma regra explícita em `base.css`. Quem pegou foi o teste de responsividade, depois que a checagem passou a olhar o que é pintado em vez do atributo.

**Limpar datas não limpava.** No calendário, "Limpar datas" zerava o estado interno, mas fechar pelo X descartava a mudança e as datas antigas voltavam sem aviso. Agora o calendário avisa o formulário a cada mudança, e não só ao confirmar. Fechar virou só fechar.

**A barra fixa cobria o fim do rodapé** no mobile. A folga de 4,5rem não dava conta da altura da barra mais a área segura do aparelho. Virou 6,5rem mais `env(safe-area-inset-bottom)`.

**Texto cortado em 320px.** O resumo da barra fixa não cabia na largura mínima. Em telas abaixo de 360px o texto de apoio agora some antes de qualquer coisa ser truncada.

**O título do hero quebrava em cinco linhas.** O bloco de texto limitava o `h1` junto com o parágrafo. Título e parágrafo passaram a ter medidas de leitura separadas.

**A logo não cabia no cabeçalho.** Medindo o arquivo oficial, o lockup é quase quadrado e só fica legível acima de 135px de altura. A solução que ficou no ar respeita o manual: o lockup inteiro aparece grande sobre a foto do hero e, depois do scroll, o cabeçalho passa a mostrar só a rosácea. Pedir uma versão horizontal ao designer da marca está em `PENDENCIAS.md`.

**As setas de mês do calendário estavam empilhadas.** Faltaram as classes modificadoras no JavaScript, então os dois botões caíram no mesmo ponto e o "próximo mês" cobria o "mês anterior". Na prática dava para avançar mas não para voltar. O teste de teclado não pegou, porque usa PageUp e PageDown; foi preciso um teste que clica nas setas e confere que elas estão em lados opostos da tela. Esse teste agora faz parte da suíte.

**O lightbox estourava a altura da tela.** O `align-items: center` no meio do lightbox fazia a linha crescer até caber a foto inteira, e aí a imagem passava por cima da legenda. Virou `stretch`, com o palco recebendo a altura real da linha. Foi preciso um teste que compara a posição da foto com a da legenda, porque olhar o `object-fit` não pegava isso.

**O mapa nunca animava quando o navegador parava de compor quadros.** Mesmo defeito de sempre, em lugar novo: o gatilho de entrada do mapa era um `IntersectionObserver` puro. Ele ganhou a mesma rede de segurança de três níveis do resto do sistema, agora dentro do próprio `aoAparecer`, o que conserta de uma vez qualquer coisa que passe a usar esse gatilho.

**O contexto escuro invertia as cores dentro do mapa.** A seção usa a classe `.gb-dark`, que troca `--text-inverse` para tinta escura. O rótulo do alfinete e os botões do mapa herdavam isso e escreviam escuro sobre escuro, ou seja, sumiam. O palco do mapa passou a ter tinta própria, porque ele é sempre escuro independente de a seção estar clara ou não.

**O alfinete ficava pequeno demais.** A compensação de escala usava `1 / zoom`, o que mantém o tamanho aparente constante, mas constante em 15px. Marcador de interface precisa de alvo, não de ponto: virou `2,3 / zoom`, que dá 33px na tela em qualquer enquadramento.

**As fotos não apareciam quando o observador não disparava.** O CSS esconde cada bloco até ele entrar na tela, e quem devolve a visibilidade é o `IntersectionObserver`. Existe mais de uma situação real em que ele não dispara: aba em segundo plano, navegador que para de compor quadros, extensão que mexe na rolagem. Nessas, a página ficava em branco. Agora a fonte da verdade é uma medição direta de posição, feita a cada rolagem, e o observador é só o atalho eficiente. Tem ainda um terceiro nível: passados oito segundos, o que sobrou aparece de qualquer jeito. Perder a animação de um bloco é melhor que perder o bloco.

**`overflow-x: hidden` no body quebrava as animações de rolagem.** Parece inofensivo e não é: ele transforma o body em contêiner de rolagem, e aí toda animação com `animation-timeline: view()` passa a medir contra um elemento que não rola, e nunca anda. Trocado por `overflow-x: clip`, que corta igual sem criar contêiner de rolagem.

**Máscara e cascata brigando pelo mesmo elemento.** As células do mosaico tinham a primitiva de máscara e, pelo pai, a de cascata. Cada elemento só tem uma lista `animation`: uma vencia e a outra nunca rodava, e a célula ficava presa no estado inicial, invisível. As duas primitivas agora são exclusivas.

**Sangria com `translate` estourava o documento.** `translate` é só visual: a caixa de layout continua onde estava, e a página ganhava 840px de rolagem lateral. Virou margem negativa calculada a partir da margem real do contêiner, num token único (`--sangria`), conferido em sete larguras.

**O foco dos diálogos dependia de `requestAnimationFrame`.** Em aba que não está pintando, o quadro nunca chega e o calendário abria sem foco: quem navega por teclado ficava preso do lado de fora. O foco agora é imediato; só a transição visual espera o quadro.

**O título do hero era fatiado antes da fonte carregar.** As linhas saíam calculadas na fonte de fallback e, quando a Playfair chegava, uma "linha" com texto demais quebrava de novo dentro da própria máscara. Agora o fatiamento espera `document.fonts.ready` e refaz quando a largura muda.

**Links quebrados no menu.** O menu listava "Acomodações", mas a seção não existe enquanto a pousada não informar os tipos de quarto. Agora o menu é montado a partir das seções que realmente vão para a página.

## O que foi verificado

```
Estrutura e SEO
  ok   lang é pt-BR
  ok   title preenchido e com menos de 65 caracteres
  ok   meta description entre 80 e 175 caracteres
  ok   canonical presente
  ok   Open Graph com título e imagem
  ok   favicon declarado
  ok   exatamente um h1
  ok   Schema.org LodgingBusiness presente
  ok   Schema com endereço
  ok   Schema com coordenadas
  ok   Schema sem aggregateRating inventado
  ok   Schema FAQPage presente
Links
  ok   nenhuma âncora quebrada
  ok   todo link _blank tem rel noopener
  ok   nenhum link para localhost ou placeholder
Acessibilidade
  ok   toda imagem tem alt
  ok   toda imagem tem width e height
  ok   todo botão tem nome acessível
  ok   todo iframe tem title
  ok   link de pular para o conteúdo
  ok   landmarks main, header e footer
  ok   regiões aria-live para retorno dinâmico
  ok   elemento interativo recebe foco por script
Responsividade
  ok   desktop (1440px) sem rolagem lateral
  ok   desktop sem elemento estourando a margem
  ok   desktop sem texto cortado
  ok   laptop (1280px) sem rolagem lateral
  ok   laptop sem elemento estourando a margem
  ok   laptop sem texto cortado
  ok   tablet (834px) sem rolagem lateral
  ok   tablet sem elemento estourando a margem
  ok   tablet sem texto cortado
  ok   tablet alvos de toque com pelo menos 40px
  ok   mobile (390px) sem rolagem lateral
  ok   mobile sem elemento estourando a margem
  ok   mobile sem texto cortado
  ok   mobile alvos de toque com pelo menos 40px
  ok   mobile 320 (320px) sem rolagem lateral
  ok   mobile 320 sem elemento estourando a margem
  ok   mobile 320 sem texto cortado
  ok   mobile 320 alvos de toque com pelo menos 40px
Calendário e hóspedes
  ok   calendário abre pelo campo de check-in
  ok   calendário é um dialog modal
  ok   dois meses lado a lado no desktop
  ok   grade com role grid e 7 colunas
  ok   dia anterior a hoje está bloqueado
  ok   hoje está disponível
  ok   foco cai em um dia ao abrir
  ok   setas de mês em lados opostos
  ok   seta avança o mês
  ok   seta volta o mês
  ok   seta direita anda um dia
  ok   seta baixo anda uma semana
  ok   PageDown troca de mês
  ok   Esc fecha o calendário
  ok   check-in preenchido após clicar no dia
  ok   check-out preenchido após o segundo clique
  ok   calendário fecha sozinho com o período completo
  ok   não deixa remover criança abaixo de zero
  ok   não deixa ficar sem nenhum adulto
  ok   campo de hóspedes reflete a escolha
Validação e WhatsApp
  ok   limpar datas tem efeito mesmo fechando pelo X
  ok   formulário vazio não abre o WhatsApp
  ok   mostra mensagem de erro nos campos
  ok   campo inválido marcado para o leitor de tela
  ok   foco volta para o primeiro campo com erro
  ok   WhatsApp abre com o formulário válido
  ok   número no formato E.164 correto
  ok   mensagem codificada em URL
  ok   mensagem traz "Check-in:"
  ok   mensagem traz "Check-out:"
  ok   mensagem traz "Adultos:"
  ok   mensagem traz "Crianças:"
  ok   mensagem traz "Acomodação:"
  ok   mensagem traz "Nome:"
  ok   mensagem traz "Observação:"
  ok   mensagem traz "Consulta:"
  ok   mensagem traz "Origem:"
  ok   mensagem traz "Página:"
  ok   mensagem traz o período em noites
  ok   identificador da consulta no formato GB-XXXX-XXXX
  ok   datas em dd/mm/aaaa
  ok   link com datas na URL já chega preenchido
  ok   hóspedes da URL respeitados
  ok   UTMs entram na mensagem
Mapa de Itapema
  ok   seção do mapa existe
  ok   coreografia chega ao fim
  ok   contorno do estado terminou de se desenhar
  ok   alfinete aparece
  ok   alfinete fica dentro do palco
  ok   alfinete tem tamanho de alvo, e não de ponto
  ok   botão alterna o enquadramento
  ok   botão diz para onde vai
  ok   svg do mapa tem descrição
Lightbox
  ok   lightbox abre pela foto da pousada
  ok   lightbox é um dialog modal
  ok   lightbox mostra contador
  ok   seta direita troca a foto
  ok   foto aparece inteira, sem corte agressivo
  ok   foto cabe na tela sem cobrir a legenda
  ok   Esc fecha o lightbox
  ok   rolagem da página é devolvida ao fechar
Barra fixa no mobile
  ok   barra fixa escondida na primeira dobra
  ok   barra fixa aparece depois do formulário do hero
  ok   barra fixa não cobre o fim do rodapé
  ok   menu mobile abre
  ok   menu mobile trava a rolagem do fundo
  ok   Esc fecha o menu mobile
  ok   rolagem devolvida ao fechar o menu
Calendário no mobile
  ok   calendário abre como bottom sheet
  ok   bottom sheet encostado na base da tela
  ok   mostra vários meses para rolar
  ok   dia com alvo de toque confortável
  ok   trava a rolagem do fundo enquanto aberto
  ok   rolagem acontece dentro do calendário
  ok   devolve a rolagem ao fechar
Movimento reduzido
  ok   navegador reporta preferência por menos movimento
  ok   tokens de duração zerados
  ok   nenhuma transição acima de 10ms
  ok   rolagem suave desligada
Navegação por teclado
  ok   Tab percorre a página sem ficar preso
  ok   Tab chega aos campos de consulta
  ok   Tab chega ao botão de consultar
  ok   anel de foco visível é declarado
Console
  ok   nenhum erro no console
```

## O que este QA não cobre

- **Contraste medido pixel a pixel.** Os pares de cor foram calculados na direção de arte, em `direcao-de-arte.md`, e todos batem WCAG AA. O script não recalcula contraste sobre a foto do hero, que muda conforme a imagem. Ao trocar a foto de capa, confira se o título continua legível.
- **Leitor de tela de verdade.** O script confere estrutura: papéis ARIA, nomes acessíveis, regiões `aria-live` e foco. Isso não substitui uma passada com VoiceOver ou NVDA.
- **Aparelho físico.** Foi tudo em Chrome com emulação de dispositivo. Vale abrir uma vez num iPhone e num Android reais, principalmente para o bottom sheet do calendário.
- **Envio real ao WhatsApp.** O teste confere a URL montada e a codificação, mas não abre o WhatsApp. Mande uma mensagem de teste para o (47) 99794-8332 antes de anunciar.
- **Performance em rede lenta.** O build fica em 744 KB no total, a primeira dobra carrega a foto do hero em WebP com `srcset` e o resto entra com carregamento adiado, mas não foi medido Lighthouse em 3G.
- **Comportamento com as fotos que faltam.** A galeria hoje tem duas fotos e o mosaico se adapta a isso. Quando chegarem as fotos reais da piscina, dos apartamentos e do café da manhã, rode o QA de novo.

## Como reproduzir

Com o site rodando em `http://localhost:5180`:

```bash
node scripts/qa.mjs
```

Para apontar para outra URL, por exemplo o site já publicado:

```bash
node scripts/qa.mjs https://www.pousadagreenbeach.com.br
```

Para gerar as capturas em cinco larguras:

```bash
node scripts/capturar.mjs
```
