/**
 * O miolo da página: seções 6, 7 e 8.
 *
 * As três vivem no mesmo arquivo porque funcionam como uma sequência só, e é
 * a sequência que faz o ritmo: caixa densa de números, pausa de foto clara,
 * bloco escuro de destino. Separadas em três arquivos, a chance de alguém
 * mexer no respiro de uma sem olhar as outras vira certeza.
 *
 *   6. combinar        o que já está combinado e o que a recepção resolve
 *   7. faixa de respiro a foto do amanhecer, sangrando, sem gatilho nenhum
 *   8. Itapema          quatro cartões de lugar, em contexto escuro
 *
 * Regra que vale para as três: nada de conteúdo mora aqui. Texto, foto e
 * ordem saem de data/pousada.js, e bloco sem `confirmado` não renderiza.
 */
import { el } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { atributosDeFoto, fotoExiste, prepararFotos, apenasReais } from '../lib/imagens.js'
import { abrirLightbox } from './lightbox.js'
import { gerarProtocolo, lerUTMs } from '../lib/whatsapp.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { config } from '../config.js'

/* ==========================================================================
   6. O QUE COMBINAR ANTES DE CHEGAR
   ========================================================================== */

/**
 * Quantos pontos a recepção ainda responde, por extenso.
 *
 * Por extenso e não em algarismo porque a frase é corrida, e número em texto
 * corrido lê como formulário. Os algarismos da seção são os da esquerda, que
 * são dado (14h, 12h) e não contagem.
 */
const PONTOS_POR_EXTENSO = [
  '',
  'esse ponto',
  'esses dois pontos',
  'esses três pontos',
  'esses quatro pontos',
  'esses cinco pontos',
]
const contarPontos = (quantos) => PONTOS_POR_EXTENSO[quantos] || 'esses pontos'

/**
 * Link do WhatsApp para PERGUNTA, que não é a mesma coisa que consulta com
 * data preenchida.
 *
 * Não passa por `montarLinkWhatsApp` de propósito. Aquela mensagem é o
 * formulário inteiro, e ela tem padrão de dois adultos e nenhuma criança:
 * mandada por quem só clicou em "perguntar", ela informa à recepção um
 * número de hóspedes que o visitante nunca escolheu, e a recepção responde
 * um orçamento para duas pessoas. Inventar dado do hóspede é o mesmo erro
 * que inventar dado da pousada.
 *
 * O protocolo e as UTMs continuam vindo de lib/whatsapp.js, então o formato
 * do identificador e a leitura de campanha não se duplicam aqui. Quando
 * aquele arquivo ganhar um `montarLinkDePergunta`, esta função sai.
 */
const linkDePergunta = (duvida = '') => {
  const linhas = ['Olá! Vim pelo site da Pousada Green Beach e queria tirar uma dúvida.']
  // Sem pendência na tela não existe dúvida para citar, e uma linha vazia no
  // meio da mensagem entrega que ali faltou alguma coisa.
  if (duvida) linhas.push('', duvida)
  linhas.push(
    '',
    `Consulta: ${gerarProtocolo()}`,
    'Origem: combinado',
    `Página: ${window.location.origin}${window.location.pathname}`,
  )

  const campanha = Object.entries(lerUTMs())
    .map(([chave, valor]) => `${chave}=${valor}`)
    .join(' | ')
  if (campanha) linhas.push(`Campanha: ${campanha}`)

  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(linhas.join('\n'))}`
}

/** Uma linha da coluna da esquerda: rótulo à esquerda, dado duro à direita. */
const linhaCombinada = ({ rotulo, resumo }) =>
  el('div', { class: 'combinar__linha' }, [
    el('dt', { class: 'combinar__rotulo', text: rotulo }),
    el('dd', { class: 'combinar__dado', text: resumo }),
  ])

/**
 * Monta as duas colunas a partir de `operacao`, e não de duas listas escritas
 * à mão. É isto que faz o item atravessar sozinho de uma coluna para a outra
 * no dia em que a pousada confirmar uma pendência: quem edita o dado não
 * precisa saber que existe um layout de duas colunas do outro lado.
 *
 * Item sem `resumo` nunca aparece como combinado, mesmo marcado como
 * confirmado. É a trava contra a linha "Pagamento:" com o valor em branco.
 */
const separarColunas = ({ combinado = [], naRecepcao = [] }, operacao) => {
  const item = (chave) => operacao[chave]
  const existe = (i) => Boolean(i)

  const esquerda = [...combinado, ...naRecepcao]
    .map(item)
    .filter((i) => existe(i) && i.confirmado && i.rotulo && i.resumo)

  const direita = naRecepcao
    .map(item)
    .filter((i) => existe(i) && !i.confirmado && i.pergunta)

  return { esquerda, direita }
}

export const criarCombinar = () => {
  const { combinar, operacao } = pousada
  if (!combinar?.confirmado) return null

  const { esquerda, direita } = separarColunas(combinar, operacao)
  // Sem nenhum dado confirmado a caixa perde o argumento inteiro: ela existe
  // para mostrar operação em dia, não para listar pendência.
  if (esquerda.length === 0) return null

  const colunaCombinado = el('div', { class: 'combinar__coluna combinar__coluna--firme' }, [
    el('h3', { class: 'combinar__cabeca', text: combinar.tituloCombinado }),
    el('dl', { class: 'combinar__lista' }, esquerda.map(linhaCombinada)),
  ])

  /*
   * A nota de fecho mora DENTRO da coluna da direita, e não numa faixa
   * separada embaixo da caixa, por dois motivos que andam juntos: ela fala
   * sobre os pontos dessa coluna, e a coluna da direita tem menos linhas que
   * a da esquerda, então sem ela sobra um vazio no pé da caixa que não se
   * repete em nenhum outro lugar da página.
   */
  const colunaRecepcao =
    direita.length > 0
      ? el('div', { class: 'combinar__coluna combinar__coluna--aberta' }, [
          el('h3', { class: 'combinar__cabeca', text: combinar.tituloRecepcao }),
          el(
            'ul',
            { class: 'combinar__pendencias' },
            direita.map((i) => el('li', { class: 'combinar__pendencia', text: i.pergunta })),
          ),
          el('p', {
            class: 'apoio combinar__nota',
            text: combinar.fecho.replace('{pontos}', contarPontos(direita.length)),
          }),
        ])
      : null

  /*
   * Os pontos citados na mensagem são os que estão na tela naquele momento, e
   * não uma lista escrita à mão: assim que o cliente confirmar um deles, a
   * frase encolhe sozinha em vez de continuar prometendo uma dúvida que já
   * tem resposta na página.
   */
  const duvida =
    direita.length > 0 && combinar.observacaoWhatsApp
      ? combinar.observacaoWhatsApp.replace(
          '{pontos}',
          direita.map((i) => (i.rotulo || '').toLocaleLowerCase('pt-BR')).join(', '),
        )
      : ''

  const gatilho = el('a', {
    class: 'botao botao--vazado combinar__gatilho',
    href: linkDePergunta(duvida),
    target: '_blank',
    rel: 'noopener noreferrer',
    text: combinar.gatilho,
    onclick: () => rastrear(EVENTOS.WHATSAPP_CLIQUE, { origem: 'combinado', noites: 0 }),
  })

  // O gatilho fecha a caixa numa faixa própria, com filete em cima, e
  // sobrevive ao dia em que todas as pendências forem confirmadas e a coluna
  // da direita deixar de existir.
  const fecho = el('div', { class: 'combinar__fecho' }, [gatilho])

  return el('section', { class: 'secao combinar', id: 'combinar' }, [
    el('div', { class: 'envelope' }, [
      el('div', { class: 'cabeca' }, [
        combinar.olho ? el('span', { class: 'olho', text: combinar.olho }) : null,
        el('h2', { text: combinar.titulo }),
      ]),
      el('div', { class: 'combinar__caixa' }, [
        el('div', { class: 'combinar__colunas' }, [colunaCombinado, colunaRecepcao]),
        fecho,
      ]),
    ]),
  ])
}

/* ==========================================================================
   7. A FAIXA DE RESPIRO
   ========================================================================== */

export const criarFaixaRespiro = () => {
  const { faixaRespiro } = pousada
  if (!faixaRespiro?.confirmado) return null

  const foto = pousada.fotos.find((f) => f.faixa)
  // A faixa é foto. Sem a foto não sobra pausa nenhuma, sobra um retângulo
  // com uma frase dentro, que é exatamente o tipo de bloco que enche página.
  if (!foto || !fotoExiste(foto.arquivo)) return null

  const attrs = atributosDeFoto(foto.arquivo, { alt: foto.alt, sizes: '100vw' })

  return el('figure', { class: 'faixa' }, [
    el('div', { class: 'faixa__fundo' }, [
      el('img', {
        ...attrs,
        class: 'faixa__imagem',
        // O foco vive no dado e não aqui: no recorte alto da faixa, com o
        // foco no meio, sobra só céu e o molhe some do quadro.
        style: `${attrs.style || ''};object-position:${foto.foco}`,
      }),
      /*
       * Véu CLARO, na cor do papel, e só no canto onde o texto senta.
       *
       * A foto é sobre o amanhecer: véu escuro por cima mata a luz que é o
       * assunto, e essa reclamação já aconteceu uma vez neste projeto. Aqui
       * o véu clareia: o quadro fica com 101,4% do brilho original. Os
       * números de contraste medidos no render estão em secoes-meio.css.
       */
      el('div', { class: 'faixa__veu', 'aria-hidden': 'true' }),
    ]),
    el('figcaption', { class: 'envelope faixa__legenda' }, [
      el('p', { class: 'faixa__frase', text: faixaRespiro.frase }),
      el('p', { class: 'faixa__apoio', text: faixaRespiro.apoio }),
    ]),
  ])
}

/* ==========================================================================
   8. ITAPEMA
   ========================================================================== */

/**
 * O acervo que o lightbox mostra, montado uma vez só.
 * `apenasReais` tira a foto de banco de imagem: ela ilustra uma seção, mas
 * não pode entrar numa galeria que a pessoa vai ler como "fotos da pousada".
 */
const acervoDoLightbox = () => prepararFotos(apenasReais(pousada.fotos), '100vw')

/** Um cartão: foto, nome do lugar e uma linha do que se vê nela. */
const criarCartao = (cartao, acervo) => {
  if (!fotoExiste(cartao.arquivo)) return null

  const grande = cartao.escala === 'grande'
  const attrs = atributosDeFoto(cartao.arquivo, {
    // Decorativa aqui de propósito: quem descreve a foto é o rótulo do botão,
    // logo abaixo. Repetir o alt e o nome do lugar faz o leitor de tela ouvir
    // o mesmo lugar duas vezes seguidas.
    alt: '',
    sizes: grande
      ? '(min-width: 80rem) 790px, (min-width: 56.25em) 62vw, 78vw'
      : '(min-width: 80rem) 380px, (min-width: 56.25em) 30vw, 78vw',
  })
  if (!attrs) return null

  const original = pousada.fotos.find((f) => f.arquivo === cartao.arquivo)
  const indice = acervo.findIndex((f) => f.arquivo === cartao.arquivo)

  const botao = el(
    'button',
    {
      type: 'button',
      class: 'itapema__cartao',
      // O nome acessível carrega o que está escrito no cartão mais o que o
      // clique faz. Sem a última frase, o leitor de tela anuncia um botão
      // chamado "A Meia Praia" e ninguém sabe que ele abre fotos.
      'aria-label': `${cartao.nome}. ${cartao.texto} Abrir a galeria de fotos.`,
      onclick: (evento) => {
        rastrear(EVENTOS.GALERIA_ABERTA, { origem: 'itapema', foto: cartao.arquivo })
        abrirLightbox(acervo, Math.max(0, indice), evento.currentTarget)
      },
    },
    [
      el('span', { class: 'itapema__foto' }, [
        el('img', {
          ...attrs,
          class: 'itapema__imagem',
          style: `${attrs.style || ''};object-position:${original?.foco || '50% 50%'}`,
        }),
      ]),
      el('span', { class: 'itapema__nome', text: cartao.nome }),
      el('span', { class: 'itapema__texto', text: cartao.texto }),
    ],
  )

  return el('li', { class: `itapema__item itapema__item--${grande ? 'grande' : 'pequena'}` }, [
    botao,
  ])
}

export const criarItapema = () => {
  const { itapema } = pousada
  if (!itapema?.confirmado) return null

  const acervo = acervoDoLightbox()
  const cartoes = (itapema.cartoes || []).map((c) => criarCartao(c, acervo)).filter(Boolean)
  // Menos de quatro lugares diferentes não sustenta a seção: com dois ou três
  // cartões a fileira vira sobra de espaço, e o assunto dela é justamente ter
  // o que mostrar em volta.
  if (cartoes.length < 4) return null

  return el(
    'section',
    { class: 'secao secao--verde gb-escuro itapema', id: 'itapema' },
    [
      el('div', { class: 'envelope' }, [
        el('div', { class: 'cabeca' }, [
          itapema.olho ? el('span', { class: 'olho', text: itapema.olho }) : null,
          el('h2', { text: itapema.titulo }),
          itapema.apoio ? el('p', { class: 'lead', text: itapema.apoio }) : null,
        ]),
        /*
         * O mapa animado entra AQUI, entre a cabeça e os cartões, quando ele
         * for portado para a v3 (hoje components/mapa.js ainda fala o
         * vocabulário de classe da v1 e não tem CSS nesta versão). A ordem é
         * decisão de arquitetura: o endereço já foi dito três vezes antes,
         * então o mapa deixa de responder "onde fica" e passa a ser o
         * argumento de destino que abre a seção.
         */
        el('ul', { class: 'itapema__cartoes' }, cartoes),
      ]),
    ],
  )
}
