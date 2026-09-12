/**
 * Camada fina de analytics.
 * Todos os eventos passam por aqui. Se nenhum provedor estiver configurado,
 * os eventos ficam so no dataLayer e no console em modo dev, sem quebrar nada.
 */
import { config } from '../config.js'

/** Nomes dos eventos, centralizados para nao existir string solta no codigo. */
export const EVENTOS = {
  INICIO_CONSULTA: 'consulta_iniciada',
  DATAS_SELECIONADAS: 'datas_selecionadas',
  HOSPEDES_ALTERADOS: 'hospedes_alterados',
  GALERIA_ABERTA: 'galeria_aberta',
  WHATSAPP_CLIQUE: 'whatsapp_clique',
  ACOMODACAO_CTA: 'acomodacao_cta',
  MAPA_ABERTO: 'mapa_aberto',
}

window.dataLayer = window.dataLayer || []

let gaCarregado = false

/** Injeta o gtag.js apenas se houver ID configurado. */
export const iniciarAnalytics = () => {
  if (!config.gaMeasurementId || gaCarregado) return
  gaCarregado = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`
  document.head.appendChild(script)

  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', config.gaMeasurementId, { send_page_view: true })
}

/**
 * Dispara um evento.
 * @param {string} nome  Use as constantes de EVENTOS.
 * @param {object} dados Propriedades adicionais, sempre serializaveis.
 */
export const rastrear = (nome, dados = {}) => {
  const carga = { evento: nome, ...dados }
  window.dataLayer.push({ event: nome, ...dados })

  if (typeof window.gtag === 'function') window.gtag('event', nome, dados)
  if (typeof window.fbq === 'function' && nome === EVENTOS.WHATSAPP_CLIQUE) {
    window.fbq('track', 'Contact', dados)
  }
  if (import.meta.env.DEV) console.info('[analytics]', carga)
}
