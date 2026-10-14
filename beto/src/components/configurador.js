/**
 * O CONFIGURADOR
 * ---------------------------------------------------------------------------
 * E aqui que a venda acontece. Todo o resto da pagina existe para trazer o
 * visitante ate este bloco e para ele chegar aqui sem duvida.
 *
 * A regra que governa o componente inteiro: o visitante NUNCA digita no
 * WhatsApp. Ele monta o pedido aqui e o unico gesto que sobra e apertar
 * enviar. Mensagem que o cliente precisa escrever e mensagem que ele nao
 * envia.
 *
 * Duas decisoes de UX que parecem detalhe e nao sao:
 *
 * 1. O botao de WhatsApp NUNCA fica desabilitado. Falta data, a mensagem vai
 *    com "não informada" e o atendente pergunta. Botao cinza e desistencia
 *    programada, e o custo de um lead incompleto e muito menor que o custo de
 *    um lead que nao existe.
 *
 * 2. O calendario e INLINE, nao e modal. Escolher um dia e o primeiro gesto
 *    da pagina: abrir uma camada por cima para isso e pedagio. Modal se
 *    justifica em intervalo de hospedagem, onde sao duas datas e dois meses.
 *    Aqui e um dia so.
 */
import { el, qs } from '../lib/dom.js'
import {
  hoje, somaMeses, mesmoDia, gradeDoMes, diasDaSemana,
  formatoMesAno, formatoExtenso, formatoCurto, paraISO,
} from '../lib/dates.js'
import { lerEstado, assinar, atualizar, definirPadrao, alternarExtra, definirIdade } from '../lib/store.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import {
  emReais, ingressosVisiveis, extrasVisiveis, embarquesVisiveis, calendarioParque,
} from '../data/produtos.js'

const LIMITE_FUTURO_MESES = 14

/* ==========================================================================
   Conta do "a partir de"
   ========================================================================== */

/**
 * Soma o que foi escolhido.
 *
 * Devolve `{ total, completo }`. `completo` e false quando alguma coisa
 * escolhida nao tem preco publicado, e nesse caso o resumo escreve "a
 * combinar" em vez de um numero. Mostrar um total que ignora um item sem
 * preco e pior do que nao mostrar total nenhum: o cliente ancora no numero
 * errado e a conversa comeca com uma correcao para cima.
 */
export const calcular = (estado) => {
  const pessoas = estado.adultos + estado.criancas
  let total = 0
  let completo = true

  const ingresso = ingressosVisiveis().find((i) => i.id === estado.ingressoId)
  if (ingresso) {
    const adulto = ingresso.precoAdulto
    const crianca = ingresso.precoCrianca ?? ingresso.precoAdulto
    if (typeof adulto === 'number') total += adulto * estado.adultos
    else completo = false
    if (typeof crianca === 'number') total += crianca * estado.criancas
    else if (estado.criancas > 0) completo = false
  } else {
    completo = false
  }

  for (const extra of extrasVisiveis()) {
    if (!estado.extras.includes(extra.id)) continue
    if (typeof extra.preco !== 'number') { completo = false; continue }
    total += extra.porPessoa ? extra.preco * pessoas : extra.preco
  }

  const embarque = embarquesVisiveis().find((e) => e.id === estado.embarqueId)
  if (embarque) {
    if (typeof embarque.preco === 'number') total += embarque.preco * pessoas
    else completo = false
  }

  return { total, completo, pessoas }
}

/** Monta o objeto que a mensagem do WhatsApp consome. */
const montarPedido = (estado, origem) => {
  const ingresso = ingressosVisiveis().find((i) => i.id === estado.ingressoId)
  const embarque = embarquesVisiveis().find((e) => e.id === estado.embarqueId)
  const nomesExtras = extrasVisiveis()
    .filter((e) => estado.extras.includes(e.id))
    .map((e) => e.nome)

  return {
    data: estado.data,
    adultos: estado.adultos,
    criancas: estado.criancas,
    idadesCriancas: estado.idades.map((i) => (i ? `${i} anos` : '')),
    ingresso: ingresso ? ingresso.nome : '',
    extras: nomesExtras,
    transfer: embarque && embarque.id !== 'sem-transfer' ? embarque.nome : '',
    hospedagem: embarque && embarque.id === 'hospede' ? 'hóspede da Green Beach' : '',
    nome: estado.nome,
    observacao: estado.observacao,
    origem,
    protocolo: estado.protocolo,
  }
}

/* ==========================================================================
   Passo 1: o dia
   ========================================================================== */

const criarCalendario = () => {
  const inicio = hoje()
  const limite = somaMeses(inicio, LIMITE_FUTURO_MESES)
  const fechados = new Set(calendarioParque.confirmado ? calendarioParque.fechados : [])

  let mes = somaMeses(lerEstado().data || inicio, 0)
  let cursor = lerEstado().data || inicio

  const titulo = el('p', { class: 'cal__mes', 'aria-live': 'polite' })
  const grade = el('div', { class: 'cal__grade', role: 'grid', 'aria-label': 'Escolha o dia da visita' })

  const trocarMes = (passo) => {
    const alvo = somaMeses(mes, passo)
    if (alvo < somaMeses(inicio, 0) || alvo > limite) return
    mes = alvo
    render()
  }

  const anterior = el('button', {
    type: 'button', class: 'cal__nav', 'aria-label': 'Mês anterior',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg>',
    onclick: () => trocarMes(-1),
  })
  const proximo = el('button', {
    type: 'button', class: 'cal__nav', 'aria-label': 'Próximo mês',
    html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>',
    onclick: () => trocarMes(1),
  })

  const topo = el('div', { class: 'cal__topo' }, [anterior, titulo, proximo])

  const semana = el('div', { class: 'cal__semana', 'aria-hidden': 'true' },
    diasDaSemana.map((d) => el('span', { text: d })))

  const indisponivel = (data) =>
    data < inicio || data > limite || fechados.has(paraISO(data))

  const escolher = (data) => {
    if (indisponivel(data)) return
    atualizar({ data })
    cursor = data
    rastrear(EVENTOS.DATA_ESCOLHIDA, { data: paraISO(data) })
    render()
  }

  /** Setas andam no calendario sem sair do componente. */
  const aoTeclar = (evento, data) => {
    const saltos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (evento.key in saltos) {
      evento.preventDefault()
      const alvo = new Date(data.getTime())
      alvo.setDate(alvo.getDate() + saltos[evento.key])
      alvo.setHours(0, 0, 0, 0)
      if (alvo < inicio || alvo > limite) return
      cursor = alvo
      if (alvo.getMonth() !== mes.getMonth() || alvo.getFullYear() !== mes.getFullYear()) {
        mes = somaMeses(alvo, 0)
      }
      render()
      const botao = qs(`[data-dia="${paraISO(alvo)}"]`, grade)
      if (botao) botao.focus()
      return
    }
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      escolher(data)
    }
  }

  const render = () => {
    const { data: escolhida } = lerEstado()
    titulo.textContent = formatoMesAno(mes)
    anterior.disabled = somaMeses(mes, -1) < somaMeses(inicio, 0)
    proximo.disabled = somaMeses(mes, 1) > limite

    grade.textContent = ''
    for (const linha of gradeDoMes(mes)) {
      const fila = el('div', { class: 'cal__linha', role: 'row' })
      for (const dia of linha) {
        if (!dia) { fila.append(el('span', { class: 'cal__vazio', role: 'gridcell' })); continue }

        const bloqueado = indisponivel(dia)
        const selecionado = mesmoDia(dia, escolhida)
        const botao = el('button', {
          type: 'button',
          role: 'gridcell',
          class: `cal__dia${selecionado ? ' is-escolhido' : ''}${bloqueado ? ' is-bloqueado' : ''}`,
          dataset: { dia: paraISO(dia) },
          tabindex: mesmoDia(dia, cursor) ? '0' : '-1',
          'aria-selected': selecionado ? 'true' : 'false',
          'aria-disabled': bloqueado ? 'true' : null,
          'aria-label': `${formatoExtenso(dia)}${bloqueado ? ', parque fechado' : ''}`,
          text: String(dia.getDate()),
          onclick: () => escolher(dia),
          onkeydown: (ev) => aoTeclar(ev, dia),
        })
        fila.append(botao)
      }
      grade.append(fila)
    }
  }

  render()
  return el('div', { class: 'cal' }, [topo, semana, grade])
}

/* ==========================================================================
   Passo 2: quem vai
   ========================================================================== */

const criarContador = ({ rotulo, apoio, valor, min, max, aoMudar }) => {
  const numero = el('output', { class: 'contador__valor', text: String(valor) })

  const botao = (sinal, rotuloAria) =>
    el('button', {
      type: 'button',
      class: 'contador__botao',
      'aria-label': rotuloAria,
      text: sinal > 0 ? '+' : '−',
      onclick: () => {
        const atual = Number(numero.textContent)
        const novo = Math.min(max, Math.max(min, atual + sinal))
        if (novo === atual) return
        numero.textContent = String(novo)
        aoMudar(novo)
      },
    })

  return el('div', { class: 'contador' }, [
    el('div', { class: 'contador__texto' }, [
      el('span', { class: 'contador__rotulo', text: rotulo }),
      apoio ? el('span', { class: 'contador__apoio', text: apoio }) : null,
    ]),
    el('div', { class: 'contador__controle' }, [botao(-1, `Menos ${rotulo}`), numero, botao(1, `Mais ${rotulo}`)]),
  ])
}

const criarPessoas = () => {
  const estado = lerEstado()
  const idades = el('div', { class: 'idades' })

  const renderIdades = () => {
    const { criancas, idades: valores } = lerEstado()
    idades.textContent = ''
    if (criancas === 0) return
    idades.append(el('p', {
      class: 'idades__titulo',
      text: 'Idade de cada criança no dia da visita',
    }))
    const linha = el('div', { class: 'idades__linha' })
    for (let i = 0; i < criancas; i += 1) {
      const campo = el('input', {
        type: 'number', inputmode: 'numeric', min: '0', max: '17',
        class: 'idades__campo', value: valores[i] || '',
        'aria-label': `Idade da criança ${i + 1}`,
        placeholder: '0',
        oninput: (ev) => definirIdade(i, ev.target.value),
      })
      linha.append(campo)
    }
    idades.append(linha)
  }

  const bloco = el('div', { class: 'pessoas' }, [
    criarContador({
      rotulo: 'Adultos',
      apoio: '',
      valor: estado.adultos,
      min: 1,
      max: 20,
      aoMudar: (v) => { atualizar({ adultos: v }); rastrear(EVENTOS.PESSOAS_ALTERADAS, { adultos: v }) },
    }),
    criarContador({
      rotulo: 'Crianças',
      apoio: 'A idade muda o preço e a gratuidade',
      valor: estado.criancas,
      min: 0,
      max: 12,
      aoMudar: (v) => { atualizar({ criancas: v }); renderIdades() },
    }),
    idades,
  ])

  renderIdades()
  return bloco
}

/* ==========================================================================
   Passo 3: qual ingresso
   ========================================================================== */

const criarIngressos = () => {
  const lista = ingressosVisiveis()
  if (lista.length === 0) return null

  // Um recomendado ja vem marcado. Tela que comeca sem nada escolhido faz o
  // visitante decidir do zero, e decidir do zero e onde ele desiste.
  const padrao = lista.find((i) => i.recomendado) || lista[0]
  if (!lerEstado().ingressoId) definirPadrao({ ingressoId: padrao.id })

  const grupo = el('div', { class: 'cartoes', role: 'radiogroup', 'aria-label': 'Tipo de ingresso' })

  for (const item of lista) {
    const id = `ing-${item.id}`
    const entrada = el('input', {
      type: 'radio', name: 'ingresso', id, class: 'cartao__entrada', value: item.id,
      checked: lerEstado().ingressoId === item.id,
      onchange: () => {
        atualizar({ ingressoId: item.id })
        rastrear(EVENTOS.INGRESSO_ESCOLHIDO, { ingresso: item.id })
      },
    })

    const preco = typeof item.precoAdulto === 'number'
      ? el('p', { class: 'cartao__preco' }, [
          el('span', { class: 'cartao__apartir', text: 'a partir de' }),
          el('strong', { text: emReais(item.precoAdulto) }),
          el('span', { class: 'cartao__unidade', text: 'por pessoa' }),
        ])
      : el('p', { class: 'cartao__preco cartao__preco--sob-consulta', text: 'Valor no atendimento' })

    const rotulo = el('label', { class: 'cartao', for: id }, [
      item.recomendado ? el('span', { class: 'cartao__selo', text: 'Mais escolhido' }) : null,
      el('h3', { class: 'cartao__nome', text: item.nome }),
      item.resumo ? el('p', { class: 'cartao__resumo', text: item.resumo }) : null,
      item.inclui.length
        ? el('ul', { class: 'cartao__inclui' }, item.inclui.map((t) => el('li', { text: t })))
        : null,
      preco,
    ])

    grupo.append(el('div', { class: 'cartao__caixa' }, [entrada, rotulo]))
  }

  return grupo
}

/* ==========================================================================
   Passo 4: transfer
   ========================================================================== */

const criarTransfer = () => {
  const lista = embarquesVisiveis()
  if (lista.length <= 1) return null

  if (!lerEstado().embarqueId) definirPadrao({ embarqueId: lista[0].id })

  const grupo = el('div', { class: 'embarques', role: 'radiogroup', 'aria-label': 'Ponto de embarque' })

  for (const ponto of lista) {
    const id = `emb-${ponto.id}`
    const entrada = el('input', {
      type: 'radio', name: 'embarque', id, class: 'embarque__entrada', value: ponto.id,
      checked: lerEstado().embarqueId === ponto.id,
      onchange: () => {
        atualizar({ embarqueId: ponto.id })
        rastrear(EVENTOS.TRANSFER_ESCOLHIDO, { embarque: ponto.id })
      },
    })

    const valor = ponto.id === 'sem-transfer'
      ? ''
      : typeof ponto.preco === 'number' ? `+ ${emReais(ponto.preco)} por pessoa` : 'valor no atendimento'

    grupo.append(el('div', { class: 'embarque' }, [
      entrada,
      el('label', { class: 'embarque__rotulo', for: id }, [
        el('span', { class: 'embarque__nome', text: ponto.nome }),
        ponto.detalhe ? el('span', { class: 'embarque__detalhe', text: ponto.detalhe }) : null,
        valor ? el('span', { class: 'embarque__preco', text: valor }) : null,
      ]),
    ]))
  }

  return grupo
}

/* ==========================================================================
   Passo 5: adicionais
   ========================================================================== */

const criarExtras = () => {
  const lista = extrasVisiveis()
  if (lista.length === 0) return null

  const grupo = el('div', { class: 'extras' })

  for (const extra of lista) {
    const id = `ext-${extra.id}`
    const entrada = el('input', {
      type: 'checkbox', id, class: 'extra__entrada', value: extra.id,
      checked: lerEstado().extras.includes(extra.id),
      onchange: () => {
        alternarExtra(extra.id)
        rastrear(EVENTOS.EXTRA_ALTERNADO, { extra: extra.id })
      },
    })

    grupo.append(el('div', { class: 'extra' }, [
      entrada,
      el('label', { class: 'extra__rotulo', for: id }, [
        el('span', { class: 'extra__nome', text: extra.nome }),
        extra.descricao ? el('span', { class: 'extra__descricao', text: extra.descricao }) : null,
        typeof extra.preco === 'number'
          ? el('span', {
              class: 'extra__preco',
              text: `+ ${emReais(extra.preco)}${extra.porPessoa ? ' por pessoa' : ''}`,
            })
          : null,
      ]),
    ]))
  }

  return grupo
}

/* ==========================================================================
   O resumo e o botao
   ========================================================================== */

/**
 * @param {object} opcoes
 * @param {string} opcoes.origem  Identifica no WhatsApp de onde saiu o clique.
 * @param {boolean} [opcoes.compacto] Versao da barra fixa do mobile.
 */
export const criarResumo = ({ origem, compacto = false }) => {
  const linhas = el('dl', { class: 'resumo__linhas' })
  // aria-live: o total muda sem recarregar e sem mover o foco. Sem isso,
  // quem usa leitor de tela escolhe um adicional e nao ouve o preco mudar.
  const valor = el('p', { class: 'resumo__valor', 'aria-live': 'polite' })
  const nota = el('p', { class: 'resumo__nota' })

  const botao = el('a', {
    class: 'botao botao--ouro botao--pedido',
    href: '#',
    rel: 'noopener',
    target: '_blank',
    onclick: () => {
      const estado = lerEstado()
      rastrear(EVENTOS.WHATSAPP_CLIQUE, {
        origem,
        protocolo: estado.protocolo,
        ingresso: estado.ingressoId,
        embarque: estado.embarqueId,
        pessoas: estado.adultos + estado.criancas,
      })
    },
  }, [
    el('span', {
      class: 'botao__icone',
      html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.17c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.9-1.14-4.73-4.1-4.87-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.25.59.84 2.05.91 2.2.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.3-.12.58.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.14.45.12.62-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.69-.18 1.38Z"/></svg>',
    }),
    el('span', { class: 'botao__texto', text: compacto ? 'Pedir no WhatsApp' : 'Pedir pelo WhatsApp' }),
  ])

  const bloco = el('div', { class: `resumo${compacto ? ' resumo--barra' : ''}` }, [
    compacto ? null : el('p', { class: 'resumo__titulo', text: 'Seu pedido' }),
    compacto ? null : linhas,
    el('div', { class: 'resumo__fecho' }, [valor, botao]),
    nota,
  ])

  const linha = (termo, descricao) =>
    el('div', { class: 'resumo__linha' }, [
      el('dt', { text: termo }),
      el('dd', { text: descricao }),
    ])

  assinar((estado) => {
    const { total, completo, pessoas } = calcular(estado)

    if (!compacto) {
      const ingresso = ingressosVisiveis().find((i) => i.id === estado.ingressoId)
      const embarque = embarquesVisiveis().find((e) => e.id === estado.embarqueId)
      const nomesExtras = extrasVisiveis()
        .filter((e) => estado.extras.includes(e.id))
        .map((e) => e.nome)

      linhas.textContent = ''
      linhas.append(linha('Dia', estado.data ? formatoCurto(estado.data) : 'a escolher'))
      linhas.append(linha('Pessoas', `${pessoas}`))
      if (ingresso) linhas.append(linha('Ingresso', ingresso.nome))
      if (embarque && embarque.id !== 'sem-transfer') linhas.append(linha('Transfer', embarque.nome))
      if (nomesExtras.length) linhas.append(linha('Adicionais', nomesExtras.join(', ')))
    }

    if (completo && total > 0) {
      valor.textContent = ''
      valor.append(
        el('span', { class: 'resumo__apartir', text: 'a partir de' }),
        el('strong', { text: emReais(total) }),
      )
      nota.textContent = 'Valor estimado. A confirmação final sai no atendimento, junto com a disponibilidade do dia.'
    } else {
      valor.textContent = ''
      valor.append(el('strong', { text: 'Orçamento no WhatsApp' }))
      nota.textContent = 'Monte o pedido e o valor fechado volta na primeira resposta.'
    }

    botao.href = montarLinkWhatsApp(montarPedido(estado, origem))
  })

  return bloco
}

/* ==========================================================================
   A barra fixa do mobile
   ========================================================================== */

/**
 * So aparece depois que o visitante tocou em alguma coisa e depois que o
 * configurador passou pela tela. Barra que nasce junto com a pagina e barra
 * que o visitante aprende a ignorar antes de precisar dela.
 */
export const criarBarraFixa = () => {
  const barra = el('div', { class: 'barra-fixa', hidden: true }, [
    criarResumo({ origem: 'barra-mobile', compacto: true }),
  ])

  assinar((estado) => {
    if (estado.tocado) barra.hidden = false
  })

  return barra
}

/* ==========================================================================
   A secao inteira
   ========================================================================== */

const passo = (numero, titulo, apoio, conteudo) => {
  if (!conteudo) return null
  return el('section', { class: 'passo' }, [
    el('header', { class: 'passo__cabecalho' }, [
      el('span', { class: 'passo__numero', text: String(numero), 'aria-hidden': 'true' }),
      el('div', {}, [
        el('h3', { class: 'passo__titulo', text: titulo }),
        apoio ? el('p', { class: 'passo__apoio', text: apoio }) : null,
      ]),
    ]),
    el('div', { class: 'passo__corpo' }, [conteudo]),
  ])
}

export const criarConfigurador = () => {
  const passos = [
    passo(1, 'O dia da visita', 'Escolha a data e o resto se encaixa.', criarCalendario()),
    passo(2, 'Quem vai', 'Criança paga diferente, então a idade importa.', criarPessoas()),
    passo(3, 'Qual ingresso', '', criarIngressos()),
    passo(4, 'Como você chega', 'A gente busca e devolve, ou você vai por conta.', criarTransfer()),
    passo(5, 'Quer agilizar o dia?', 'Opcional, e dá para decidir depois.', criarExtras()),
  ].filter(Boolean)

  // Renumera, porque passo sem dado nao renderiza e numeracao com buraco
  // parece erro.
  passos.forEach((p, i) => { qs('.passo__numero', p).textContent = String(i + 1) })

  const coluna = el('div', { class: 'pedido__passos' }, passos)
  const lateral = el('aside', { class: 'pedido__lateral' }, [
    criarResumo({ origem: 'configurador' }),
  ])

  const secao = el('section', { class: 'secao secao--areia pedido', id: 'pedido' }, [
    el('div', { class: 'envelope pedido__interno' }, [
      el('header', { class: 'pedido__cabecalho' }, [
        el('p', { class: 'olho', text: 'Monte o seu pedido' }),
        el('h2', { class: 'pedido__titulo', text: 'Cinco escolhas e o pedido vai pronto' }),
        el('p', { class: 'pedido__apoio' },
          ['Você monta aqui, a gente recebe tudo escrito no WhatsApp e responde com o valor fechado. Nada de formulário, nada de cadastro.']),
      ]),
      el('div', { class: 'pedido__grade' }, [coluna, lateral]),
    ]),
  ])

  // O evento marca o INICIO do pedido, nao a montagem da secao. Disparar na
  // criacao contaria toda visita como pedido iniciado e a taxa de conversao
  // da pagina viraria ficcao.
  let avisado = false
  assinar((estado) => {
    if (avisado || !estado.tocado) return
    avisado = true
    rastrear(EVENTOS.PEDIDO_INICIADO, {})
  })

  return secao
}
