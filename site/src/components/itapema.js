/**
 * Seção sobre Itapema, a cidade.
 *
 * Existe por um motivo comercial: quem procura pousada em Itapema ainda está
 * escolhendo o destino, não só a cama. E existe por um motivo prático: o
 * acervo de fotos aéreas é da cidade, não da pousada, então é aqui que ele
 * pode brilhar sem que ninguém confunda uma coisa com a outra.
 *
 * Regra do conteúdo: cada frase descreve o que a foto realmente mostra.
 * Nada de distância inventada nem de superlativo de folheto.
 */
import { el } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'
import { abrirLightbox } from './lightbox.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

/** Os quatro recortes da cidade que a seção conta, na ordem do dia. */
const RECORTES = [
  { arquivo: 'itapema-verao-na-praia', titulo: 'A Meia Praia', texto: 'A praia larga do centro, a que enche de guarda-sol em dezembro.' },
  { arquivo: 'itapema-canto-da-praia', titulo: 'O Canto da Praia', texto: 'A ponta onde os barcos de pesca ficam ancorados, na água calma.' },
  { arquivo: 'itapema-ilha-praia-grossa', titulo: 'A Praia Grossa', texto: 'Água turquesa e uma ilhota logo em frente, do outro lado do morro.' },
  { arquivo: 'itapema-baia-do-mirante', titulo: 'Do alto', texto: 'A baía inteira vista do mirante, com o mar aberto até o horizonte.' },
]

export const criarItapema = () => {
  const todas = prepararFotos(pousada.fotos, '(min-width: 62em) 25vw, 80vw')
  const porArquivo = new Map(todas.map((f) => [f.arquivo, f]))

  const cartoes = RECORTES.map((recorte, indice) => {
    const foto = porArquivo.get(recorte.arquivo)
    if (!foto) return null

    return el('li', { class: 'recorte' }, [
      el('button', {
        type: 'button',
        class: 'recorte__foto',
        'aria-label': `Ampliar a foto: ${foto.alt}`,
        onclick: (evento) => {
          rastrear(EVENTOS.GALERIA_ABERTA, { origem: 'itapema', recorte: recorte.arquivo })
          const posicao = todas.findIndex((f) => f.arquivo === recorte.arquivo)
          abrirLightbox(todas, Math.max(0, posicao), evento.currentTarget)
        },
      }, [
        el('img', {
          src: foto.src,
          srcset: foto.srcset,
          sizes: foto.sizes,
          alt: foto.alt,
          loading: 'lazy',
          decoding: 'async',
          width: String(foto.largura),
          height: String(foto.altura),
          style: `background-image:url(${foto.mini});background-size:cover;background-position:${foto.foco};object-position:${foto.foco}`,
        }),
      ]),
      el('div', { class: 'recorte__texto' }, [
        el('h3', { class: 'recorte__titulo', text: recorte.titulo }),
        el('p', { class: 'recorte__apoio', text: recorte.texto }),
      ]),
    ])
  }).filter(Boolean)

  if (cartoes.length === 0) return null

  return el('section', {
    class: 'secao itapema gb-dark tem-fundo',
    id: 'itapema',
    dataset: { surface: 'dark' },
  }, [
    el('div', { class: 'secao__interno' }, [
      el('header', { class: 'secao__cabecalho itapema__cabecalho' }, [
        el('p', { class: 'olho', text: 'Em volta' }),
        el('h2', { class: 'secao__titulo', text: 'Itapema não acaba na areia' }),
        el('p', {
          class: 'secao__apoio',
          text: 'A Meia Praia é a praia larga do centro, a que aparece nas fotos do alto. Do outro lado do morro estão as praias menores, e no canto ficam os barcos de pesca. Tudo isso cabe num fim de semana.',
        }),
      ]),
      el('ul', { class: 'recortes' }, cartoes),
    ]),
  ])
}
