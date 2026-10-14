/**
 * A GRADE DE ATRACOES
 * ---------------------------------------------------------------------------
 * A peca que faz a pagina dar vontade. Ninguem compra "passaporte 1 dia":
 * as pessoas compram a Fire Whip, o Big Drop, o Hot Wheels.
 *
 * Anatomia do cartao, medida na referencia e explicada em
 * ../../DIRECAO-DE-ARTE.md, secao 3:
 *
 *   foto sangrando, sem raio, colada na coluna vizinha
 *   pilula branca com o nome, SOBREPOSTA na junção entre foto e corpo
 *   corpo na cor do cartao, descricao em caixa alta branca
 *   selo de altura minima, em pilula branca, a direita
 *
 * A pilula sobreposta e a assinatura do sistema: e ela que amarra foto e
 * cor. Sem ela o cartao vira um bloco colorido com uma foto em cima.
 *
 * O FILTRO DE ALTURA e o que diferencia esta grade da do parque em valor,
 * nao em aparencia: ele responde "o que o meu filho de 1,05 m pega", que e a
 * pergunta real de quem esta decidindo a compra.
 */
import { el, qs } from '../lib/dom.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { ANCORA_PEDIDO } from '../data/oferta.js'
import {
  grade, categorias, degrausDeAltura, filtrar, atracoesVisiveis,
} from '../data/atracoes.js'

/** "1,30m" a partir de 130. Zero vira "Livre". */
const emMetros = (cm) => (cm === 0 ? 'Livre' : `${(cm / 100).toFixed(2).replace('.', ',')}m`)

/** Seta vertical bicolor do selo de altura, igual a da referencia. */
const SETA = `<svg viewBox="0 0 16 24" aria-hidden="true" focusable="false">
  <path d="M8 1l4 5H4z" fill="currentColor"/>
  <path d="M8 23l-4-5h8z" fill="currentColor"/>
  <rect x="7.1" y="6" width="1.8" height="12" fill="currentColor"/>
</svg>`

/* ==========================================================================
   O cartao
   ========================================================================== */

const criarCartao = (atracao, indice) => {
  // A cor vem do ciclo de tokens pelo indice, nunca escrita no dado. Assim
  // reordenar a lista nao exige repintar nada.
  const cor = `var(--cartao-${(indice % 10) + 1})`

  const temFoto = atracao.foto && fotoExiste(atracao.foto)
  const midia = temFoto
    ? (() => {
        const attrs = atributosDeFoto(atracao.foto, {
          alt: `${atracao.nome}, no Beto Carrero World`,
          sizes: '(min-width: 64em) 33vw, (min-width: 40em) 50vw, 100vw',
        })
        return el('div', { class: 'atracao__midia' }, [el('img', attrs)])
      })()
    : // Estado de cor: enquanto a foto oficial nao chega, o bloco vira a cor
      // do cartao com o nome em tipo grande. Intencional em vez de quebrado.
      el('div', {
        class: 'atracao__midia atracao__midia--cor',
        'aria-hidden': 'true',
      }, [el('span', { text: atracao.nome })])

  const selos = []
  if (atracao.altura !== null) {
    selos.push(el('p', { class: 'pilula selo-altura' }, [
      el('span', { class: 'selo-altura__seta', html: SETA }),
      el('span', { class: 'selo-altura__texto' }, [
        el('span', { class: 'selo-altura__rotulo', text: 'Altura mínima' }),
        el('strong', { text: emMetros(atracao.altura) }),
      ]),
    ]))
  }

  return el('article', {
    class: 'atracao',
    style: `--cor-cartao:${cor}`,
    dataset: { id: atracao.id },
  }, [
    midia,
    el('div', { class: 'atracao__corpo' }, [
      el('h3', { class: 'pilula atracao__nome', text: atracao.nome }),
      el('div', { class: 'atracao__baixo' }, [
        atracao.descricao
          ? el('p', { class: 'atracao__descricao', text: atracao.descricao })
          : el('p', { class: 'atracao__descricao atracao__descricao--vazia' }),
        selos.length ? el('div', { class: 'atracao__selos' }, selos) : null,
      ]),
    ]),
  ])
}

/* ==========================================================================
   A regua de altura
   ========================================================================== */

const criarRegua = (aoMudar) => {
  let escolhido = null

  const botoes = degrausDeAltura.map((d) =>
    el('button', {
      type: 'button',
      class: 'regua__degrau',
      dataset: { cm: String(d.cm) },
      'aria-pressed': 'false',
      text: d.rotulo,
    }),
  )

  const limpar = el('button', {
    type: 'button',
    class: 'regua__limpar',
    text: 'Ver todas',
    hidden: true,
  })

  const aplicar = (cm) => {
    escolhido = cm
    botoes.forEach((b) => b.setAttribute('aria-pressed', Number(b.dataset.cm) === cm ? 'true' : 'false'))
    limpar.hidden = cm === null
    aoMudar(cm)
    if (cm !== null) rastrear(EVENTOS.ALTURA_FILTRADA, { altura: cm })
  }

  botoes.forEach((b) => b.addEventListener('click', () => {
    const cm = Number(b.dataset.cm)
    // Clicar de novo no degrau marcado desliga o filtro. E o gesto que a
    // pessoa tenta primeiro, e nao atender isso obriga a cacar o "ver todas".
    aplicar(escolhido === cm ? null : cm)
  }))
  limpar.addEventListener('click', () => aplicar(null))

  return el('div', { class: 'regua' }, [
    el('p', { class: 'regua__pergunta', id: 'regua-rotulo', text: 'Qual a altura de quem vai?' }),
    el('div', { class: 'regua__degraus', role: 'group', 'aria-labelledby': 'regua-rotulo' }, botoes),
    limpar,
  ])
}

/* ==========================================================================
   A secao
   ========================================================================== */

export const criarAtracoes = () => {
  if (!grade.confirmado || atracoesVisiveis().length === 0) return null

  let altura = null
  let categoria = 'todas'

  const lista = el('div', { class: 'atracoes__grade' })
  const vazio = el('p', { class: 'atracoes__vazio', hidden: true })

  const pintar = () => {
    const itens = filtrar({ alturaCm: altura, categoria })
    lista.textContent = ''
    itens.forEach((a, i) => lista.append(criarCartao(a, i)))

    vazio.hidden = itens.length > 0
    if (itens.length === 0) {
      vazio.textContent = altura !== null
        ? `Nenhuma atração da nossa lista libera com ${emMetros(altura)}. Pergunte no WhatsApp: a lista do parque é maior que esta.`
        : 'Nada nesta categoria por enquanto.'
    }
  }

  const abas = el('div', { class: 'abas', role: 'group', 'aria-label': 'Tipo de atração' },
    categorias.map((c) =>
      el('button', {
        type: 'button',
        class: 'abas__aba',
        'aria-pressed': c.id === 'todas' ? 'true' : 'false',
        text: c.nome,
        onclick: (ev) => {
          categoria = c.id
          ;[...ev.currentTarget.parentElement.children]
            .forEach((b) => b.setAttribute('aria-pressed', b === ev.currentTarget ? 'true' : 'false'))
          pintar()
        },
      }),
    ))

  const regua = criarRegua((cm) => { altura = cm; pintar() })

  pintar()

  return el('section', { class: 'secao atracoes', id: 'atracoes' }, [
    el('div', { class: 'envelope' }, [
      el('header', { class: 'cabeca atracoes__cabeca' }, [
        el('p', { class: 'olho', text: grade.olho }),
        el('h2', {}, grade.titulo.map((l) => el('span', { class: 'linha', text: l }))),
        el('p', { class: 'lead', text: grade.apoio }),
      ]),
      el('div', { class: 'atracoes__filtros' }, [abas, regua]),
    ]),

    // A grade sangra: foto colada na borda da janela e colada na coluna
    // vizinha, sem medianiz. E o gesto mais caracteristico da referencia.
    el('div', { class: 'atracoes__faixa' }, [lista, el('div', { class: 'envelope' }, [vazio])]),

    el('div', { class: 'envelope atracoes__fim' }, [
      el('p', { class: 'apoio', text: grade.avisoFoto }),
      el('a', { class: 'botao botao--acao botao--grande', href: ANCORA_PEDIDO, text: 'Quero ir nesse dia' }),
    ]),
  ])
}
