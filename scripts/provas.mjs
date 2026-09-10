/**
 * Captura os estados interativos da pagina, um por arquivo.
 *
 *   node scripts/provas.mjs [url] [pasta-de-saida]
 *
 * Padrao: http://localhost:5180 e ./capturas/provas
 *
 * Diferente de capturar.mjs, aqui a captura e do tamanho da tela, nao da
 * pagina inteira. Isso importa por dois motivos: iframe de outra origem, como
 * o mapa do Google, so e pintado em captura de viewport, e estado aberto de
 * calendario e lightbox so existe na tela.
 */
import { writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { abrirChrome, novaAba, avaliar, ir } from './cdp.mjs'

const URL_ALVO = process.argv[2] || 'http://localhost:5180'
const SAIDA = path.resolve(process.argv[3] || 'capturas/provas')

const DESKTOP = { largura: 1440, altura: 900, escala: 1, movel: false }
const MOBILE = { largura: 390, altura: 844, escala: 2, movel: true }

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  await rm(SAIDA, { recursive: true, force: true })
  await mkdir(SAIDA, { recursive: true })

  const cdp = await abrirChrome({ porta: 9339 })
  const aba = await novaAba(cdp, DESKTOP)

  const tela = async (nome) => {
    const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'png' }, aba)
    const arquivo = path.join(SAIDA, `${nome}.png`)
    await writeFile(arquivo, Buffer.from(data, 'base64'))
    console.log(`  ${nome}`)
  }

  const dimensionar = (t) => cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: t.largura, height: t.altura, deviceScaleFactor: t.escala, mobile: t.movel,
    screenWidth: t.largura, screenHeight: t.altura,
  }, aba)

  /** Rola ate a secao pelo topo real do elemento, sem animacao. */
  const rolarAte = (seletor, folga = 80) => avaliar(cdp, aba, `(async () => {
    const alvo = document.querySelector(${JSON.stringify(seletor)});
    if (!alvo) return false;
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - ${folga}, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 600));
    return true;
  })()`, { awaitPromise: true })

  const proximaData = (dias) => {
    const d = new Date()
    d.setDate(d.getDate() + dias)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  console.log('Desktop')
  // A coreografia de chegada do hero termina por volta de 1,3s. Capturar
  // antes disso mostra o título no meio do caminho e parece bug de layout.
  await ir(cdp, aba, URL_ALVO, 1900)
  await tela('01-desktop-hero')

  await rolarAte('#mapa', 60)
  // A viagem leva cerca de 5s, e so comeca quando metade do mapa esta na tela.
  await espera(6000)
  await tela('02-desktop-mapa')

  await avaliar(cdp, aba, `(async () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 300));
    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await new Promise(r => setTimeout(r, 400));
    document.querySelector('[data-dia="${proximaData(9)}"]')?.dispatchEvent(new MouseEvent('mouseenter'));
  })()`, { awaitPromise: true })
  await tela('03-desktop-calendario')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('[data-dia="${proximaData(9)}"]').click();
    await new Promise(r => setTimeout(r, 120));
    document.querySelector('[data-dia="${proximaData(13)}"]')?.dispatchEvent(new MouseEvent('mouseenter'));
    await new Promise(r => setTimeout(r, 200));
  })()`, { awaitPromise: true })
  await tela('04-desktop-calendario-intervalo')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.calendario__fechar')?.click();
    await new Promise(r => setTimeout(r, 350));
    document.querySelector('#consultar .campo--hospedes .campo__gatilho').click();
    await new Promise(r => setTimeout(r, 400));
  })()`, { awaitPromise: true })
  await tela('05-desktop-hospedes')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.hospedes__aplicar').click();
    await new Promise(r => setTimeout(r, 350));
    const foto = document.querySelector('.sobre__foto');
    foto.scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise(r => setTimeout(r, 400));
    foto.click();
    await new Promise(r => setTimeout(r, 700));
  })()`, { awaitPromise: true })
  await tela('06-desktop-lightbox')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.lightbox__fechar').click();
    await new Promise(r => setTimeout(r, 400));
  })()`, { awaitPromise: true })

  await rolarAte('.comodidades')
  await espera(900)
  await tela('07-desktop-comodidades')

  await rolarAte('.fechamento', 60)
  await tela('08-desktop-cta-final')

  console.log('Mobile')
  await dimensionar(MOBILE)
  await ir(cdp, aba, URL_ALVO, 1900)
  await tela('10-mobile-hero')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await new Promise(r => setTimeout(r, 600));
  })()`, { awaitPromise: true })
  await tela('11-mobile-calendario')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.calendario__fechar').click();
    await new Promise(r => setTimeout(r, 400));
    document.querySelector('#consultar .campo--hospedes .campo__gatilho').click();
    await new Promise(r => setTimeout(r, 500));
  })()`, { awaitPromise: true })
  await tela('12-mobile-hospedes')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.hospedes__aplicar').click();
    await new Promise(r => setTimeout(r, 400));
    document.querySelector('.cabecalho__menu').click();
    await new Promise(r => setTimeout(r, 450));
  })()`, { awaitPromise: true })
  await tela('13-mobile-menu')

  await avaliar(cdp, aba, `(async () => {
    document.querySelector('.cabecalho__menu').click();
    await new Promise(r => setTimeout(r, 400));
    const alvo = document.querySelector('.comodidades');
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 700));
  })()`, { awaitPromise: true })
  await tela('14-mobile-barra-fixa')

  await cdp.fechar()
  console.log(`\nProvas em ${SAIDA}`)
}

main().catch((erro) => { console.error(erro); process.exit(1) })
