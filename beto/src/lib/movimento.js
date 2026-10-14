/**
 * Motor do movimento.
 *
 * O CSS de `styles/movimento.css` faz o desenho; este arquivo só liga e
 * desliga as classes que ele espera. A divisão é proposital: quem quiser
 * mudar uma duração mexe no CSS, não aqui.
 *
 * Contrato com o CSS:
 *   <html class="js">          JavaScript vivo. Sem isso nada fica escondido.
 *   <html class="is-pronto">   fontes carregadas, a coreografia do hero pode ir
 *   .m-entra / .m-cascata      recebem .is-dentro ao aparecer na tela
 *   .m-revela                  idem, para a limpeza da foto
 *   .m-numero                  idem, para o número que sobe
 *   .m-foto                    recebe .is-carregada quando a imagem chega
 *   .m-titulo > .m-linha > span  cada linha do display do hero
 *
 * Nada aqui é obrigatório para a página funcionar: se este módulo falhar,
 * o pior que acontece é a página ficar parada, e parada ela continua inteira.
 */
import { qs, qsa, menosMovimento } from './dom.js'

const LIMITE_FONTE = 900

/**
 * Quebra o título do hero em linhas visuais e embrulha cada uma.
 * Mede a posição real de cada palavra depois do layout, então acompanha
 * qualquer quebra que a fonte e a largura produzirem.
 *
 * Precisa rodar com a fonte final já carregada. Fatiar com a fonte de
 * fallback dá linhas erradas, e aí uma "linha" com texto demais quebra
 * de novo dentro da própria máscara.
 *
 * Acessibilidade: o texto completo continua no h1, palavra por palavra, com
 * espaços de verdade. O leitor de tela lê a frase inteira, não linha a linha.
 */
const fatiarTitulo = (titulo) => {
  if (!titulo) return
  const texto = (titulo.dataset.textoOriginal || titulo.textContent).replace(/\s+/g, ' ').trim()
  if (!texto) return
  titulo.dataset.textoOriginal = texto

  // Passo 1: cada palavra vira uma marca, para dar para medir onde ela caiu.
  titulo.textContent = ''
  titulo.classList.remove('m-titulo')
  const marcas = []
  texto.split(' ').forEach((palavra, i, lista) => {
    const marca = document.createElement('span')
    marca.textContent = palavra
    titulo.append(marca)
    if (i < lista.length - 1) titulo.append(document.createTextNode(' '))
    marcas.push(marca)
  })

  // Passo 2: palavras que compartilham o mesmo topo estão na mesma linha.
  const linhas = []
  let topoAtual = null
  for (const marca of marcas) {
    const topo = Math.round(marca.offsetTop)
    if (topo !== topoAtual) { linhas.push([]); topoAtual = topo }
    linhas[linhas.length - 1].push(marca.textContent)
  }

  // Passo 3: remonta com uma máscara por linha.
  titulo.textContent = ''
  titulo.classList.add('m-titulo')
  linhas.forEach((linha, i) => {
    const caixa = document.createElement('span')
    caixa.className = 'm-linha'
    const interno = document.createElement('span')
    interno.textContent = linha.join(' ')
    caixa.append(interno)
    titulo.append(caixa)
    // Espaço entre linhas para o leitor de tela não colar as palavras.
    if (i < linhas.length - 1) titulo.append(document.createTextNode(' '))
  })
}

/**
 * Refaz o fatiamento quando a largura muda de verdade.
 * Só reage a mudança de largura: no celular, rolar a página muda a altura
 * porque a barra de endereço aparece e some, e isso não é redimensionar.
 */
const acompanharLargura = (titulo) => {
  if (!titulo) return
  let larguraAnterior = window.innerWidth
  let agendado = 0
  window.addEventListener('resize', () => {
    if (window.innerWidth === larguraAnterior) return
    larguraAnterior = window.innerWidth
    window.clearTimeout(agendado)
    agendado = window.setTimeout(() => fatiarTitulo(titulo), 180)
  })
}

/**
 * Espera a fonte de display chegar, fatia o título com ela e só então libera
 * a coreografia. Teto de tempo para uma rede ruim não segurar o hero.
 */
const prepararHero = () => {
  const titulo = qs('.hero__titulo')
  const liberar = () => {
    fatiarTitulo(titulo)
    document.documentElement.classList.add('is-pronto')
  }

  let liberado = false
  const umaVez = () => { if (!liberado) { liberado = true; liberar() } }

  const teto = window.setTimeout(umaVez, LIMITE_FONTE)
  const fontes = document.fonts?.ready
  if (fontes) fontes.then(() => { window.clearTimeout(teto); umaVez() }).catch(umaVez)
  else { window.clearTimeout(teto); umaVez() }

  acompanharLargura(titulo)
}

const SELETOR_ANIMAVEL = '.m-entra, .m-cascata, .m-revela, .m-numero'

/**
 * Revela tudo que está dentro da tela agora, medindo direto.
 *
 * Isto é a rede de segurança do sistema inteiro. O CSS esconde os blocos
 * antes de eles entrarem, e quem os mostra de volta é o IntersectionObserver.
 * Se o observador não disparar, e existe mais de uma situação real em que ele
 * não dispara (aba em segundo plano, navegador que para de compor quadros,
 * captura de página inteira, extensão que mexe no scroll), a página fica em
 * branco. Uma medição direta nunca falha, então ela é a fonte da verdade e o
 * observador é só o atalho eficiente.
 */
const revelarVisiveis = (nodes) => {
  const altura = window.innerHeight || document.documentElement.clientHeight
  let restantes = 0
  for (const node of nodes) {
    if (node.classList.contains('is-dentro')) continue
    const r = node.getBoundingClientRect()
    const dentro = r.top < altura * 0.94 && r.bottom > 0
    if (dentro || r.bottom <= 0) node.classList.add('is-dentro')
    else restantes += 1
  }
  return restantes
}

/** Liga observador e, junto, a verificação por rolagem que serve de rede. */
const observarEntradas = () => {
  const nodes = qsa(SELETOR_ANIMAVEL)
  if (nodes.length === 0) return

  const revelarTudo = () => { for (const n of nodes) n.classList.add('is-dentro') }

  if (!('IntersectionObserver' in window)) { revelarTudo(); return }

  const observador = new IntersectionObserver((entradas, obs) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue
      entrada.target.classList.add('is-dentro')
      obs.unobserve(entrada.target)
    }
  }, {
    // Começa um pouco antes de entrar de fato, senão a animação só aparece
    // depois que o bloco já está visível e o efeito se perde.
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.06,
  })
  for (const node of nodes) observador.observe(node)

  // Rede de segurança 1: o que já está na tela no primeiro quadro.
  revelarVisiveis(nodes)

  // Rede de segurança 2: a cada rolagem, uma medição direta. Custa uma
  // leitura de layout por quadro rolado, e só enquanto sobrar bloco escondido.
  let agendado = false
  const aoRolar = () => {
    if (agendado) return
    agendado = true
    requestAnimationFrame(() => {
      agendado = false
      if (revelarVisiveis(nodes) === 0) {
        window.removeEventListener('scroll', aoRolar)
        window.removeEventListener('resize', aoRolar)
        observador.disconnect()
      }
    })
  }
  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRolar, { passive: true })

  // Rede de segurança 3: se depois de oito segundos ainda houver bloco
  // escondido acima da dobra atual, mostra assim mesmo. Melhor perder a
  // animação de um bloco do que perder o bloco.
  window.setTimeout(() => revelarVisiveis(nodes), 8000)
}

/** Marca a foto como carregada, para o CSS soltar o blur da miniatura. */
const acompanharFotos = (raiz = document) => {
  for (const img of qsa('.m-foto', raiz)) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-carregada')
    } else {
      img.addEventListener('load', () => img.classList.add('is-carregada'), { once: true })
      img.addEventListener('error', () => img.classList.add('is-carregada'), { once: true })
    }
  }
}

/**
 * Aplica as classes de movimento na árvore já montada.
 * Fica aqui, e não espalhado pelos componentes, para o inventário do que anima
 * caber em uma tela só.
 */
const marcarElementos = () => {
  const marcar = (seletor, ...classes) => {
    for (const node of qsa(seletor)) node.classList.add(...classes)
  }

  // Fotos com carregamento progressivo a partir da miniatura.
  marcar('.hero__imagem, .mosaico__imagem, .acomodacao__foto img, .recorte__foto img, .sobre__foto img, .faixa__imagem, .fechamento__imagem', 'm-foto')

  // Deriva lenta nas fotos grandes. Alterna o sentido para duas vizinhas
  // nunca andarem para o mesmo lado.
  marcar('.hero__imagem', 'm-kenburns')
  qsa('.faixa__imagem, .fechamento__imagem').forEach((img, i) => {
    img.classList.add('m-kenburns')
    if (i % 2 === 1) img.classList.add('m-kenburns--inversa')
  })

  // Limpeza de imagem ao entrar na tela.
  marcar('.mosaico__celula, .recorte__foto, .sobre__foto, .acomodacao__foto', 'm-revela')

  // Blocos de texto que sobem ao aparecer.
  marcar('.secao__cabecalho, .sobre__texto, .localizacao__texto, .duvidas__cabecalho, .fechamento__texto, .faixa__interno', 'm-entra')

  // Listas que entram em cascata, item a item.
  //
  // O mosaico NÃO entra aqui de propósito. .m-revela e .m-cascata são
  // primitivas exclusivas: cada elemento só tem uma lista `animation`, e as
  // células do mosaico já usam .m-revela. Marcar o pai como cascata dá aos
  // filhos uma segunda animação que vence no cascata e mata a máscara, e a
  // célula fica presa no estado inicial, ou seja, invisível.
  marcar('.destaques, .comodidades__grade, .recortes, .duvidas__lista, .acomodacoes__lista, .avaliacoes__lista', 'm-cascata')
}

/** Liga tudo. Chame depois que a página estiver montada no DOM. */
export const iniciarMovimento = () => {
  marcarElementos()
  acompanharFotos()
  prepararHero()

  // Com movimento reduzido nada precisa observar: o CSS já entrega tudo
  // visível, e ficar escutando rolagem à toa só gasta bateria.
  if (menosMovimento()) {
    for (const node of qsa(SELETOR_ANIMAVEL)) node.classList.add('is-dentro')
    return
  }

  observarEntradas()
}

/** Reaplica em conteúdo criado depois da montagem, como o lightbox. */
export const registrarFotos = acompanharFotos
