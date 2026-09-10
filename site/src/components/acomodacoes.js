/**
 * Acomodacoes.
 * Cada card leva a foto, capacidade, camas, comodidades e um CTA que abre o
 * WhatsApp ja com o nome daquela acomodacao na mensagem.
 */
import { el } from '../lib/dom.js'
import { icone } from '../lib/icones.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'
import { lerEstado, validar, atualizar } from '../lib/store.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { abrirLightbox } from './lightbox.js'
import { ICONE_WHATSAPP } from './busca.js'

const criarCard = (acomodacao, indice) => {
  const fotos = prepararFotos(acomodacao.fotos || [], '(min-width: 48em) 45vw, 92vw')
  const capa = fotos[0]

  const imagem = capa
    ? el('button', {
        type: 'button',
        class: 'acomodacao__foto',
        'aria-label': `Ver fotos de ${acomodacao.nome}`,
        onclick: (e) => abrirLightbox(fotos, 0, e.currentTarget),
      }, [
        el('img', {
          src: capa.src,
          srcset: capa.srcset,
          sizes: capa.sizes,
          alt: capa.alt,
          loading: indice < 2 ? 'eager' : 'lazy',
          decoding: 'async',
          width: String(capa.largura),
          height: String(capa.altura),
          style: `background-image:url(${capa.mini});background-size:cover;background-position:${capa.foco};object-position:${capa.foco}`,
        }),
        fotos.length > 1
          ? el('span', { class: 'acomodacao__contador', text: `${fotos.length} fotos`, 'aria-hidden': 'true' })
          : null,
      ])
    : el('div', { class: 'acomodacao__foto acomodacao__foto--vazia', 'aria-hidden': 'true' })

  const fatos = el('ul', { class: 'acomodacao__fatos' }, [
    acomodacao.capacidade
      ? el('li', {}, [
          el('span', { class: 'acomodacao__fato-icone', 'aria-hidden': 'true', html: icone('familia') }),
          el('span', { text: acomodacao.capacidade }),
        ])
      : null,
    acomodacao.camas
      ? el('li', {}, [
          el('span', { class: 'acomodacao__fato-icone', 'aria-hidden': 'true', html: icone('cama') }),
          el('span', { text: acomodacao.camas }),
        ])
      : null,
    acomodacao.area
      ? el('li', {}, [
          el('span', { class: 'acomodacao__fato-icone', 'aria-hidden': 'true', html: icone('varanda') }),
          el('span', { text: acomodacao.area }),
        ])
      : null,
  ].filter(Boolean))

  const comodidades = (acomodacao.comodidades || []).length
    ? el('ul', { class: 'acomodacao__comodidades' },
        acomodacao.comodidades.map((c) =>
          el('li', {}, [
            el('span', { class: 'acomodacao__comodidade-icone', 'aria-hidden': 'true', html: icone(c.icone) }),
            el('span', { text: c.nome }),
          ]),
        ),
      )
    : null

  const cta = el('button', {
    type: 'button',
    class: 'botao botao--primario acomodacao__cta',
    onclick: () => {
      atualizar({ tocado: true })
      const dados = lerEstado()
      const { valido } = validar(dados)
      rastrear(EVENTOS.ACOMODACAO_CTA, { acomodacao: acomodacao.nome, comDatas: valido })
      rastrear(EVENTOS.WHATSAPP_CLIQUE, {
        origem: 'acomodacao',
        acomodacao: acomodacao.nome,
        protocolo: dados.protocolo,
      })
      // Datas em branco nao travam o contato aqui: quem clica no card ja quer
      // falar sobre aquela acomodacao, e a mensagem sai marcando o que falta.
      const link = montarLinkWhatsApp({ ...dados, acomodacao: acomodacao.nome, origem: 'acomodacao' })
      window.open(link, '_blank', 'noopener,noreferrer')
    },
  }, [
    el('span', { class: 'botao__icone', 'aria-hidden': 'true', html: ICONE_WHATSAPP }),
    el('span', { text: 'Consultar esta acomodação' }),
  ])

  return el('article', { class: 'acomodacao' }, [
    imagem,
    el('div', { class: 'acomodacao__corpo' }, [
      el('h3', { class: 'acomodacao__nome', text: acomodacao.nome }),
      fatos,
      acomodacao.descricao ? el('p', { class: 'acomodacao__descricao', text: acomodacao.descricao }) : null,
      comodidades,
      cta,
    ]),
  ])
}

export const criarAcomodacoes = () => {
  const lista = pousada.acomodacoes
  if (lista.length === 0) return null

  return el('section', { class: 'secao acomodacoes', id: 'acomodacoes' }, [
    el('div', { class: 'secao__interno' }, [
      el('header', { class: 'secao__cabecalho' }, [
        el('p', { class: 'olho', text: 'Onde dormir' }),
        el('h2', { class: 'secao__titulo', text: 'Acomodações' }),
        el('p', {
          class: 'secao__apoio',
          text: 'A disponibilidade e os valores de cada período são confirmados direto com a pousada.',
        }),
      ]),
      el('div', { class: 'acomodacoes__lista' }, lista.map(criarCard)),
    ]),
  ])
}
