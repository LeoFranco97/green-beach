/** Primeira dobra: foto grande, promessa curta e o formulario de consulta. */
import { el } from '../lib/dom.js'
import { icone } from '../lib/icones.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos, atributosDeFoto } from '../lib/imagens.js'
import { criarBusca } from './busca.js'

export const criarHero = () => {
  const fotos = prepararFotos(pousada.fotos)
  const capa = fotos.find((f) => f.destaque) || fotos[0]
  const atributos = capa ? atributosDeFoto(capa.arquivo, { alt: capa.alt, sizes: '100vw', prioritaria: true }) : null

  const fundo = el('div', { class: 'hero__fundo' }, [
    atributos
      ? el('img', {
          class: 'hero__imagem',
          ...atributos,
          style: `${atributos.style};object-position:${capa.foco}`,
        })
      : el('div', { class: 'hero__imagem hero__imagem--vazia', 'aria-hidden': 'true' }),
    el('div', { class: 'hero__veu', 'aria-hidden': 'true' }),
  ])

  const localizacao = pousada.endereco.confirmado && pousada.endereco.linhaUnica
    ? el('p', { class: 'hero__local' }, [
        el('span', { class: 'hero__local-icone', 'aria-hidden': 'true', html: icone('local') }),
        el('span', { text: pousada.endereco.linhaUnica }),
      ])
    : null

  const selo = pousada.avaliacoes.confirmado && pousada.avaliacoes.nota
    ? el('p', { class: 'hero__selo' }, [
        el('span', { class: 'hero__selo-icone', 'aria-hidden': 'true', html: icone('estrela') }),
        el('span', {
          text: `${String(pousada.avaliacoes.nota).replace('.', ',')} no ${pousada.avaliacoes.fonte} com ${pousada.avaliacoes.total} avaliacoes`,
        }),
      ])
    : null

  const texto = el('div', { class: 'hero__texto' }, [
    selo,
    el('h1', { class: 'hero__titulo', text: pousada.hero.titulo }),
    el('p', { class: 'hero__apoio', text: pousada.hero.apoio }),
    localizacao,
  ])

  return el('section', { class: 'hero', id: 'topo' }, [
    fundo,
    el('div', { class: 'hero__interno' }, [
      texto,
      el('div', { class: 'hero__busca', id: 'consultar' }, [
        el('p', { class: 'hero__busca-titulo', text: 'Consulte as datas da sua estadia' }),
        criarBusca({ variante: 'hero', origem: 'hero' }),
      ]),
    ]),
  ])
}
