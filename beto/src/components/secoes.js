/**
 * As secoes que nao sao o configurador.
 *
 * Todas seguem a mesma regra: bloco sem dado confirmado devolve null e some
 * da pagina. A pagina fica menor e continua verdadeira, que e o acordo
 * escrito em ARQUITETURA.md e herdado do site da pousada.
 */
import { el } from '../lib/dom.js'
import { config } from '../config.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import {
  fatos, comoFunciona, diaNoParque, respiro, hospedagem, duvidas,
  fechamento, rodape, contato, endereco, pousada, parque, marca, fotoPor,
  ANCORA_PEDIDO,
} from '../data/oferta.js'

/** Cabeca padrao de secao: olho, titulo quebrado em linhas, apoio opcional. */
const cabeca = ({ olho, titulo, apoio, classe = '' }) =>
  el('header', { class: `cabeca ${classe}`.trim() }, [
    olho ? el('p', { class: 'olho', text: olho }) : null,
    el('h2', {}, [].concat(titulo).map((linha) =>
      el('span', { class: 'linha', text: linha }))),
    apoio ? el('p', { class: 'lead', text: apoio }) : null,
  ])

/* ==========================================================================
   Faixa de fatos
   ========================================================================== */

/**
 * Quatro numeros que respondem "e longe?" em dois segundos.
 *
 * O piso de tres confirmados nao e capricho. Uma faixa de numeros so
 * funciona como faixa: dois numeros e um buraco nao leem como grade, leem
 * como erro de carregamento, e erro de carregamento na primeira rolagem
 * custa confianca justamente onde a pagina ainda nao ganhou nenhuma.
 */
export const criarFatos = () => {
  const confirmados = fatos.filter((f) => f.confirmado && f.numero)
  if (confirmados.length < 3) return null

  return el('section', { class: 'secao secao--areia faixa-fatos' }, [
    el('div', { class: 'envelope' }, [
      el('dl', { class: 'fatos' }, confirmados.map((f) =>
        el('div', { class: 'fato' }, [
          el('dt', { class: 'fato__numero' }, [
            el('strong', { text: f.numero }),
            f.unidade ? el('span', { class: 'fato__unidade', text: f.unidade }) : null,
          ]),
          el('dd', { class: 'fato__rotulo', text: f.rotulo }),
        ]))),
    ]),
  ])
}

/* ==========================================================================
   Como funciona
   ========================================================================== */

export const criarComoFunciona = () => {
  if (!comoFunciona.confirmado) return null
  const passos = comoFunciona.passos.filter((p) => p.confirmado)
  if (passos.length === 0) return null

  const entrega = comoFunciona.entrega
  return el('section', { class: 'secao como' }, [
    el('div', { class: 'envelope' }, [
      cabeca({ olho: comoFunciona.olho, titulo: comoFunciona.titulo }),
      el('ol', { class: 'como__passos' }, passos.map((p) =>
        el('li', { class: 'como__passo' }, [
          el('span', { class: 'como__numero', 'aria-hidden': 'true', text: p.numero }),
          el('h3', { class: 'como__titulo', text: p.titulo }),
          el('p', { class: 'como__texto', text: p.texto }),
        ]))),
      entrega?.confirmado && entrega.valor
        ? el('p', { class: 'como__entrega apoio', text: entrega.valor })
        : null,
    ]),
  ])
}

/* ==========================================================================
   O dia no parque
   ========================================================================== */

/**
 * Bloco editorial. Contraste de escala entre as fotos e deliberado: duas
 * imagens do mesmo tamanho lado a lado e grade de estoque, e e um dos cinco
 * defeitos que a direcao de arte v3 foi escrita para corrigir.
 */
export const criarDiaNoParque = () => {
  if (!diaNoParque.confirmado) return null
  const etapas = diaNoParque.roteiro.filter((e) => e.confirmado && e.hora)
  if (etapas.length === 0) return null

  const grande = fotoPor('dia-grande')
  const detalhe = fotoPor('dia-detalhe')

  const figura = (foto, classe, sizes) => {
    if (!foto || !fotoExiste(foto.arquivo)) return null
    const attrs = atributosDeFoto(foto.arquivo, { alt: foto.alt, sizes })
    return el('figure', { class: classe }, [
      el('img', { ...attrs, style: `${attrs.style || ''};object-position:${foto.foco}` }),
      foto.legenda ? el('figcaption', { text: foto.legenda }) : null,
    ])
  }

  return el('section', { class: 'secao dia' }, [
    el('div', { class: 'envelope dia__interno' }, [
      el('div', { class: 'dia__texto' }, [
        cabeca({ olho: diaNoParque.olho, titulo: diaNoParque.titulo }),
        ...diaNoParque.paragrafos.map((t) => el('p', { class: 'dia__paragrafo', text: t })),
        el('ol', { class: 'roteiro' }, etapas.map((e) =>
          el('li', { class: 'roteiro__etapa' }, [
            el('span', { class: 'roteiro__hora', text: e.hora }),
            el('div', {}, [
              el('h3', { class: 'roteiro__rotulo', text: e.rotulo }),
              e.texto ? el('p', { class: 'roteiro__texto', text: e.texto }) : null,
            ]),
          ]))),
      ]),
      el('div', { class: 'dia__fotos' }, [
        figura(grande, 'dia__grande', '(min-width: 64em) 44vw, 100vw'),
        figura(detalhe, 'dia__detalhe', '(min-width: 64em) 20vw, 50vw'),
      ]),
    ]),
  ])
}

/* ==========================================================================
   Respiro
   ========================================================================== */

/**
 * A unica faixa escura da pagina inteira. Nao tem botao de proposito: se
 * ganhar um, deixa de ser pausa e vira o quarto pedido seguido.
 */
export const criarRespiro = () => {
  if (!respiro.confirmado) return null
  return el('section', { class: 'secao secao--verde respiro' }, [
    el('div', { class: 'envelope' }, [
      el('p', { class: 'respiro__frase' }, respiro.frase.map((linha) =>
        el('span', { class: 'linha', text: linha }))),
      respiro.apoio ? el('p', { class: 'respiro__apoio', text: respiro.apoio }) : null,
    ]),
  ])
}

/* ==========================================================================
   Hospedagem
   ========================================================================== */

export const criarHospedagem = () => {
  if (!hospedagem.confirmado) return null
  const foto = fotoPor('hospedagem')

  const figura = foto && fotoExiste(foto.arquivo)
    ? (() => {
        const attrs = atributosDeFoto(foto.arquivo, {
          alt: foto.alt,
          sizes: '(min-width: 64em) 30vw, 100vw',
        })
        return el('figure', { class: 'hosp__foto' }, [
          el('img', { ...attrs, style: `${attrs.style || ''};object-position:${foto.foco}` }),
          foto.legenda ? el('figcaption', { text: foto.legenda }) : null,
        ])
      })()
    : null

  return el('section', { class: 'secao secao--areia hosp' }, [
    el('div', { class: 'envelope hosp__interno' }, [
      el('div', { class: 'hosp__texto' }, [
        cabeca({ olho: hospedagem.olho, titulo: hospedagem.titulo }),
        ...hospedagem.paragrafos.map((t) => el('p', { class: 'hosp__paragrafo', text: t })),
        // Gatilho de texto, nao botao dourado: botao primario aqui
        // competiria com o unico CTA da pagina.
        el('a', { class: 'elo', href: config.siteHotel, text: hospedagem.gatilho }),
      ]),
      figura,
    ]),
  ])
}

/* ==========================================================================
   Duvidas
   ========================================================================== */

/**
 * `<details>` nativo. Acordeao escrito a mao costuma perder o teclado, o
 * leitor de tela e a busca do navegador, e nao ganha nada em troca.
 */
export const criarDuvidas = () => {
  const confirmadas = duvidas.filter((d) => d.confirmado && d.resposta)
  if (confirmadas.length === 0) return null

  return el('section', { class: 'secao duvidas', id: 'duvidas' }, [
    el('div', { class: 'envelope' }, [
      cabeca({ olho: 'Antes de pedir', titulo: ['Perguntas que', 'travam a compra'] }),
      el('div', { class: 'duvidas__lista' }, confirmadas.map((d) =>
        el('details', { class: 'duvida', ontoggle: (ev) => {
          if (ev.target.open) rastrear(EVENTOS.DUVIDA_ABERTA, { pergunta: d.pergunta })
        } }, [
          el('summary', { class: 'duvida__pergunta', text: d.pergunta }),
          el('p', { class: 'duvida__resposta', text: d.resposta }),
        ]))),
    ]),
  ])
}

/* ==========================================================================
   Fechamento
   ========================================================================== */

export const criarFechamento = () => {
  if (!fechamento.confirmado) return null
  return el('section', { class: 'secao secao--pausa fecho' }, [
    el('div', { class: 'envelope fecho__interno' }, [
      el('h2', { class: 'fecho__titulo' }, fechamento.titulo.map((linha) =>
        el('span', { class: 'linha', text: linha }))),
      fechamento.apoio ? el('p', { class: 'lead fecho__apoio', text: fechamento.apoio }) : null,
      el('a', { class: 'botao botao--ouro', href: ANCORA_PEDIDO, text: fechamento.botao }),
    ]),
  ])
}

/* ==========================================================================
   Rodape
   ========================================================================== */

export const criarRodape = () => {
  if (!rodape.confirmado) return null

  const whatsappSimples = `https://wa.me/${config.whatsappNumber}`

  return el('footer', { class: 'rodape' }, [
    el('div', { class: 'envelope rodape__interno' }, [
      el('div', { class: 'rodape__marca' }, [
        el('img', {
          class: 'rodape__logo', src: marca.logoClara, alt: pousada.nome,
          width: '180', height: '72', loading: 'lazy', decoding: 'async',
        }),
        el('p', { class: 'rodape__grupo', text: pousada.grupo }),
      ]),

      el('div', { class: 'rodape__coluna' }, [
        el('h2', { class: 'rodape__titulo', text: rodape.contato }),
        el('a', { class: 'rodape__elo', href: whatsappSimples, rel: 'noopener', target: '_blank', text: contato.whatsappExibicao }),
        el('a', { class: 'rodape__elo', href: contato.instagramUrl, rel: 'noopener', target: '_blank', text: `@${contato.instagram}` }),
      ]),

      el('div', { class: 'rodape__coluna' }, [
        el('h2', { class: 'rodape__titulo', text: rodape.pousadaTitulo }),
        el('p', { class: 'rodape__linha', text: endereco.linhaUnica }),
        el('a', { class: 'rodape__elo', href: config.siteHotel, text: 'greenbeach.com.br' }),
      ]),

      el('div', { class: 'rodape__notas' }, [
        el('p', { class: 'rodape__nota', text: rodape.transparencia }),
        el('p', { class: 'rodape__nota', text: rodape.aviso }),
        el('p', { class: 'rodape__nota rodape__nota--fina',
          text: `${pousada.nome}. ${endereco.cidade}, ${endereco.estado}. ${parque.nome} em ${parque.cidade}, ${parque.estado}.` }),
      ]),
    ]),
  ])
}
