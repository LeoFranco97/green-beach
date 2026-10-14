/**
 * CATALOGO DO CONFIGURADOR
 * ---------------------------------------------------------------------------
 * Ingresso, adicional, ponto de embarque e calendario do parque.
 * Separado de oferta.js de proposito: aqui mora o que tem PRECO, e preco tem
 * regra propria.
 *
 * REGRA DE PRECO, sem excecao:
 *   todo valor carrega `fonte` (URL) e `coletadoEm` (data da coleta).
 *   item sem as duas coisas fica `confirmado: false` e NAO renderiza.
 *
 * ===========================================================================
 * O FATO QUE MANDA NESTE ARQUIVO
 * ===========================================================================
 * O preco do parque NAO E UM NUMERO, e uma curva por data. O passaporte de
 * um dia foi de R$ 119,90 a R$ 189,90 entre outubro e dezembro de 2026, e
 * trava em R$ 249,90 em janeiro de 2027. Comprar com uma semana de
 * antecedencia, dentro da MESMA baixa temporada, chegou a custar R$ 50 a
 * menos que comprar no dia.
 *
 * Por isso o preco aqui e uma tabela por mes e nao um campo. O configurador
 * le o mes do dia escolhido. Mes sem preco coletado nao vira chute: o resumo
 * escreve "Orcamento no WhatsApp" e a conversa resolve.
 *
 * O valor guardado e o MENOR preco observado no mes, porque a pagina promete
 * "a partir de" e nada alem disso.
 *
 * ATENCAO, A DECISAO QUE FALTA: estes sao os precos de venda ONLINE DO
 * PARQUE, coletados da API publica do e-commerce dele. NAO sao a tabela de
 * revenda da Green Beach, que ainda nao existe. Enquanto a condicao comercial
 * nao for fechada, a pagina esta ancorando no preco do parque, e o
 * atendimento precisa fechar no mesmo valor ou abaixo. Se a Green Beach for
 * vender acima disso, estes numeros TEM que subir antes de publicar, senao a
 * primeira resposta no WhatsApp e uma correcao para cima, que e a pior
 * maneira de comecar uma venda.
 *
 * Fonte completa, com as 627 linhas de apuracao:
 *   ../../pesquisa/dossie-beto-carrero.md
 */

const FONTE_API = 'https://www.betocarrero.com.br (API publica do e-commerce)'
const COLETA = '14/10/2026'

/** Formata um numero em real, sem centavo quando o centavo e zero. */
export const emReais = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(valor)

/** Chave de mes "AAAA-MM" a partir de um Date. */
export const chaveDoMes = (data) =>
  data ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}` : ''

/**
 * Os ingressos, na ordem em que aparecem.
 *
 * `recomendado: true` em no maximo um: escolha sem recomendacao trava a
 * decisao, e duas recomendacoes nao recomendam nada.
 *
 * `porMes`         menor preco adulto observado no mes.
 * `infantilPorMes` menor preco do ingresso infantil, que o parque vende
 *                  apenas para a faixa de 2 a 4 anos, e apenas em alguns
 *                  meses. Mes sem oferta infantil significa que a crianca
 *                  dessa faixa paga o ingresso cheio, e isso NAO esta
 *                  confirmado, entao vira orcamento no atendimento.
 */
export const ingressos = [
  {
    id: 'passaporte-1-dia',
    nome: 'Passaporte 1 dia',
    resumo: 'O dia inteiro no parque, com os shows e os brinquedos inclusos.',
    inclui: [
      'Acesso a todas as áreas do parque',
      'Shows e atrações do dia',
      'Data marcada na compra',
    ],
    recomendado: true,
    porMes: {
      '2026-10': 119.90,
      '2026-11': 129.90,
      '2026-12': 129.90,
      '2027-01': 249.90,
      '2027-07': 159.90,
    },
    infantilPorMes: {
      '2026-11': 77.90,
      '2026-12': 78.90,
    },
    fonte: FONTE_API,
    coletadoEm: COLETA,
    confirmado: true,
  },
  {
    id: 'passaporte-2-dias',
    nome: 'Passaporte 2 dias',
    resumo: 'Dois dias seguidos. Sai mais barato por dia e tira a correria.',
    inclui: [
      'Dois dias de parque',
      'Dá para ver o que não coube no primeiro dia',
      'Datas marcadas na compra',
    ],
    recomendado: false,
    porMes: {
      '2026-10': 218.90,
      '2026-11': 228.90,
      '2026-12': 228.90,
      '2027-01': 348.90,
      '2027-07': 269.90,
    },
    infantilPorMes: {
      '2026-11': 131.90,
      '2026-12': 137.90,
    },
    fonte: FONTE_API,
    coletadoEm: COLETA,
    confirmado: true,
  },
]

/**
 * Adicionais. `porPessoa` decide como o resumo soma.
 *
 * Tres e o teto deste bloco. O parque vende mais de vinte adicionais, e
 * listar vinte caixas de marcar transforma o passo opcional no passo mais
 * longo da pagina. O resto sai no atendimento, que e onde cabe.
 */
export const extras = [
  {
    id: 'fast-pass',
    nome: 'Fast Pass',
    descricao: 'Fila preferencial em 11 atrações, no mesmo dia do ingresso.',
    preco: 150.00,
    porPessoa: true,
    fonte: FONTE_API,
    coletadoEm: COLETA,
    confirmado: true,
  },
  {
    id: 'estacionamento',
    nome: 'Estacionamento',
    descricao: 'Por veículo, não por pessoa. Quem vai de transfer não precisa.',
    preco: 70.00,
    porPessoa: false,
    fonte: FONTE_API,
    coletadoEm: COLETA,
    confirmado: true,
  },
  {
    id: 'excalibur',
    nome: 'Excalibur com lanche',
    descricao: 'O show do castelo, com lanche incluso.',
    preco: 119.00,
    porPessoa: true,
    fonte: FONTE_API,
    coletadoEm: COLETA,
    confirmado: true,
  },
]

/**
 * Pontos de embarque do transfer.
 *
 * Os pontos sao decisao de operacao da Green Beach, entao vao ao ar. O PRECO
 * de cada trecho nao existe ainda, e por isso vem `null`: o configurador
 * escreve "valor no atendimento" no lugar do numero, mostra o total dos
 * ingressos assim mesmo, e avisa em letra de apoio que o transfer ainda vai
 * entrar. Esconder o total inteiro por causa do transfer jogaria fora a
 * ancora de preco que a pagina toda construiu.
 *
 * `sem-transfer` existe sempre e nunca some: tirar a opcao de ir por conta
 * faz o visitante que tem carro abandonar a pagina.
 *
 * A lista e curta de proposito. Nao entra cidade onde ninguem confirmou que
 * o transfer para: prometer embarque em Bombinhas sem saber se o carro vai
 * ate la e vender o que nao se tem.
 */
export const embarques = [
  {
    id: 'itapema',
    nome: 'Itapema',
    cidade: 'Itapema',
    detalhe: 'Centro ou Meia Praia, combinamos o ponto',
    preco: null,
    confirmado: true,
  },
  {
    id: 'hospede',
    nome: 'Sou hóspede da Green Beach',
    cidade: 'Itapema',
    detalhe: 'Embarque na porta da pousada, na Rua 141',
    preco: null,
    confirmado: true,
  },
  {
    id: 'outro-ponto',
    nome: 'Estou em outra cidade do litoral',
    cidade: '',
    detalhe: 'Diga onde no WhatsApp e a gente vê se dá para buscar',
    preco: null,
    confirmado: true,
  },
  {
    id: 'sem-transfer',
    nome: 'Vou por conta própria',
    cidade: '',
    detalhe: 'Compro só o ingresso',
    preco: 0,
    confirmado: true,
  },
]

/**
 * Dias em que o parque nao abre, em ISO "AAAA-MM-DD".
 *
 * De 14/10/2026 a 31/03/2027 o parque abre TODOS OS DIAS, e isso e argumento
 * de venda, nao detalhe: nenhuma data da alta temporada precisa de ressalva.
 * As paradas voltam em abril de 2027, sempre em terca ou quarta.
 *
 * De agosto de 2027 em diante nao ha dia liberado para venda. Isso NAO e
 * fechamento, e calendario comercial ainda nao aberto, e por isso nao entra
 * nesta lista: bloquear o dia faria o calendario mentir. Quem o limite de 14
 * meses do configurador levar ate la cai no atendimento.
 */
export const calendarioParque = {
  fechados: [
    '2027-04-06', '2027-04-07', '2027-04-13', '2027-04-14', '2027-04-27', '2027-04-28',
    '2027-05-11', '2027-05-12', '2027-05-18', '2027-05-19',
    '2027-06-01', '2027-06-02', '2027-06-08', '2027-06-09', '2027-06-15',
    '2027-06-16', '2027-06-22', '2027-06-23', '2027-06-29', '2027-06-30',
  ],
  observacao: 'O parque abre todos os dias até 31 de março de 2027.',
  fonte: 'https://www.betocarrero.com.br, calendário de funcionamento',
  coletadoEm: COLETA,
  confirmado: true,
}

/** So o que tem dado confirmado chega ao visitante. */
export const ingressosVisiveis = () => ingressos.filter((i) => i.confirmado)
export const extrasVisiveis = () => extras.filter((e) => e.confirmado)
export const embarquesVisiveis = () => embarques.filter((e) => e.confirmado)

/**
 * Menor preco adulto de um ingresso no mes da data escolhida.
 * Sem data, devolve o menor preco de toda a tabela, que e a ancora honesta
 * de um "a partir de" antes de o visitante escolher o dia.
 * Mes sem preco coletado devolve null, e null vira orcamento, nunca chute.
 */
export const precoAdultoEm = (ingresso, data) => {
  if (!ingresso) return null
  if (!data) {
    const todos = Object.values(ingresso.porMes)
    return todos.length ? Math.min(...todos) : null
  }
  const valor = ingresso.porMes[chaveDoMes(data)]
  return typeof valor === 'number' ? valor : null
}

/** Mesma logica para o ingresso infantil de 2 a 4 anos. */
export const precoInfantilEm = (ingresso, data) => {
  if (!ingresso || !data) return null
  const valor = ingresso.infantilPorMes?.[chaveDoMes(data)]
  return typeof valor === 'number' ? valor : null
}

/**
 * A menor ancora da pagina inteira, para o hero.
 * Sai da propria tabela em vez de ser digitada a mao, entao nao existe a
 * chance de o hero prometer um numero que o configurador nao pratica.
 */
export const ancoraGeral = () => {
  const valores = ingressosVisiveis().flatMap((i) => Object.values(i.porMes))
  return valores.length ? Math.min(...valores) : null
}
