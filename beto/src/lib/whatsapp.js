/**
 * Monta o link do WhatsApp com o pedido de ingresso inteiro ja escrito.
 *
 * A regra de conversao desta pagina: o visitante nunca digita no WhatsApp.
 * Ele monta o pedido aqui, na pagina, e o unico gesto que sobra para ele e
 * apertar enviar. Mensagem que o cliente precisa escrever e mensagem que ele
 * nao envia.
 *
 * Regra da casa: o numero vive apenas em config.js, nunca aqui nem no HTML.
 */
import { config } from '../config.js'
import { formatoLongo } from './dates.js'

const NAO_INFORMADA = 'não informada'
const NAO_INFORMADO = 'não informado'

/** Le os parametros de campanha da URL, para o lead chegar com origem. */
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
 * Identificador curto e legivel do pedido, para o atendente citar e para
 * cruzar o lead com o analytics depois. Ex.: BC-M4K2-7QP1
 */
export const gerarProtocolo = () => {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bloco = () =>
    Array.from({ length: 4 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('')
  return `BC-${bloco()}-${bloco()}`
}

/** Limpa texto livre para nao quebrar a mensagem nem carregar lixo. */
const limpar = (texto, limite = 400) =>
  typeof texto === 'string' ? texto.replace(/\s+/g, ' ').trim().slice(0, limite) : ''

/** Linha de pessoas, sempre somando, porque e o que define o orcamento. */
const linhaPessoas = ({ adultos = 2, criancas = 0, idadesCriancas = [] }) => {
  const total = adultos + criancas
  const partes = [`${adultos} adulto${adultos === 1 ? '' : 's'}`]
  if (criancas > 0) {
    const idades = idadesCriancas.filter(Boolean).join(', ')
    partes.push(`${criancas} criança${criancas === 1 ? '' : 's'}${idades ? ` (${idades})` : ''}`)
  }
  return `${partes.join(' e ')} — total ${total}`
}

/**
 * Monta o corpo da mensagem em texto puro.
 *
 * @param {object} pedido
 * @param {Date|null} pedido.data        Dia da visita ao parque.
 * @param {number}    pedido.adultos
 * @param {number}    pedido.criancas
 * @param {string[]} [pedido.idadesCriancas]
 * @param {string}   [pedido.ingresso]   Nome do ingresso escolhido.
 * @param {string[]} [pedido.extras]     Adicionais marcados.
 * @param {string}   [pedido.transfer]   Ponto de embarque, ou vazio se nao quer.
 * @param {string}   [pedido.hospedagem] Se e hospede, ou quer diária junto.
 * @param {string}   [pedido.nome]
 * @param {string}   [pedido.observacao]
 * @param {string}   [pedido.origem]     De onde partiu o clique.
 * @param {string}   [pedido.protocolo]
 */
export const montarMensagem = (pedido) => {
  const {
    data = null,
    adultos = 2,
    criancas = 0,
    idadesCriancas = [],
    ingresso = '',
    extras = [],
    transfer = '',
    hospedagem = '',
    nome = '',
    observacao = '',
    origem = 'site',
    protocolo = gerarProtocolo(),
  } = pedido || {}

  const linhas = [
    'Olá! Quero comprar ingresso do Beto Carrero pela Green Beach.',
    '',
    `Dia da visita: ${data ? formatoLongo(data) : NAO_INFORMADA}`,
    `Pessoas: ${linhaPessoas({ adultos, criancas, idadesCriancas })}`,
    `Ingresso: ${limpar(ingresso, 80) || NAO_INFORMADO}`,
  ]

  if (extras.length > 0) linhas.push(`Adicionais: ${extras.map((e) => limpar(e, 60)).join(', ')}`)
  linhas.push(`Transfer: ${limpar(transfer, 80) || 'não quero, vou por conta'}`)
  if (hospedagem) linhas.push(`Hospedagem: ${limpar(hospedagem, 80)}`)

  linhas.push(
    `Nome: ${limpar(nome, 80) || NAO_INFORMADO}`,
    `Observação: ${limpar(observacao) || NAO_INFORMADA}`,
    '',
    `Pedido: ${protocolo}`,
    `Origem: ${limpar(origem, 40)}`,
    `Página: ${window.location.origin}${window.location.pathname}`,
  )

  const utmTexto = Object.entries(lerUTMs())
    .map(([chave, valor]) => `${chave}=${valor}`)
    .join(' | ')
  if (utmTexto) linhas.push(`Campanha: ${utmTexto}`)

  return linhas.join('\n')
}

/** Monta a URL final do wa.me com a mensagem codificada. */
export const montarLinkWhatsApp = (pedido) =>
  `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(montarMensagem(pedido))}`
