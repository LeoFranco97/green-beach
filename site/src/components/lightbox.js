/**
 * Lightbox de tela cheia para a galeria.
 * Teclado: setas para navegar, Esc para fechar, Tab preso dentro do dialogo.
 * Mobile: arrastar para o lado troca a foto, arrastar para baixo fecha.
 */
import { el, qs, prenderFoco, travarScroll, liberarScroll, menosMovimento } from '../lib/dom.js'

const LIMIAR_ARRASTO = 60

/**
 * @param {Array<{src: string, alt: string, legenda?: string, categoria?: string}>} fotos
 * @param {number} indiceInicial
 * @param {HTMLElement} ancora Elemento que recebe o foco de volta ao fechar.
 */
export const abrirLightbox = (fotos, indiceInicial = 0, ancora = null) => {
  if (!Array.isArray(fotos) || fotos.length === 0) return
  let indice = Math.min(Math.max(0, indiceInicial), fotos.length - 1)

  const imagem = el('img', { class: 'lightbox__imagem', decoding: 'async' })
  const legenda = el('p', { class: 'lightbox__legenda' })
  const contador = el('p', { class: 'lightbox__contador', 'aria-live': 'polite' })

  const botaoAnterior = el('button', {
    type: 'button', class: 'lightbox__nav lightbox__nav--anterior', 'aria-label': 'Foto anterior',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg>',
    onclick: () => irPara(indice - 1),
  })
  const botaoProximo = el('button', {
    type: 'button', class: 'lightbox__nav lightbox__nav--proximo', 'aria-label': 'Próxima foto',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>',
    onclick: () => irPara(indice + 1),
  })
  const botaoFechar = el('button', {
    type: 'button', class: 'lightbox__fechar', 'aria-label': 'Fechar galeria',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    onclick: () => encerrar(),
  })

  const palco = el('div', { class: 'lightbox__palco' }, [imagem])
  const painel = el('div', {
    class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Fotos da pousada',
  }, [
    el('header', { class: 'lightbox__topo' }, [contador, botaoFechar]),
    el('div', { class: 'lightbox__meio' }, [botaoAnterior, palco, botaoProximo]),
    el('footer', { class: 'lightbox__rodape' }, [legenda]),
  ])

  const overlay = el('div', { class: 'lightbox-overlay' }, [painel])

  /** Pre-carrega vizinhas para a troca ser instantanea. */
  const preCarregar = (i) => {
    const foto = fotos[(i + fotos.length) % fotos.length]
    if (!foto) return
    const img = new Image()
    img.src = foto.src
  }

  const render = () => {
    const foto = fotos[indice]
    imagem.src = foto.src
    if (foto.srcset) { imagem.srcset = foto.srcset; imagem.sizes = '100vw' }
    imagem.alt = foto.alt || ''
    legenda.textContent = foto.legenda || foto.categoria || ''
    legenda.hidden = !legenda.textContent
    contador.textContent = `${indice + 1} de ${fotos.length}`
    const unica = fotos.length < 2
    botaoAnterior.hidden = unica
    botaoProximo.hidden = unica
    preCarregar(indice + 1)
    preCarregar(indice - 1)
  }

  const irPara = (novo) => {
    // O CSS lê data-sentido para a foto entrar do lado certo, e is-trocando
    // para disparar a animação. Reiniciar a classe força o replay quando a
    // pessoa segura a seta.
    const anterior = indice
    indice = (novo + fotos.length) % fotos.length
    const avancou = (indice - anterior + fotos.length) % fotos.length <= fotos.length / 2
    palco.dataset.sentido = avancou ? 'proximo' : 'anterior'
    palco.classList.remove('is-trocando')
    void palco.offsetWidth
    palco.classList.add('is-trocando')
    render()
  }

  const aoTeclar = (evento) => {
    if (evento.key === 'Escape') { evento.preventDefault(); encerrar() }
    else if (evento.key === 'ArrowRight') { evento.preventDefault(); irPara(indice + 1) }
    else if (evento.key === 'ArrowLeft') { evento.preventDefault(); irPara(indice - 1) }
    else if (evento.key === 'Home') { evento.preventDefault(); irPara(0) }
    else if (evento.key === 'End') { evento.preventDefault(); irPara(fotos.length - 1) }
  }

  /* ------------------------------------------------------------- gestos */
  let inicioX = 0
  let inicioY = 0
  let arrastando = false

  palco.addEventListener('pointerdown', (evento) => {
    if (evento.pointerType === 'mouse') return
    arrastando = true
    inicioX = evento.clientX
    inicioY = evento.clientY
    palco.setPointerCapture(evento.pointerId)
  })
  palco.addEventListener('pointermove', (evento) => {
    if (!arrastando) return
    const dx = evento.clientX - inicioX
    const dy = evento.clientY - inicioY
    if (Math.abs(dx) > Math.abs(dy)) imagem.style.transform = `translateX(${dx * 0.4}px)`
    else if (dy > 0) imagem.style.transform = `translateY(${dy * 0.4}px)`
  })
  const encerrarArrasto = (evento) => {
    if (!arrastando) return
    arrastando = false
    imagem.style.transform = ''
    const dx = evento.clientX - inicioX
    const dy = evento.clientY - inicioY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > LIMIAR_ARRASTO) irPara(indice + (dx < 0 ? 1 : -1))
    else if (dy > LIMIAR_ARRASTO * 1.5) encerrar()
  }
  palco.addEventListener('pointerup', encerrarArrasto)
  palco.addEventListener('pointercancel', () => { arrastando = false; imagem.style.transform = '' })

  /* --------------------------------------------------------- ciclo de vida */
  let soltarFoco = () => {}

  const encerrar = () => {
    overlay.removeEventListener('keydown', aoTeclar)
    overlay.classList.remove('is-aberto')
    soltarFoco()
    liberarScroll()
    const remover = () => overlay.remove()
    if (menosMovimento()) remover()
    else window.setTimeout(remover, 200)
  }

  overlay.addEventListener('keydown', aoTeclar)
  overlay.addEventListener('mousedown', (evento) => {
    if (evento.target === overlay || evento.target === palco) encerrar()
  })

  document.body.append(overlay)
  travarScroll()
  render()

  // Foco imediato, transição no quadro seguinte. Ver calendario.js.
  botaoFechar.focus()
  soltarFoco = prenderFoco(painel, ancora)
  requestAnimationFrame(() => overlay.classList.add('is-aberto'))

  return { fechar: encerrar }
}
