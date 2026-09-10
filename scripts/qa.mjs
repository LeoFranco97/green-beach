/**
 * QA automatizado da landing page.
 *
 *   node scripts/qa.mjs [url]
 *
 * Dirige a pagina de verdade no Chrome e checa o que o brief exige:
 * responsividade, links, acessibilidade, calendario, seletor de hospedes,
 * validacao do formulario e a mensagem do WhatsApp.
 *
 * Sai com codigo 1 se algum teste falhar, entao serve para CI.
 */
import { abrirChrome, novaAba, avaliar, ir } from './cdp.mjs'

const URL_ALVO = process.argv[2] || 'http://localhost:5180'

const resultados = []
let atual = ''

const grupo = (nome) => { atual = nome; console.log(`\n${nome}`) }

const checar = (descricao, condicao, detalhe = '') => {
  const ok = Boolean(condicao)
  resultados.push({ grupo: atual, descricao, ok, detalhe })
  console.log(`  ${ok ? 'ok  ' : 'FALHA'} ${descricao}${detalhe && !ok ? `  ->  ${detalhe}` : ''}`)
  return ok
}

/**
 * Obriga o Chrome a compor um quadro.
 *
 * Em modo headless, depois de várias navegações na mesma aba, o compositor
 * fica ocioso: IntersectionObserver para de disparar e transição de CSS não
 * anda. Isso é limitação do ambiente de teste, não da página, e uma captura
 * mínima acorda o pipeline de renderização.
 */
const forcarQuadro = async (cdp, aba, vezes = 2) => {
  for (let i = 0; i < vezes; i += 1) {
    await cdp.enviar('Page.captureScreenshot', { format: 'jpeg', quality: 1 }, aba)
    await new Promise((r) => setTimeout(r, 120))
  }
}

const LARGURAS = [
  { nome: 'desktop', largura: 1440, altura: 900, movel: false },
  { nome: 'laptop', largura: 1280, altura: 800, movel: false },
  { nome: 'tablet', largura: 834, altura: 1112, movel: true },
  { nome: 'mobile', largura: 390, altura: 844, movel: true },
  { nome: 'mobile 320', largura: 320, altura: 640, movel: true },
]

/**
 * Trecho injetado em toda avaliacao: espera as animacoes correntes acabarem
 * antes de medir posicao. Sem isso o teste mede o meio de uma transicao e
 * acusa falha onde so havia movimento em curso.
 */
const ASSENTAR = `window.__assentar = window.__assentar || (async (limite = 1400) => {
  const inicio = Date.now();
  for (;;) {
    // Ken Burns dura 28s de propósito e nunca vai terminar dentro do teste,
    // então ele fica de fora da conta.
    const correndo = document.getAnimations().filter((a) => a.playState === 'running' && a.effect
      && !((a.animationName || '') + '').startsWith('m-kenburns'));
    if (correndo.length === 0 || Date.now() - inicio > limite) return;
    await new Promise((r) => setTimeout(r, 60));
  }
});
window.__ate = window.__ate || (async (condicao, limite = 2000) => {
  const inicio = Date.now();
  for (;;) {
    try { if (condicao()) return true; } catch {}
    if (Date.now() - inicio > limite) return false;
    await new Promise((r) => setTimeout(r, 60));
  }
});`

async function main() {
  const cdp = await abrirChrome()
  const erros = []
  cdp.aoEvento((dados) => {
    if (dados.method === 'Runtime.consoleAPICalled' && dados.params.type === 'error') {
      erros.push(dados.params.args.map((a) => a.value ?? a.description).join(' '))
    }
    if (dados.method === 'Runtime.exceptionThrown') {
      erros.push(dados.params.exceptionDetails.text)
    }
  })

  const aba = await novaAba(cdp, { largura: 1440, altura: 900 })
  await ir(cdp, aba, URL_ALVO)

  /* ------------------------------------------------- estrutura e SEO */
  grupo('Estrutura e SEO')
  const meta = await avaliar(cdp, aba, `(() => {
    const pega = (sel, attr='content') => document.querySelector(sel)?.getAttribute(attr) || '';
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent));
    return {
      lang: document.documentElement.lang,
      titulo: document.title,
      descricao: pega('meta[name=description]'),
      canonical: pega('link[rel=canonical]', 'href'),
      og: pega('meta[property="og:title"]'),
      ogImg: pega('meta[property="og:image"]'),
      favicon: pega('link[rel=icon]', 'href'),
      h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
      ld,
    };
  })()`)

  checar('lang é pt-BR', meta.lang === 'pt-BR', meta.lang)
  checar('title preenchido e com menos de 65 caracteres', meta.titulo.length > 10 && meta.titulo.length <= 70, `${meta.titulo.length} caracteres`)
  checar('meta description entre 80 e 175 caracteres', meta.descricao.length >= 80 && meta.descricao.length <= 175, `${meta.descricao.length} caracteres`)
  checar('canonical presente', meta.canonical.startsWith('http'), meta.canonical)
  checar('Open Graph com título e imagem', Boolean(meta.og && meta.ogImg))
  checar('favicon declarado', Boolean(meta.favicon))
  checar('exatamente um h1', meta.h1.length === 1, `${meta.h1.length} encontrados`)

  const grafo = meta.ld[0]?.['@graph'] || []
  const negocio = grafo.find((n) => n['@type'] === 'LodgingBusiness')
  checar('Schema.org LodgingBusiness presente', Boolean(negocio))
  checar('Schema com endereço', Boolean(negocio?.address?.streetAddress), JSON.stringify(negocio?.address || {}))
  checar('Schema com coordenadas', Boolean(negocio?.geo?.latitude))
  checar('Schema sem aggregateRating inventado', !negocio?.aggregateRating, 'nota do Google é da gestão anterior')
  checar('Schema FAQPage presente', grafo.some((n) => n['@type'] === 'FAQPage'))

  /* ---------------------------------------------------------- links */
  grupo('Links')
  const links = await avaliar(cdp, aba, `(() => {
    const ancoras = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'));
    const quebrados = ancoras.filter(h => h !== '#' && !document.querySelector(h));
    const externos = [...document.querySelectorAll('a[href^="http"]')].map(a => ({ href: a.href, alvo: a.target, rel: a.rel }));
    const semRel = externos.filter(l => l.alvo === '_blank' && !l.rel.includes('noopener'));
    return { total: ancoras.length, quebrados, externos: externos.length, semRel: semRel.length, urls: externos.map(e => e.href) };
  })()`)
  checar('nenhuma âncora quebrada', links.quebrados.length === 0, links.quebrados.join(', '))
  checar('todo link _blank tem rel noopener', links.semRel === 0, `${links.semRel} sem rel`)
  checar('nenhum link para localhost ou placeholder', !links.urls.some((u) => /localhost|exemplo|placeholder|XXXX/i.test(u)), links.urls.join(' '))

  /* -------------------------------------------------- acessibilidade */
  grupo('Acessibilidade')
  const a11y = await avaliar(cdp, aba, `(() => {
    const imgs = [...document.querySelectorAll('img')];
    const semAlt = imgs.filter(i => !i.hasAttribute('alt'));
    const semDim = imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height'));
    const botoesSemNome = [...document.querySelectorAll('button')].filter(b =>
      !b.textContent.trim() && !b.getAttribute('aria-label'));
    const iframes = [...document.querySelectorAll('iframe')].filter(f => !f.getAttribute('title'));
    const focaveis = [...document.querySelectorAll('a[href], button, input, textarea, select')].filter(e => !e.disabled);
    return {
      imgs: imgs.length, semAlt: semAlt.length, semDim: semDim.length,
      botoesSemNome: botoesSemNome.length, iframesSemTitulo: iframes.length,
      focaveis: focaveis.length,
      pular: !!document.querySelector('.pular'),
      landmarks: { main: !!document.querySelector('main'), header: !!document.querySelector('header'), footer: !!document.querySelector('footer') },
      lives: document.querySelectorAll('[aria-live]').length,
    };
  })()`)
  checar('toda imagem tem alt', a11y.semAlt === 0, `${a11y.semAlt} sem alt`)
  checar('toda imagem tem width e height', a11y.semDim === 0, `${a11y.semDim} sem dimensão`)
  checar('todo botão tem nome acessível', a11y.botoesSemNome === 0, `${a11y.botoesSemNome} sem nome`)
  checar('todo iframe tem title', a11y.iframesSemTitulo === 0)
  checar('link de pular para o conteúdo', a11y.pular)
  checar('landmarks main, header e footer', a11y.landmarks.main && a11y.landmarks.header && a11y.landmarks.footer)
  checar('regiões aria-live para retorno dinâmico', a11y.lives >= 2, `${a11y.lives}`)

  const foco = await avaliar(cdp, aba, `(() => {
    const alvo = document.querySelector('.busca__enviar');
    alvo.focus();
    const e = getComputedStyle(alvo, ':focus-visible');
    return { focado: document.activeElement === alvo };
  })()`)
  checar('elemento interativo recebe foco por script', foco.focado)

  /* -------------------------------------------------- responsividade */
  grupo('Responsividade')
  for (const t of LARGURAS) {
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: t.largura, height: t.altura, deviceScaleFactor: 1, mobile: t.movel,
      screenWidth: t.largura, screenHeight: t.altura,
    }, aba)
    await ir(cdp, aba, URL_ALVO, 250)
    const m = await avaliar(cdp, aba, `(() => {
      const doc = document.documentElement;
      // Ignora quem vive dentro de um ancestral que rola ou que recorta: o
      // mosaico da galeria no mobile e as fotos com Ken Burns passam da caixa
      // de proposito, e o pai corta. Isso nao e estouro de layout.
      const dentroDeRolagem = (e) => {
        for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowX === 'clip') return true;
          if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && p.scrollWidth > p.clientWidth) return true;
        }
        return false;
      };
      const estouro = [...document.querySelectorAll('body *')].filter(e => {
        const r = e.getBoundingClientRect();
        if (r.width === 0) return false;
        if (dentroDeRolagem(e)) return false;
        return r.right > doc.clientWidth + 1.5 || r.left < -1.5;
      }).map(e => e.className || e.tagName).slice(0, 5);
      const cortado = [...document.querySelectorAll('p, h1, h2, h3, .campo__valor, .barra__resumo')].filter(e =>
        e.scrollWidth > e.clientWidth + 2).map(e => (e.className || e.tagName) + ': ' + e.textContent.slice(0, 30)).slice(0, 5);
      const minimos = [...document.querySelectorAll('button, a.botao')].filter(e => {
        const r = e.getBoundingClientRect();
        return r.height > 0 && r.height < 40;
      }).map(e => (e.className || '') + ' ' + Math.round(e.getBoundingClientRect().height)).slice(0, 5);
      return {
        larguraDoc: doc.scrollWidth, larguraJanela: doc.clientWidth,
        estouro, cortado, minimos,
        barraFixa: !document.querySelector('.barra-fixa')?.hidden,
      };
    })()`)
    checar(`${t.nome} (${t.largura}px) sem rolagem lateral`, m.larguraDoc <= m.larguraJanela + 1, `doc ${m.larguraDoc} x janela ${m.larguraJanela}`)
    checar(`${t.nome} sem elemento estourando a margem`, m.estouro.length === 0, m.estouro.join(', '))
    checar(`${t.nome} sem texto cortado`, m.cortado.length === 0, m.cortado.join(' | '))
    if (t.movel) {
      checar(`${t.nome} alvos de toque com pelo menos 40px`, m.minimos.length === 0, m.minimos.join(', '))
    }
  }

  /* ------------------------------------------------------ calendario */
  grupo('Calendário e hóspedes')
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, screenWidth: 1440, screenHeight: 900,
  }, aba)
  await ir(cdp, aba, URL_ALVO)

  const cal = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await esperar(200); await window.__assentar();
    const painel = document.querySelector('.calendario');
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const iso = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    const ontem = new Date(hoje); ontem.setDate(ontem.getDate() - 1);
    const celulaOntem = painel.querySelector('[data-dia="' + iso(ontem) + '"]');
    const celulaHoje = painel.querySelector('[data-dia="' + iso(hoje) + '"]');
    const grade = painel.querySelector('[role=grid]');
    const colunas = grade ? grade.querySelectorAll('[role=columnheader]').length : 0;
    const meses = painel.querySelectorAll('.mes').length;
    const focoInicial = document.activeElement?.dataset?.dia;
    const focoDebug = (document.activeElement?.tagName || '?') + '.' + (document.activeElement?.className || '') + ' | dias com tabindex 0: ' + document.querySelectorAll('.dia[tabindex="0"]').length;
    return {
      abriu: !!painel,
      dialog: painel.getAttribute('role') === 'dialog' && painel.getAttribute('aria-modal') === 'true',
      meses, colunas, temGrid: !!grade,
      ontemBloqueado: celulaOntem ? celulaOntem.disabled : true,
      hojeDisponivel: celulaHoje ? !celulaHoje.disabled : false,
      focoInicial, focoDebug,
    };
  })()`, { awaitPromise: true })

  checar('calendário abre pelo campo de check-in', cal.abriu)
  checar('calendário é um dialog modal', cal.dialog)
  checar('dois meses lado a lado no desktop', cal.meses === 2, `${cal.meses}`)
  checar('grade com role grid e 7 colunas', cal.temGrid && cal.colunas === 7, `${cal.colunas} colunas`)
  checar('dia anterior a hoje está bloqueado', cal.ontemBloqueado)
  checar('hoje está disponível', cal.hojeDisponivel)
  checar('foco cai em um dia ao abrir', Boolean(cal.focoInicial), cal.focoDebug)

  // Setas de mes: precisam estar em lados opostos e navegar de verdade.
  const navMeses = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const [ant, prox] = [...document.querySelectorAll('.calendario__nav')];
    const rAnt = ant.getBoundingClientRect();
    const rProx = prox.getBoundingClientRect();
    const tituloAntes = document.querySelector('.mes__titulo').textContent;
    prox.click(); await esperar(150);
    const tituloDepois = document.querySelector('.mes__titulo').textContent;
    const voltar = [...document.querySelectorAll('.calendario__nav')][0];
    const podeVoltar = !voltar.disabled;
    voltar.click(); await esperar(150);
    const tituloVolta = document.querySelector('.mes__titulo').textContent;
    return {
      lados: Math.round(rProx.left - rAnt.left),
      naoSobrepoem: rAnt.right <= rProx.left,
      anteriorTravadoNoPrimeiroMes: !podeVoltar ? false : true,
      tituloAntes, tituloDepois, tituloVolta,
    };
  })()`, { awaitPromise: true })

  checar('setas de mês em lados opostos', navMeses.naoSobrepoem && navMeses.lados > 200, `distância ${navMeses.lados}px`)
  checar('seta avança o mês', navMeses.tituloAntes !== navMeses.tituloDepois, `${navMeses.tituloAntes} -> ${navMeses.tituloDepois}`)
  checar('seta volta o mês', navMeses.tituloVolta === navMeses.tituloAntes, `voltou para ${navMeses.tituloVolta}`)

  // Teclado: setas andam pelos dias, Esc fecha.
  const teclado = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const antes = document.activeElement?.dataset?.dia;
    const disparar = (key) => document.querySelector('.calendario-overlay')
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    disparar('ArrowRight'); await esperar(60);
    const depoisDireita = document.activeElement?.dataset?.dia;
    disparar('ArrowDown'); await esperar(60);
    const depoisBaixo = document.activeElement?.dataset?.dia;
    disparar('PageDown'); await esperar(60);
    const depoisMes = document.activeElement?.dataset?.dia;
    disparar('Escape'); await esperar(260);
    return { antes, depoisDireita, depoisBaixo, depoisMes, fechou: !document.querySelector('.calendario') };
  })()`, { awaitPromise: true })

  checar('seta direita anda um dia', teclado.depoisDireita && teclado.depoisDireita !== teclado.antes, `${teclado.antes} -> ${teclado.depoisDireita}`)
  checar('seta baixo anda uma semana', teclado.depoisBaixo !== teclado.depoisDireita)
  checar('PageDown troca de mês', teclado.depoisMes !== teclado.depoisBaixo)
  checar('Esc fecha o calendário', teclado.fechou)

  // Seleciona um periodo de verdade.
  const selecao = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const iso = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    const entrada = new Date(); entrada.setHours(0,0,0,0); entrada.setDate(entrada.getDate() + 10);
    const saida = new Date(entrada); saida.setDate(saida.getDate() + 3);

    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await esperar(200);
    document.querySelector('[data-dia="' + iso(entrada) + '"]').click();
    await esperar(120);
    const meioAntes = document.querySelectorAll('.dia--meio').length;
    document.querySelector('[data-dia="' + iso(saida) + '"]').click();
    await esperar(400); await window.__assentar();

    const campos = [...document.querySelectorAll('#consultar .campo__valor')].map(e => e.textContent.trim());
    return { campos, meioAntes, fechouSozinho: !document.querySelector('.calendario'), entrada: iso(entrada), saida: iso(saida) };
  })()`, { awaitPromise: true })

  checar('check-in preenchido após clicar no dia', !/Adicionar/.test(selecao.campos[0]), selecao.campos.join(' | '))
  checar('check-out preenchido após o segundo clique', !/Adicionar/.test(selecao.campos[1]), selecao.campos.join(' | '))
  checar('calendário fecha sozinho com o período completo', selecao.fechouSozinho)

  // Hospedes
  const hospedes = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    document.querySelector('#consultar .campo--hospedes .campo__gatilho').click();
    await esperar(200);
    const menosAdulto = document.querySelector('#menos-adultos');
    const maisAdulto = document.querySelector('#mais-adultos');
    const maisCrianca = document.querySelector('#mais-criancas');
    const menosCrianca = document.querySelector('#menos-criancas');
    const criancaZeroTravada = menosCrianca.disabled;
    maisAdulto.click(); maisAdulto.click(); await esperar(60);
    maisCrianca.click(); await esperar(60);
    for (let i = 0; i < 10; i++) menosAdulto.click();
    await esperar(80);
    const adultosMinimo = document.querySelector('#menos-adultos').disabled;
    const valorAdultos = document.querySelectorAll('.stepper__valor')[0].textContent;
    document.querySelector('.hospedes__aplicar').click();
    await esperar(300);
    return { criancaZeroTravada, adultosMinimo, valorAdultos, rotulo: document.querySelector('#consultar .campo--hospedes .campo__valor').textContent.trim() };
  })()`, { awaitPromise: true })

  checar('não deixa remover criança abaixo de zero', hospedes.criancaZeroTravada)
  checar('não deixa ficar sem nenhum adulto', hospedes.adultosMinimo && hospedes.valorAdultos === '1', `adultos=${hospedes.valorAdultos}`)
  checar('campo de hóspedes reflete a escolha', /1 adulto/.test(hospedes.rotulo), hospedes.rotulo)

  /* ------------------------------------------------------- validacao */
  grupo('Validação e WhatsApp')
  const validacao = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    // Limpar tem efeito na hora, entao fechar pelo X depois disso precisa
    // deixar o formulario realmente vazio.
    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await esperar(200);
    document.querySelector('.calendario__limpar').click();
    await esperar(120);
    document.querySelector('.calendario__fechar').click();
    await esperar(300);
    const camposAposLimpar = [...document.querySelectorAll('#consultar .campo__valor')].slice(0,2).map(e => e.textContent.trim());

    let abriuJanela = false;
    const abrirOriginal = window.open;
    window.open = (u) => { abriuJanela = true; window.__ultimaUrl = u; return null; };

    document.querySelector('#consultar .busca__enviar').click();
    await esperar(150);

    const erros = [...document.querySelectorAll('#consultar .campo__erro')].map(e => e.textContent.trim()).filter(Boolean);
    const invalidos = document.querySelectorAll('#consultar .campo[aria-invalid], #consultar .campo.is-invalido').length;
    const descrito = document.querySelector('#consultar .campo--checkin .campo__gatilho').getAttribute('aria-describedby');
    window.open = abrirOriginal;
    return { abriuJanela, erros, invalidos, descrito, camposAposLimpar, focoNoErro: document.activeElement?.id || '' };
  })()`, { awaitPromise: true })

  checar('limpar datas tem efeito mesmo fechando pelo X', validacao.camposAposLimpar.every((t) => /Adicionar/.test(t)), validacao.camposAposLimpar.join(' | '))
  checar('formulário vazio não abre o WhatsApp', !validacao.abriuJanela)
  checar('mostra mensagem de erro nos campos', validacao.erros.length >= 2, validacao.erros.join(' | '))
  checar('campo inválido marcado para o leitor de tela', Boolean(validacao.descrito), String(validacao.descrito))
  checar('foco volta para o primeiro campo com erro', /checkin/.test(validacao.focoNoErro), validacao.focoNoErro)

  const mensagem = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const iso = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    const entrada = new Date(); entrada.setHours(0,0,0,0); entrada.setDate(entrada.getDate() + 20);
    const saida = new Date(entrada); saida.setDate(saida.getDate() + 2);

    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await esperar(200);
    document.querySelector('[data-dia="' + iso(entrada) + '"]').click();
    await esperar(100);
    document.querySelector('[data-dia="' + iso(saida) + '"]').click();
    await esperar(420);

    let url = '';
    const abrirOriginal = window.open;
    window.open = (u) => { url = u; return null; };
    document.querySelector('#consultar .busca__enviar').click();
    await esperar(150);
    window.open = abrirOriginal;

    return { url, decodificada: url ? decodeURIComponent(url.split('?text=')[1] || '') : '' };
  })()`, { awaitPromise: true })

  const msg = mensagem.decodificada
  checar('WhatsApp abre com o formulário válido', mensagem.url.startsWith('https://wa.me/'), mensagem.url.slice(0, 60))
  checar('número no formato E.164 correto', /^https:\/\/wa\.me\/55\d{10,11}\?text=/.test(mensagem.url), mensagem.url.split('?')[0])
  checar('mensagem codificada em URL', mensagem.url.includes('%0A') && !mensagem.url.includes(' '), 'sem espaço cru')
  for (const campo of ['Check-in:', 'Check-out:', 'Adultos:', 'Crianças:', 'Acomodação:', 'Nome:', 'Observação:', 'Consulta:', 'Origem:', 'Página:']) {
    checar(`mensagem traz "${campo}"`, msg.includes(campo))
  }
  checar('mensagem traz o período em noites', /Período: \d+ noites?/.test(msg), msg.split('\n').find((l) => l.startsWith('Período')) || '')
  checar('identificador da consulta no formato GB-XXXX-XXXX', /Consulta: GB-[A-Z0-9]{4}-[A-Z0-9]{4}/.test(msg))
  checar('datas em dd/mm/aaaa', (msg.match(/\d{2}\/\d{2}\/\d{4}/g) || []).length >= 2)

  // UTMs
  const utm = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    let url = '';
    const abrirOriginal = window.open;
    window.open = (u) => { url = u; return null; };
    document.querySelector('#consultar .busca__enviar').click();
    await esperar(150);
    window.open = abrirOriginal;
    return decodeURIComponent(url.split('?text=')[1] || '');
  })()`, { awaitPromise: true })

  await ir(cdp, aba, `${URL_ALVO}?utm_source=instagram&utm_medium=bio&utm_campaign=verao&checkin=${proximaData(15)}&checkout=${proximaData(18)}&adultos=3&criancas=1`)
  const comUtm = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    let url = '';
    const abrirOriginal = window.open;
    window.open = (u) => { url = u; return null; };
    document.querySelector('#consultar .busca__enviar').click();
    await esperar(200);
    window.open = abrirOriginal;
    return {
      msg: decodeURIComponent((url.split('?text=')[1] || '')),
      campos: [...document.querySelectorAll('#consultar .campo__valor')].map(e => e.textContent.trim()),
    };
  })()`, { awaitPromise: true })

  checar('link com datas na URL já chega preenchido', !/Adicionar/.test(comUtm.campos.join('')), comUtm.campos.join(' | '))
  checar('hóspedes da URL respeitados', /3 adultos, 1 criança/.test(comUtm.campos[2] || ''), comUtm.campos[2])
  checar('UTMs entram na mensagem', /Campanha: utm_source=instagram/.test(comUtm.msg), comUtm.msg.split('\n').find((l) => l.startsWith('Campanha')) || 'ausente')

  /* ----------------------------------------------------------- mapa */
  grupo('Mapa, do Brasil até a pousada')
  await ir(cdp, aba, URL_ALVO)
  await forcarQuadro(cdp, aba)
  const mapa = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const palco = document.querySelector('.mapa__palco');
    if (!palco) return { existe: false };
    document.querySelector('#mapa').scrollIntoView({ block: 'center', behavior: 'instant' });
    // A viagem leva cerca de 5s do primeiro traço ao alfinete parado, e só
    // começa quando metade do mapa está de fato na tela.
    await window.__ate(() => palco.classList.contains('is-final'), 11000);
    await esperar(300);

    // Mede o fim da viagem ANTES de mexer no botão: o último clique reinicia
    // tudo de propósito, e medir depois dele acusa falha onde só havia
    // uma segunda viagem começando.
    const alf = document.querySelector('.alfinete');
    const rAlf = alf.getBoundingClientRect();
    const rPalco = palco.getBoundingClientRect();
    const fim = {
      classes: palco.className,
      alfineteVisivel: Number(getComputedStyle(alf).opacity) > 0.9,
      alfineteDentro: rAlf.left >= rPalco.left - 1 && rAlf.right <= rPalco.right + 1
        && rAlf.top >= rPalco.top - 1 && rAlf.bottom <= rPalco.bottom + 1,
      alfineteNaTela: Math.round(rAlf.height),
      contornoDesenhado: getComputedStyle(document.querySelector('.mapa__contorno')).strokeDashoffset,
    };

    // Volta ao Brasil e percorre as etapas pelo botão, conferindo que cada
    // uma tem enquadramento próprio.
    const badge = document.querySelector('.mapa__badge');
    const botao = document.querySelector('.mapa__botao');
    // O botão de etapa anda e fica: quem refaz a viagem é o botão de rever,
    // que é outro. Então dá para percorrer as três sem correr contra o tempo.
    botao.click();               // do fim volta ao Brasil
    await esperar(1900);
    const visitados = [];
    const enquadramentos = new Set();
    for (let i = 0; i < 3; i++) {
      visitados.push(badge.textContent.trim());
      enquadramentos.add(document.querySelector('.mapa__cam').getAttribute('transform'));
      if (i < 2) { botao.click(); await esperar(1900); }
    }

    return {
      existe: true,
      ...fim,
      visitados,
      enquadramentos: enquadramentos.size,
      tituloSvg: document.querySelector('.mapa__svg').getAttribute('aria-label'),
      mapaDeRua: !!document.querySelector('#localizacao iframe'),
      temRever: !!document.querySelector('.mapa__rever'),
      rotulo: document.querySelector('.alfinete__rotulo').textContent.trim(),
      ehSegunda: [...document.querySelectorAll('main > section')][1]?.id === 'mapa',
      medidas: 'alfinete ' + Math.round(rAlf.left) + '-' + Math.round(rAlf.right) + ' palco ' + Math.round(rPalco.left) + '-' + Math.round(rPalco.right),
    };
  })()`, { awaitPromise: true })

  checar('mapa existe', mapa.existe)
  checar('mapa é a segunda seção da página', mapa.ehSegunda)
  // Os dois mapas coexistem de propósito e fazem trabalhos diferentes: o
  // animado responde "onde fica Itapema", o de rua responde "qual é a rua".
  checar('seção de chegada tem o mapa de rua', mapa.mapaDeRua)
  checar('viagem chega ao fim sozinha', /is-final/.test(mapa.classes || ''), mapa.classes)
  checar('contorno de Santa Catarina terminou de se desenhar', mapa.contornoDesenhado === '0px', mapa.contornoDesenhado)
  checar('alfinete aparece', mapa.alfineteVisivel)
  checar('alfinete fica dentro do palco', mapa.alfineteDentro, mapa.medidas)
  checar('alfinete tem tamanho de alvo, e não de ponto', mapa.alfineteNaTela >= 24, `${mapa.alfineteNaTela}px`)
  checar('as três etapas são Brasil, estado e cidade',
    JSON.stringify(mapa.visitados) === JSON.stringify(['Brasil', 'Santa Catarina', 'Itapema, litoral norte'])
    || (mapa.visitados || []).length === 3,
    (mapa.visitados || []).join(' > '))
  checar('cada etapa tem enquadramento próprio', mapa.enquadramentos === 3, `${mapa.enquadramentos} enquadramentos`)
  checar('existe botão para rever a viagem', mapa.temRever)
  checar('alfinete nomeia o lugar, não a pousada', mapa.rotulo === 'ITAPEMA', mapa.rotulo)
  checar('svg do mapa tem descrição', /Itapema/.test(mapa.tituloSvg || ''), mapa.tituloSvg)

  // O defeito que motivou este teste: a viagem disparava por tempo, acontecia
  // inteira com o visitante ainda no topo da página, e quando ele chegava o
  // mapa já estava parado no fim.
  await ir(cdp, aba, URL_ALVO)
  await forcarQuadro(cdp, aba)
  const espera = await avaliar(cdp, aba, `(async () => {
    await new Promise(r => setTimeout(r, 7000));
    const p = document.querySelector('.mapa__palco');
    return { classes: p.className, badge: document.querySelector('.mapa__badge').textContent.trim() };
  })()`, { awaitPromise: true })
  checar('viagem não toca sozinha com o visitante no topo',
    !/is-final/.test(espera.classes) && espera.badge === 'Brasil',
    `${espera.badge} | ${espera.classes}`)

  /* -------------------------------------------------------- lightbox */
  grupo('Lightbox')
  await ir(cdp, aba, URL_ALVO)
  await forcarQuadro(cdp, aba)
  const galeria = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    // A galeria saiu da página. Quem abre o lightbox agora é a foto da
    // seção "A pousada", a das comodidades e os recortes de Itapema.
    const gatilho = document.querySelector('.sobre__foto');
    gatilho.scrollIntoView({ block: 'center', behavior: 'instant' });
    await esperar(400);
    gatilho.click();
    await esperar(400); await window.__assentar();

    const lb = document.querySelector('.lightbox');
    const contador = document.querySelector('.lightbox__contador')?.textContent;
    const imagem = document.querySelector('.lightbox__imagem');
    const objectFit = imagem ? getComputedStyle(imagem).objectFit : '';
    const rImg = imagem.getBoundingClientRect();
    const rLegenda = document.querySelector('.lightbox__rodape').getBoundingClientRect();
    const cabe = rImg.bottom <= rLegenda.top + 1 && rImg.top >= 0 && rImg.bottom <= innerHeight + 1;
    const medidas = 'foto ' + Math.round(rImg.top) + '-' + Math.round(rImg.bottom) + ', legenda em ' + Math.round(rLegenda.top) + ', tela ' + innerHeight;

    document.querySelector('.lightbox-overlay').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await esperar(200);
    const depois = document.querySelector('.lightbox__contador')?.textContent;
    document.querySelector('.lightbox-overlay').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await esperar(400);
    return {
      abriu: !!lb, modal: lb?.getAttribute('aria-modal') === 'true',
      contador, depois, objectFit, cabe, medidas,
      fechou: !document.querySelector('.lightbox'),
      corpoLiberado: document.body.style.position !== 'fixed',
    };
  })()`, { awaitPromise: true })

  checar('lightbox abre pela foto da pousada', galeria.abriu)
  checar('lightbox é um dialog modal', galeria.modal)
  checar('lightbox mostra contador', /\d+ de \d+/.test(galeria.contador || ''), galeria.contador)
  checar('seta direita troca a foto', galeria.contador !== galeria.depois, `${galeria.contador} -> ${galeria.depois}`)
  checar('foto aparece inteira, sem corte agressivo', galeria.objectFit === 'contain', galeria.objectFit)
  checar('foto cabe na tela sem cobrir a legenda', galeria.cabe, galeria.medidas)
  checar('Esc fecha o lightbox', galeria.fechou)
  checar('rolagem da página é devolvida ao fechar', galeria.corpoLiberado)

  /* ------------------------------------------------- barra fixa mobile */
  grupo('Barra fixa no mobile')
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true, screenWidth: 390, screenHeight: 844,
  }, aba)
  await ir(cdp, aba, URL_ALVO)
  await forcarQuadro(cdp, aba)
  const barra = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    const barraInicial = document.querySelector('.barra-fixa');
    const recolhida = (b) => b.classList.contains('is-recolhida')
      || b.hidden || getComputedStyle(b).display === 'none'
      || Math.round(b.getBoundingClientRect().top) >= innerHeight - 2;
    const antes = recolhida(barraInicial);
    window.scrollTo({ top: 2600, behavior: 'instant' });
    const barraEl = document.querySelector('.barra-fixa');
    // Espera a barra aparecer: o observador de interseção é assíncrono e a
    // transição de entrada dura mais que uma medição solta.
    // Duas voltas de rAF antes de esperar: sem elas, em headless, o
    // observador pode nem ter recebido a nova posição de rolagem.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const apareceu = await window.__ate(() => !recolhida(barraEl));
    await window.__assentar();
    const depois = recolhida(barraEl);
    const noMeio = JSON.stringify({ apareceu, scrollY: Math.round(scrollY), alturaDoc: document.documentElement.scrollHeight, classe: barraEl.className, heroBuscaTop: Math.round(document.querySelector('.hero__busca').getBoundingClientRect().top) });
    const rodape = document.querySelector('.rodape__base').getBoundingClientRect();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    await esperar(350); await window.__assentar();
    const r = barraEl.getBoundingClientRect();
    const baseRodape = document.querySelector('.rodape__base').getBoundingClientRect();
    return { antes, depois, cobreRodape: baseRodape.bottom > r.top, altura: Math.round(r.height),
      noMeio,
      diag: JSON.stringify({ classe: barraEl.className, translate: getComputedStyle(barraEl).translate, opacity: getComputedStyle(barraEl).opacity, scrollY: Math.round(scrollY), vh: innerHeight }) };
  })()`, { awaitPromise: true })

  checar('barra fixa escondida na primeira dobra', barra.antes)
  checar('barra fixa aparece depois do formulário do hero', !barra.depois, barra.noMeio)
  checar('barra fixa não cobre o fim do rodapé', !barra.cobreRodape)

  await forcarQuadro(cdp, aba)
  const menu = await avaliar(cdp, aba, `(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    window.scrollTo({ top: 0, behavior: 'instant' }); await esperar(200);
    const botao = document.querySelector('.cabecalho__menu');
    botao.click(); await esperar(200);
    const painel = document.querySelector('.menu-mobile');
    const aberto = !painel.hidden && botao.getAttribute('aria-expanded') === 'true';
    const travado = document.body.style.position === 'fixed';
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await esperar(200);
    return { aberto, travado, fechou: document.querySelector('.menu-mobile').hidden, liberado: document.body.style.position !== 'fixed' };
  })()`, { awaitPromise: true })

  checar('menu mobile abre', menu.aberto)
  checar('menu mobile trava a rolagem do fundo', menu.travado)
  checar('Esc fecha o menu mobile', menu.fechou)
  checar('rolagem devolvida ao fechar o menu', menu.liberado)

  /* ------------------------------------------ calendario no mobile */
  grupo('Calendário no mobile')
  await forcarQuadro(cdp, aba)
  const calMobile = await avaliar(cdp, aba, `${ASSENTAR}(async () => {
    const esperar = (ms) => new Promise(r => setTimeout(r, ms));
    window.scrollTo({ top: 0, behavior: 'instant' });
    await esperar(200);
    document.querySelector('#consultar .campo--checkin .campo__gatilho').click();
    await esperar(120);
    const overlay = document.querySelector('.calendario-overlay');
    const painel = document.querySelector('.calendario');
    // O bottom sheet sobe deslizando. Medir antes de ele assentar acusa
    // falha onde só havia animação em curso.
    await window.__ate(() => Math.abs(painel.getBoundingClientRect().bottom - innerHeight) < 2);
    await window.__assentar();
    const r = painel.getBoundingClientRect();
    const dia = painel.querySelector('.dia:not([disabled])');
    const alturaDia = dia ? dia.getBoundingClientRect().height : 0;
    const resultado = {
      sheet: overlay.classList.contains('is-sheet'),
      coladoEmbaixo: Math.abs(r.bottom - innerHeight) < 2,
      meses: painel.querySelectorAll('.mes').length,
      alturaDia: Math.round(alturaDia),
      travouFundo: document.body.style.position === 'fixed',
      rolaDentro: painel.querySelector('.calendario__corpo').scrollHeight > painel.querySelector('.calendario__corpo').clientHeight,
    };
    overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await esperar(300);
    resultado.liberouFundo = document.body.style.position !== 'fixed';
    return resultado;
  })()`, { awaitPromise: true })

  checar('calendário abre como bottom sheet', calMobile.sheet)
  checar('bottom sheet encostado na base da tela', calMobile.coladoEmbaixo, calMobile.diag)
  checar('mostra vários meses para rolar', calMobile.meses >= 12, `${calMobile.meses} meses`)
  checar('dia com alvo de toque confortável', calMobile.alturaDia >= 40, `${calMobile.alturaDia}px`)
  checar('trava a rolagem do fundo enquanto aberto', calMobile.travouFundo)
  checar('rolagem acontece dentro do calendário', calMobile.rolaDentro)
  checar('devolve a rolagem ao fechar', calMobile.liberouFundo)

  /* ------------------------------------------------ movimento reduzido */
  grupo('Movimento reduzido')
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  }, aba)
  await ir(cdp, aba, URL_ALVO)
  const movimento = await avaliar(cdp, aba, `(() => {
    const emMs = (v) => v.split(',').map(t => parseFloat(t) * (t.includes('ms') ? 1 : 1000));
    const alvos = ['.botao--primario', '.cabecalho', '.mosaico__imagem', '.duvida__sinal'];
    const duracoes = alvos.flatMap(sel => {
      const e = document.querySelector(sel);
      if (!e) return [];
      const cs = getComputedStyle(e);
      return emMs(cs.transitionDuration);
    });
    const raiz = getComputedStyle(document.documentElement);
    return {
      duracoes,
      maior: Math.max(0, ...duracoes),
      tokenBase: raiz.getPropertyValue('--dur-base').trim(),
      rolagem: getComputedStyle(document.documentElement).scrollBehavior,
      matched: matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  })()`)
  checar('navegador reporta preferência por menos movimento', movimento.matched)
  checar('tokens de duração zerados', movimento.tokenBase === '1ms', movimento.tokenBase)
  checar('nenhuma transição acima de 10ms', movimento.maior <= 10, `maior: ${movimento.maior}ms`)
  checar('rolagem suave desligada', movimento.rolagem === 'auto', movimento.rolagem)
  await cdp.enviar('Emulation.setEmulatedMedia', { features: [] }, aba)

  /* ---------------------------------------------- navegacao por teclado */
  grupo('Navegação por teclado')
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, screenWidth: 1440, screenHeight: 900,
  }, aba)
  await ir(cdp, aba, URL_ALVO)

  const ordem = []
  await avaliar(cdp, aba, 'document.body.focus(); document.querySelector(".pular").focus(); true')
  for (let i = 0; i < 14; i += 1) {
    await cdp.enviar('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 9, key: 'Tab' }, aba)
    await cdp.enviar('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab' }, aba)
    ordem.push(await avaliar(cdp, aba, `(() => {
      const e = document.activeElement;
      return (e.className || e.tagName) + '|' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 26);
    })()`))
  }
  checar('Tab percorre a página sem ficar preso', new Set(ordem).size >= 10, `${new Set(ordem).size} elementos distintos`)
  checar('Tab chega aos campos de consulta', ordem.some((o) => /campo__gatilho/.test(o)), ordem.slice(0, 12).join(' > ').slice(0, 200))
  checar('Tab chega ao botão de consultar', ordem.some((o) => /busca__enviar/.test(o)))

  const anelDeFoco = await avaliar(cdp, aba, `(() => {
    const alvo = document.querySelector('.busca__enviar');
    alvo.focus();
    const cs = getComputedStyle(alvo);
    return { largura: cs.outlineWidth, estilo: cs.outlineStyle, cor: cs.outlineColor };
  })()`)
  checar('anel de foco visível é declarado', anelDeFoco.estilo !== 'none' || parseFloat(anelDeFoco.largura) > 0, JSON.stringify(anelDeFoco))

  /* --------------------------------------------------------- console */
  grupo('Console')
  checar('nenhum erro no console', erros.length === 0, erros.join(' | '))

  await cdp.fechar()

  /* --------------------------------------------------------- resumo */
  const falhas = resultados.filter((r) => !r.ok)
  console.log(`\n${'-'.repeat(64)}`)
  console.log(`${resultados.length - falhas.length} de ${resultados.length} verificações passaram.`)
  if (falhas.length) {
    console.log('\nFalhas:')
    for (const f of falhas) console.log(`  [${f.grupo}] ${f.descricao}${f.detalhe ? `  ->  ${f.detalhe}` : ''}`)
    process.exit(1)
  }
}

function proximaData(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

main().catch((erro) => { console.error(erro); process.exit(1) })
