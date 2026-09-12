/**
 * Monta o link do WhatsApp com a mensagem completa da consulta.
 * Regra da casa: o numero vive apenas em config.js, nunca aqui nem no HTML.
 */
import { config } from '../config.js'
import { formatoLongo, noitesEntre, rotuloNoites } from './dates.js'

const NAO_INFORMADA = 'não informada'
const NAO_INFORMADO = 'não informado'

/** Le utm_source, utm_medium, utm_campaign, utm_term e utm_content da URL. */
export const lerUTMs = () => {
  const params = new URLSearchParams(window.location.search)
  const utms = {}
  for (const chave of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const valor = params.get(chave)
    if (valor) utms[chave] = valor.slice(0, 120)
  }
  return utms
}

/**
 * Identificador curto e legivel da consulta, para a pousada citar no
 * atendimento e para cruzar o lead com o analytics. Ex.: GB-M4K2-7QP1
 */
export const gerarProtocolo = () => {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bloco = () =>
    Array.from({ length: 4 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('')
  return `GB-${bloco()}-${bloco()}`
}

/** Limpa texto livre para nao quebrar a mensagem nem carregar lixo. */
const limpar = (texto, limite = 400) =>
  typeof texto === 'string' ? texto.replace(/\s+/g, ' ').trim().slice(0, limite) : ''

/**
 * Monta o corpo da mensagem em texto puro.
 * @param {object} consulta
 * @param {Date|null} consulta.checkin
 * @param {Date|null} consulta.checkout
 * @param {number} consulta.adultos
 * @param {number} consulta.criancas
 * @param {string} [consulta.acomodacao]
 * @param {string} [consulta.nome]
 * @param {string} [consulta.observacao]
 * @param {string} [consulta.origem] De onde partiu o clique (hero, acomodacao, cta-final...)
 * @param {string} [consulta.protocolo]
 */
export const montarMensagem = (consulta) => {
  const {
    checkin = null,
    checkout = null,
    adultos = 2,
    criancas = 0,
    acomodacao = '',
    nome = '',
    observacao = '',
    origem = 'site',
    protocolo = gerarProtocolo(),
  } = consulta || {}

  const noites = noitesEntre(checkin, checkout)
  const utms = lerUTMs()

  const linhas = [
    'Olá! Vim pelo site da Pousada Green Beach e gostaria de consultar disponibilidade.',
    '',
    `Check-in: ${checkin ? formatoLongo(checkin) : NAO_INFORMADA}`,
    `Check-out: ${checkout ? formatoLongo(checkout) : NAO_INFORMADA}`,
  ]

  if (noites > 0) linhas.push(`Período: ${rotuloNoites(noites)}`)

  linhas.push(
    `Adultos: ${adultos}`,
    `Crianças: ${criancas}`,
    `Acomodação: ${limpar(acomodacao, 80) || NAO_INFORMADA}`,
    `Nome: ${limpar(nome, 80) || NAO_INFORMADO}`,
    `Observação: ${limpar(observacao) || NAO_INFORMADA}`,
    '',
    `Consulta: ${protocolo}`,
    `Origem: ${limpar(origem, 40)}`,
    `Página: ${window.location.origin}${window.location.pathname}`,
  )

  const utmTexto = Object.entries(utms)
    .map(([chave, valor]) => `${chave}=${valor}`)
    .join(' | ')
  if (utmTexto) linhas.push(`Campanha: ${utmTexto}`)

  return linhas.join('\n')
}

/** Monta a URL final do wa.me com a mensagem codificada. */
export const montarLinkWhatsApp = (consulta) =>
  `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(montarMensagem(consulta))}`
