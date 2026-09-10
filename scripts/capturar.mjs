/**
 * Captura a pagina inteira em varias larguras, usando o Chrome em modo
 * headless. Sem nenhuma dependencia de npm.
 *
 *   node scripts/capturar.mjs [url] [pasta-de-saida]
 *
 * Padrao: http://localhost:5180 e ./capturas
 *
 * Serve para conferir responsividade e para mandar previa ao cliente.
 *
 * A captura roda com prefers-reduced-motion: reduce EMULADO, e isso e
 * proposital. As animacoes de entrada sao atadas a posicao da rolagem
 * (animation-timeline: view()), entao um bloco que esta fora da tela esta,
 * por definicao, no comeco da animacao, ou seja, invisivel. Como
 * captureBeyondViewport nao rola a pagina, so estica o quadro, sem isso
 * metade da captura sai em branco. O layout e exatamente o mesmo: so o
 * movimento sai.
 *
 * Para ver os estados interativos, e o movimento ligado, use provas.mjs.
 *
 * Observacao: elementos de posicao fixa, como a barra de consulta do mobile,
 * aparecem na captura na posicao da primeira tela. E limitacao da captura,
 * nao um erro de layout.
 */
import { writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { abrirChrome, novaAba, avaliar, ir } from './cdp.mjs'

const URL_ALVO = process.argv[2] || 'http://localhost:5180'
const SAIDA = path.resolve(process.argv[3] || 'capturas')

const TAMANHOS = [
  { nome: 'desktop', largura: 1440, altura: 900, escala: 1, movel: false },
  { nome: 'laptop', largura: 1280, altura: 720, escala: 1, movel: false },
  { nome: 'tablet', largura: 834, altura: 1112, escala: 2, movel: true },
  { nome: 'mobile', largura: 390, altura: 844, escala: 3, movel: true },
  { nome: 'mobile-pequeno', largura: 320, altura: 640, escala: 2, movel: true },
]

async function main() {
  // Apaga so os proprios arquivos, para nao levar junto capturas/provas.
  await mkdir(SAIDA, { recursive: true })
  for (const t of TAMANHOS) await rm(path.join(SAIDA, `${t.nome}.png`), { force: true })

  const cdp = await abrirChrome({ porta: 9335 })
  const erros = []
  cdp.aoEvento((dados) => {
    if (dados.method === 'Runtime.consoleAPICalled' && dados.params.type === 'error') {
      erros.push(dados.params.args.map((a) => a.value ?? a.description).join(' '))
    }
    if (dados.method === 'Runtime.exceptionThrown') erros.push(dados.params.exceptionDetails.text)
  })

  const aba = await novaAba(cdp)
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  }, aba)

  for (const t of TAMANHOS) {
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: t.largura, height: t.altura, deviceScaleFactor: t.escala, mobile: t.movel,
      screenWidth: t.largura, screenHeight: t.altura,
    }, aba)
    await ir(cdp, aba, URL_ALVO, 500)

    // Percorre a pagina inteira antes de capturar. Sao tres coisas de uma vez:
    // as fotos com carregamento adiado entram, o iframe do mapa carrega, e os
    // blocos que so aparecem ao entrar na tela saem do estado escondido.
    // Sem isso a captura de pagina inteira sai com metade do conteudo em
    // branco, porque captureBeyondViewport nao rola, so estica o quadro.
    await avaliar(cdp, aba, `(async () => {
      const passo = Math.round(innerHeight * 0.7);
      for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 140));
      }
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 2200));
      window.scrollTo({ top: 0, behavior: 'instant' });
      // O observador que esconde a barra de consulta e assincrono. Sem esta
      // espera, a captura pega a barra ainda visivel no topo da pagina.
      await new Promise(r => setTimeout(r, 1000));
    })()`, { awaitPromise: true })

    const { data } = await cdp.enviar('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true, optimizeForSpeed: false,
    }, aba)
    await writeFile(path.join(SAIDA, `${t.nome}.png`), Buffer.from(data, 'base64'))
    // Captura de pagina inteira em 3x e pesada. Um respiro evita que a
    // navegacao seguinte comece com o Chrome ainda ocupado.
    await new Promise((r) => setTimeout(r, 800))

    const m = await avaliar(cdp, aba, `({
      alturaDoc: document.documentElement.scrollHeight,
      larguraDoc: document.documentElement.scrollWidth,
      larguraJanela: document.documentElement.clientWidth,
    })`)
    const lateral = m.larguraDoc > m.larguraJanela + 1
    console.log(
      `${t.nome.padEnd(16)} ${String(t.largura).padStart(4)}x${t.altura}  pagina ${m.alturaDoc}px` +
      (lateral ? `  ATENCAO rolagem lateral (${m.larguraDoc}px)` : ''),
    )
  }

  console.log(erros.length ? `\nErros no console:\n  ${erros.join('\n  ')}` : '\nNenhum erro no console.')
  await cdp.fechar()
  console.log(`\nCapturas em ${SAIDA}`)
}

main().catch((erro) => { console.error(erro); process.exit(1) })
