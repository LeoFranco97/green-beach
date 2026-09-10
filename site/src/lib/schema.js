/**
 * Dados estruturados Schema.org.
 * Tipo LodgingBusiness, que e o correto para pousada e hotel.
 * So entram campos confirmados: marcar dado incerto em Schema e pedir
 * penalidade do Google e frustracao do hospede.
 */
import { pousada } from '../data/pousada.js'
import { prepararFotos } from './imagens.js'
import { config } from '../config.js'
import { montarDuvidas } from '../components/duvidas.js'

const MAPA_COMODIDADE = {
  wifi: 'Wi-Fi',
  piscina: 'Piscina',
  cafe: 'Cafe da manha',
  ar: 'Ar-condicionado',
  tv: 'TV',
  frigobar: 'Frigobar',
  estacionamento: 'Estacionamento',
  churrasco: 'Churrasqueira',
}

export const montarSchema = () => {
  const { endereco, contato, operacao, avaliacoes, acomodacoes, comodidades, fotos } = pousada

  const negocio = {
    '@type': 'LodgingBusiness',
    '@id': `${config.siteUrl}/#pousada`,
    name: pousada.nome,
    url: config.siteUrl,
    description: pousada.seo.descricao,
    priceRange: '$$',
  }

  const fotosProntas = prepararFotos(fotos)
  if (fotosProntas.length) {
    negocio.image = fotosProntas.slice(0, 6).map((f) => `${config.siteUrl}${f.src}`)
  }
  if (contato.telefoneLink) negocio.telephone = contato.telefoneLink
  if (contato.email) negocio.email = contato.email
  if (contato.instagramUrl) negocio.sameAs = [contato.instagramUrl]

  if (endereco.confirmado) {
    negocio.address = {
      '@type': 'PostalAddress',
      streetAddress: endereco.logradouro,
      addressLocality: endereco.cidade,
      addressRegion: endereco.estado,
      postalCode: endereco.cep,
      addressCountry: endereco.pais,
    }
    if (endereco.coordenadas.lat && endereco.coordenadas.lng) {
      negocio.geo = {
        '@type': 'GeoCoordinates',
        latitude: endereco.coordenadas.lat,
        longitude: endereco.coordenadas.lng,
      }
    }
  }

  if (operacao.checkin.confirmado && operacao.checkin.horario) negocio.checkinTime = operacao.checkin.horario
  if (operacao.checkout.confirmado && operacao.checkout.horario) negocio.checkoutTime = operacao.checkout.horario

  if (comodidades.length) {
    negocio.amenityFeature = comodidades.map((c) => ({
      '@type': 'LocationFeatureSpecification',
      name: MAPA_COMODIDADE[c.icone] || c.nome,
      value: true,
    }))
  }

  if (avaliacoes.confirmado && avaliacoes.nota && avaliacoes.total) {
    negocio.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avaliacoes.nota,
      reviewCount: avaliacoes.total,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (acomodacoes.length) {
    negocio.containsPlace = acomodacoes.map((a) => {
      const quarto = { '@type': 'HotelRoom', name: a.nome }
      if (a.ocupacaoMaxima) {
        quarto.occupancy = { '@type': 'QuantitativeValue', maxValue: a.ocupacaoMaxima, unitCode: 'C62' }
      }
      if (a.descricao) quarto.description = a.descricao
      return quarto
    })
  }

  const respondidas = montarDuvidas().filter((d) => d.respondida)
  const faq = respondidas.length
    ? {
        '@type': 'FAQPage',
        '@id': `${config.siteUrl}/#duvidas`,
        mainEntity: respondidas.map((d) => ({
          '@type': 'Question',
          name: d.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: d.resposta },
        })),
      }
    : null

  const site = {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#site`,
    url: config.siteUrl,
    name: pousada.nome,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${config.siteUrl}/#pousada` },
  }

  return { '@context': 'https://schema.org', '@graph': [negocio, site, faq].filter(Boolean) }
}

/** Injeta o JSON-LD no head. */
export const injetarSchema = () => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(montarSchema())
  document.head.appendChild(script)
}
