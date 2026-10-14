/**
 * Dados estruturados.
 *
 * Duas regras que nao se negociam aqui:
 *
 * 1. SEM `aggregateRating`. A nota que circula sobre este endereco e da
 *    gestao anterior da casa, e declarar ela como nossa seria mentir para o
 *    Google tambem.
 *
 * 2. Pergunta sem resposta NAO entra no FAQPage. FAQPage com `acceptedAnswer`
 *    vazio e desqualificado, e "confirme pelo WhatsApp" nao e resposta.
 */
import { config } from '../config.js'
import { pousada, endereco, contato, parque, duvidas } from '../data/oferta.js'
import { ingressosVisiveis } from '../data/produtos.js'

/** A oferta so e declarada quando existe preco publicado de verdade. */
const montarOfertas = () => {
  const itens = ingressosVisiveis().filter((i) => typeof i.precoAdulto === 'number')
  if (itens.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Ingresso ${parque.nome} com transfer de Itapema`,
    description:
      `Ingresso do ${parque.nome}, em ${parque.cidade}, ${parque.estado}, vendido pela ` +
      `${pousada.nome} com opcao de transfer saindo de Itapema e regiao.`,
    brand: { '@type': 'Brand', name: parque.nome },
    offers: itens.map((i) => ({
      '@type': 'Offer',
      name: i.nome,
      price: i.precoAdulto,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: config.siteUrl,
      seller: { '@type': 'Organization', name: pousada.nome },
    })),
  }
}

const montarFAQ = () => {
  const respondidas = duvidas.filter((d) => d.confirmado && d.resposta)
  if (respondidas.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: respondidas.map((d) => ({
      '@type': 'Question',
      name: d.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: d.resposta },
    })),
  }
}

const montarNegocio = () => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: pousada.nome,
  url: config.siteHotel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: endereco.logradouro,
    addressLocality: endereco.cidade,
    addressRegion: endereco.estado,
    addressCountry: endereco.pais,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -27.098438,
    longitude: -48.614563,
  },
  sameAs: [contato.instagramUrl],
})

export const injetarSchema = () => {
  for (const dado of [montarNegocio(), montarOfertas(), montarFAQ()]) {
    if (!dado) continue
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(dado)
    document.head.appendChild(script)
  }
}
