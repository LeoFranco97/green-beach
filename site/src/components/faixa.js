/**
 * Faixa de foto sangrada, com uma frase curta por cima.
 *
 * Serve de respiro entre seções e de mudança de ritmo: depois de dois blocos
 * de texto sobre fundo claro, uma foto de ponta a ponta acorda a página.
 * Não tem CTA nem link: é pausa, não é venda.
 */
import { el } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'

/**
 * @param {object} opcoes
 * @param {string} opcoes.arquivo  Chave da foto no manifesto.
 * @param {string} opcoes.frase    Uma linha, no máximo duas.
 * @param {string} [opcoes.apoio]  Linha menor abaixo, opcional.
 * @param {'alta'|'baixa'} [opcoes.altura]
 * @param {'padrao'|'leve'} [opcoes.veu]  Use 'leve' em foto já escura, como
 *   a orla à noite: o véu padrão em cima de uma noturna some com a foto.
 * @param {'escura'|'clara'} [opcoes.tinta]  'clara' inverte a faixa: véu de
 *   areia e texto escuro. É o que uma foto de amanhecer pede, porque véu
 *   escuro em cima de amanhecer mata justamente a luz que é o assunto.
 */
export const criarFaixa = ({ arquivo, frase, apoio = '', altura = 'baixa', veu = 'padrao', tinta = 'escura' }) => {
  const [foto] = prepararFotos(pousada.fotos.filter((f) => f.arquivo === arquivo), '100vw')
  if (!foto) return null

  const variante = tinta === 'clara' ? ' faixa--clara' : ''
  return el('section', { class: `faixa faixa--${altura}${variante} tem-fundo`, 'aria-label': frase }, [
    el('div', { class: 'faixa__fundo' }, [
      el('img', {
        class: 'faixa__imagem',
        src: foto.src,
        srcset: foto.srcset,
        sizes: '100vw',
        alt: foto.alt,
        loading: 'lazy',
        decoding: 'async',
        width: String(foto.largura),
        height: String(foto.altura),
        style: `background-image:url(${foto.mini});background-size:cover;background-position:${foto.foco};object-position:${foto.foco}`,
      }),
      el('div', { class: `faixa__veu faixa__veu--${veu}`, 'aria-hidden': 'true' }),
    ]),
    el('div', { class: 'faixa__interno' }, [
      el('p', { class: 'faixa__frase', text: frase }),
      apoio ? el('p', { class: 'faixa__apoio', text: apoio }) : null,
    ]),
  ])
}
