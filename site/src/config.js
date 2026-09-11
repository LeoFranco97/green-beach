/**
 * CONFIGURACAO DO SITE
 * ---------------------------------------------------------------------------
 * Este e o unico arquivo que precisa ser editado para colocar o site no ar.
 * Nada de numero de telefone, dominio ou ID de analytics espalhado pelo codigo.
 *
 * Os valores podem vir de variaveis de ambiente (arquivo .env na raiz do site)
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
   * WhatsApp oficial da pousada, formato E.164 sem sinais: 55 + DDD + numero.
   * (47) 99794-8332, publicado pela propria pousada no Instagram como canal
   * de reserva e confirmado no Facebook da operacao no mesmo endereco.
   */
  whatsappNumber: read('VITE_WHATSAPP_NUMBER', '5547997948332'),

  /**
   * Dominio final, sem barra no fim. Usado em canonical, OG e sitemap.
   * Registrado em 11/09/2026 no registro.br, no CNPJ do grupo, com DNS na
   * Hostinger. O apex e o endereco canonico: www redireciona para ele.
   */
  siteUrl: read('VITE_SITE_URL', 'https://greenbeach.com.br'),

  /** ID de medicao do Google Analytics 4 (G-XXXXXXXXXX). Vazio desliga o GA. */
  gaMeasurementId: read('VITE_GA_MEASUREMENT_ID', ''),

  /** Pixel da Meta. Vazio desliga. */
  metaPixelId: read('VITE_META_PIXEL_ID', ''),

  /** Mapa. A busca por nome funciona sem chave de API. */
  map: {
    /** Endereco exibido e usado como texto de busca no mapa. */
    query: read('VITE_MAP_QUERY', 'Pousada e Hotel Green Beach, Rua 141, 58, Centro, Itapema, SC, 88220-000'),
    /** Place ID da ficha do Google, para a rota cair no pino certo. */
    placeId: read('VITE_MAP_PLACE_ID', 'ChIJCbzvCqOx2JQRMgYOV9J4-ys'),
    /** Nivel de zoom do mapa incorporado. */
    zoom: 17,
  },
}

/** URL do mapa incorporado, sem chave de API. */
export const mapEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(config.map.query)}&z=${config.map.zoom}&output=embed`

/** URL para abrir a rota no app do Google Maps, ancorada no Place ID. */
export const mapDirectionsUrl = () => {
  const params = new URLSearchParams({ api: '1', destination: config.map.query })
  if (config.map.placeId) params.set('destination_place_id', config.map.placeId)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}
