/**
 * Hero.
 *
 * A v1 tinha foto de praia ao entardecer com véu por cima. Estava errado por
 * dois motivos: a foto é de Itapema e o produto é o parque, e a imagem é
 * escura e calma numa página que vende montanha-russa.
 *
 * Enquanto não existir foto oficial de atração, o hero é uma FAIXA VERMELHA
 * CHAPADA, que é exatamente o que a referência faz na página de atrações
 * dela. Não é solução de emergência: é o gesto do sistema. Vermelho inteiro,
 * caixa alta branca pesada, e a linha de fecho dentro de uma pílula amarela.
 *
 * Quando a foto chegar, basta preencher `fotoPor('hero')` com um arquivo que
 * exista e o componente troca sozinho para foto com véu, sem mexer no CSS.
 *
 * O botão NÃO abre o WhatsApp: rola até o configurador. Mandar para o
 * WhatsApp antes de o visitante escolher data e quantidade produz lead sem
 * informação, que é o lead que ninguém responde.
 */
import { el } from '../lib/dom.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { hero, precoAncora, provaDoHero, fotoPor, ANCORA_PEDIDO } from '../data/oferta.js'
import { ancoraGeral, emReais } from '../data/produtos.js'

/**
 * Fundo. Com foto confirmada vira foto com véu, sem foto fica a cor chapada.
 * A decisão é do dado, não de quem edita o CSS.
 */
const montarFundo = () => {
  const capa = fotoPor('hero')
  if (!capa || !fotoExiste(capa.arquivo)) return null

  const attrs = atributosDeFoto(capa.arquivo, {
    alt: '', // decorativa: o que ela mostra já está escrito no título
    sizes: '100vw',
    prioritaria: true,
  })

  return el('div', { class: 'hero__fundo' }, [
    el('img', { ...attrs, style: `${attrs.style || ''};object-position:${capa.foco}` }),
    el('div', { class: 'hero__veu hero__veu--topo', 'aria-hidden': 'true' }),
    el('div', { class: 'hero__veu hero__veu--base', 'aria-hidden': 'true' }),
  ])
}

/**
 * O título. As duas primeiras linhas em branco, a terceira numa pílula
 * amarela com tinta navy.
 *
 * A pílula não é enfeite, é acessibilidade: amarelo como TEXTO sobre o
 * vermelho do hero dá 2,3:1 e reprova em qualquer critério. Como superfície,
 * com navy por cima, passa com folga.
 */
const montarTitulo = () => {
  const linhas = []
  for (const linha of [].concat(hero.titulo)) {
    linhas.push(el('span', { class: 'hero__linha', text: linha }))
  }
  if (hero.tituloSegunda) linhas.push(el('span', { class: 'hero__linha', text: hero.tituloSegunda }))
  if (hero.tituloDestaque) {
    linhas.push(el('span', { class: 'hero__linha hero__linha--destaque' }, [
      el('mark', { class: 'hero__marca', text: hero.tituloDestaque }),
    ]))
  }
  return el('h1', { class: 'hero__entra' }, linhas)
}

/**
 * A linha abaixo do botão. Cada item tem a sua trava: o preço âncora sai do
 * próprio catálogo, e a prova de distância só entra medida. Se as duas
 * faltarem, a linha some inteira.
 */
const montarProvas = () => {
  const itens = []
  const menor = ancoraGeral()

  if (precoAncora.confirmado && precoAncora.valor) {
    itens.push(el('li', { class: 'hero__prova', text: precoAncora.valor }))
  } else if (typeof menor === 'number') {
    itens.push(el('li', { class: 'hero__prova', text: `Ingresso a partir de ${emReais(menor)}` }))
  }
  if (provaDoHero.confirmado && provaDoHero.valor) {
    itens.push(el('li', { class: 'hero__prova', text: provaDoHero.valor }))
  }
  if (itens.length === 0) return null
  return el('ul', { class: 'hero__provas' }, itens)
}

export const criarHero = () => {
  if (!hero.confirmado) return null

  const fundo = montarFundo()

  const conteudo = el('div', { class: 'hero__conteudo' }, [
    hero.olho ? el('span', { class: 'olho hero__olho hero__entra', text: hero.olho }) : null,
    montarTitulo(),
    hero.apoio ? el('p', { class: 'lead hero__lead hero__entra', text: hero.apoio }) : null,
    el('div', { class: 'hero__acao hero__entra' }, [
      el('a', {
        class: 'botao botao--claro botao--grande',
        href: ANCORA_PEDIDO,
        text: hero.botao,
      }),
      montarProvas(),
    ]),
  ])

  const secao = el('section', {
    class: `hero${fundo ? ' hero--foto' : ' hero--cor'}`,
    id: 'topo',
  }, [fundo, el('div', { class: 'envelope hero__interior' }, [conteudo])].filter(Boolean))

  /*
   * O fade up entra depois que as fontes carregam. Sem isso o texto aparece
   * na fonte de recuo, a Nunito 900 chega, e a linha salta de largura no
   * meio da animação. Se a promessa nunca resolver, a classe entra mesmo
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
