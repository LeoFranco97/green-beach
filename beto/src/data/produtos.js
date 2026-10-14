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
 * Preco de parque muda e preco errado numa pagina de venda nao e detalhe de
 * design, e processo. Quando o parque reajustar, a correcao acontece aqui e
 * so aqui.
 *
 * Fonte desta versao: ../../pesquisa/dossie-beto-carrero.md
 */

/** Formata um numero em real, sem centavo quando o centavo e zero. */
export const emReais = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(valor)

/**
 * Os ingressos, na ordem em que aparecem.
 * `recomendado: true` em no maximo um: escolha sem recomendacao trava a
 * decisao, e duas recomendacoes nao recomendam nada.
 */
export const ingressos = [
  {
    id: 'um-dia',
    nome: '',
    resumo: '',
    inclui: [],
    naoInclui: [],
    precoAdulto: null,
    precoCrianca: null,
    recomendado: true,
    fonte: '',
    coletadoEm: '',
    confirmado: false, // PENDENTE: nome oficial e preco vigente do ingresso de 1 dia
  },
]

/** Adicionais do parque. `porPessoa` decide como o resumo soma. */
export const extras = [
  {
    id: 'fila-rapida',
    nome: '',
    descricao: '',
    preco: null,
    porPessoa: true,
    fonte: '',
    coletadoEm: '',
    confirmado: false, // PENDENTE: nome e preco do produto de fila rapida
  },
]

/**
 * Pontos de embarque do transfer.
 * `sem-transfer` existe sempre e nunca some: tirar a opcao de ir por conta
 * faz o visitante que tem carro abandonar a pagina.
 */
export const embarques = [
  {
    id: 'sem-transfer',
    nome: 'Vou por conta própria',
    cidade: '',
    detalhe: 'Compro só o ingresso',
    preco: 0,
    confirmado: true,
  },
  {
    id: 'hospede',
    nome: 'Sou hóspede da Green Beach',
    cidade: 'Itapema',
    detalhe: '',
    preco: null,
    confirmado: false, // PENDENTE: preco do transfer para hospede
  },
]

/**
 * Dias em que o parque nao abre, em ISO "YYYY-MM-DD".
 * Com a lista vazia o calendario libera todos os dias, que e o comportamento
 * seguro: melhor o atendente corrigir um dia do que o calendario bloquear um
 * dia que estava aberto e matar a venda.
 */
export const calendarioParque = {
  fechados: [],
  observacao: '',
  fonte: '',
  coletadoEm: '',
  confirmado: false, // PENDENTE: calendario oficial de funcionamento 2026/2027
}

/** Ancora de preco do hero e do resumo. */
export const ancora = {
  valor: null,
  rotulo: 'por pessoa',
  fonte: '',
  coletadoEm: '',
  confirmado: false, // PENDENTE: menor preco real que a Green Beach pratica
}

/** So o que tem dado confirmado chega ao visitante. */
export const ingressosVisiveis = () => ingressos.filter((i) => i.confirmado)
export const extrasVisiveis = () => extras.filter((e) => e.confirmado)
export const embarquesVisiveis = () => embarques.filter((e) => e.confirmado)
