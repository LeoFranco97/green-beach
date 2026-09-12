/** Helpers minimos de DOM, para o codigo dos componentes ficar legivel. */

/** Cria um elemento com atributos e filhos em uma linha. */
export const el = (tag, attrs = {}, filhos = []) => {
  const node = document.createElement(tag)
  for (const [chave, valor] of Object.entries(attrs)) {
    if (valor === null || valor === undefined || valor === false) continue
    if (chave === 'class') node.className = valor
    else if (chave === 'text') node.textContent = valor
    else if (chave === 'html') node.innerHTML = valor
    else if (chave === 'dataset') Object.assign(node.dataset, valor)
    else if (chave.startsWith('on') && typeof valor === 'function') {
      node.addEventListener(chave.slice(2).toLowerCase(), valor)
    } else node.setAttribute(chave, valor === true ? '' : String(valor))
  }
  for (const filho of [].concat(filhos)) {
    if (filho === null || filho === undefined || filho === false) continue
    node.append(filho instanceof Node ? filho : document.createTextNode(String(filho)))
  }
  return node
}

export const qs = (seletor, raiz = document) => raiz.querySelector(seletor)
export const qsa = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor))

/** Escapa texto para uso seguro dentro de template de HTML. */
export const escapar = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Prende o foco dentro de um container ate ser desfeito.
 * Devolve a funcao de limpeza, que tambem devolve o foco a origem.
 */
export const prenderFoco = (container, origem) => {
  const aoTeclar = (evento) => {
    if (evento.key !== 'Tab') return
    const focaveis = qsa(FOCAVEIS, container).filter((n) => n.offsetParent !== null || n === document.activeElement)
    if (focaveis.length === 0) return
    const primeiro = focaveis[0]
    const ultimo = focaveis[focaveis.length - 1]
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault()
      ultimo.focus()
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault()
      primeiro.focus()
    }
  }
  container.addEventListener('keydown', aoTeclar)
  return () => {
    container.removeEventListener('keydown', aoTeclar)
    if (origem && typeof origem.focus === 'function') origem.focus()
  }
}

/** Trava a rolagem do body preservando a posicao, para modais em mobile. */
let travas = 0
let scrollSalvo = 0
export const travarScroll = () => {
  travas += 1
  if (travas > 1) return
  scrollSalvo = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollSalvo}px`
  document.body.style.width = '100%'
}
export const liberarScroll = () => {
  travas = Math.max(0, travas - 1)
  if (travas > 0) return
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollSalvo)
}

/** True quando o usuario pediu menos movimento no sistema. */
export const menosMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Dispara uma vez, quando o elemento entra na tela.
 *
 * Nao confia so no IntersectionObserver. Ele deixa de disparar em situacoes
 * reais: aba em segundo plano, navegador que parou de compor quadros, captura
 * automatizada. Como aqui ele costuma ser o gatilho de uma animacao que
 * revela conteudo, falhar em silencio significa deixar um bloco invisivel.
 * Por isso: observador como atalho, medicao direta a cada rolagem como fonte
 * da verdade, e um teto de tempo como ultimo recurso.
 */
export const aoAparecer = (node, callback, margem = '120px', teto = 6000) => {
  let disparado = false
  const disparar = () => {
    if (disparado) return
    disparado = true
    limpar()
    callback()
  }

  const naTela = () => {
    const r = node.getBoundingClientRect()
    const altura = window.innerHeight || document.documentElement.clientHeight
    return r.top < altura * 1.05 && r.bottom > -altura * 0.05
  }

  let agendado = false
  const aoRolar = () => {
    if (agendado) return
    agendado = true
    requestAnimationFrame(() => { agendado = false; if (naTela()) disparar() })
  }

  let obs = null
  const prazo = window.setTimeout(disparar, teto)

  const limpar = () => {
    window.clearTimeout(prazo)
    window.removeEventListener('scroll', aoRolar)
    window.removeEventListener('resize', aoRolar)
    if (obs) obs.disconnect()
  }

  if ('IntersectionObserver' in window) {
    obs = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) if (entrada.isIntersecting) return disparar()
    }, { rootMargin: margem })
    obs.observe(node)
  }

  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRolar, { passive: true })
  if (naTela()) disparar()

  return limpar
}
