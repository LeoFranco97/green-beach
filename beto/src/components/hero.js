/**
 * Hero.
 *
 * Anatomia herdada do site da pousada, que por sua vez veio do Woolmers
 * Estate: foto sangrando, veus cruzados, olho em caixa alta espacada, display
 * serifado quebrado em tres linhas com a terceira em italico dourado.
 *
 * A diferenca em relacao ao site da pousada: la o formulario inteiro vive no
 * hero, porque nao existe outra coisa para fazer na pagina. Aqui NAO. O hero
 * tem um botao que rola ate o configurador, e o motivo esta em ARQUITETURA.md,
 * 3.2: mandar o visitante para o WhatsApp antes de ele escolher data e
 * quantidade produz lead sem informacao, e lead sem informacao e o lead que
 * ninguem responde.
 */
import { el } from '../lib/dom.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { hero, precoAncora, provaDoHero, fotoPor, ANCORA_PEDIDO } from '../data/oferta.js'

/** Monta a foto de fundo com os veus por cima. */
const montarFundo = () => {
  const capa = fotoPor('hero')
  if (!capa || !fotoExiste(capa.arquivo)) {
    // Sem foto, o hero vira superficie solida em vez de caixa quebrada.
    return el('div', { class: 'hero__fundo hero__fundo--vazio', 'aria-hidden': 'true' })
  }

  const attrs = atributosDeFoto(capa.arquivo, {
    alt: '', // decorativa: o que ela mostra ja esta escrito no titulo
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
 * O titulo em tres linhas.
 * A quebra vem do arquivo de dados, nao da largura da tela: e ela que faz o
 * gesto tipografico da pagina.
 */
const montarTitulo = () => {
  const linhas = []
  for (const linha of [].concat(hero.titulo)) {
    linhas.push(el('span', { class: 'hero__linha', text: linha }))
  }
  if (hero.tituloSegunda) linhas.push(el('span', { class: 'hero__linha', text: hero.tituloSegunda }))
  if (hero.tituloItalico) {
    linhas.push(el('span', { class: 'hero__linha italica', text: hero.tituloItalico }))
  }
  return el('h1', { class: 'hero__entra' }, linhas)
}

/**
 * A linha abaixo do botao. Duas informacoes independentes, cada uma com a
 * sua trava: o preco ancora so entra com fonte e data, e a prova de
 * distancia so entra medida. Se as duas faltarem, a linha inteira some e
 * nao fica um tracinho orfao no lugar.
 */
const montarProvas = () => {
  const itens = []
  if (precoAncora.confirmado && precoAncora.valor) {
    itens.push(el('span', { class: 'hero__prova', text: precoAncora.valor }))
  }
  if (provaDoHero.confirmado && provaDoHero.valor) {
    itens.push(el('span', { class: 'hero__prova', text: provaDoHero.valor }))
  }
  if (itens.length === 0) return null
  return el('p', { class: 'hero__provas' }, itens)
}

export const criarHero = () => {
  if (!hero.confirmado) return null

  const conteudo = el('div', { class: 'hero__conteudo' }, [
    hero.olho ? el('span', { class: 'olho hero__entra', text: hero.olho }) : null,
    montarTitulo(),
    hero.apoio ? el('p', { class: 'lead hero__lead hero__entra', text: hero.apoio }) : null,
    el('div', { class: 'hero__acao hero__entra' }, [
      el('a', { class: 'botao botao--ouro', href: ANCORA_PEDIDO, text: hero.botao }),
      montarProvas(),
    ]),
  ])

  const secao = el('section', { class: 'hero', id: 'topo' }, [
    montarFundo(),
    el('div', { class: 'envelope hero__interior' }, [conteudo]),
  ])

  /*
   * O fade up entra depois que as fontes carregam. Sem isso o texto aparece
   * na fonte de recuo, a Playfair chega, e a linha salta de largura no meio
   * da animacao. Se a promessa nunca resolver, a classe entra mesmo assim:
   * hero invisivel e pior que hero sem transicao.
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
