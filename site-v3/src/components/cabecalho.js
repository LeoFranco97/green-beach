/**
 * Cabeçalho.
 *
 * Transparente sobre o hero, sólido depois dele. A navegação inteira mora
 * numa gaveta, como no Woolmers: um site de pousada tem um destino só, e
 * menu horizontal cheio de item só oferece caminhos para não reservar.
 */
import { el, qs, travarScroll, liberarScroll, prenderFoco } from '../lib/dom.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import logoClara from '../assets/green-beach-logo-clara.webp'
import logoEscura from '../assets/green-beach-logo.webp'

const SECOES = [
  { href: '#casa', texto: 'A pousada' },
  { href: '#diaria', texto: 'O que está incluso' },
  { href: '#combinar', texto: 'Antes de chegar' },
  { href: '#itapema', texto: 'Itapema' },
  { href: '#chegar', texto: 'Como chegar' },
  { href: '#consultar', texto: 'Consultar datas' },
]

/** A gaveta de navegação. Fica no documento sempre, escondida por estado. */
const criarGaveta = (aoFechar) => {
  const lista = el(
    'ul',
    { class: 'gaveta__lista' },
    SECOES.map((s) => el('li', {}, [el('a', { href: s.href, text: s.texto })])),
  )

  const gaveta = el(
    'div',
    {
      class: 'gaveta',
      id: 'gaveta',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Navegação',
      hidden: '',
    },
    [
      el('button', {
        class: 'gaveta__fechar',
        type: 'button',
        'aria-label': 'Fechar navegação',
        html: '&times;',
        onclick: aoFechar,
      }),
      el('nav', { 'aria-label': 'Seções da página' }, [lista]),
    ],
  )

  // Clicar num link navega e fecha. Sem isso a gaveta cobre o destino.
  lista.addEventListener('click', (e) => {
    if (e.target.closest('a')) aoFechar()
  })

  return gaveta
}

export const criarCabecalho = () => {
  /*
   * O lockup oficial, inteiro, nos dois estados.
   *
   * Ele é vertical e quase quadrado, então pede altura. Sobre a foto o
   * cabeçalho tem 96px e ele entra com 76; quando fica sólido o cabeçalho
   * cresce para 84px em vez de encolher, para a marca continuar lendo. Um
   * cabeçalho sólido baixo com a logo espremida é pior que um pouco mais
   * alto com ela legível.
   *
   * São dois arquivos e não um com filter: inverter a marca com filter
   * estraga o dourado da rosácea.
   */
  const marca = el('a', {
    class: 'cabecalho__marca',
    href: '#topo',
    /* Literal, e não pousada.marca.nome: esse campo não existe no arquivo de
       dados (marca só guarda as três imagens), então a interpolação saía
       "undefined, ir para o topo" para quem usa leitor de tela. */
    'aria-label': 'Pousada e Hotel Green Beach, ir para o topo',
  }, [
    el('img', { class: 'cabecalho__logo marca--clara', src: logoClara, alt: '', width: '350', height: '350' }),
    el('img', { class: 'cabecalho__logo marca--escura', src: logoEscura, alt: '', width: '350', height: '350' }),
  ])

  const gatilho = el('button', {
    class: 'cabecalho__gatilho',
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': 'gaveta',
  }, [
    el('span', { class: 'cabecalho__barras', 'aria-hidden': 'true' }, [
      el('span'), el('span'), el('span'),
    ]),
    el('span', { class: 'so-leitor', text: 'Abrir navegação' }),
  ])

  const atalho = el('a', {
    class: 'cabecalho__atalho',
    href: montarLinkWhatsApp({ origem: 'cabecalho' }),
    rel: 'noopener',
    target: '_blank',
    text: 'Falar no WhatsApp',
  })

  const cabecalho = el('header', { class: 'cabecalho', id: 'cabecalho' }, [
    el('div', { class: 'envelope cabecalho__interior' }, [
      marca,
      el('div', { class: 'cabecalho__acoes' }, [atalho, gatilho]),
    ]),
  ])

  let aberta = false
  let devolverFoco = null

  const fechar = () => {
    if (!aberta) return
    aberta = false
    gaveta.classList.remove('is-aberta')
    gatilho.setAttribute('aria-expanded', 'false')
    liberarScroll()
    devolverFoco?.()
    // Espera a transição antes de esconder, senão ela não acontece.
    setTimeout(() => { if (!aberta) gaveta.hidden = true }, 400)
  }

  const abrir = () => {
    if (aberta) return
    aberta = true
    gaveta.hidden = false
    travarScroll()
    // Dois quadros: o primeiro pinta o elemento visível, o segundo anima.
    requestAnimationFrame(() => requestAnimationFrame(() => gaveta.classList.add('is-aberta')))
    devolverFoco = prenderFoco(gaveta, gatilho)
    gatilho.setAttribute('aria-expanded', 'true')
  }

  const gaveta = criarGaveta(fechar)
  gatilho.addEventListener('click', () => (aberta ? fechar() : abrir()))
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar() })

  /*
   * A troca para sólido acompanha o fim do hero, não uma altura fixa em
   * pixel: o hero é clamp() e muda com a largura da janela. IntersectionObserver
   * com uma sentinela evita ler scrollY a cada quadro.
   */
  const observarHero = () => {
    const hero = qs('.hero')
    if (!hero) { cabecalho.classList.add('is-solido'); return }
    const obs = new IntersectionObserver(
      ([entrada]) => cabecalho.classList.toggle('is-solido', !entrada.isIntersecting),
      { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).fontSize, 10) * 6}px 0px 0px 0px` },
    )
    obs.observe(hero)
  }

  return { cabecalho, gaveta, observarHero }
}
