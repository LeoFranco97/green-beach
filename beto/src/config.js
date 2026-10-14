/**
 * CONFIGURACAO DA LANDING DE INGRESSOS
 * ---------------------------------------------------------------------------
 * Unico arquivo que precisa ser editado para colocar a pagina no ar.
 * Nada de numero de telefone, dominio ou ID de analytics espalhado pelo codigo.
 *
 * Os valores podem vir de variaveis de ambiente (.env na raiz de beto/)
 * ou dos padroes abaixo. Veja .env.example.
 */

const env = import.meta.env

/** Le uma variavel de ambiente com fallback. */
const read = (key, fallback) => {
  const value = env?.[key]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback
}

export const config = {
  /**
   * WhatsApp que recebe o pedido de ingresso, formato E.164 sem sinais.
   * Padrao: o mesmo canal da pousada, (47) 99794-8332. Se a venda de
   * ingresso tiver atendente proprio, troque aqui e so aqui.
   */
  whatsappNumber: read('VITE_WHATSAPP_NUMBER', '5547997948332'),

  /** Endereco publico desta pagina, sem barra no fim. */
  siteUrl: read('VITE_SITE_URL', 'https://greenbeach.com.br/beto-carrero'),

  /** Site institucional da pousada, para o link de volta. */
  siteHotel: read('VITE_SITE_HOTEL', 'https://greenbeach.com.br'),

  /** ID de medicao do Google Analytics 4 (G-XXXXXXXXXX). Vazio desliga. */
  gaMeasurementId: read('VITE_GA_MEASUREMENT_ID', ''),

  /** Pixel da Meta. Vazio desliga. */
  metaPixelId: read('VITE_META_PIXEL_ID', ''),
}
