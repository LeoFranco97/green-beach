/**
 * Cabecalho fixo.
 * Comeca transparente sobre a foto do hero e vira solido depois do scroll.
 * No mobile abre um painel de navegacao de tela cheia.
 */
import { el, qs, qsa, prenderFoco, travarScroll, liberarScroll } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { linksDeNavegacao } from '../lib/navegacao.js'

// So entra no menu a secao que realmente vai existir na pagina.
const LINKS = linksDeNavegacao()

export const criarCabecalho = () => {
  const marca = el('a', {
    class: 'cabecalho__marca',
    href: '#topo',
    'aria-label': `${pousada.nome}, ir para o topo`,
  }, [
    // O lockup completo so fica legivel acima de 135px de altura, entao ele
    // vive sobre a foto do hero, onde ha espaco. Depois do scroll o
    // cabecalho encolhe e passa a usar so a rosacea. Ver direcao-de-arte.md.
    el('img', {
      class: 'cabecalho__logo cabecalho__logo--lockup',
      src: pousada.marca.logoClara,
      alt: pousada.nome,
      width: '150',
      height: '163',
      fetchpriority: 'high',
    }),
    el('img', {
      class: 'cabecalho__logo cabecalho__logo--simbolo',
      src: pousada.marca.simbolo,
      alt: '',
      'aria-hidden': 'true',
      width: '48',
      height: '45',
    }),
  ])

  const listaLinks = (extraClasse = '') =>
    el('ul', { class: `nav__lista ${extraClasse}`.trim() },
      LINKS.map((link) =>
        el('li', {}, [el('a', { class: 'nav__link', href: link.href, text: link.texto })]),
      ),
    )

  const navDesktop = el('nav', { class: 'cabecalho__nav', 'aria-label': 'Navegação principal' }, [listaLinks()])

  const ctaTopo = el('a', {
    class: 'botao botao--contorno cabecalho__cta',
    href: '#consultar',
    text: 'Consultar disponibilidade',
  })

  /* ---------------------------------------------------------- menu mobile */
  const painelMobile = el('div', { class: 'menu-mobile', id: 'menu-mobile', hidden: true }, [
    el('nav', { class: 'menu-mobile__nav', 'aria-label': 'Navegação' }, [listaLinks('nav__lista--empilhada')]),
    el('a', {
      class: 'botao botao--primario menu-mobile__cta',
      href: '#consultar',
      text: 'Consultar disponibilidade',
    }),
    el('div', { class: 'menu-mobile__contato' }, [
      pousada.contato.telefoneExibicao
        ? el('a', {
            class: 'menu-mobile__telefone',
            href: `tel:${pousada.contato.telefoneLink}`,
            text: `WhatsApp ${pousada.contato.telefoneExibicao}`,
          })
        : null,
      el('a', {
        class: 'menu-mobile__instagram',
        href: pousada.contato.instagramUrl,
        target: '_blank',
        rel: 'noopener',
        text: `@${pousada.contato.instagram}`,
      }),
    ]),
  ])

  let soltarFoco = () => {}
  let aberto = false

  const alternar = el('button', {
    type: 'button',
    class: 'cabecalho__menu',
    'aria-expanded': 'false',
    'aria-controls': 'menu-mobile',
    'aria-label': 'Abrir menu',
  }, [el('span', { class: 'cabecalho__hamburguer', 'aria-hidden': 'true' })])

  const fecharMenu = () => {
    if (!aberto) return
    aberto = false
    painelMobile.hidden = true
    alternar.setAttribute('aria-expanded', 'false')
    alternar.setAttribute('aria-label', 'Abrir menu')
    raiz.classList.remove('is-menu-aberto')
    liberarScroll()
    soltarFoco()
  }

  const abrirMenu = () => {
    aberto = true
    painelMobile.hidden = false
    alternar.setAttribute('aria-expanded', 'true')
    alternar.setAttribute('aria-label', 'Fechar menu')
    raiz.classList.add('is-menu-aberto')
    travarScroll()
    soltarFoco = prenderFoco(painelMobile, alternar)
    qs('a', painelMobile)?.focus()
  }

  alternar.addEventListener('click', () => (aberto ? fecharMenu() : abrirMenu()))
  painelMobile.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fecharMenu()
  })
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && aberto) fecharMenu()
  })

  const raiz = el('header', { class: 'cabecalho', id: 'cabecalho' }, [
    el('div', { class: 'cabecalho__interno' }, [marca, navDesktop, el('div', { class: 'cabecalho__acoes' }, [ctaTopo, alternar])]),
    painelMobile,
  ])

  /* ------------------------------------------- transparente -> solido */
  const sentinela = el('div', { class: 'cabecalho__sentinela', 'aria-hidden': 'true' })

  const observarScroll = () => {
    if (!('IntersectionObserver' in window)) { raiz.classList.add('is-solido'); return }
    const obs = new IntersectionObserver(
      ([entrada]) => raiz.classList.toggle('is-solido', !entrada.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(sentinela)
  }

  /* ----------------------------------------- marcar secao ativa no menu */
  const marcarSecaoAtiva = () => {
    const alvos = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (alvos.length === 0 || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        const id = `#${entrada.target.id}`
        for (const link of qsa('.nav__link', raiz)) {
          const ativo = link.getAttribute('href') === id
          link.classList.toggle('is-ativo', ativo)
          if (ativo) link.setAttribute('aria-current', 'true')
          else link.removeAttribute('aria-current')
        }
      }
    }, { rootMargin: '-45% 0px -50% 0px' })
    for (const alvo of alvos) obs.observe(alvo)
  }

  return { raiz, sentinela, iniciar: () => { observarScroll(); marcarSecaoAtiva() } }
}
