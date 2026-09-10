/**
 * Galeria.
 *
 * A grade mistura três proporções e três escalas de propósito. Quatro fotos
 * do mesmo tamanho lado a lado viram catálogo de estoque, e o acervo tem
 * muita foto da mesma baía: sem variação de escala e de assunto, o visitante
 * vê a mesma curva quatro vezes e conclui que não há o que mostrar.
 *
 * A ordem e a proporção de cada peça vêm do campo `mosaico` no arquivo de
 * dados, de 1 a 6. A peça 6 sangra de ponta a ponta e fecha a seção.
 */
import { el, aoAparecer } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'
import { abrirLightbox } from './lightbox.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

/** Quantas peças a grade comporta. Foto extra vai só para o lightbox. */
const PECAS = 6

export const criarGaleria = () => {
  const todas = prepararFotos(pousada.fotos, '(min-width: 62em) 58vw, 92vw')
  if (todas.length === 0) return null

  const pecas = todas
    .filter((f) => Number.isInteger(f.mosaico))
    .sort((a, b) => a.mosaico - b.mosaico)
    .slice(0, PECAS)

  // Sem posições declaradas, cai numa grade simples com o que houver.
  const visiveis = pecas.length >= 3 ? pecas : todas.slice(0, PECAS)

  const abrir = (foto, ancora) => {
    const indice = Math.max(0, todas.findIndex((f) => f.arquivo === foto.arquivo))
    rastrear(EVENTOS.GALERIA_ABERTA, { foto: foto.arquivo, total: todas.length })
    abrirLightbox(todas, indice, ancora)
  }

  const criarPeca = (foto, ordem) => {
    const img = el('img', {
      class: 'mosaico__imagem',
      src: foto.src,
      srcset: foto.srcset,
      sizes: foto.sizes,
      alt: foto.alt,
      loading: ordem <= 2 ? 'eager' : 'lazy',
      decoding: 'async',
      width: String(foto.largura),
      height: String(foto.altura),
      style: `background-image:url(${foto.mini});background-size:cover;background-position:${foto.foco};object-position:${foto.foco}`,
    })

    const botao = el('button', {
      type: 'button',
      // O modificador não é decorativo: o CSS de movimento usa ele para
      // aplicar a máscara de limpeza só na peça principal. Nove limpezas
      // seguidas transformariam a seção em apresentação de slides.
      class: `mosaico__celula ${ordem === 1 ? 'mosaico__celula--principal' : 'mosaico__celula--apoio'}`,
      dataset: { peca: String(ordem) },
      'aria-label': `Ampliar a foto: ${foto.alt}`,
      onclick: (evento) => abrir(foto, evento.currentTarget),
    }, [img])

    // A etiqueta é honestidade, não enfeite: doze aéreas da cidade e uma da
    // placa não são "fotos da pousada", e quem olha a ilha da Praia Grossa
    // precisa saber que aquilo não é o jardim do hotel.
    if (foto.categoria) {
      botao.append(el('span', { class: 'mosaico__tag', text: foto.categoria, 'aria-hidden': 'true' }))
    }
    return botao
  }

  const mosaico = el('div', {
    class: 'mosaico',
    dataset: { total: String(visiveis.length) },
  }, visiveis.map((foto, i) => criarPeca(foto, i + 1)))

  const botaoTodas = el('button', {
    type: 'button',
    class: 'galeria__todas',
    onclick: (evento) => abrir(todas[0], evento.currentTarget),
  }, [
    el('span', {
      class: 'galeria__grade-icone',
      'aria-hidden': 'true',
      html: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></svg>',
    }),
    el('span', { text: todas.length > 1 ? `Ver as ${todas.length} fotos` : 'Ver a foto' }),
  ])

  const raiz = el('section', {
    class: 'galeria',
    id: 'galeria',
    'aria-label': 'Fotos da pousada e de Itapema',
  }, [
    el('div', { class: 'galeria__interno' }, [mosaico, botaoTodas]),
  ])

  // Pré-carrega as primeiras do lightbox quando a galeria chega perto da tela,
  // para o primeiro clique já abrir com a foto pronta.
  aoAparecer(raiz, () => {
    for (const foto of todas.slice(0, 3)) {
      const img = new Image()
      img.src = foto.src
    }
  })

  return raiz
}
