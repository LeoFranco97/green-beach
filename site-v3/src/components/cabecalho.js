/**
 * Cabeçalho.
 *
 * Transparente sobre o hero, sólido depois dele. A navegação inteira mora
 * numa gaveta, como no Woolmers: um site de pousada tem um destino só, e
 * menu horizontal cheio de item só oferece caminhos para não reservar.
 */
import { el, qs, travarScroll, liberarScroll, prenderFoco } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'

const SECOES = [
  { href: '#fatos', texto: 'A pousada' },
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
   * Assinatura em texto vivo, não a logo em imagem.
   *
   * Não é preferência: o lockup oficial é quase quadrado e, medido no
   * arquivo mestre na v1, só fica legível acima de 135px de altura. Num
   * cabeçalho de 96px ele vira borrão. Não existe versão horizontal
   * reduzida da marca, e pedir uma está em PENDENCIAS.
   *
   * Enquanto ela não existe, texto na fonte da marca é honesto, lê em
   * qualquer tamanho e é exatamente o que a referência faz. Quando a versão
   * horizontal chegar, isto aqui vira uma <img> e mais nada muda.
   */
  const marca = el('a', { class: 'cabecalho__marca', href: '#topo', 'aria-label': `${pousada.marca.nome}, início` }, [
    el('span', { class: 'cabecalho__nome', text: 'Green Beach' }),
    el('span', { class: 'cabecalho__lugar', text: 'Pousada e Hotel · Itapema, SC' }),
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
