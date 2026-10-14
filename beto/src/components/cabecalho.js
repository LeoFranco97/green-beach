/**
 * Cabecalho.
 *
 * Transparente sobre o hero, solido depois que o hero sai da tela. Sem menu:
 * a pagina tem uma secao que importa e o cabecalho leva a ela. Menu de cinco
 * itens numa landing de conversao e cinco maneiras de sair do caminho.
 *
 * O lockup completo da marca so e legivel acima de 135px de altura, entao o
 * cabecalho usa o simbolo isolado. A regra vem da direcao de arte do site da
 * pousada e vale igual aqui.
 */
import { el } from '../lib/dom.js'
import { config } from '../config.js'
import { marca, pousada, hero, ANCORA_PEDIDO } from '../data/oferta.js'

export const criarCabecalho = () => {
  const simbolo = el('img', {
    class: 'cabecalho__simbolo',
    src: marca.simbolo,
    alt: pousada.nome,
    width: '44',
    height: '44',
    decoding: 'async',
  })

  const cabecalho = el('header', { class: 'cabecalho' }, [
    el('div', { class: 'envelope cabecalho__interno' }, [
      el('a', { class: 'cabecalho__marca', href: config.siteHotel, 'aria-label': `Site da ${pousada.nomeCurto}` }, [
        simbolo,
        el('span', { class: 'cabecalho__nome' }, [
          el('strong', { text: pousada.nomeCurto }),
          el('span', { text: 'Ingressos e transfer' }),
        ]),
      ]),
      el('a', { class: 'botao botao--acao cabecalho__acao', href: ANCORA_PEDIDO, text: hero.botao }),
    ]),
  ])

  /**
   * Observa o hero e troca o estado do cabecalho. Observar o hero em vez de
   * medir a rolagem evita o numero magico: se a altura do hero mudar, o
   * cabecalho continua certo sem ninguem lembrar de atualizar um px.
   */
  const observarHero = () => {
    const alvo = document.getElementById('topo')
    if (!alvo || !('IntersectionObserver' in window)) {
      cabecalho.classList.add('is-solido')
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => cabecalho.classList.toggle('is-solido', !entrada.isIntersecting),
      { rootMargin: '-60% 0px 0px 0px' },
    )
    obs.observe(alvo)
  }

  return { cabecalho, observarHero }
}
