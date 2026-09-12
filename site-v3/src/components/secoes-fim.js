/**
 * AS QUATRO ÚLTIMAS SEÇÕES
 * ---------------------------------------------------------------------------
 * 9  Como chegar     o endereço, o mapa animado e a rota
 * 10 O nome é novo   o fecho editorial, só tipografia
 * 11 CTA final       o último pedido, com o formulário completo
 * 12 Rodapé          contato, navegação e a linha de base
 *
 * A ordem e o texto estão decididos em arquitetura-v3.md, seções 9 a 12.
 * Este arquivo executa aquilo, não reinventa.
 *
 * Três decisões que valem registro, porque contrariam o que estava escrito:
 *
 * 1. O mapa de rua do Google NÃO entra. O cartão do iframe exibe "4,4 (287)",
 *    que é a nota da gestão anterior. Publicar aquele número dois blocos
 *    acima da seção que existe justamente para dizer "estas estrelas não são
 *    nossas" desmontaria o argumento mais forte da página. O mapa animado
 *    responde "onde fica" e o botão de rota responde "como eu chego", que são
 *    as duas perguntas reais. `mapEmbedUrl` continua em config.js, pronta,
 *    para o dia em que a ficha do Google for reivindicada pela nova gestão.
 *
 * 2. O mapa animado entra AQUI e não na seção 8, como previa a arquitetura.
 *    Foi direção recebida. Se a seção 8 também chamar `criarMapa()`, a página
 *    terá dois mapas: o componente não é um singleton e não avisa.
 *
 * 3. O telefone fixo (47) 3368-2466 não é publicado em lugar nenhum. Ele saiu
 *    da ficha do Google, que ainda é da operação anterior, e ninguém confirmou
 *    que ele toca na recepção de hoje. O dado continua em pousada.js, marcado,
 *    esperando confirmação.
 */
/*
 * A folha vem por aqui, e não por um @import em index.css, porque index.css
 * está com outro agente nesta rodada. Se um dia ela migrar para lá, esta
 * linha sai: as duas juntas duplicam as regras no bundle.
 */

import { el } from '../lib/dom.js'
import { pousada } from '../data/pousada.js'
import { config, mapDirectionsUrl } from '../config.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'
import { montarLinkWhatsApp } from '../lib/whatsapp.js'
import { assinar } from '../lib/store.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { criarMapa } from './mapa.js'
import { criarBusca } from './busca.js'

/**
 * O texto que ainda não mora em pousada.js.
 *
 * Ele está aqui, num bloco só e no topo do arquivo, e não espalhado pelas
 * funções, porque este é conteúdo e conteúdo se edita sem ler código. Quando
 * o cliente aprovar a seção 10, o lugar definitivo destes campos é
 * `data/pousada.js`, seguindo a convenção `confirmado`.
 *
 * Fonte de cada frase: arquitetura-v3.md, seções 9 a 12, texto já aprovado
 * na direção. Nada aqui foi escrito no escuro.
 */
const TEXTO = {
  chegar: {
    olho: 'Como chegar',
    titulo: 'Rua 141, no centro',
    rota: 'Abrir rota no Google Maps',
  },

  /**
   * Seção 10, versão ABERTA das duas que a arquitetura escreveu.
   *
   * `confirmado` aqui não quer dizer "o fato foi verificado", porque os três
   * fatos já estão verificados no projeto: a marca começou em agosto de 2026,
   * a nota do Google é da gestão anterior, e o site não exibe nota. O que esta
   * chave controla é a decisão de NEGÓCIO de falar publicamente do passado do
   * imóvel, que é do cliente e não do design. Virar para false tira a seção
   * inteira da página sem mexer em mais nada.
   *
   * O nome do hotel anterior não aparece, e não pode aparecer: dizer "outro
   * nome e outra administração" resolve, e não empurra o visitante para uma
   * busca cheia de reclamação sobre os antigos donos.
   */
  nome: {
    olho: 'Antes de você procurar no Google',
    titulo: 'A casa é a mesma.',
    tituloItalico: 'O nome é novo.',
    paragrafos: [
      'O prédio da Rua 141 recebe hóspede há muitos anos, com outro nome e outra administração. Desde agosto de 2026 ele é a Pousada & Hotel Green Beach, do Grupo Green, com telefone novo e atendimento novo. A esquina é a mesma, a operação não.',
      'Por isso você não vai achar nota de avaliação neste site. As estrelas que aparecem hoje no Google foram escritas sobre a operação anterior, e usar aquilo como recomendação nossa seria mentira. Quando existir avaliação escrita sobre a Green Beach, ela entra aqui, com nome e data.',
    ],
    link: 'Falar com a recepção',
    confirmado: true,
  },

  fechamento: {
    titulo: 'Suas datas ainda estão livres?',
    apoio: 'Escolha o período e mande. A recepção responde com o que está livre para essas datas.',
  },

  rodape: {
    contato: 'Contato',
    navegar: 'Navegar',
    /* Só descreve como a operação funciona de fato: não há motor de reserva,
       quem confirma é a recepção. Nenhuma promessa de prazo de resposta,
       porque ninguém mediu esse prazo. */
    aviso: 'Este site não fecha reserva. As datas que você escolher vão para o WhatsApp da recepção, e é ela que confirma o que está livre.',
  },
}

/**
 * Os mesmos destinos da gaveta do cabeçalho.
 *
 * A lista está duplicada aqui, e isso é dívida consciente: `SECOES` não é
 * exportada de cabecalho.js e `lib/navegacao.js` ainda devolve os ids da v1,
 * que não existem nesta página. O lugar certo dos dois é um módulo só.
 * Enquanto ele não existe, `podarLinksMortos` garante que o rodapé nunca
 * ofereça uma âncora que não leva a lugar nenhum, que é o defeito que
 * navegacao.js foi escrito para evitar.
 *
 * "Consultar datas" fica de fora de propósito: o formulário está logo acima,
 * na seção 11, e repetir o pedido no rodapé é insistência, não navegação.
 */
const DESTINOS = [
  { href: '#fatos', texto: 'A pousada' },
  { href: '#diaria', texto: 'O que está incluso' },
  { href: '#combinar', texto: 'Antes de chegar' },
  { href: '#itapema', texto: 'Itapema' },
  { href: '#chegar', texto: 'Como chegar' },
]

/** Remove do rodapé os links cujo destino não existe no documento. */
const podarLinksMortos = (lista) => {
  requestAnimationFrame(() => {
    for (const item of Array.from(lista.children)) {
      const alvo = item.querySelector('a')?.getAttribute('href') || ''
      if (alvo.startsWith('#') && !document.getElementById(alvo.slice(1))) {
        if (import.meta.env.DEV) console.warn('[rodape] seção ausente, link removido:', alvo)
        item.remove()
      }
    }
    // Bloco sem nenhum link não fica como título órfão no rodapé.
    if (lista.children.length === 0) lista.closest('.rodape__bloco')?.remove()
  })
}

/** "14:00" vira "14h", "14:30" vira "14h30". Derivado do dado, nunca escrito à mão. */
const horaCurta = (hhmm) => {
  if (typeof hhmm !== 'string' || !/^\d{1,2}:\d{2}$/.test(hhmm)) return ''
  const [h, m] = hhmm.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

/**
 * Uma linha da tabelinha de horários.
 *
 * Lê `rotulo` e `resumo`, que são os campos que a seção 6 usa na coluna da
 * esquerda: é o mesmo dado, escrito uma vez só, aparecendo em dois lugares.
 * Se `resumo` ainda não existir no item, deriva de `horario`, que é o dado
 * bruto, para a seção nunca ficar muda por causa de um campo novo.
 */
const linhaHorario = (item, rotuloPadrao) => {
  if (!item?.confirmado) return null
  const valor = item.resumo || horaCurta(item.horario)
  if (!valor) return null
  return el('div', {}, [
    el('dt', { text: item.rotulo || rotuloPadrao }),
    el('dd', { text: valor }),
  ])
}

/**
 * Link de WhatsApp que acompanha o formulário.
 *
 * Assina o store, então se a pessoa já escolheu as datas lá em cima, a
 * mensagem sai com elas mesmo partindo daqui. O `origem` é o que permite a
 * pousada distinguir, no próprio WhatsApp, dúvida de reserva.
 */
const linkDeRecepcao = ({ texto, classe, origem }) => {
  const a = el('a', {
    class: classe,
    href: montarLinkWhatsApp({ origem }),
    target: '_blank',
    rel: 'noopener noreferrer',
    text: texto,
    onclick: () => rastrear(EVENTOS.WHATSAPP_CLIQUE, { origem }),
  })
  assinar((estado) => {
    a.href = montarLinkWhatsApp({ ...estado, origem })
  })
  return a
}

/* ==========================================================================
   9. COMO CHEGAR
   ========================================================================== */

export const criarComoChegar = () => {
  const { endereco, operacao } = pousada
  if (!endereco.confirmado) return null

  /* Os horários repetidos em miúdo, porque quem chega direto nesta seção pelo
     menu pode ter pulado a caixa da seção 6. Rótulo em cima e valor embaixo,
     com numeral tabular, para os dois alinharem na vertical. */
  const linhas = [
    linhaHorario(operacao.checkin, 'Check-in'),
    linhaHorario(operacao.checkout, 'Check-out'),
  ].filter(Boolean)
  const horarios = linhas.length ? el('dl', { class: 'fim-chegar__horarios' }, linhas) : null

  const rota = el('a', {
    class: 'botao botao--vazado fim-chegar__rota',
    href: mapDirectionsUrl(),
    target: '_blank',
    rel: 'noopener noreferrer',
    text: TEXTO.chegar.rota,
    // Ancorada no Place ID, então o pino cai no número certo e não na rua toda.
    onclick: () => rastrear(EVENTOS.MAPA_ABERTO, { etapa: 'rota' }),
  })

  const texto = el('div', { class: 'fim-chegar__texto' }, [
    el('span', { class: 'olho', text: TEXTO.chegar.olho }),
    el('h2', { text: TEXTO.chegar.titulo }),
    /* <address> é o elemento certo para o endereço de contato da página. O
       itálico que o navegador aplica sai no CSS: itálico aqui brigaria com a
       linha itálica do display, que é a assinatura da página. */
    el('address', { class: 'fim-chegar__endereco', text: endereco.linhaUnica }),
    endereco.nota ? el('p', { class: 'lead fim-chegar__nota', text: endereco.nota }) : null,
    horarios,
    rota,
  ])

  /* O palco do mapa, sem a seção que mapa.js embrulha por conta própria: ela
     traz o texto e os ids da v1, que aqui virariam repetição e âncora
     duplicada. `criarMapa` devolve null quando não há coordenada confirmada,
     e aí a seção continua de pé só com endereço, nota e rota. */
  const palco = criarMapa()

  return el('section', { class: 'secao fim-chegar', id: 'chegar' }, [
    el('div', { class: 'envelope fim-chegar__grade' }, [
      texto,
      palco
        ? el('div', { class: 'fim-chegar__mapa gb-escuro' }, [palco])
        : null,
    ]),
  ])
}

/* ==========================================================================
   10. O NOME É NOVO
   O bloco mais importante da página depois do hero. Só tipografia: no
   Woolmers o fecho editorial também é só texto, e é isso que faz ele soar
   como conversa e não como anúncio. Foto aqui transformaria em campanha o
   único momento em que a casa fala na primeira pessoa.
   ========================================================================== */

export const criarNome = () => {
  const dados = TEXTO.nome
  if (!dados.confirmado) return null

  const texto = el('div', { class: 'fim-nome__texto' }, [
    ...dados.paragrafos.map((p) => el('p', { text: p })),
    linkDeRecepcao({
      texto: dados.link,
      classe: 'fim-nome__link',
      origem: 'nome-novo',
    }),
  ])

  return el('section', { class: 'secao secao--pausa fim-nome', id: 'nome' }, [
    el('div', { class: 'envelope fim-nome__grade' }, [
      el('div', { class: 'fim-nome__cabeca' }, [
        el('span', { class: 'olho', text: dados.olho }),
        /* Duas linhas, a segunda em itálico e em bronze. É o mesmo gesto da
           terceira linha do hero, e é a segunda e última vez que ele aparece
           na página: o hero abre a conversa, este bloco a fecha. Sobre papel
           o bronze é #8B784E (3,99:1) e só vale de 28px para cima, que é
           onde --fs-h2 vive (30 a 48px). */
        el('h2', { class: 'fim-nome__titulo' }, [
          el('span', { class: 'fim-nome__linha', text: dados.titulo }),
          el('span', { class: 'fim-nome__linha italica', text: dados.tituloItalico }),
        ]),
      ]),
      texto,
    ]),
  ])
}

/* ==========================================================================
   11. CTA FINAL
   ========================================================================== */

/**
 * A foto de fechamento com o véu de leitura.
 *
 * Véu medido, não escolhido: `itapema-por-do-sol` é uma cidade acesa à noite,
 * com milhares de pontos de luz. Os três véus do hero, aplicados aqui, deixam
 * o pior pixel da coluna de texto em 1,72:1. Com `--veu-faixa` o pior pixel
 * sobe para 6,63:1 e a mediana para 15,8:1.
 *
 * Funciona porque o gradiente e a foto andam juntos: o céu, que é a parte
 * escura da imagem (p90 0,094), fica quase sem véu e guarda 64% do brilho; a
 * cidade acesa, que é o que estoura, recebe 0,72 a 0,88 e vira textura atrás
 * do formulário. É o inverso de derrubar a foto inteira com um filtro.
 *
 * Único ponto abaixo de 4,5:1: uma nuvem clara em y 0,16 a 0,19, onde o pior
 * pixel dá 3,61:1. Só o H2 passa por ali, e H2 é texto grande (30 a 48px),
 * cujo piso é 3:1. Passa, e passa medido.
 */
const montarFundoFechamento = () => {
  const foto = pousada.fotos.find((f) => f.fechamento)
  if (!foto || !fotoExiste(foto.arquivo)) {
    return el('div', { class: 'fim-cta__fundo fim-cta__fundo--vazio', 'aria-hidden': 'true' })
  }

  const attrs = atributosDeFoto(foto.arquivo, {
    // Decorativa: o que ela mostra não acrescenta nada ao pedido que o bloco faz.
    alt: '',
    sizes: '100vw',
  })
  const foco = foto.focoFechamento || foto.foco

  return el('div', { class: 'fim-cta__fundo' }, [
    el('img', { ...attrs, style: `${attrs.style || ''};object-position:${foco}` }),
    el('div', { class: 'fim-cta__veu', 'aria-hidden': 'true' }),
  ])
}

export const criarFechamento = () => {
  const titulo = el('h2', { class: 'fim-cta__titulo', id: 'fim-cta-titulo', text: TEXTO.fechamento.titulo })

  const conteudo = el('div', { class: 'fim-cta__conteudo' }, [
    titulo,
    el('p', { class: 'lead fim-cta__apoio', text: TEXTO.fechamento.apoio }),
    /* A terceira e última aparição do formulário não existe: são duas
       instâncias no site inteiro, esta e a do hero, e as duas dividem o mesmo
       store. Quem preencheu lá em cima encontra tudo preenchido aqui.
       `extras` liga nome e observação, que o hero não mostra para não pedir
       demais na primeira dobra. */
    criarBusca({ variante: 'cta', origem: 'cta-final', extras: true }),
  ])

  return el('section', {
    class: 'secao secao--pausa fim-cta',
    id: 'consultar',
    'aria-labelledby': 'fim-cta-titulo',
  }, [
    montarFundoFechamento(),
    el('div', { class: 'envelope fim-cta__interior' }, [conteudo]),
  ])
}

/* ==========================================================================
   12. RODAPÉ
   Contato, e só. Sete colunas de links pressupõem um site de quarenta
   páginas; este tem uma.
   ========================================================================== */

export const criarRodape = () => {
  const { contato, endereco, marca, nome, grupo } = pousada

  /* ------------------------------------------------------------- contato */
  const linhasDeContato = []

  if (contato.confirmado && contato.telefoneExibicao) {
    linhasDeContato.push(
      el('li', {}, [
        el('a', {
          class: 'rodape__link',
          href: `https://wa.me/${config.whatsappNumber}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          // Sem mensagem pronta: aqui é a linha de contato, não um pedido de
          // reserva. Quem quer reservar com data usa o formulário logo acima.
          onclick: () => rastrear(EVENTOS.WHATSAPP_CLIQUE, { origem: 'rodape' }),
        }, [
          el('span', { class: 'rodape__rotulo', text: 'WhatsApp' }),
          el('span', { class: 'rodape__valor', text: contato.telefoneExibicao }),
        ]),
      ]),
    )
  }

  if (contato.confirmado && contato.instagram) {
    linhasDeContato.push(
      el('li', {}, [
        el('a', {
          class: 'rodape__link',
          href: contato.instagramUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, [
          el('span', { class: 'rodape__rotulo', text: 'Instagram' }),
          el('span', { class: 'rodape__valor', text: `@${contato.instagram}` }),
        ]),
      ]),
    )
  }

  // E-mail só entra quando existir: o antigo perdeu o domínio.
  if (contato.confirmado && contato.email) {
    linhasDeContato.push(
      el('li', {}, [
        el('a', { class: 'rodape__link', href: `mailto:${contato.email}` }, [
          el('span', { class: 'rodape__rotulo', text: 'E-mail' }),
          el('span', { class: 'rodape__valor', text: contato.email }),
        ]),
      ]),
    )
  }

  const blocoContato = el('div', { class: 'rodape__bloco rodape__bloco--contato' }, [
    el('h2', { class: 'olho', text: TEXTO.rodape.contato }),
    endereco.confirmado
      ? el('address', { class: 'rodape__endereco' }, [
          el('span', { text: `${endereco.logradouro}, ${endereco.bairro}` }),
          el('span', { text: `${endereco.cidade}, ${endereco.estado}, ${endereco.cep}` }),
        ])
      : null,
    linhasDeContato.length ? el('ul', { class: 'rodape__lista' }, linhasDeContato) : null,
  ])

  /* ------------------------------------------------------------ navegar */
  const listaNav = el(
    'ul',
    { class: 'rodape__lista rodape__lista--nav' },
    DESTINOS.map((d) => el('li', {}, [el('a', { class: 'rodape__link', href: d.href, text: d.texto })])),
  )
  podarLinksMortos(listaNav)

  const blocoNavegar = el('nav', { class: 'rodape__bloco rodape__bloco--navegar', 'aria-label': 'Seções da página' }, [
    el('h2', { class: 'olho', text: TEXTO.rodape.navegar }),
    listaNav,
  ])

  /* -------------------------------------------------------------- marca */
  /* Lockup completo em versão clara. Ele é vertical e quase quadrado, e só
     lê "POUSADA & HOTEL" acima de 135px de altura: por isso 136 e não o
     carimbo de 40px que rodapé costuma ter. Enquanto a versão horizontal
     reduzida não existir, é este o ativo disponível. */
  const blocoMarca = el('div', { class: 'rodape__marca' }, [
    el('img', {
      class: 'rodape__logo',
      src: marca.logoClara,
      alt: nome,
      width: '320',
      height: '348',
      loading: 'lazy',
      decoding: 'async',
    }),
    el('p', { class: 'rodape__aviso', text: TEXTO.rodape.aviso }),
  ])

  /* --------------------------------------------------------------- base */
  /* Ano pelo relógio, para a linha não envelhecer sozinha. CNPJ e razão
     social entram aqui quando o cliente mandar: hoje não existem em fonte
     nenhuma, e inventar registro de empresa não é licença poética. */
  const ano = new Date().getFullYear()
  const base = el('div', { class: 'rodape__base' }, [
    el('p', { class: 'rodape__copyright', text: `© ${ano} ${nome}. ${grupo}.` }),
  ])

  return el('footer', { class: 'rodape gb-escuro', id: 'contato' }, [
    el('div', { class: 'envelope rodape__grade' }, [blocoMarca, blocoContato, blocoNavegar]),
    el('div', { class: 'envelope' }, [base]),
  ])
}
