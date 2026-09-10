/**
 * Perguntas frequentes.
 * As respostas saem de pousada.operacao. Item nao confirmado nao vira resposta
 * inventada: vira um convite honesto para confirmar pelo WhatsApp.
 */
import { el } from '../lib/dom.js'
import { icone } from '../lib/icones.js'
import { pousada } from '../data/pousada.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { lerEstado } from '../lib/store.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

const PERGUNTAS = [
  { chave: 'checkin', pergunta: 'Qual o horário de check-in?' },
  { chave: 'checkout', pergunta: 'Qual o horário de check-out?' },
  { chave: 'cafeDaManha', pergunta: 'O café da manhã está incluso?' },
  { chave: 'criancas', pergunta: 'Crianças podem se hospedar?' },
  { chave: 'pets', pergunta: 'A pousada aceita animais de estimação?' },
  { chave: 'estacionamento', pergunta: 'Tem estacionamento?' },
  { chave: 'cancelamento', pergunta: 'Como funciona o cancelamento?' },
  { chave: 'pagamento', pergunta: 'Quais formas de pagamento são aceitas?' },
]

/**
 * Resposta usada quando o dado ainda nao foi confirmado pela pousada.
 * Uma frase por tema, e nao a mesma repetida tres vezes, senao a secao inteira
 * cheira a texto de encher linguica.
 */
const SEM_RESPOSTA = {
  checkin: 'Combine o horário de chegada pelo WhatsApp, principalmente se for chegar de madrugada.',
  checkout: 'Fale com a recepção sobre o horário de saída e sobre guardar a bagagem depois dele.',
  cafeDaManha: 'Confirme o horário e o que é servido pelo WhatsApp antes de reservar.',
  criancas: 'A regra muda conforme a idade e o apartamento. Diga a idade das crianças no WhatsApp que a pousada informa berço, cama extra e cortesia.',
  pets: 'Confirme o porte do seu pet pelo WhatsApp antes de fechar a reserva.',
  estacionamento: 'Combine pelo WhatsApp antes de vir de carro.',
  cancelamento: 'O prazo de cancelamento é combinado no momento da reserva. Pergunte no WhatsApp antes de confirmar as datas, para não ter surpresa depois.',
  pagamento: 'A pousada informa as formas de pagamento, o parcelamento e o sinal na hora da consulta pelo WhatsApp.',
}

const PADRAO = 'Este detalhe a pousada prefere confirmar caso a caso. Chame no WhatsApp que a resposta vem na hora.'

/** Monta a lista final de perguntas com as respostas disponiveis. */
export const montarDuvidas = () => {
  const itens = PERGUNTAS.map(({ chave, pergunta }) => {
    const campo = pousada.operacao[chave]
    const respondida = Boolean(campo && campo.confirmado && campo.valor)
    return {
      pergunta,
      resposta: respondida ? campo.valor : SEM_RESPOSTA[chave] || PADRAO,
      respondida,
    }
  })
  return itens.concat(pousada.duvidasExtras.filter((d) => d.confirmado !== false))
}

export const criarDuvidas = () => {
  const itens = montarDuvidas()

  const lista = el('div', { class: 'duvidas__lista' },
    itens.map((item, i) => {
      const conteudo = el('div', {
        class: 'duvida__resposta',
        id: `duvida-resposta-${i}`,
        role: 'region',
        hidden: true,
      }, [el('p', { text: item.resposta })])

      const gatilho = el('button', {
        type: 'button',
        class: 'duvida__pergunta',
        id: `duvida-pergunta-${i}`,
        'aria-expanded': 'false',
        'aria-controls': `duvida-resposta-${i}`,
        onclick: () => {
          const aberto = gatilho.getAttribute('aria-expanded') === 'true'
          gatilho.setAttribute('aria-expanded', String(!aberto))
          conteudo.hidden = aberto
          item.raiz.classList.toggle('is-aberto', !aberto)
        },
      }, [
        el('span', { text: item.pergunta }),
        el('span', { class: 'duvida__sinal', 'aria-hidden': 'true' }),
      ])

      conteudo.setAttribute('aria-labelledby', `duvida-pergunta-${i}`)
      item.raiz = el('div', { class: 'duvida' }, [gatilho, conteudo])
      return item.raiz
    }),
  )

  const ajuda = el('a', {
    class: 'duvidas__ajuda',
    href: '#',
    onclick: (evento) => {
      evento.preventDefault()
      rastrear(EVENTOS.WHATSAPP_CLIQUE, { origem: 'duvidas' })
      const link = montarLinkWhatsApp({
        ...lerEstado(),
        origem: 'duvidas',
        observacao: lerEstado().observacao || 'Tenho uma dúvida antes de reservar',
      })
      window.open(link, '_blank', 'noopener,noreferrer')
    },
  }, [
    el('span', { text: 'Ficou com outra dúvida? Fale com a pousada no WhatsApp' }),
  ])

  // Bloco de contato na coluna da esquerda. Quem está no FAQ é justamente
  // quem tem uma pergunta que a lista não responde: ter o canal ao lado é
  // útil, e ainda resolve o vazio que sobrava embaixo do título.
  const { contato } = pousada
  const canais = el('ul', { class: 'duvidas__canais' }, [
    contato.telefoneExibicao
      ? el('li', {}, [
          el('span', { class: 'duvidas__canal-rotulo', text: 'WhatsApp' }),
          el('a', {
            class: 'duvidas__canal-valor',
            href: `https://wa.me/${contato.telefoneLink.replace(/\D/g, '')}`,
            target: '_blank',
            rel: 'noopener',
            text: contato.telefoneExibicao,
          }),
        ])
      : null,
    contato.fixoExibicao
      ? el('li', {}, [
          el('span', { class: 'duvidas__canal-rotulo', text: 'Telefone' }),
          el('a', { class: 'duvidas__canal-valor', href: `tel:${contato.fixoLink}`, text: contato.fixoExibicao }),
        ])
      : null,
    el('li', {}, [
      el('span', { class: 'duvidas__canal-rotulo', text: 'Instagram' }),
      el('a', {
        class: 'duvidas__canal-valor',
        href: contato.instagramUrl,
        target: '_blank',
        rel: 'noopener',
        text: `@${contato.instagram}`,
      }),
    ]),
  ].filter(Boolean))

  return el('section', { class: 'secao duvidas', id: 'duvidas' }, [
    el('div', { class: 'secao__interno duvidas__grade' }, [
      el('div', { class: 'duvidas__cabecalho' }, [
        el('p', { class: 'olho', text: 'Antes de reservar' }),
        el('h2', { class: 'secao__titulo', text: 'Perguntas frequentes' }),
        ajuda,
        canais,
      ]),
      lista,
    ]),
  ])
}
