/**
 * Calendario de periodo (check-in / check-out).
 *
 * Desktop: popover ancorado no campo, dois meses lado a lado.
 * Mobile:  bottom sheet de tela cheia com meses empilhados e rolagem.
 *
 * Acessibilidade: grade com role="grid", tabindex movel (roving tabindex),
 * setas para andar dia a dia, PageUp/PageDown para trocar de mes, Home/End
 * para inicio e fim da semana, Enter/Espaco para escolher, Esc para fechar.
 */
import { el, qs, qsa, prenderFoco, travarScroll, liberarScroll, menosMovimento } from '../lib/dom.js'
import {
  hoje, somaDias, somaMeses, mesmoDia, gradeDoMes, diasDaSemana,
  formatoMesAno, formatoExtenso, noitesEntre, rotuloNoites, paraISO,
} from '../lib/dates.js'

const MESES_VISIVEIS_MOBILE = 14
const LIMITE_FUTURO_MESES = 18

const ehMobile = () => window.matchMedia('(max-width: 47.99em)').matches

/**
 * @param {object} opcoes
 * @param {Date|null} opcoes.checkin
 * @param {Date|null} opcoes.checkout
 * @param {'checkin'|'checkout'} opcoes.foco  Qual campo abriu o calendario.
 * @param {HTMLElement} opcoes.ancora         Elemento que abriu, recebe o foco de volta.
 * @param {(periodo: {checkin: Date|null, checkout: Date|null}) => void} opcoes.aoConfirmar
 */
export const abrirCalendario = (opcoes) => {
  const inicioPermitido = hoje()
  const limite = somaMeses(inicioPermitido, LIMITE_FUTURO_MESES)

  let checkin = opcoes.checkin || null
  let checkout = opcoes.checkout || null
  // Quando o visitante abre pelo campo de saida e ja tem entrada, o proximo
  // clique deve definir a saida, nao recomecar o intervalo.
  let proximo = opcoes.foco === 'checkout' && checkin ? 'checkout' : 'checkin'
  let mesBase = somaMeses(checkin || inicioPermitido, 0)
  let cursor = checkin || inicioPermitido
  let hover = null

  const mobile = ehMobile()
  const dupla = !mobile

  const overlay = el('div', { class: `calendario-overlay ${mobile ? 'is-sheet' : 'is-popover'}` })
  const painel = el('div', {
    class: 'calendario',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Escolher datas da estadia',
  })

  /* ---------------------------------------------------------------- topo */
  const titulo = el('p', { class: 'calendario__titulo' })
  const subtitulo = el('p', { class: 'calendario__subtitulo' })
  const fechar = el('button', {
    type: 'button',
    class: 'calendario__fechar',
    'aria-label': 'Fechar calendário',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    onclick: () => encerrar(),
  })
  const cabecalho = el('header', { class: 'calendario__cabecalho' }, [
    el('div', {}, [titulo, subtitulo]),
    fechar,
  ])

  /* ------------------------------------------------------------ navegacao */
  const btnAnterior = el('button', {
    type: 'button', class: 'calendario__nav calendario__nav--anterior', 'aria-label': 'Mês anterior',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg>',
    onclick: () => trocarMes(-1),
  })
  const btnProximo = el('button', {
    type: 'button', class: 'calendario__nav calendario__nav--proximo', 'aria-label': 'Próximo mês',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>',
    onclick: () => trocarMes(1),
  })

  const meses = el('div', { class: 'calendario__meses' })
  const corpo = el('div', { class: 'calendario__corpo' }, mobile ? [meses] : [btnAnterior, btnProximo, meses])

  /* ---------------------------------------------------------------- rodape */
  const btnLimpar = el('button', {
    type: 'button', class: 'calendario__limpar', text: 'Limpar datas',
    onclick: () => {
      checkin = null
      checkout = null
      proximo = 'checkin'
      render()
      // Limpar tem efeito imediato. Se so valesse ao confirmar, quem limpasse
      // e fechasse pelo X ficaria com as datas antigas sem perceber.
      propagar()
    },
  })
  const btnAplicar = el('button', {
    type: 'button', class: 'calendario__aplicar', text: 'Confirmar',
    onclick: () => confirmar(),
  })
  const rodape = el('footer', { class: 'calendario__rodape' }, [btnLimpar, btnAplicar])

  painel.append(cabecalho, corpo, rodape)
  overlay.append(painel)

  /* ------------------------------------------------------------- helpers */
  const antesDoMinimo = (data) => data < inicioPermitido
  const depoisDoMaximo = (data) => data > limite

  const dentroDoIntervalo = (data) => {
    const fim = checkout || (proximo === 'checkout' ? hover : null)
    if (!checkin || !fim) return false
    return data > checkin && data < fim
  }

  const estadoDoDia = (data) => {
    if (mesmoDia(data, checkin)) return 'inicio'
    if (mesmoDia(data, checkout)) return 'fim'
    if (dentroDoIntervalo(data)) return 'meio'
    return ''
  }

  const escolher = (data) => {
    if (antesDoMinimo(data) || depoisDoMaximo(data)) return

    if (proximo === 'checkin' || !checkin) {
      checkin = data
      checkout = null
      proximo = 'checkout'
    } else if (noitesEntre(checkin, data) < 1) {
      // Clicou em um dia igual ou anterior a entrada: reinicia o intervalo.
      checkin = data
      checkout = null
      proximo = 'checkout'
    } else {
      checkout = data
      proximo = 'checkin'
    }
    hover = null
    cursor = data
    render()
    propagar()
    // Fechar sozinho no desktop assim que o intervalo fica completo mantem o
    // fluxo rapido, sem tirar do visitante a chance de ajustar antes.
    if (checkin && checkout && !mobile) window.setTimeout(encerrar, 160)
  }

  const trocarMes = (passo) => {
    const alvo = somaMeses(mesBase, passo)
    const primeiroPermitido = new Date(inicioPermitido.getFullYear(), inicioPermitido.getMonth(), 1)
    if (alvo < primeiroPermitido || alvo > limite) return
    mesBase = alvo
    render()
  }

  /* -------------------------------------------------------------- teclado */
  const moverCursor = (passo, unidade = 'dia') => {
    const alvo = unidade === 'mes' ? somaMeses(cursor, passo) : somaDias(cursor, passo)
    if (alvo < inicioPermitido || alvo > limite) return
    cursor = alvo
    if (!mobile) {
      const primeiroVisivel = new Date(mesBase.getFullYear(), mesBase.getMonth(), 1)
      const ultimoVisivel = new Date(mesBase.getFullYear(), mesBase.getMonth() + (dupla ? 2 : 1), 0)
      if (cursor < primeiroVisivel) mesBase = somaMeses(mesBase, -1)
      else if (cursor > ultimoVisivel) mesBase = somaMeses(mesBase, 1)
    }
    render()
    const celula = qs(`[data-dia="${paraISO(cursor)}"]`, meses)
    if (celula) {
      celula.focus()
      if (mobile) celula.scrollIntoView({ block: 'nearest' })
    }
  }

  const aoTeclar = (evento) => {
    const mapa = {
      ArrowLeft: () => moverCursor(-1),
      ArrowRight: () => moverCursor(1),
      ArrowUp: () => moverCursor(-7),
      ArrowDown: () => moverCursor(7),
      Home: () => moverCursor(-cursor.getDay()),
      End: () => moverCursor(6 - cursor.getDay()),
      PageUp: () => moverCursor(-1, 'mes'),
      PageDown: () => moverCursor(1, 'mes'),
    }
    if (evento.key === 'Escape') { evento.preventDefault(); encerrar(); return }
    const acao = mapa[evento.key]
    if (!acao) return
    evento.preventDefault()
    acao()
  }

  /* ------------------------------------------------------------- desenho */
  const desenharMes = (referencia) => {
    const rotulo = formatoMesAno(referencia)
    const grade = el('div', { class: 'mes__grade', role: 'grid', 'aria-labelledby': `mes-${paraISO(referencia)}` })

    const linhaDias = el('div', { class: 'mes__semana mes__semana--rotulos', role: 'row' })
    for (const dia of diasDaSemana) {
      linhaDias.append(el('span', { class: 'mes__rotulo', role: 'columnheader', 'aria-label': dia, text: dia }))
    }
    grade.append(linhaDias)

    for (const semana of gradeDoMes(referencia)) {
      const linha = el('div', { class: 'mes__semana', role: 'row' })
      for (const data of semana) {
        if (!data) { linha.append(el('span', { class: 'dia dia--vazio', role: 'gridcell', 'aria-hidden': 'true' })); continue }

        const bloqueado = antesDoMinimo(data) || depoisDoMaximo(data)
        const situacao = estadoDoDia(data)
        const focado = mesmoDia(data, cursor)

        const legenda = [
          formatoExtenso(data),
          situacao === 'inicio' ? 'entrada selecionada' : '',
          situacao === 'fim' ? 'saída selecionada' : '',
          bloqueado ? 'indisponível' : '',
        ].filter(Boolean).join(', ')

        const celula = el('button', {
          type: 'button',
          class: `dia${situacao ? ` dia--${situacao}` : ''}${mesmoDia(data, hoje()) ? ' dia--hoje' : ''}`,
          role: 'gridcell',
          tabindex: focado ? '0' : '-1',
          disabled: bloqueado,
          'aria-disabled': bloqueado ? 'true' : null,
          'aria-selected': situacao === 'inicio' || situacao === 'fim' ? 'true' : 'false',
          'aria-label': legenda,
          dataset: { dia: paraISO(data) },
          onclick: () => escolher(data),
          onmouseenter: () => {
            if (proximo !== 'checkout' || !checkin || checkout) return
            hover = data
            pintarIntervalo()
          },
          onfocus: () => { cursor = data },
        }, [el('span', { class: 'dia__numero', text: String(data.getDate()) })])

        linha.append(celula)
      }
      grade.append(linha)
    }

    return el('section', { class: 'mes' }, [
      el('h3', { class: 'mes__titulo', id: `mes-${paraISO(referencia)}`, text: rotulo }),
      grade,
    ])
  }

  /** Repinta so as classes de intervalo, sem refazer a arvore no hover. */
  const pintarIntervalo = () => {
    for (const celula of qsa('.dia:not(.dia--vazio)', meses)) {
      const data = new Date(`${celula.dataset.dia}T00:00:00`)
      celula.classList.toggle('dia--meio', estadoDoDia(data) === 'meio')
    }
  }

  const render = () => {
    meses.textContent = ''
    if (mobile) {
      const primeiro = new Date(inicioPermitido.getFullYear(), inicioPermitido.getMonth(), 1)
      for (let i = 0; i < MESES_VISIVEIS_MOBILE; i += 1) meses.append(desenharMes(somaMeses(primeiro, i)))
    } else {
      meses.append(desenharMes(mesBase))
      if (dupla) meses.append(desenharMes(somaMeses(mesBase, 1)))
      const primeiroPermitido = new Date(inicioPermitido.getFullYear(), inicioPermitido.getMonth(), 1)
      btnAnterior.disabled = somaMeses(mesBase, -1) < primeiroPermitido
      btnProximo.disabled = somaMeses(mesBase, 1) > limite
    }

    const noites = noitesEntre(checkin, checkout)
    if (checkin && checkout) {
      titulo.textContent = rotuloNoites(noites)
      subtitulo.textContent = `${formatoExtenso(checkin)} até ${formatoExtenso(checkout)}`
    } else if (checkin) {
      titulo.textContent = 'Escolha a saída'
      subtitulo.textContent = `Entrada em ${formatoExtenso(checkin)}`
    } else {
      titulo.textContent = 'Escolha as datas'
      subtitulo.textContent = 'Toque no dia de entrada e depois no de saída'
    }

    btnAplicar.disabled = !checkin
    btnLimpar.disabled = !checkin && !checkout
  }

  /* ------------------------------------------------------------ ciclo de vida */
  let soltarFoco = () => {}

  /** Avisa quem abriu o calendario a cada mudanca, sem fechar. */
  const propagar = () => opcoes.aoConfirmar?.({ checkin, checkout })

  const confirmar = () => {
    propagar()
    encerrar()
  }

  const encerrar = () => {
    overlay.removeEventListener('keydown', aoTeclar)
    document.removeEventListener('click', aoClicarFora, true)
    window.removeEventListener('resize', aoRedimensionar)
    overlay.classList.remove('is-aberto')
    soltarFoco()
    if (mobile) liberarScroll()
    const remover = () => overlay.remove()
    if (menosMovimento()) remover()
    else window.setTimeout(remover, 180)
  }

  const aoClicarFora = (evento) => {
    if (!overlay.contains(evento.target)) encerrar()
  }

  // Trocar de orientacao ou redimensionar muda o layout de popover para sheet.
  const aoRedimensionar = () => { if (ehMobile() !== mobile) encerrar() }

  overlay.addEventListener('keydown', aoTeclar)
  overlay.addEventListener('mousedown', (evento) => { if (evento.target === overlay) encerrar() })

  document.body.append(overlay)
  if (mobile) travarScroll()
  render()

  // O foco vai primeiro e sem esperar quadro nenhum. Prender foco a um
  // requestAnimationFrame parece inofensivo, mas em aba de fundo ou em
  // navegador sem pintar o quadro nunca chega, e aí o calendário abre sem
  // foco: quem navega por teclado fica preso do lado de fora.
  const celulaFoco = qs(`[data-dia="${paraISO(cursor)}"]`, meses) || qs('.dia:not([disabled])', meses)
  celulaFoco?.focus()
  if (mobile) celulaFoco?.scrollIntoView({ block: 'center' })
  soltarFoco = prenderFoco(painel, opcoes.ancora)

  // O listener de clique fora entra no fim da fila de eventos, para não
  // capturar o próprio clique que abriu o calendário.
  window.setTimeout(() => document.addEventListener('click', aoClicarFora, true), 0)
  window.addEventListener('resize', aoRedimensionar)

  // Só a transição visual espera o quadro.
  requestAnimationFrame(() => overlay.classList.add('is-aberto'))

  return { fechar: encerrar }
}
