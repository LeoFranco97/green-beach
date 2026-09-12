/**
 * Hero.
 *
 * Anatomia herdada do Woolmers Estate: foto sangrando, três véus cruzados,
 * olho em caixa alta espaçada, display serifado quebrado em três linhas com
 * a terceira em itálico dourado, e uma faixa de apoio embaixo.
 *
 * A troca em relação à referência: onde ele tem dois botões que levam para a
 * bilheteria, aqui vive o formulário de consulta inteiro. Não existe motor
 * de reserva nesta operação, então o formulário é o herói da primeira dobra
 * e não um atalho para outra página.
 */
import { el } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { criarBusca } from './busca.js'

/** Monta a foto de fundo com os três véus por cima. */
const montarFundo = () => {
  const capa = pousada.fotos.find((f) => f.destaque)
  if (!capa || !fotoExiste(capa.arquivo)) {
    // Sem foto, o hero vira superfície sólida em vez de caixa quebrada.
    return el('div', { class: 'hero__fundo hero__fundo--vazio', 'aria-hidden': 'true' })
  }

  const attrs = atributosDeFoto(capa.arquivo, {
    alt: '', // decorativa: o que ela mostra já está escrito no título
    sizes: '100vw',
    prioritaria: true,
  })

  return el('div', { class: 'hero__fundo' }, [
    el('img', { ...attrs, style: `${attrs.style || ''};object-position:${capa.foco}` }),
    el('div', { class: 'hero__veu hero__veu--lateral', 'aria-hidden': 'true' }),
    el('div', { class: 'hero__veu hero__veu--topo', 'aria-hidden': 'true' }),
    el('div', { class: 'hero__veu hero__veu--base', 'aria-hidden': 'true' }),
  ])
}

/**
 * O título em três linhas.
 * A quebra vem do arquivo de dados, não da largura da tela: é ela que faz o
 * gesto tipográfico da página, e deixar o navegador decidir onde quebrar
 * desmonta a assinatura.
 */
const montarTitulo = ({ titulo, tituloItalico }) => {
  const linhas = (Array.isArray(titulo) ? titulo : [titulo]).map((linha) =>
    el('span', { class: 'hero__linha', text: linha }),
  )
  if (tituloItalico) {
    linhas.push(el('span', { class: 'hero__linha italica', text: tituloItalico }))
  }
  return el('h1', { class: 'hero__entra' }, linhas)
}

export const criarHero = () => {
  const { hero } = pousada
  if (!hero?.confirmado) return null

  const conteudo = el('div', { class: 'hero__conteudo' }, [
    hero.olho ? el('span', { class: 'olho hero__entra', text: hero.olho }) : null,
    montarTitulo(hero),
    hero.apoio ? el('p', { class: 'lead hero__lead hero__entra', text: hero.apoio }) : null,
    el('div', { class: 'hero__entra' }, [
      hero.chamada
        ? el('span', { class: 'hero__chamada', id: 'chamada-consulta', text: hero.chamada })
        : null,
      criarBusca({ variante: 'hero', origem: 'hero' }),
    ]),
  ])

  const secao = el('section', { class: 'hero', id: 'topo' }, [
    montarFundo(),
    el('div', { class: 'envelope hero__interior' }, [conteudo]),
  ])

  /*
   * O fade up entra depois que as fontes carregam. Sem isso o texto aparece
   * na fonte de recuo, a Playfair chega, e a linha inteira salta de largura
   * no meio da animação. Se a promessa nunca resolver, a classe entra mesmo
   * assim: hero invisível é pior que hero sem transição.
   */
  const revelar = () => secao.classList.add('is-pronto')
  if (document.fonts?.ready) {
    document.fonts.ready.then(revelar)
    setTimeout(revelar, 1200)
  } else {
    revelar()
  }

  return secao
}
