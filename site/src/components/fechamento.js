/** CTA final, barra fixa do mobile e rodape. */
import { el, qs } from '../lib/dom.js'
import { icone } from '../lib/icones.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'
import { linksDeNavegacao } from '../lib/navegacao.js'
import { criarBusca, ICONE_WHATSAPP } from './busca.js'
import { assinar, lerEstado, validar, atualizar } from '../lib/store.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { formatoCurto, noitesEntre, rotuloNoites } from '../lib/dates.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

/** Icone de WhatsApp em traco, para combinar com os demais do rodape. */
const ICONE_WHATSAPP_TRACO =
  '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.6 20.4l1.3-4.5a8.2 8.2 0 1 1 3.3 3.1l-4.6 1.4Z"/><path d="M8.9 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.3.3-.1.6a7 7 0 0 0 3.3 2.9c.3.1.5.1.7-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5a2 2 0 0 1-1.4 1.7c-.5.1-1.2.2-3.4-.7a9.4 9.4 0 0 1-4.3-3.9c-.3-.5-.9-1.6-.9-2.7 0-1 .5-1.6.7-1.8Z"/></svg>'

/* ------------------------------------------------------------- CTA final */
export const criarFechamento = () => {
  const fotos = prepararFotos(pousada.fotos)
  const capa = fotos.find((f) => f.fechamento) || fotos[fotos.length - 1]

  const fundo = el('div', { class: 'fechamento__fundo' }, [
    capa
      ? el('img', {
          class: 'fechamento__imagem',
          src: capa.src,
          srcset: capa.srcset,
          sizes: '100vw',
          alt: '',
          loading: 'lazy',
          decoding: 'async',
          width: String(capa.largura),
          height: String(capa.altura),
          style: `object-position:${capa.focoFechamento || capa.foco}`,
          'aria-hidden': 'true',
        })
      : null,
    el('div', { class: 'fechamento__veu', 'aria-hidden': 'true' }),
  ])

  return el('section', { class: 'fechamento', id: 'reservar' }, [
    fundo,
    el('div', { class: 'fechamento__interno' }, [
      el('div', { class: 'fechamento__texto' }, [
        el('h2', { class: 'fechamento__titulo', text: 'Suas datas ainda estão livres?' }),
        el('p', {
          class: 'fechamento__apoio',
          text: 'Sem central de reservas e sem formulário que ninguém lê. Você escolhe o período e fala direto com a pousada.',
        }),
      ]),
      el('div', { class: 'fechamento__caixa' }, [
        criarBusca({ variante: 'cta', origem: 'cta-final', extras: true }),
      ]),
    ]),
  ])
}

/* ------------------------------------------------- barra fixa do mobile */
export const criarBarraFixa = () => {
  const resumo = el('span', { class: 'barra__resumo' })
  const detalhe = el('span', { class: 'barra__detalhe' })

  const acao = el('button', {
    type: 'button',
    class: 'botao botao--primario barra__botao',
    onclick: () => {
      const dados = lerEstado()
      const { valido } = validar(dados)

      if (!valido) {
        // Sem datas, a barra leva o visitante ao formulario em vez de abrir o
        // WhatsApp com a mensagem pela metade.
        atualizar({ tocado: true })
        const alvo = qs('#consultar')
        alvo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        window.setTimeout(() => qs('#consultar .campo__gatilho')?.focus(), 500)
        return
      }

      rastrear(EVENTOS.WHATSAPP_CLIQUE, {
        origem: 'barra-fixa',
        noites: noitesEntre(dados.checkin, dados.checkout),
        protocolo: dados.protocolo,
      })
      window.open(montarLinkWhatsApp({ ...dados, origem: 'barra-fixa' }), '_blank', 'noopener,noreferrer')
    },
  }, [
    el('span', { class: 'botao__icone', 'aria-hidden': 'true', html: ICONE_WHATSAPP }),
    el('span', { class: 'barra__rotulo', text: 'Consultar' }),
  ])

  // Recolhida por classe, e não pelo atributo hidden: hidden vira
  // display:none e mata qualquer transição de saída. inert e aria-hidden
  // garantem que, recolhida, ela some também para teclado e leitor de tela.
  const raiz = el('div', { class: 'barra-fixa is-recolhida', 'aria-hidden': 'true', inert: true }, [
    el('div', { class: 'barra__info' }, [resumo, detalhe]),
    acao,
  ])

  const recolher = (recolhida) => {
    raiz.classList.toggle('is-recolhida', recolhida)
    raiz.setAttribute('aria-hidden', String(recolhida))
    if (recolhida) raiz.setAttribute('inert', '')
    else raiz.removeAttribute('inert')
  }

  assinar((estado) => {
    const noites = noitesEntre(estado.checkin, estado.checkout)
    if (noites > 0) {
      resumo.textContent = `${formatoCurto(estado.checkin)} até ${formatoCurto(estado.checkout)}`
      detalhe.textContent = `${rotuloNoites(noites)}, ${estado.adultos + estado.criancas} ${estado.adultos + estado.criancas === 1 ? 'hóspede' : 'hóspedes'}`
      raiz.classList.add('is-completa')
    } else {
      resumo.textContent = 'Consulte as datas'
      detalhe.textContent = 'Resposta direto no WhatsApp'
      raiz.classList.remove('is-completa')
    }
  })

  /**
   * A barra so aparece depois que o hero sai da tela, para nao competir com o
   * formulario principal nem cobrir a primeira dobra.
   */
  const iniciar = () => {
    const hero = qs('.hero__busca')
    if (!hero || !('IntersectionObserver' in window)) { recolher(false); return }
    const obs = new IntersectionObserver(([entrada]) => recolher(entrada.isIntersecting), { threshold: 0 })
    obs.observe(hero)
  }

  return { raiz, iniciar }
}

/* ---------------------------------------------------------------- rodape */
export const criarRodape = () => {
  const { contato, endereco } = pousada
  const ano = new Date().getFullYear()

  const contatos = el('ul', { class: 'rodape__contatos' }, [
    endereco.confirmado && endereco.linhaUnica
      ? el('li', {}, [
          el('span', { class: 'rodape__icone', 'aria-hidden': 'true', html: icone('local') }),
          el('span', { text: endereco.linhaUnica }),
        ])
      : null,
    contato.telefoneExibicao
      ? el('li', {}, [
          el('span', { class: 'rodape__icone', 'aria-hidden': 'true', html: ICONE_WHATSAPP_TRACO }),
          el('a', {
            href: `https://wa.me/${contato.telefoneLink.replace(/\D/g, '')}`,
            target: '_blank',
            rel: 'noopener',
            text: `WhatsApp ${contato.telefoneExibicao}`,
          }),
        ])
      : null,
    contato.fixoExibicao
      ? el('li', {}, [
          el('span', { class: 'rodape__icone', 'aria-hidden': 'true', html: icone('recepcao') }),
          el('a', { href: `tel:${contato.fixoLink}`, text: contato.fixoExibicao }),
        ])
      : null,
    contato.email
      ? el('li', {}, [
          el('span', { class: 'rodape__icone', 'aria-hidden': 'true', html: icone('cartao') }),
          el('a', { href: `mailto:${contato.email}`, text: contato.email }),
        ])
      : null,
  ].filter(Boolean))

  return el('footer', { class: 'rodape' }, [
    el('div', { class: 'rodape__interno' }, [
      el('div', { class: 'rodape__marca' }, [
        el('img', {
          class: 'rodape__logo',
          src: pousada.marca.logoClara,
          alt: pousada.nome,
          width: '160',
          height: '174',
          loading: 'lazy',
        }),
      ]),
      el('div', { class: 'rodape__blocos' }, [
        el('div', { class: 'rodape__bloco' }, [
          el('h2', { class: 'rodape__titulo', text: 'Contato' }),
          contatos,
          el('a', {
            class: 'rodape__social',
            href: contato.instagramUrl,
            target: '_blank',
            rel: 'noopener',
            text: `Instagram @${contato.instagram}`,
          }),
        ]),
        el('nav', { class: 'rodape__bloco', 'aria-label': 'Navegação do rodapé' }, [
          el('h2', { class: 'rodape__titulo', text: 'Navegar' }),
          el('ul', { class: 'rodape__links' },
            linksDeNavegacao().map((link) => el('li', {}, [el('a', { href: link.href, text: link.texto })])),
          ),
        ]),
      ]),
    ]),
    el('div', { class: 'rodape__base' }, [
      el('p', { text: `${ano} ${pousada.nome}. ${pousada.grupo}.` }),
    ]),
  ])
}
