/**
 * Mapa de Santa Catarina com a pousada marcada.
 *
 * A ideia é dar contexto de destino para quem não é de Santa Catarina: onde
 * fica Itapema, e onde no meio de Itapema fica a pousada. O contorno do
 * estado se desenha, a câmera fecha no litoral e o alfinete cai.
 *
 * Regras que valem para tudo aqui:
 *   - O alfinete vive DENTRO da câmera. A posição vem do mesmo transform do
 *     mapa, então não existe como ele sair do lugar. Só a escala é
 *     compensada, para o tamanho na tela ficar constante em qualquer zoom.
 *   - Com movimento reduzido, o mapa nasce no estado final. Nada de ficar
 *     esperando uma animação que não vai rodar.
 */
import { el, qs, aoAparecer, menosMovimento } from '../lib/dom.js'
import { SC } from '../data/mapa-sc.js'
import { pousada } from '../data/pousada.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

const NS = 'http://www.w3.org/2000/svg'

/**
 * Enquadramentos da câmera, em coordenadas do viewBox 1000x640.
 * ALFINETE_NA_TELA é o tamanho aparente do alfinete: ele é marcador de
 * interface, então não cresce junto com o zoom.
 */
const ALFINETE_NA_TELA = 2.3

const VISTA_ESTADO = { cx: 500, cy: 320, z: 1 }
// Aberto o bastante para a linha da costa e os municipios vizinhos
// aparecerem. Fechar demais tira justamente a informacao que o mapa da:
// onde no litoral isso fica.
const VISTA_POUSADA = { cx: 897, cy: 205, z: 5.2 }

/**
 * Converte latitude e longitude para o viewBox do mapa.
 * A projeção foi ajustada contra cinco pontos conhecidos, com erro abaixo de
 * 0,05px. Ver o cabeçalho de data/mapa-sc.js.
 */
export const projetar = (lat, lng) => ({
  x: 162.340287 * lng + 8796.882037,
  y: -9312.759979 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) - 4364.821223,
})

const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(NS, tag)
  for (const [chave, valor] of Object.entries(attrs)) {
    if (valor !== null && valor !== undefined) node.setAttribute(chave, String(valor))
  }
  return node
}

export const criarMapa = () => {
  const { lat, lng } = pousada.endereco.coordenadas
  if (!pousada.endereco.confirmado || lat === null || lng === null) return null

  const ponto = projetar(lat, lng)

  /* ----------------------------------------------------------------- svg */
  const svg = svgEl('svg', {
    class: 'mapa__svg',
    viewBox: '0 0 1000 640',
    role: 'img',
    'aria-label': `Mapa de Santa Catarina com a ${pousada.nome} marcada em Itapema, no litoral norte`,
  })

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
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gbSombra" x="-70%" y="-70%" width="240%" height="240%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.2" flood-color="#0d1209" flood-opacity=".6"/>
      </filter>
    </defs>
    <g class="mapa__cam">
      <path class="mapa__terra" d="${SC.estado}"/>
      <path class="mapa__divisas" d="${SC.municipios}"/>
      <path class="mapa__cidade" d="${SC.itapema}"/>
      <path class="mapa__contorno" d="${SC.estado}"/>
      <g class="mapa__alfinete"></g>
    </g>
  `

  const cam = qs('.mapa__cam', svg)
  const contorno = qs('.mapa__contorno', svg)
  const grupoAlfinete = qs('.mapa__alfinete', svg)

  /* ------------------------------------------------------------ alfinete */
  // O desenho vive em coordenadas próprias e é levado ao ponto por transform,
  // para o transform carregar posição e escala sem misturar com a animação.
  const alfinete = svgEl('g', { class: 'alfinete' })
  alfinete.innerHTML = `
    <circle class="alfinete__eco" cx="0" cy="0" r="9"/>
    <g class="alfinete__corpo">
      <path class="alfinete__forma" d="M0 2c0-6.9 5.6-12.5 12.5-12.5S25-4.9 25 2c0 8.6-12.5 21-12.5 21S0 10.6 0 2Z" transform="translate(-12.5,-23)"/>
      <circle class="alfinete__miolo" cx="0" cy="-21" r="4.6"/>
    </g>
    <text class="alfinete__rotulo" x="0" y="12">GREEN BEACH</text>
  `
  grupoAlfinete.append(alfinete)

  /* -------------------------------------------------------------- câmera */
  let vista = VISTA_ESTADO

  /**
   * Aponta a câmera. O alfinete recebe a escala inversa no mesmo quadro, para
   * não crescer junto com o zoom: no mapa ele é um marcador de interface, e
   * marcador de interface tem tamanho fixo na tela.
   */
  const aplicarVista = (v) => {
    vista = v
    const tx = 500 - v.cx * v.z
    const ty = 320 - v.cy * v.z
    cam.setAttribute('transform', `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${v.z})`)
    alfinete.setAttribute('transform', `translate(${ponto.x},${ponto.y}) scale(${(ALFINETE_NA_TELA / v.z).toFixed(4)})`)
  }

  /* ------------------------------------------------------------- palco */
  const palco = el('div', { class: 'mapa__palco' }, [
    el('div', { class: 'mapa__grade', 'aria-hidden': 'true' }),
  ])
  palco.append(svg)

  const badge = el('span', { class: 'mapa__badge', text: 'Santa Catarina' })
  const botaoVista = el('button', {
    type: 'button',
    class: 'mapa__botao',
    text: 'Ver o estado',
    onclick: () => {
      const noEstado = palco.classList.toggle('is-aberto')
      aplicarVista(noEstado ? VISTA_ESTADO : VISTA_POUSADA)
      botaoVista.textContent = noEstado ? 'Ver a pousada' : 'Ver o estado'
      badge.textContent = noEstado ? 'Santa Catarina' : 'Itapema, litoral norte'
      rastrear(EVENTOS.MAPA_ABERTO, { destino: noEstado ? 'estado' : 'pousada' })
    },
  })

  palco.append(el('div', { class: 'mapa__hud' }, [badge, botaoVista]))

  /* ------------------------------------------------------------- coluna */
  // Sem endereço nem botão de rota aqui: isso é trabalho da seção de chegada,
  // mais abaixo. Este bloco responde só "onde fica Itapema".
  const texto = el('div', { class: 'mapa__texto' }, [
    el('p', { class: 'olho', text: 'Onde fica' }),
    el('h2', { class: 'secao__titulo', text: 'Itapema, no litoral norte de Santa Catarina' }),
    el('p', {
      class: 'mapa__apoio',
      text: 'Entre Balneário Camboriú e Porto Belo, na faixa de praia mais movimentada do estado. A pousada fica no centro, a poucos passos da areia.',
    }),
  ])

  const raiz = el('section', {
    class: 'secao mapa gb-dark tem-fundo',
    id: 'mapa',
    dataset: { surface: 'dark' },
  }, [
    el('div', { class: 'secao__interno mapa__grade-mestre' }, [texto, palco]),
  ])

  /* ------------------------------------------------------ coreografia */
  const tocar = () => {
    // O comprimento real do traço vira a base do stroke-dasharray, senão a
    // linha "desenhando" começa e termina em lugares arbitrários.
    const comprimento = contorno.getTotalLength()
    contorno.style.setProperty('--traco', comprimento)

    aplicarVista(VISTA_ESTADO)
    // Força um quadro antes de ligar as transições, para o contorno não
    // aparecer desenhado de uma vez.
    void palco.offsetWidth
    palco.classList.add('is-pronto')

    window.setTimeout(() => palco.classList.add('is-desenhado'), 60)
    window.setTimeout(() => {
      aplicarVista(VISTA_POUSADA)
      palco.classList.add('is-perto')
      badge.textContent = 'Itapema, litoral norte'
    }, 1500)
    window.setTimeout(() => palco.classList.add('is-marcado'), 2900)
    // Rede de segurança: se a animação do alfinete não rodar, por aba em
    // segundo plano ou navegador que parou de compor, ele fica invisível.
    window.setTimeout(() => palco.classList.add('is-final'), 4600)
  }

  if (menosMovimento()) {
    aplicarVista(VISTA_POUSADA)
    palco.classList.add('is-desenhado', 'is-perto', 'is-marcado', 'is-final')
    badge.textContent = 'Itapema, litoral norte'
  } else {
    aplicarVista(VISTA_ESTADO)
    aoAparecer(raiz, tocar, '-10%')
  }

  return raiz
}
