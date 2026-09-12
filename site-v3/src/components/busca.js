/**
 * Formulario de consulta de disponibilidade.
 * O mesmo componente serve o hero e o CTA final, mudando so a variante visual.
 * Todo o estado vive no store, entao as duas instancias ficam sincronizadas.
 */
import { el, qs } from '../lib/dom.js'
import { formatoCurto, noitesEntre, rotuloNoites } from '../lib/dates.js'
import { lerEstado, assinar, atualizar, definirPeriodo, validar } from '../lib/store.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { abrirCalendario } from './calendario.js'
import { abrirHospedes } from './hospedes.js'

let contador = 0

const rotuloHospedes = ({ adultos, criancas }) => {
  const partes = [`${adultos} ${adultos === 1 ? 'adulto' : 'adultos'}`]
  if (criancas > 0) partes.push(`${criancas} ${criancas === 1 ? 'criança' : 'crianças'}`)
  return partes.join(', ')
}

/**
 * @param {object} opcoes
 * @param {'hero'|'cta'} [opcoes.variante]
 * @param {string} [opcoes.origem]      Rotulo de origem gravado na mensagem.
 * @param {boolean} [opcoes.extras]     Mostra os campos opcionais nome/observacao.
 */
export const criarBusca = (opcoes = {}) => {
  const { variante = 'hero', origem = 'hero', extras = false } = opcoes
  const id = `busca-${(contador += 1)}`
  let consultaIniciada = false

  const marcarInicio = (campo) => {
    if (consultaIniciada) return
    consultaIniciada = true
    rastrear(EVENTOS.INICIO_CONSULTA, { origem, campo })
  }

  /* ------------------------------------------------------------- campos */
  const criarCampo = ({ chave, rotulo, dica }) => {
    const valorNode = el('span', { class: 'campo__valor', text: dica })
    const erroNode = el('p', { class: 'campo__erro', id: `${id}-${chave}-erro`, role: 'alert' })
    const botao = el('button', {
      type: 'button',
      class: 'campo__gatilho',
      id: `${id}-${chave}`,
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
    }, [
      el('span', { class: 'campo__rotulo', text: rotulo }),
      valorNode,
    ])
    const raiz = el('div', { class: `campo campo--${chave}` }, [botao, erroNode])
    return { raiz, botao, valorNode, erroNode, chave }
  }

  const campoCheckin = criarCampo({ chave: 'checkin', rotulo: 'Check-in', dica: 'Adicionar data' })
  const campoCheckout = criarCampo({ chave: 'checkout', rotulo: 'Check-out', dica: 'Adicionar data' })
  const campoHospedes = criarCampo({ chave: 'hospedes', rotulo: 'Hóspedes', dica: '2 adultos' })

  const abrirDatas = (foco) => (evento) => {
    const gatilho = evento.currentTarget
    marcarInicio(foco)
    gatilho.setAttribute('aria-expanded', 'true')
    const atual = lerEstado()
    abrirCalendario({
      checkin: atual.checkin,
      checkout: atual.checkout,
      foco,
      ancora: gatilho,
      aoConfirmar: ({ checkin, checkout }) => {
        gatilho.setAttribute('aria-expanded', 'false')
        definirPeriodo(checkin, checkout)
        if (checkin && checkout) {
          rastrear(EVENTOS.DATAS_SELECIONADAS, {
            origem,
            noites: noitesEntre(checkin, checkout),
          })
        }
      },
    })
  }

  campoCheckin.botao.addEventListener('click', abrirDatas('checkin'))
  campoCheckout.botao.addEventListener('click', abrirDatas('checkout'))

  campoHospedes.botao.addEventListener('click', (evento) => {
    const gatilho = evento.currentTarget
    marcarInicio('hospedes')
    gatilho.setAttribute('aria-expanded', 'true')
    const atual = lerEstado()
    abrirHospedes({
      adultos: atual.adultos,
      criancas: atual.criancas,
      ancora: gatilho,
      aoMudar: (valores) => {
        atualizar(valores)
        rastrear(EVENTOS.HOSPEDES_ALTERADOS, { origem, ...valores })
      },
    })
    // O aria-expanded volta a false quando o dialogo devolve o foco.
    gatilho.addEventListener('focus', () => gatilho.setAttribute('aria-expanded', 'false'), { once: true })
  })

  /* ----------------------------------------------------- campos opcionais */
  let campoNome = null
  let campoObs = null
  let blocoExtras = null

  if (extras) {
    campoNome = el('input', {
      type: 'text', id: `${id}-nome`, class: 'texto__input', name: 'nome',
      autocomplete: 'name', maxlength: '80', placeholder: 'Como podemos te chamar?',
      oninput: (e) => atualizar({ nome: e.target.value }),
    })
    campoObs = el('textarea', {
      id: `${id}-obs`, class: 'texto__input texto__input--area', name: 'observacao', rows: '2',
      maxlength: '400', placeholder: 'Chego tarde, preciso de berço, vou de carro...',
      oninput: (e) => atualizar({ observacao: e.target.value }),
    })
    blocoExtras = el('div', { class: 'busca__extras' }, [
      el('div', { class: 'texto' }, [
        el('label', { class: 'texto__rotulo', for: `${id}-nome`, text: 'Seu nome (opcional)' }),
        campoNome,
      ]),
      el('div', { class: 'texto' }, [
        el('label', { class: 'texto__rotulo', for: `${id}-obs`, text: 'Alguma observação? (opcional)' }),
        campoObs,
      ]),
    ])
  }

  /* --------------------------------------------------------------- envio */
  const resumo = el('p', { class: 'busca__resumo', 'aria-live': 'polite' })

  const enviar = el('button', {
    type: 'submit',
    class: 'botao botao--primario busca__enviar',
  }, [
    el('span', { class: 'botao__icone', 'aria-hidden': 'true', html: ICONE_WHATSAPP }),
    el('span', { text: 'Consultar disponibilidade' }),
  ])

  const formulario = el('form', {
    class: `busca busca--${variante}`,
    novalidate: true,
    'aria-label': 'Consultar disponibilidade',
  }, [
    el('div', { class: 'busca__campos' }, [campoCheckin.raiz, campoCheckout.raiz, campoHospedes.raiz]),
    blocoExtras,
    el('div', { class: 'busca__acao' }, [enviar, resumo]),
  ])

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault()
    atualizar({ tocado: true })
    const dados = lerEstado()
    const { valido, erros } = validar(dados)
    pintarErros(erros)

    if (!valido) {
      const primeiro = erros.checkin ? campoCheckin : erros.checkout ? campoCheckout : campoHospedes
      primeiro.botao.focus()
      return
    }

    const link = montarLinkWhatsApp({ ...dados, acomodacao: '', origem })
    rastrear(EVENTOS.WHATSAPP_CLIQUE, {
      origem,
      noites: noitesEntre(dados.checkin, dados.checkout),
      adultos: dados.adultos,
      criancas: dados.criancas,
      protocolo: dados.protocolo,
    })
    window.open(link, '_blank', 'noopener,noreferrer')
  })

  const pintarErros = (erros) => {
    for (const campo of [campoCheckin, campoCheckout, campoHospedes]) {
      const mensagem = erros[campo.chave] || ''
      campo.erroNode.textContent = mensagem
      campo.raiz.classList.toggle('is-invalido', Boolean(mensagem))
      campo.botao.setAttribute('aria-invalid', mensagem ? 'true' : 'false')
      if (mensagem) campo.botao.setAttribute('aria-describedby', campo.erroNode.id)
      else campo.botao.removeAttribute('aria-describedby')
    }
  }

  /* ------------------------------------------------------- sincronizacao */
  assinar((estado) => {
    campoCheckin.valorNode.textContent = estado.checkin ? formatoCurto(estado.checkin) : 'Adicionar data'
    campoCheckin.valorNode.classList.toggle('is-vazio', !estado.checkin)
    campoCheckout.valorNode.textContent = estado.checkout ? formatoCurto(estado.checkout) : 'Adicionar data'
    campoCheckout.valorNode.classList.toggle('is-vazio', !estado.checkout)
    campoHospedes.valorNode.textContent = rotuloHospedes(estado)
    campoHospedes.valorNode.classList.remove('is-vazio')

    if (campoNome && campoNome.value !== estado.nome) campoNome.value = estado.nome
    if (campoObs && campoObs.value !== estado.observacao) campoObs.value = estado.observacao

    const noites = noitesEntre(estado.checkin, estado.checkout)
    resumo.textContent = noites > 0
      ? `${rotuloNoites(noites)} para ${rotuloHospedes(estado)}. A pousada responde pelo WhatsApp.`
      : 'Sem compromisso. A pousada responde direto pelo WhatsApp.'

    if (estado.tocado) pintarErros(validar(estado).erros)
  })

  return formulario
}

export const ICONE_WHATSAPP = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2.2c-5.42 0-9.83 4.4-9.83 9.82a9.76 9.76 0 0 0 1.35 4.95L2 22l5.17-1.35a9.82 9.82 0 0 0 4.87 1.24h.01c5.41 0 9.82-4.4 9.82-9.82 0-2.63-1.02-5.09-2.88-6.95a9.74 9.74 0 0 0-6.95-2.88zm0 17.94h-.01a8.15 8.15 0 0 1-4.15-1.14l-.3-.18-3.08.81.82-3-.19-.31a8.13 8.13 0 0 1-1.25-4.35c0-4.5 3.66-8.16 8.17-8.16a8.11 8.11 0 0 1 5.77 2.4 8.11 8.11 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.17 8.16z"/></svg>`
