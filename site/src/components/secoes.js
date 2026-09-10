/**
 * Secoes editoriais: A pousada, Comodidades, Localizacao e Avaliacoes.
 * Toda secao devolve null quando nao ha dado confirmado, entao a pagina
 * nunca mostra bloco vazio nem texto de enchimento.
 */
import { el } from '../lib/dom.js'
import { icone } from '../lib/icones.js'
import { pousada } from '../data/pousada.js'
import { prepararFotos } from '../lib/imagens.js'
import { abrirLightbox } from './lightbox.js'
import { mapEmbedUrl, mapDirectionsUrl } from '../config.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'

/* ------------------------------------------------------------- A pousada */
export const criarSobre = () => {
  const { sobre, destaques } = pousada
  if (!sobre.confirmado && destaques.length === 0) return null

  const todas = prepararFotos(pousada.fotos, '(min-width: 62em) 40vw, 90vw')
  const retrato = todas.find((f) => f.sobre) || todas.find((f) => f.tipo === 'pousada')

  const coluna = el('div', { class: 'sobre__texto' }, [
    el('p', { class: 'olho', text: pousada.grupo }),
    el('h2', { class: 'secao__titulo', text: sobre.titulo || 'A pousada' }),
    ...sobre.paragrafos.map((p) => el('p', { class: 'sobre__paragrafo', text: p })),
  ])

  // A única foto que mostra a pousada de verdade vive aqui, e não no mosaico
  // de aéreas: é o retrato da casa, não do destino.
  const foto = retrato
    ? el('button', {
        type: 'button',
        class: 'sobre__foto',
        'aria-label': `Ampliar a foto: ${retrato.alt}`,
        onclick: (evento) => {
          const posicao = todas.findIndex((f) => f.arquivo === retrato.arquivo)
          abrirLightbox(todas, Math.max(0, posicao), evento.currentTarget)
        },
      }, [
        el('img', {
          src: retrato.src,
          srcset: retrato.srcset,
          sizes: retrato.sizes,
          alt: retrato.alt,
          loading: 'lazy',
          decoding: 'async',
          width: String(retrato.largura),
          height: String(retrato.altura),
          style: `background-image:url(${retrato.mini});background-size:cover;background-position:${retrato.foco};object-position:${retrato.foco}`,
        }),
        el('span', { class: 'sobre__legenda', text: retrato.legenda || '' }),
      ])
    : null

  // Fileira tipográfica, sem ícone dentro de círculo. Círculo de ícone em
  // fila é o visual mais genérico que existe em site de hotel, e o próprio
  // manual da marca proíbe. Aqui quem cria hierarquia é o tamanho e o filete.
  const lista = destaques.length
    ? el('ul', { class: 'destaques' },
        destaques.map((d) =>
          el('li', { class: 'destaque' }, [
            el('h3', { class: 'destaque__titulo' }, [
              el('span', { class: 'destaque__glifo', 'aria-hidden': 'true', html: icone(d.icone) }),
              el('span', { text: d.titulo }),
            ]),
            el('p', { class: 'destaque__texto', text: d.texto }),
          ]),
        ),
      )
    : null

  return el('section', { class: 'secao sobre', id: 'a-pousada' }, [
    el('div', { class: 'secao__interno' }, [
      el('div', { class: 'sobre__grade' }, [coluna, foto].filter(Boolean)),
      lista,
    ]),
  ])
}

/* --------------------------------------------------------- Comodidades */
export const criarComodidades = () => {
  const itens = pousada.comodidades
  if (itens.length === 0) return null

  // Foto alta sangrando na borda direita. A seção era a mais plana da página:
  // dez itens miúdos em cinco colunas, fundo liso e um vazio embaixo.
  const todas = prepararFotos(pousada.fotos, '(min-width: 62em) 42vw, 92vw')
  const vertical = todas.find((f) => f.comodidades) || todas.find((f) => f.tipo === 'destino')

  const foto = vertical
    ? el('button', {
        type: 'button',
        class: 'comodidades__foto',
        'aria-label': `Ampliar a foto: ${vertical.alt}`,
        onclick: (evento) => {
          const posicao = todas.findIndex((f) => f.arquivo === vertical.arquivo)
          abrirLightbox(todas, Math.max(0, posicao), evento.currentTarget)
        },
      }, [
        el('img', {
          src: vertical.src,
          srcset: vertical.srcset,
          sizes: vertical.sizes,
          alt: vertical.alt,
          loading: 'lazy',
          decoding: 'async',
          width: String(vertical.largura),
          height: String(vertical.altura),
          style: `background-image:url(${vertical.mini});background-size:cover;background-position:${vertical.foco};object-position:${vertical.foco}`,
        }),
      ])
    : null

  return el('section', { class: 'secao comodidades', id: 'comodidades' }, [
    el('div', { class: 'secao__interno comodidades__grade-mestre' }, [
      el('div', { class: 'comodidades__texto' }, [
        el('header', { class: 'secao__cabecalho' }, [
          el('p', { class: 'olho', text: 'Estrutura' }),
          el('h2', { class: 'secao__titulo', text: 'O que a pousada oferece' }),
        ]),
        el('ul', { class: 'comodidades__grade' },
          itens.map((item) =>
            el('li', { class: 'comodidade' }, [
              el('span', { class: 'comodidade__icone', 'aria-hidden': 'true', html: icone(item.icone) }),
              el('span', { class: 'comodidade__nome', text: item.nome }),
            ]),
          ),
        ),
        el('p', {
          class: 'secao__nota',
          text: 'Precisa de algo que não está na lista? Pergunte pelo WhatsApp antes de reservar.',
        }),
      ]),
      foto,
    ].filter(Boolean)),
  ])
}

/* --------------------------------------------------------- Localizacao */
export const criarLocalizacao = () => {
  const { endereco, proximidades } = pousada
  if (!endereco.confirmado && proximidades.length === 0) return null

  const rota = el('a', {
    class: 'botao botao--contorno localizacao__rota',
    href: mapDirectionsUrl(),
    target: '_blank',
    rel: 'noopener',
    onclick: () => rastrear(EVENTOS.MAPA_ABERTO, { destino: 'rota' }),
  }, [
    el('span', { text: 'Abrir rota no Google Maps' }),
    el('span', { class: 'botao__seta', 'aria-hidden': 'true', html: icone('seta') }),
  ])

  const mapa = el('div', { class: 'localizacao__mapa' }, [
    el('iframe', {
      class: 'localizacao__iframe',
      src: mapEmbedUrl(),
      title: `Mapa com a localização da ${pousada.nome}`,
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
      allowfullscreen: true,
    }),
  ])

  const listaProximos = proximidades.length
    ? el('ul', { class: 'proximidades' },
        proximidades.map((p) =>
          el('li', { class: 'proximidade' }, [
            el('span', { class: 'proximidade__nome', text: p.nome }),
            el('span', { class: 'proximidade__distancia', text: p.distancia }),
          ]),
        ),
      )
    : null

  return el('section', { class: 'secao localizacao tem-fundo', id: 'localizacao' }, [
    el('div', { class: 'secao__interno localizacao__grade' }, [
      el('div', { class: 'localizacao__texto' }, [
        el('p', { class: 'olho', text: 'Como chegar' }),
        el('h2', { class: 'secao__titulo', text: 'Rua 141, no centro' }),
        endereco.confirmado && endereco.linhaUnica
          ? el('address', { class: 'localizacao__endereco', text: endereco.linhaUnica })
          : el('p', { class: 'localizacao__endereco', text: 'Litoral de Santa Catarina' }),
        endereco.nota ? el('p', { class: 'localizacao__nota', text: endereco.nota }) : null,
        listaProximos,
        // Chegar e sair é informação de localização tanto quanto distância, e
        // são dois dos poucos dados que já estão confirmados.
        pousada.operacao.checkin.confirmado && pousada.operacao.checkout.confirmado
          ? el('dl', { class: 'horarios' }, [
              el('div', { class: 'horario' }, [
                el('dt', { class: 'horario__rotulo', text: 'Check-in' }),
                el('dd', { class: 'horario__valor', text: `a partir das ${pousada.operacao.checkin.horario.replace(':00', 'h')}` }),
              ]),
              el('div', { class: 'horario' }, [
                el('dt', { class: 'horario__rotulo', text: 'Check-out' }),
                el('dd', { class: 'horario__valor', text: `até as ${pousada.operacao.checkout.horario.replace(':00', 'h')}` }),
              ]),
            ])
          : null,
        rota,
      ]),
      mapa,
    ]),
  ])
}

/* --------------------------------------------------------- Avaliacoes */
export const criarAvaliacoes = () => {
  const { avaliacoes } = pousada
  if (!avaliacoes.confirmado || avaliacoes.depoimentos.length === 0) return null

  return el('section', { class: 'secao avaliacoes', id: 'avaliacoes' }, [
    el('div', { class: 'secao__interno' }, [
      el('header', { class: 'secao__cabecalho avaliacoes__cabecalho' }, [
        el('div', {}, [
          el('p', { class: 'olho', text: 'Quem ja ficou' }),
          el('h2', { class: 'secao__titulo', text: 'O que os hóspedes contam' }),
        ]),
        avaliacoes.nota
          ? el('a', {
              class: 'avaliacoes__nota',
              href: avaliacoes.fonteUrl || '#',
              target: '_blank',
              rel: 'noopener',
            }, [
              el('span', { class: 'avaliacoes__valor', text: String(avaliacoes.nota).replace('.', ',') }),
              el('span', { class: 'avaliacoes__fonte', text: `${avaliacoes.total} avaliações no ${avaliacoes.fonte}` }),
            ])
          : null,
      ]),
      el('ul', { class: 'avaliacoes__lista' },
        avaliacoes.depoimentos.map((d) =>
          el('li', { class: 'depoimento' }, [
            el('blockquote', { class: 'depoimento__texto' }, [el('p', { text: d.texto })]),
            el('footer', { class: 'depoimento__autor' }, [
              el('span', { class: 'depoimento__nome', text: d.autor }),
              el('span', { class: 'depoimento__meta', text: `${d.data} no ${d.plataforma}` }),
            ]),
          ]),
        ),
      ),
    ]),
  ])
}
