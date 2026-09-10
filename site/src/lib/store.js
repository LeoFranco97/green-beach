/**
 * Estado unico da consulta de disponibilidade.
 * O formulario do hero, a barra fixa do mobile e o CTA final leem e escrevem
 * aqui, entao o visitante nunca precisa digitar as datas duas vezes.
 */
import { hoje, deISO, paraISO, noitesEntre } from './dates.js'
import { gerarProtocolo } from './whatsapp.js'

const MAX_ADULTOS = 12
const MAX_CRIANCAS = 8

const estado = {
  checkin: null,
  checkout: null,
  adultos: 2,
  criancas: 0,
  nome: '',
  observacao: '',
  protocolo: gerarProtocolo(),
  tocado: false, // vira true no primeiro envio, para so entao mostrar erro
}

const ouvintes = new Set()

/** Copia rasa do estado, para os componentes nao mutarem por acidente. */
export const lerEstado = () => ({ ...estado })

export const assinar = (fn) => {
  ouvintes.add(fn)
  fn(lerEstado())
  return () => ouvintes.delete(fn)
}

const notificar = () => {
  const snapshot = lerEstado()
  for (const fn of ouvintes) fn(snapshot)
}

export const atualizar = (mudancas) => {
  Object.assign(estado, mudancas)
  if ('adultos' in mudancas) estado.adultos = Math.min(MAX_ADULTOS, Math.max(1, Number(estado.adultos) || 1))
  if ('criancas' in mudancas) estado.criancas = Math.min(MAX_CRIANCAS, Math.max(0, Number(estado.criancas) || 0))
  notificar()
}

/** Define o intervalo garantindo checkout depois do checkin. */
export const definirPeriodo = (checkin, checkout) => {
  estado.checkin = checkin || null
  estado.checkout = checkout || null
  if (estado.checkin && estado.checkout && noitesEntre(estado.checkin, estado.checkout) < 1) {
    estado.checkout = null
  }
  notificar()
}

export const limites = { MAX_ADULTOS, MAX_CRIANCAS }

/**
 * Valida a consulta. Devolve { valido, erros } com a mensagem por campo,
 * em portugues, para ser exibida ao lado do campo que falhou.
 */
export const validar = (dados = lerEstado()) => {
  const erros = {}
  const inicio = hoje()

  if (!dados.checkin) {
    erros.checkin = 'Escolha a data de entrada.'
  } else if (dados.checkin < inicio) {
    erros.checkin = 'A entrada não pode ser antes de hoje.'
  }

  if (!dados.checkout) {
    erros.checkout = 'Escolha a data de saída.'
  } else if (dados.checkin && noitesEntre(dados.checkin, dados.checkout) < 1) {
    erros.checkout = 'A saída precisa ser pelo menos um dia depois da entrada.'
  }

  if (!Number.isFinite(dados.adultos) || dados.adultos < 1) {
    erros.hospedes = 'Informe ao menos um adulto.'
  }
  if (dados.criancas < 0) {
    erros.hospedes = 'Número de crianças inválido.'
  }

  return { valido: Object.keys(erros).length === 0, erros }
}

/** Le o periodo da querystring, para links de campanha ja chegarem preenchidos. */
export const hidratarDaURL = () => {
  const params = new URLSearchParams(window.location.search)
  const entrada = deISO(params.get('checkin') || '')
  const saida = deISO(params.get('checkout') || '')
  const adultos = Number(params.get('adultos'))
  const criancas = Number(params.get('criancas'))

  if (entrada && entrada >= hoje()) estado.checkin = entrada
  if (saida && estado.checkin && noitesEntre(estado.checkin, saida) >= 1) estado.checkout = saida
  if (Number.isFinite(adultos) && adultos >= 1) estado.adultos = Math.min(MAX_ADULTOS, adultos)
  if (Number.isFinite(criancas) && criancas >= 0) estado.criancas = Math.min(MAX_CRIANCAS, criancas)
  notificar()
}

/** Resumo em texto do periodo, usado na barra fixa e no CTA final. */
export const resumoPeriodo = (dados = lerEstado()) => {
  if (!dados.checkin || !dados.checkout) return null
  return { noites: noitesEntre(dados.checkin, dados.checkout), checkin: dados.checkin, checkout: dados.checkout }
}

export const paraQuery = (dados = lerEstado()) => {
  const params = new URLSearchParams()
  if (dados.checkin) params.set('checkin', paraISO(dados.checkin))
  if (dados.checkout) params.set('checkout', paraISO(dados.checkout))
  params.set('adultos', String(dados.adultos))
  params.set('criancas', String(dados.criancas))
  return params.toString()
}
