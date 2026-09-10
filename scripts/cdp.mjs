/**
 * Cliente minimo do protocolo DevTools do Chrome, sem dependencia de npm.
 * Usado por capturar.mjs e por qa.mjs.
 */
import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { setTimeout as espera } from 'node:timers/promises'
import path from 'node:path'

export const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export async function abrirChrome({ porta = 9333, extras = [] } = {}) {
  const perfil = path.join(process.env.TMPDIR || '/tmp', `gb-chrome-${Date.now()}`)
  const processo = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${porta}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--font-render-hinting=none',
    ...extras,
    'about:blank',
  ], { stdio: 'ignore' })

  let endereco = null
  for (let tentativa = 0; tentativa < 80; tentativa += 1) {
    try {
      const resposta = await fetch(`http://127.0.0.1:${porta}/json/version`)
      endereco = (await resposta.json()).webSocketDebuggerUrl
      break
    } catch {
      await espera(250)
    }
  }
  if (!endereco) throw new Error('O Chrome nao abriu a porta de depuracao')

  const socket = new WebSocket(endereco)
  await new Promise((ok, erro) => {
    socket.addEventListener('open', ok, { once: true })
    socket.addEventListener('error', erro, { once: true })
  })

  let proximoId = 0
  const pendentes = new Map()
  const ouvintes = new Set()

  socket.addEventListener('message', (evento) => {
    const dados = JSON.parse(evento.data)
    if (dados.id && pendentes.has(dados.id)) {
      const { resolve, reject } = pendentes.get(dados.id)
      pendentes.delete(dados.id)
      dados.error ? reject(new Error(dados.error.message)) : resolve(dados.result)
      return
    }
    for (const ouvinte of ouvintes) ouvinte(dados)
  })

  const enviar = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = (proximoId += 1)
      pendentes.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params, sessionId }))
    })

  const aoEvento = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn) }

  const esperarEvento = (nome, sessionId, limite = 20000) =>
    new Promise((resolve, reject) => {
      const prazo = setTimeout(() => { parar(); reject(new Error(`Tempo esgotado esperando ${nome}`)) }, limite)
      const parar = aoEvento((dados) => {
        if (dados.method === nome && (!sessionId || dados.sessionId === sessionId)) {
          clearTimeout(prazo)
          parar()
          resolve(dados.params)
        }
      })
    })

  const fechar = async () => {
    socket.close()
    processo.kill()
    // O Chrome ainda esta escrevendo no perfil por um instante depois do kill,
    // entao a limpeza e melhor esforco e nunca derruba o teste.
    await espera(300)
    await rm(perfil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {})
  }

  return { enviar, aoEvento, esperarEvento, fechar }
}

/** Abre uma aba nova e devolve o sessionId ja com Page e Runtime ligados. */
export async function novaAba(cdp, { largura = 1440, altura = 900, escala = 1, movel = false } = {}) {
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })
  await cdp.enviar('Page.enable', {}, sessionId)
  await cdp.enviar('Runtime.enable', {}, sessionId)
  await cdp.enviar('DOM.enable', {}, sessionId)
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: largura, height: altura, deviceScaleFactor: escala, mobile: movel,
    screenWidth: largura, screenHeight: altura,
  }, sessionId)
  return sessionId
}

/** Avalia expressao na pagina e devolve o valor ja desserializado. */
export async function avaliar(cdp, sessionId, expressao, { awaitPromise = false } = {}) {
  const { result, exceptionDetails } = await cdp.enviar('Runtime.evaluate', {
    expression: expressao,
    returnByValue: true,
    awaitPromise,
  }, sessionId)
  if (exceptionDetails) {
    throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description || ''))
  }
  return result.value
}

/**
 * Navega e espera a pagina assentar.
 *
 * Nao depende de Page.loadEventFired: navegar para a mesma URL nem sempre
 * dispara o evento, e ai o teste inteiro travava. Aqui a espera e por
 * readyState mais a presenca de conteudo montado, que e observavel sempre.
 *
 * O seletor padrao cobre os dois sites do projeto: o v1, que monta em
 * #app, e o v2, que monta em #root.
 */
export async function ir(cdp, sessionId, url, respiro = 350, seletorPronto = '#app main, #root > *') {
  await cdp.enviar('Page.navigate', { url }, sessionId)

  const limite = Date.now() + 45000
  for (;;) {
    try {
      const pronto = await avaliar(cdp, sessionId, `document.readyState === "complete" && !!document.querySelector(${JSON.stringify(seletorPronto)})`)
      if (pronto) break
    } catch {
      // A navegacao derruba o contexto de execucao por um instante.
    }
    if (Date.now() > limite) throw new Error(`Tempo esgotado carregando ${url}`)
    await new Promise((r) => setTimeout(r, 120))
  }

  await avaliar(cdp, sessionId, `document.fonts.ready.then(() => new Promise(r => setTimeout(r, ${respiro})))`, { awaitPromise: true })
}
