/**
 * Estado unico do pedido de ingresso.
 *
 * O configurador, a barra fixa do mobile e o CTA final leem e escrevem aqui,
 * entao o visitante nunca escolhe a mesma coisa duas vezes.
 */
import { deISO, paraISO, hoje } from './dates.js'
import { gerarProtocolo } from './whatsapp.js'

const MAX_ADULTOS = 20
const MAX_CRIANCAS = 12

const estado = {
  /** @type {Date|null} dia da visita ao parque */
  data: null,
  adultos: 2,
  criancas: 0,
  /** @type {string[]} idade de cada crianca, na ordem */
  idades: [],
  /** id do ingresso escolhido em data/produtos.js */
  ingressoId: '',
  /** @type {string[]} ids dos adicionais marcados */
  extras: [],
  /** id do ponto de embarque, ou 'sem-transfer' */
  embarqueId: '',
  nome: '',
  observacao: '',
  protocolo: gerarProtocolo(),
  /** vira true no primeiro toque, e e o que libera a barra fixa do mobile */
  tocado: false,
}

const ouvintes = new Set()

/** Copia rasa, para componente nao mutar o estado por acidente. */
export const lerEstado = () => ({ ...estado, idades: [...estado.idades], extras: [...estado.extras] })

export const assinar = (fn) => {
  ouvintes.add(fn)
  fn(lerEstado())
  return () => ouvintes.delete(fn)
}

const notificar = () => {
  const copia = lerEstado()
  for (const fn of ouvintes) fn(copia)
}

const limitar = (valor, min, max) => Math.min(max, Math.max(min, Number(valor) || min))

export const atualizar = (mudancas = {}) => {
  Object.assign(estado, mudancas)

  if ('adultos' in mudancas) estado.adultos = limitar(estado.adultos, 1, MAX_ADULTOS)
  if ('criancas' in mudancas) {
    estado.criancas = limitar(estado.criancas, 0, MAX_CRIANCAS)
    // A lista de idades acompanha a contagem: sobra some, falta entra vazia.
    estado.idades = Array.from({ length: estado.criancas }, (_, i) => estado.idades[i] || '')
  }

  estado.tocado = true
  notificar()
}

/**
 * Aplica um valor PADRAO, sem marcar o pedido como tocado.
 *
 * Existe por causa da barra fixa do mobile: ela acende quando `tocado` vira
 * true. O configurador ja nasce com um ingresso e um ponto de embarque
 * marcados, e se essas duas escolhas automaticas contassem como toque, a
 * barra apareceria antes de o visitante fazer qualquer coisa, que e
 * exatamente a barra que ele aprende a ignorar.
 */
export const definirPadrao = (mudancas = {}) => {
  Object.assign(estado, mudancas)
  notificar()
}

/** Liga ou desliga um adicional sem o componente precisar mexer no array. */
export const alternarExtra = (id) => {
  const i = estado.extras.indexOf(id)
  if (i >= 0) estado.extras.splice(i, 1)
  else estado.extras.push(id)
  estado.tocado = true
  notificar()
}

/** Grava a idade de uma crianca pela posicao. */
export const definirIdade = (indice, valor) => {
  estado.idades[indice] = String(valor || '').slice(0, 2)
  estado.tocado = true
  notificar()
}

/**
 * Le a data que veio na URL (?data=2026-12-20), para anuncio e post do
 * Instagram caírem com o dia já escolhido.
 */
export const hidratarDaURL = () => {
  const params = new URLSearchParams(window.location.search)
  const data = deISO(params.get('data') || '')
  if (data && data >= hoje()) estado.data = data

  const pessoas = Number(params.get('adultos'))
  if (Number.isFinite(pessoas) && pessoas > 0) estado.adultos = limitar(pessoas, 1, MAX_ADULTOS)

  const ingresso = params.get('ingresso')
  if (ingresso) estado.ingressoId = ingresso.slice(0, 40)

  notificar()
}

/** Chave ISO do dia escolhido, para comparar com o calendario do parque. */
export const dataISO = () => paraISO(estado.data)
