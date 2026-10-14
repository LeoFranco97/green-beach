/**
 * CONTEUDO DA LANDING DE INGRESSOS
 * ---------------------------------------------------------------------------
 * Unico arquivo de conteudo da pagina. Texto, ingresso, preco, ponto de
 * embarque, pergunta frequente: tudo aqui.
 *
 * Convencao herdada do site da pousada e que vale igual aqui:
 *
 *   confirmado: true   dado verificado em fonte publica, com URL e data de
 *                      coleta no comentario. Vai para o ar.
 *   confirmado: false  placeholder. A pagina NAO renderiza o bloco. Nada
 *                      inventado chega ao visitante.
 *
 * REGRA DE PRECO: preco de parque muda. Todo valor carrega `coletadoEm` e
 * `fonte`. Valor sem as duas coisas entra como confirmado: false.
 *
 * Fontes desta versao: ../../pesquisa/dossie-beto-carrero.md
 */

import logoDourada from '../assets/green-beach-logo.webp'
import logoClara from '../assets/green-beach-logo-clara.webp'
import simbolo from '../assets/green-beach-simbolo.webp'

export const marca = { logoDourada, logoClara, simbolo }

/**
 * O nome do parque aparece como produto vendido, nunca como se fosse marca
 * da pousada. A linha de transparencia do rodape existe por isso.
 */
export const parque = {
  nome: 'Beto Carrero World',
  cidade: 'Penha',
  estado: 'SC',
  confirmado: true,
}

/* ===========================================================================
   DAQUI PARA BAIXO: CASCA VISUAL (out/2026)
   ---------------------------------------------------------------------------
   Regra que vale para tudo o que vem abaixo e que nao se discute:

   NUMERO NAO SAI DA CABECA DE NINGUEM. Tempo de viagem, quilometro, horario
   de saida, lotacao da van, preco, idade de crianca, prazo de cancelamento e
   regra de altura entram aqui com `confirmado: false` ate o levantamento
   devolver fonte e data. Enquanto estiverem false, o bloco inteiro nao
   renderiza: a pagina fica menor e continua verdadeira.

   O que ESTA confirmado aqui e so de dois tipos:
     1. Dado da pousada (endereco, WhatsApp, Instagram, site).
     2. Decisao de operacao fechada com o Leonardo em 14/10/2026 e registrada
        em ARQUITETURA.md: vende ingresso mais transfer, fecha por WhatsApp,
        sem checkout, preco ancora "a partir de", revendedora autorizada.
   =========================================================================== */

/** Campo confirmado devolve o valor; campo pendente devolve null. */
export const seConfirmado = (campo) => (campo && campo.confirmado ? campo.valor : null)

/**
 * A ancora do configurador mora aqui, e nao dentro de cada componente.
 * O configurador e escrito por outra pessoa, em paralelo: o acordo e que ele
 * carimbe este id na secao dele. O main.js confere depois que a pagina monta
 * e, se o id nao existir, manda os gatilhos para o WhatsApp em vez de deixar
 * botao apontando para o vazio.
 */
export const ANCORA_PEDIDO = '#pedido'

/* ------------------------------------------------------------------ marca */

export const pousada = {
  nome: 'Pousada & Hotel Green Beach',
  nomeCurto: 'Green Beach',
  grupo: 'Grupo Green',
  confirmado: true,
}

export const contato = {
  /** [POUSADA] mesmo canal publicado pela casa. O numero em si vive em config.js. */
  whatsappExibicao: '(47) 99794-8332',
  instagram: 'pousadagreenbeach',
  instagramUrl: 'https://www.instagram.com/pousadagreenbeach/',
  confirmado: true,
}

export const endereco = {
  logradouro: 'Rua 141, 58',
  bairro: 'Centro',
  cidade: 'Itapema',
  estado: 'SC',
  pais: 'BR',
  linhaUnica: 'Rua 141, 58, Centro, Itapema, SC',
  confirmado: true,
}

/* ------------------------------------------------------------------ fotos */

/**
 * O acervo desta pagina, e o mapa de onde cada foto pode aparecer.
 *
 * Nao existe foto do parque, e nenhuma vai ser pescada de busca: ate o
 * material oficial de parceiro chegar, a pagina e feita com o acervo da
 * pousada e da regiao, e o bloco editorial fica tipografico. Isso esta
 * decidido em ARQUITETURA.md, 3.6.
 *
 * Luminancia e familia de cada foto medidas em direcao-de-arte-v3.md, 6.1 e
 * 6.4. Duas consequencias que mandam no layout e nao se negociam:
 *
 *   hero    so aceita foto com p90 abaixo de 0,30 na caixa de texto. Das
 *           quatro aereas desta pasta, so `itapema-por-do-sol` (0,208)
 *           passa. As outras tres exigiriam veu acima de 0,40, que apaga a
 *           foto e deixa um retangulo esverdeado no lugar.
 *   familia A `meia-praia-aerea`, `guarda-sois` e `verao-na-praia` sao a
 *           mesma foto com outro enquadramento. No maximo duas na pagina, e
 *           em escalas muito diferentes.
 */
export const fotos = [
  {
    arquivo: 'itapema-por-do-sol',
    papel: 'hero',
    familia: 'C',
    tipo: 'destino',
    alt: 'Pôr do sol em Itapema, com o céu vermelho sobre o morro, a curva da praia e a cidade já iluminada',
    foco: '50% 50%',
  },
  {
    arquivo: 'itapema-meia-praia-aerea',
    papel: 'dia-grande',
    familia: 'A',
    tipo: 'destino',
    alt: 'Vista aérea da Meia Praia em Itapema: a faixa de areia em curva, guarda-sóis na areia e os prédios do centro',
    legenda: 'Itapema vista do alto. O transfer sai daqui.',
    foco: '50% 46%',
  },
  {
    arquivo: 'itapema-guarda-sois',
    papel: 'dia-detalhe',
    familia: 'A',
    tipo: 'destino',
    alt: 'Praia de Itapema vista quase de cima, com dezenas de guarda-sóis coloridos na areia e a espuma das ondas',
    legenda: 'Verão na Meia Praia, guarda-sol por guarda-sol.',
    foco: '50% 55%',
  },
  {
    arquivo: 'fachada-green-beach',
    papel: 'hospedagem',
    familia: 'E',
    tipo: 'pousada',
    alt: 'Fachada da Pousada e Hotel Green Beach, na Rua 141, no centro de Itapema',
    /** Legenda que so afirma o que se ve na foto. */
    legenda: 'A entrada da pousada, na Rua 141.',
    foco: '50% 50%',
  },
  {
    arquivo: 'itapema-verao-na-praia',
    /**
     * Sem papel de proposito: e a terceira foto da familia A e entraria como
     * repeticao. Fica no arquivo para quem for diagramar saber que ela
     * existe e por que ela NAO esta na pagina.
     */
    papel: '',
    familia: 'A',
    tipo: 'destino',
    alt: 'Verão na praia de Itapema, vista do alto, com a areia cheia e o mar verde',
    foco: '50% 50%',
  },
  {
    arquivo: 'cafe-da-manha',
    /**
     * Foto de banco de imagem, declarada como tal desde a v1 do site da
     * pousada. A direcao de arte v3, 6.1, recomenda TIRAR, e nao trocar por
     * outra de banco: foto de banco ilustrando servico real e um dos sinais
     * mais reconheciveis de peca amadora. Por isso ela nao tem papel nesta
     * pagina. Entra quando existir a foto verdadeira.
     */
    papel: '',
    familia: 'F',
    tipo: 'ilustracao',
    alt: 'Mesa de café da manhã',
    foco: '50% 50%',
  },
]

/** Acha a foto pelo papel que ela cumpre no layout, nunca pelo nome do arquivo. */
export const fotoPor = (papel) => fotos.find((f) => f.papel === papel && f.tipo !== 'ilustracao') || null

/* ------------------------------------------------------------------- hero */

export const hero = {
  /** Diz de onde sai e para onde vai, que e a primeira pergunta do turista. */
  olho: 'De Itapema ao Beto Carrero World',

  /**
   * Tres linhas, a terceira em italico dourado. A quebra e dado e nao
   * resultado de largura de tela: ela e a assinatura tipografica da pagina.
   *
   * Duas regras foram obedecidas ao escrever estas linhas:
   *   medida  no maximo 19 caracteres por linha. Playfair a 80px gasta
   *           0,474em por caractere, e a coluna do hero tem 730px numa
   *           janela de 1280. "O ingresso, a ida" ocupa 644px.
   *   acento  nenhuma maiuscula acentuada, em nenhuma linha. Em portugues o
   *           acento sobe 32,6% acima da altura de maiuscula e come a folga
   *           da entrelinha de 1,06.
   */
  titulo: ['O ingresso, a ida'],
  tituloSegunda: 'e a volta',
  tituloItalico: 'num pedido só',

  apoio:
    'Você monta o pedido aqui: o dia, quem vai, qual ingresso e de onde o transfer sai. A gente responde no WhatsApp com o valor fechado.',

  /** Rotulo do unico botao primario da pagina. Ele rola ate o configurador. */
  botao: 'Montar meu pedido',

  confirmado: true,
}

/**
 * O preco ancora do hero.
 *
 * PENDENTE: tabela de preco de revenda, com fonte e data de coleta. Preco de
 * parque muda, entao o campo guarda `coletadoEm` e `fonte` junto com o valor.
 * Enquanto estiver false, a linha de preco simplesmente nao aparece no hero,
 * e o resto do bloco continua de pe.
 */
export const precoAncora = {
  valor: '',
  coletadoEm: '',
  fonte: '',
  confirmado: false,
}

/**
 * A linha de prova logo abaixo do botao: distancia e tempo ate o parque.
 *
 * PENDENTE: ninguem mediu. Nao vale copiar de blog de viagem, que e onde
 * esses numeros costumam ser inventados. Fonte aceitavel: rota medida no
 * Google Maps no dia, ou o operador do transfer.
 */
export const provaDoHero = {
  /** [OSRM] rota rodoviaria medida em 14/10/2026, nao linha reta de mapa. */
  valor: '50 km de Itapema, 44 minutos de estrada',
  fonte: 'OSRM, rota rodoviária Itapema a Penha',
  coletadoEm: '14/10/2026',
  confirmado: true,
}

/* ------------------------------------------------------- faixa de 4 fatos */

/**
 * Os quatro numeros que respondem "e longe?" em dois segundos.
 *
 * Os quatro estao pendentes, entao hoje a faixa inteira nao vai ao ar. Isso
 * e o certo: faixa de fatos com um numero e tres buracos e pior que faixa
 * nenhuma. O componente exige no minimo tres confirmados para renderizar, e
 * a razao esta escrita em fatos.js.
 */
export const fatos = [
  {
    chave: 'duracao',
    numero: '44',
    unidade: 'min',
    rotulo: 'de Itapema até o portão',
    /** [OSRM] 14/10/2026. Tempo de estrada, nao de porta a porta: o transfer
     *  ainda nao tem horario definido, e por isso o rotulo nao promete isso. */
    confirmado: true,
  },
  {
    chave: 'distancia',
    numero: '50',
    unidade: 'km',
    rotulo: 'de Itapema até Penha',
    /** [OSRM] 14/10/2026, rota rodoviaria. */
    confirmado: true,
  },
  {
    chave: 'abertura',
    numero: '7',
    unidade: 'dias',
    rotulo: 'por semana, até 31 de março',
    /** [PARQUE] calendario oficial consultado em 14/10/2026: nenhuma data
     *  fechada entre outubro de 2026 e marco de 2027. As paradas voltam em
     *  abril, sempre em terca ou quarta. */
    confirmado: true,
  },
  {
    chave: 'saida',
    numero: '',
    unidade: '',
    rotulo: 'horário de saída',
    /** PENDENTE: horario de saida e de retorno, por cidade de embarque. */
    confirmado: false,
  },
]

/* ---------------------------------------------------------- como funciona */

/**
 * Os tres passos.
 *
 * Nenhum dos tres afirma numero, prazo ou politica: os tres descrevem a
 * operacao que o Leonardo fechou em 14/10/2026, que e por isso que eles
 * podem ir ao ar antes do levantamento. O unico detalhe operacional que
 * ainda nao se sabe, COMO o ingresso chega na mao do cliente, esta separado
 * em `entrega`, pendente, e nao segura a secao.
 */
export const comoFunciona = {
  olho: 'Como funciona',
  titulo: ['Três passos,', 'nenhum formulário'],
  passos: [
    {
      numero: '1',
      titulo: 'Você monta o pedido',
      texto:
        'Escolhe o dia, quem vai, o ingresso e o ponto de embarque. A página abre o WhatsApp com o pedido já escrito, e você só aperta enviar.',
      confirmado: true,
    },
    {
      numero: '2',
      titulo: 'A gente responde',
      texto:
        'Quem atende é uma pessoa, não um robô. A resposta vem com o valor fechado para o dia que você escolheu.',
      confirmado: true,
    },
    {
      numero: '3',
      titulo: 'Pagamento combinado',
      texto:
        'Sem checkout, sem cadastro e sem gateway. O pagamento é combinado direto com a pousada, na mesma conversa.',
      confirmado: true,
    },
  ],
  /**
   * PENDENTE: como o ingresso chega (voucher no WhatsApp, QR, retirada na
   * recepcao) e em quanto tempo. Vira a quarta linha do passo 3 quando a
   * pousada confirmar.
   */
  entrega: { valor: '', confirmado: false },
  confirmado: true,
}

/* ------------------------------------------------------------ dia no parque */

/**
 * O bloco editorial com o roteiro de horario.
 *
 * ESTA DESLIGADO, e o motivo e o proprio conteudo: o que diferencia esta
 * secao de qualquer revendedor e saber a que horas sai, a que horas chega, o
 * que ver primeiro e a que horas volta. Nenhum desses quatro existe ainda.
 * Sem eles sobraria um titulo bonito com duas fotos de praia, que e enchimento
 * de pagina.
 *
 * O esqueleto fica escrito para que ligar a secao seja so preencher `hora` e
 * virar `confirmado`, sem ninguem precisar diagramar de novo.
 *
 * O que NAO pode entrar aqui quando a secao acender: nome de atracao,
 * brinquedo ou show. Nada disso foi verificado, e nada disso pode vir de
 * busca. Entra quando o material oficial de parceiro chegar.
 */
export const diaNoParque = {
  olho: 'O dia inteiro',
  titulo: ['Da sua rua até', 'o portão do parque'],
  paragrafos: [
    'Quem já fez esse caminho sabe que o dia começa cedo e que a diferença entre um passeio bom e um passeio corrido está em duas ou três decisões tomadas antes de sair.',
  ],
  roteiro: [
    { rotulo: 'Saída de Itapema', hora: '', texto: '', confirmado: false },
    { rotulo: 'Chegada ao parque', hora: '', texto: '', confirmado: false },
    { rotulo: 'O que ver primeiro', hora: '', texto: '', confirmado: false },
    { rotulo: 'Volta para Itapema', hora: '', texto: '', confirmado: false },
  ],
  confirmado: false,
}

/* ---------------------------------------------------------------- respiro */

/**
 * A unica faixa escura da pagina, e a pausa que o sistema v3 pede.
 *
 * Ela nao vende nada e nao tem botao: se ganhar um gatilho, deixa de ser
 * pausa e vira o quarto pedido seguido. As duas linhas sao quebra deliberada,
 * pelo mesmo motivo do titulo do hero.
 *
 * As duas frases so repetem o que a pagina ja prometeu em cima. Nenhuma
 * promessa nova entra aqui.
 */
export const respiro = {
  frase: ['Você escolhe o dia.', 'A ida, a volta e o ingresso são com a gente.'],
  apoio: 'Pedido montado aqui, respondido por uma pessoa, no WhatsApp da pousada.',
  confirmado: true,
}

/* ------------------------------------------------------------- hospedagem */

/**
 * O cross sell, de proposito discreto: esta pagina vende ingresso, a pousada
 * e a oferta de segunda ordem. Por isso o gatilho e de texto e nao botao
 * dourado. Botao primario nesta secao competiria com o unico CTA da pagina.
 *
 * O paragrafo nao crava distancia da areia nem do parque: as duas estao
 * pendentes de medicao, e o site da pousada ja registra essa mesma ressalva.
 */
export const hospedagem = {
  olho: 'Se a viagem for maior',
  titulo: ['Dormir em Itapema,', 'no centro'],
  paragrafos: [
    'Quem vem de longe para o parque precisa de um lugar para dormir antes e depois. A Pousada & Hotel Green Beach fica na Rua 141, no centro de Itapema, numa rua paralela à orla.',
    'É a mesma casa que vende este ingresso. Se você também precisa de quarto, resolve na mesma conversa.',
  ],
  gatilho: 'Ver a pousada',
  confirmado: true,
}

/* ------------------------------------------------------------------ FAQ */

/**
 * As perguntas que travam a compra, e so elas.
 *
 * Tres estao respondidas, e as tres saem de fato ou de decisao registrada:
 * a Green Beach e revendedora autorizada, o transfer e opcional, e nao e
 * preciso ser hospede. As demais estao pendentes e NAO aparecem na pagina
 * nem no Schema.org: "confirme pelo WhatsApp" nao e resposta, e FAQPage com
 * resposta vazia e desqualificada pelo Google.
 */
export const duvidas = [
  {
    pergunta: 'É o mesmo ingresso que eu compraria no site oficial?',
    resposta:
      'Sim. A Green Beach vende como revendedora autorizada do Beto Carrero World. O que muda é que aqui você resolve a ida e a volta junto, e fala com uma pessoa pelo WhatsApp antes e durante o passeio.',
    confirmado: true,
  },
  {
    pergunta: 'Posso comprar só o ingresso, sem o transfer?',
    resposta:
      'Pode. No pedido existe a opção de ir por conta própria, e aí o que você recebe é só o ingresso.',
    confirmado: true,
  },
  {
    pergunta: 'Preciso estar hospedado na Green Beach?',
    resposta:
      'Não. O transfer atende quem está hospedado na pousada e também quem está em outro lugar do litoral. No pedido você escolhe de onde sai.',
    confirmado: true,
  },
  {
    /**
     * Esta e a pergunta que mais muda o valor do pedido de uma familia, e e
     * a que mais circula errada: tem blog afirmando que crianca abaixo de um
     * metro nao paga. A regra do parque e por IDADE, nunca por altura.
     * [PARQUE] Regulamento Interno e catalogo da loja, 14/10/2026.
     */
    pergunta: 'Criança paga? A partir de que idade?',
    resposta:
      'A regra do parque é por idade, e não por altura. Até 1 ano e 11 meses não paga. De 2 a 4 anos existe um ingresso infantil, mais barato, que o parque oferta em alguns meses do ano. De 5 anos em diante paga o ingresso inteiro. Por isso o pedido pergunta a idade de cada criança: é ela que define o valor.',
    confirmado: true,
  },
  {
    /**
     * [PARQUE] 14/10/2026. Verificado em cinco veiculos e confirmado em
     * fonte primaria: zero mencoes a "Mundo Animal" ou "zoologico" no FAQ e
     * nas 28 paginas do Regulamento. Revendedor que ainda anuncia "com
     * zoologico" esta vendendo o que nao existe, e e por isso que esta
     * pergunta entra na pagina.
     */
    pergunta: 'O parque ainda tem o Mundo Animal, o zoológico?',
    resposta:
      'Não. O Mundo Animal foi encerrado em junho de 2024 e não faz mais parte do parque. Se você vir alguém anunciando ingresso "com zoológico", é informação velha.',
    confirmado: true,
  },
  {
    /** [PARQUE] 14/10/2026. O proprio parque diz isso no site dele. */
    pergunta: 'Vale a pena usar meia-entrada?',
    resposta:
      'Quase sempre não. A meia-entrada do parque tem valor fixo, e o passaporte promocional costuma sair bem abaixo dela. Vale conferir os dois antes de decidir, e é uma das contas que a gente faz com você no WhatsApp.',
    confirmado: true,
  },
  {
    /** [PARQUE] calendario oficial, 14/10/2026. */
    pergunta: 'O parque abre todo dia?',
    resposta:
      'Até 31 de março de 2027, sim, todos os dias. A partir de abril o parque fecha em algumas terças e quartas. O calendário do pedido já bloqueia os dias fechados, então o dia que você conseguir escolher é dia de parque aberto.',
    confirmado: true,
  },
  {
    /** [PARQUE] 14/10/2026. A tabela e por atracao e muda, entao a resposta
     *  aponta para a fonte em vez de copiar numeros que envelhecem. */
    pergunta: 'Tem altura mínima para os brinquedos?',
    resposta:
      'Tem, e varia de atração para atração. O parque publica a tabela completa, brinquedo por brinquedo, no FAQ oficial. Se você me disser a altura das crianças no WhatsApp, eu digo o que elas pegam e o que não pegam antes de você comprar.',
    confirmado: true,
  },
  {
    /** [API DO PARQUE] 5 meses coletados em 14/10/2026. */
    pergunta: 'Compro agora ou mais perto da data?',
    resposta:
      'Agora. O preço do parque sobe conforme o dia chega: dentro da mesma baixa temporada, a diferença entre comprar na semana e comprar com duas semanas de antecedência passou de 50 reais por pessoa. Alta temporada tem preço próprio e mais alto.',
    confirmado: true,
  },
  {
    pergunta: 'Dá para cancelar ou remarcar?',
    resposta: '',
    /** PENDENTE: politica que a Green Beach vai praticar, que pode ser mais
     *  restritiva que a do parque. Precisa sair por escrito da pousada. */
    confirmado: false,
  },
  {
    pergunta: 'E se chover no dia?',
    resposta: '',
    /** PENDENTE: depende da regra do parque e da regra de remarcacao acima. */
    confirmado: false,
  },
  {
    pergunta: 'Como eu recebo o ingresso?',
    resposta: '',
    /** PENDENTE: forma de entrega e prazo. Ver `comoFunciona.entrega`. */
    confirmado: false,
  },
  {
    pergunta: 'Que horas o transfer sai e que horas volta?',
    resposta: '',
    /** PENDENTE: horario por cidade de embarque. */
    confirmado: false,
  },
  {
    pergunta: 'O que levar no dia?',
    resposta: '',
    /** PENDENTE: lista curta, escrita por quem ja acompanhou o passeio. */
    confirmado: false,
  },
]

/* ----------------------------------------------------------- fechamento */

export const fechamento = {
  titulo: ['Vamos montar', 'o seu pedido?'],
  apoio: 'Dia, pessoas e ponto de embarque. O resto a gente responde no WhatsApp.',
  botao: 'Montar meu pedido',
  confirmado: true,
}

/* --------------------------------------------------------------- rodape */

export const rodape = {
  contato: 'Contato',
  pousadaTitulo: 'A pousada',
  /**
   * A linha de transparencia. Ela nao e enfeite juridico: a pagina cita a
   * marca de um parque que nao e dela, e quem le precisa saber em uma frase
   * quem vende e quem opera.
   */
  transparencia:
    'Beto Carrero World é marca e propriedade do parque, em Penha, Santa Catarina. A Pousada & Hotel Green Beach é revendedora autorizada e não opera o parque.',
  /** Descreve como a venda funciona de fato. Nenhuma promessa de prazo de
   *  resposta, porque ninguem mediu esse prazo. */
  aviso:
    'Esta página não processa pagamento. O pedido que você montar vai para o WhatsApp da pousada, e é lá que o valor é fechado.',
  confirmado: true,
}
