/**
 * Mapa da localização.
 *
 * Faz uma viagem: começa no Brasil inteiro, fecha em Santa Catarina, fecha de
 * novo em Itapema e larga o alfinete em cima da pousada. É uma câmera só,
 * andando num espaço de coordenadas só, sem corte entre as etapas.
 *
 * Serve a quem não é da região, que é justamente quem precisa decidir o
 * destino antes de decidir a cama.
 *
 * Regras que valem para tudo aqui:
 *   - O alfinete vive DENTRO da câmera. A posição vem do mesmo transform do
 *     mapa, então não existe como ele sair do lugar. Só a escala é
 *     compensada, para o tamanho na tela ficar constante em qualquer zoom.
 *   - Com movimento reduzido, o mapa nasce no estado final.
 */
import { el, qs, aoAparecer, menosMovimento } from '../lib/dom.js'
import { MAPA, PROJECAO, VISTAS } from '../data/mapa-sc.js'
import { pousada } from '../data/pousada.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

/** Tamanho aparente do alfinete: ele é marcador de interface, não cresce. */
const ALFINETE_NA_TELA = 2.3

/** Ritmo da viagem, em milissegundos a partir do início. */
const ROTEIRO = [
  { em: 40, faz: 'desenhar' },
  { em: 900, faz: 'estado' },
  { em: 2500, faz: 'cidade' },
  { em: 3800, faz: 'alfinete' },
  { em: 5000, faz: 'fim' },
]

/**
 * Converte latitude e longitude para o viewBox do mapa.
 * Os parâmetros vêm do arquivo gerado, então mudar a projeção lá muda aqui
 * junto e não existe número solto para desencontrar.
 */
export const projetar = (lat, lng) => {
  // Os dois eixos em radiano. Grau no x com radiano no y esmaga o mapa numa
  // faixa horizontal, porque um radiano vale 57,3 graus.
  const mx = (lng * Math.PI) / 180
  const my = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
  return {
    x: PROJECAO.offsetX + (mx - PROJECAO.mercMinX) * PROJECAO.escala,
    y: PROJECAO.offsetY + (PROJECAO.mercMax - my) * PROJECAO.escala,
  }
}

export const criarMapa = () => {
  const { lat, lng } = pousada.endereco.coordenadas
  if (!pousada.endereco.confirmado || lat === null || lng === null) return null

  const ponto = projetar(lat, lng)

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'mapa__svg')
  svg.setAttribute('viewBox', `0 0 ${PROJECAO.largura} ${PROJECAO.altura}`)
  svg.setAttribute('role', 'img')
  svg.setAttribute(
    'aria-label',
    `Mapa do Brasil que se aproxima até Itapema, em Santa Catarina, onde fica a ${pousada.nome}`,
  )

  svg.innerHTML = `
    <defs>
      <linearGradient id="gbTerra" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#46543a"/>
        <stop offset=".55" stop-color="#3a452b"/>
        <stop offset="1" stop-color="#2b3420"/>
      </linearGradient>
      <linearGradient id="gbDestaque" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e5b64e"/>
        <stop offset="1" stop-color="#c79a35"/>
      </linearGradient>
      <filter id="gbGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gbSombra" x="-70%" y="-70%" width="240%" height="240%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.2" flood-color="#0d1209" flood-opacity=".6"/>
      </filter>
    </defs>
    <g class="mapa__cam">
      <path class="mapa__brasil" d="${MAPA.brasil}"/>
      <path class="mapa__terra" d="${MAPA.estado}"/>
      <path class="mapa__divisas" d="${MAPA.municipios}"/>
      <path class="mapa__cidade" d="${MAPA.itapema}"/>
      <path class="mapa__contorno" d="${MAPA.estado}"/>
      <g class="mapa__alfinete"></g>
    </g>
  `

  const cam = qs('.mapa__cam', svg)
  const contorno = qs('.mapa__contorno', svg)

  const alfinete = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  alfinete.setAttribute('class', 'alfinete')
  alfinete.innerHTML = `
    <circle class="alfinete__eco" cx="0" cy="0" r="9"/>
    <g class="alfinete__corpo">
      <path class="alfinete__forma" d="M0 2c0-6.9 5.6-12.5 12.5-12.5S25-4.9 25 2c0 8.6-12.5 21-12.5 21S0 10.6 0 2Z" transform="translate(-12.5,-23)"/>
      <circle class="alfinete__miolo" cx="0" cy="-21" r="4.6"/>
    </g>
    <text class="alfinete__rotulo" x="0" y="13">GREEN BEACH</text>
  `
  qs('.mapa__alfinete', svg).append(alfinete)

  /** Relogios da coreografia, para poder cancelar e tocar de novo. */
  let relogios = []

  /* -------------------------------------------------------------- câmera */
  const aplicarVista = (v) => {
    const tx = PROJECAO.largura / 2 - v.cx * v.z
    const ty = PROJECAO.altura / 2 - v.cy * v.z
    cam.setAttribute('transform', `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${v.z})`)
    alfinete.setAttribute(
      'transform',
      `translate(${ponto.x},${ponto.y}) scale(${(ALFINETE_NA_TELA / v.z).toFixed(4)})`,
    )
  }

  /* --------------------------------------------------------------- palco */
  const palco = el('div', { class: 'mapa__palco' }, [
    el('div', { class: 'mapa__grade', 'aria-hidden': 'true' }),
  ])
  palco.append(svg)

  const badge = el('span', { class: 'mapa__badge', text: 'Brasil' })

  /** Etapas que o botão percorre, na ordem em que a viagem acontece. */
  const ETAPAS = [
    { vista: VISTAS.brasil, badge: 'Brasil', proximo: 'Aproximar' },
    { vista: VISTAS.estado, badge: 'Santa Catarina', proximo: 'Aproximar' },
    { vista: VISTAS.cidade, badge: 'Itapema, litoral norte', proximo: 'Ver o Brasil' },
  ]
  let etapa = 0

  const irPara = (indice, deClique = false) => {
    etapa = (indice + ETAPAS.length) % ETAPAS.length
    const atual = ETAPAS[etapa]
    aplicarVista(atual.vista)
    badge.textContent = atual.badge
    botao.textContent = atual.proximo
    palco.classList.toggle('is-perto', etapa >= 1)
    palco.classList.toggle('is-cidade', etapa === 2)
    if (deClique) rastrear(EVENTOS.MAPA_ABERTO, { etapa: atual.badge })
  }

  // Dois controles, e nao um. Juntar "andar de etapa" com "rever a viagem" no
  // mesmo botao fazia o Brasil aparecer por um segundo e ir embora sozinho,
  // que e o oposto do que a pessoa pediu ao clicar.
  const botao = el('button', {
    type: 'button',
    class: 'mapa__botao',
    text: 'Aproximar',
    onclick: () => irPara(etapa + 1, true),
  })

  const rever = el('button', {
    type: 'button',
    class: 'mapa__rever',
    'aria-label': 'Rever a viagem do mapa, do Brasil até a pousada',
    html: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M13.5 8a5.5 5.5 0 1 1-1.9-4.2M13.5 1.5V5H10"/></svg>',
    onclick: () => {
      rastrear(EVENTOS.MAPA_ABERTO, { etapa: 'rever' })
      tocar()
    },
  })

  palco.append(el('div', { class: 'mapa__hud' }, [badge, el('div', { class: 'mapa__ctrls' }, [botao, rever])]))

  /* --------------------------------------------------------- coreografia */

  /**
   * Toca a viagem.
   *
   * Reinicia do zero toda vez, para o botao poder pedir de novo.
   */
  const tocar = () => {
    for (const t of relogios) window.clearTimeout(t)
    relogios = []

    palco.classList.remove('is-desenhado', 'is-marcado', 'is-final')
    irPara(0)
    // O comprimento real do traco vira a base do stroke-dasharray, senao a
    // linha "desenhando" comeca e termina em lugares arbitrarios.
    contorno.style.setProperty('--traco', contorno.getTotalLength())
    void palco.offsetWidth
    palco.classList.add('is-pronto')

    for (const passo of ROTEIRO) {
      relogios.push(window.setTimeout(() => {
        if (passo.faz === 'desenhar') palco.classList.add('is-desenhado')
        if (passo.faz === 'estado') irPara(1)
        if (passo.faz === 'cidade') irPara(2)
        if (passo.faz === 'alfinete') palco.classList.add('is-marcado')
        if (passo.faz === 'fim') palco.classList.add('is-final')
      }, passo.em))
    }
  }

  /**
   * Espera o mapa estar DE FATO na tela para tocar.
   *
   * Aqui nao existe rede de seguranca por tempo, e e de proposito. Numa
   * animacao que revela conteudo, disparar por tempo e o certo: melhor mostrar
   * sem animar do que deixar o bloco invisivel. Aqui e o contrario: o estado
   * inicial ja e um mapa completo e legivel, do Brasil. Se a viagem disparar
   * por tempo enquanto o visitante ainda esta no topo da pagina, ela acontece
   * inteira sem plateia, e quando ele finalmente chega o mapa ja esta parado
   * no fim. Foi exatamente esse o defeito relatado.
   *
   * Por isso: metade do mapa visivel, medida de verdade, e so entao toca.
   */
  const esperarPalco = () => {
    let tocou = false
    const visivel = () => {
      const r = palco.getBoundingClientRect()
      const altura = window.innerHeight || document.documentElement.clientHeight
      const dentro = Math.min(r.bottom, altura) - Math.max(r.top, 0)
      return dentro > 0 && dentro >= Math.min(r.height, altura) * 0.45
    }
    const conferir = () => {
      if (tocou || !visivel()) return
      tocou = true
      limpar()
      tocar()
    }

    let agendado = false
    const aoRolar = () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(() => { agendado = false; conferir() })
    }

    let obs = null
    const limpar = () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      if (obs) obs.disconnect()
    }

    if ('IntersectionObserver' in window) {
      obs = new IntersectionObserver(conferir, { threshold: [0, 0.25, 0.45, 0.7] })
      obs.observe(palco)
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })
    conferir()
  }

  if (menosMovimento()) {
    irPara(2)
    palco.classList.add('is-desenhado', 'is-marcado', 'is-final')
  } else {
    irPara(0)
    palco.classList.add('is-pronto')
    esperarPalco()
  }

  return palco
}

/**
 * Seção que embrulha o mapa.
 *
 * Fica logo depois do hero: quem chega numa pousada que nunca ouviu falar
 * precisa saber onde isso fica antes de qualquer outra coisa.
 */
export const criarSecaoMapa = () => {
  const palco = criarMapa()
  if (!palco) return null

  const texto = el('div', { class: 'mapa__texto' }, [
    el('p', { class: 'olho', text: 'Onde fica' }),
    el('h2', { class: 'secao__titulo', text: 'Itapema, no litoral norte de Santa Catarina' }),
    el('p', {
      class: 'mapa__apoio',
      text: 'Entre Balneário Camboriú e Porto Belo, na faixa de praia mais movimentada do estado. A pousada fica no centro, a poucos passos da areia.',
    }),
    el('p', {
      class: 'mapa__endereco',
      text: pousada.endereco.linhaUnica,
    }),
  ])

  return el('section', {
    class: 'secao mapa gb-dark tem-fundo',
    id: 'mapa',
    dataset: { surface: 'dark' },
  }, [
    el('div', { class: 'secao__interno mapa__grade-mestre' }, [texto, palco]),
  ])
}
