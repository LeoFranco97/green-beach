/**
 * Seletor de hospedes.
 * Desktop: popover ancorado no campo. Mobile: bottom sheet.
 * Cada linha e um stepper com botoes reais, entao funciona no teclado e o
 * leitor de tela anuncia a quantidade a cada mudanca.
 */
import { el, qs, prenderFoco, travarScroll, liberarScroll, menosMovimento } from '../lib/dom.js'
import { limites } from '../lib/store.js'

const ehMobile = () => window.matchMedia('(max-width: 47.99em)').matches

const LINHAS = [
  { chave: 'adultos', titulo: 'Adultos', apoio: '13 anos ou mais', min: 1, max: limites.MAX_ADULTOS },
  { chave: 'criancas', titulo: 'Crianças', apoio: 'Até 12 anos', min: 0, max: limites.MAX_CRIANCAS },
]

/**
 * @param {object} opcoes
 * @param {number} opcoes.adultos
 * @param {number} opcoes.criancas
 * @param {HTMLElement} opcoes.ancora
 * @param {(v: {adultos: number, criancas: number}) => void} opcoes.aoMudar
 */
export const abrirHospedes = (opcoes) => {
  const valores = { adultos: opcoes.adultos ?? 2, criancas: opcoes.criancas ?? 0 }
  const mobile = ehMobile()

  const overlay = el('div', { class: `hospedes-overlay ${mobile ? 'is-sheet' : 'is-popover'}` })
  const painel = el('div', {
    class: 'hospedes',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Quantidade de hóspedes',
  })

  const cabecalho = el('header', { class: 'hospedes__cabecalho' }, [
    el('p', { class: 'hospedes__titulo', text: 'Quem vai se hospedar' }),
    el('button', {
      type: 'button',
      class: 'hospedes__fechar',
      'aria-label': 'Fechar seletor de hóspedes',
      html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
      onclick: () => encerrar(),
    }),
  ])

  const lista = el('div', { class: 'hospedes__lista' })

  for (const linha of LINHAS) {
    const saida = el('output', {
      class: 'stepper__valor',
      'aria-live': 'polite',
      for: `menos-${linha.chave} mais-${linha.chave}`,
      text: String(valores[linha.chave]),
    })

    const ajustar = (delta) => {
      const novo = Math.min(linha.max, Math.max(linha.min, valores[linha.chave] + delta))
      if (novo === valores[linha.chave]) return
      valores[linha.chave] = novo
      saida.textContent = String(novo)
      sincronizarBotoes()
      opcoes.aoMudar?.({ ...valores })
    }

    const menos = el('button', {
      type: 'button', id: `menos-${linha.chave}`, class: 'stepper__botao',
      'aria-label': `Menos um ${linha.titulo.toLowerCase().replace(/s$/, '')}`,
      html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>',
      onclick: () => ajustar(-1),
    })
    const mais = el('button', {
      type: 'button', id: `mais-${linha.chave}`, class: 'stepper__botao',
      'aria-label': `Mais um ${linha.titulo.toLowerCase().replace(/s$/, '')}`,
      html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14"/></svg>',
      onclick: () => ajustar(1),
    })

    linha.refs = { menos, mais }

    lista.append(el('div', { class: 'hospedes__linha' }, [
      el('div', { class: 'hospedes__rotulo' }, [
        el('p', { class: 'hospedes__nome', text: linha.titulo }),
        el('p', { class: 'hospedes__apoio', text: linha.apoio }),
      ]),
      el('div', { class: 'stepper' }, [menos, saida, mais]),
    ]))
  }

  const sincronizarBotoes = () => {
    for (const linha of LINHAS) {
      linha.refs.menos.disabled = valores[linha.chave] <= linha.min
      linha.refs.mais.disabled = valores[linha.chave] >= linha.max
    }
  }
  sincronizarBotoes()

  const rodape = el('footer', { class: 'hospedes__rodape' }, [
    el('button', { type: 'button', class: 'hospedes__aplicar', text: 'Confirmar', onclick: () => encerrar() }),
  ])

  painel.append(cabecalho, lista, rodape)
  overlay.append(painel)

  let soltarFoco = () => {}

  const encerrar = () => {
    document.removeEventListener('click', aoClicarFora, true)
    overlay.removeEventListener('keydown', aoTeclar)
    window.removeEventListener('resize', aoRedimensionar)
    overlay.classList.remove('is-aberto')
    soltarFoco()
    if (mobile) liberarScroll()
    const remover = () => overlay.remove()
    if (menosMovimento()) remover()
    else window.setTimeout(remover, 180)
  }

  const aoTeclar = (evento) => { if (evento.key === 'Escape') { evento.preventDefault(); encerrar() } }
  const aoClicarFora = (evento) => { if (!overlay.contains(evento.target)) encerrar() }
  const aoRedimensionar = () => { if (ehMobile() !== mobile) encerrar() }

  overlay.addEventListener('keydown', aoTeclar)
  overlay.addEventListener('mousedown', (evento) => { if (evento.target === overlay) encerrar() })

  document.body.append(overlay)
  if (mobile) travarScroll()

  // Foco imediato, transição no quadro seguinte. Ver o comentário em
  // calendario.js sobre por que o foco não pode depender de rAF.
  qs('.stepper__botao:not([disabled])', painel)?.focus()
  soltarFoco = prenderFoco(painel, opcoes.ancora)
  window.setTimeout(() => document.addEventListener('click', aoClicarFora, true), 0)
  window.addEventListener('resize', aoRedimensionar)
  requestAnimationFrame(() => overlay.classList.add('is-aberto'))

  return { fechar: encerrar }
}
