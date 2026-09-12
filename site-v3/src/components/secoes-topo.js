/**
 * SEÇÕES 3, 4 e 5: a faixa de três fatos, a casa e a diária.
 *
 * As três vivem no mesmo arquivo porque são um bloco só de leitura: saindo do
 * hero, o visitante recebe fato seco (3), depois entende que tipo de lugar é e
 * por que a reserva é pelo WhatsApp (4), e só então lê o que vem na diária (5).
 * Separar em três arquivos esconderia que elas se revezam em foto e em cor:
 * 3 não tem foto nenhuma, 4 tem a única foto real da casa em tamanho pequeno,
 * 5 tem a foto grande sangrando. Quem mexer em uma precisa ver as outras.
 *
 * Anatomia e texto definidos em arquitetura-v3.md, seções 3, 4 e 5.
 * Sistema visual em direcao-de-arte-v3.md.
 *
 * ONDE MORA O TEXTO, E POR QUÊ ISSO É UMA PENDÊNCIA
 * -------------------------------------------------------------------------
 * Todo FATO que estas seções afirmam sai de data/pousada.js e só aparece
 * quando o dado de origem está `confirmado: true`. Nada é inventado aqui.
 *
 * O que está neste arquivo, e não lá, é a REDAÇÃO aprovada da v3 (olho,
 * título e parágrafos), que a arquitetura decidiu e que o arquivo de dados
 * ainda não recebeu: hoje `pousada.sobre` guarda a redação da v2, com título
 * e segundo parágrafo que a v3 descartou. Copiar o texto novo para cá em vez
 * de reescrever `pousada.sobre` foi escolha de escopo, não de arquitetura, e
 * está na lista de pendências: assim que `pousada.sobre` for atualizado para
 * a v3, estas constantes viram leitura do arquivo de dados e somem daqui.
 */
import { el } from '../lib/dom.js'
import { pousada, seConfirmado } from '../data/pousada.js'
import { atributosDeFoto, fotoExiste } from '../lib/imagens.js'

/* --------------------------------------------------------------- âncoras */

/* Os dois destinos de gatilho da página. Os nomes não são escolha deste
   arquivo: já estão no menu do cabeçalho (cabecalho.js). Âncora que muda de
   nome no meio da página é link que não leva a lugar nenhum, e numa página
   de conversão única isso custa a conversão. */
const ANCORA_FORMULARIO = '#consultar'
const ANCORA_COMBINAR = '#combinar'

/* ---------------------------------------------------------------- comuns */

/**
 * Título com quebra deliberada de linha.
 * A quebra é decisão de arte, igual à do hero: o navegador quebra pela
 * largura disponível e deixa palavra sozinha fechando o título, que é o
 * defeito tipográfico mais visível que existe em peça de marca.
 */
const montarTitulo = (linhas, classe = 'casa__titulo') =>
  el(
    'h2',
    { class: classe },
    linhas.map((linha) => el('span', { class: 'titulo__linha', text: linha })),
  )

/**
 * Gatilho de texto, não botão cheio.
 * A página tem um botão primário só por seção, e nas seções 4 e 5 quem carrega
 * a ação é o formulário lá embaixo: repetir a superfície dourada aqui faria a
 * página inteira parecer um anúncio com três chamadas competindo.
 */
const gatilhoDeTexto = (texto, href) =>
  el('a', { class: 'gatilho', href, text: texto })

/* ==========================================================================
   3. FAIXA DE TRÊS FATOS
   Responde onde fica, o que está incluso e se aceita pet antes que alguém
   precise rolar atrás disso. Sem foto: é a pausa tipográfica entre o hero e
   a seção 4, as duas com imagem.
   ========================================================================== */

/**
 * Quatro candidatos para três vagas, na ordem de prioridade da arquitetura.
 *
 * O quarto existe pela razão registrada em arquitetura-v3.md: se a pousada
 * deixar de confirmar a política de pet, a faixa não pode virar duas colunas
 * (duas colunas iguais dividindo a tela estão proibidas no sistema) nem pode
 * inventar um fato para tapar o buraco. Então entra o fato que já é verdade
 * pelo canal de atendimento, e a faixa continua com três.
 */
const FATOS = [
  {
    titulo: 'Rua 141, no centro de Itapema',
    apoio: 'Rua paralela à orla, a pé da areia e do calçadão.',
    /* O texto não crava distância de propósito: as fontes públicas vão de 20
       a 500 metros e se contradizem. Ver a nota em pousada.endereco. */
    confere: () => Boolean(pousada.endereco?.confirmado),
  },
  {
    titulo: 'Café da manhã incluso',
    apoio: 'Já na diária, servido todos os dias.',
    confere: () => Boolean(pousada.operacao?.cafeDaManha?.confirmado),
  },
  {
    titulo: 'Aceita animais de estimação',
    apoio: 'Confirme o porte do seu pet antes de reservar.',
    confere: () => Boolean(pousada.operacao?.pets?.confirmado),
  },
  {
    titulo: 'Reserva direto com a recepção',
    apoio: 'Sem intermediário: a consulta vai pelo WhatsApp da casa.',
    confere: () => Boolean(pousada.contato?.confirmado),
  },
]

export const criarFatos = () => {
  const fatos = FATOS.filter((fato) => fato.confere()).slice(0, 3)

  /* Faixa de um ou dois fatos não é faixa, é sobra de layout. Sem três fatos
     confirmados a seção não vai ao ar, e o menu do cabeçalho já sabe
     perguntar antes de criar o link. */
  if (fatos.length < 3) return null

  const itens = fatos.map((fato) =>
    el('div', { class: 'fatos__item' }, [
      el('h3', { class: 'fatos__titulo', text: fato.titulo }),
      el('p', { class: 'apoio fatos__apoio', text: fato.apoio }),
    ]),
  )

  /* Sem a classe .secao de propósito: a faixa respira por bloco e não por
     seção, e a razão está comentada em secoes-topo.css. */
  return el('section', { class: 'fatos', id: 'fatos' }, [
    el('div', { class: 'envelope' }, [el('div', { class: 'fatos__grade' }, itens)]),
  ])
}

/* ==========================================================================
   4. A CASA, E POR QUE A RESERVA É DIRETA
   É aqui que a ausência de motor de reserva deixa de ser falta e vira
   argumento. A única foto real da pousada aparece UMA vez na página, e é
   nesta seção.
   ========================================================================== */

/* Redação aprovada da v3. Ver o cabeçalho do arquivo sobre onde ela deveria
   morar. O segundo parágrafo não repete o primeiro: um diz onde é, o outro
   diz como se reserva, e é essa segunda parte que a v2 não tinha. */
const CASA = {
  olho: 'A pousada',
  titulo: ['Sem central de reservas.', 'Você fala com a casa.'],
  paragrafos: [
    'A Green Beach fica na Rua 141, no centro de Itapema, numa rua paralela à orla. É o tipo de endereço em que o dia começa na praia, o almoço é ali na esquina e ninguém precisa pegar o carro para nada.',
    'Aqui não tem intermediário nem formulário que cai numa caixa de entrada. As datas que você escolher vão direto para o WhatsApp da recepção, e quem responde é quem vai te receber na chegada.',
  ],
  gatilho: 'Consultar as datas',
}

/**
 * A fachada, em retrato 4:5 e nunca maior que três colunas.
 *
 * O original tem 628 px de largura. Numa caixa de 3 colunas (276 px a
 * 1280 px) ela ainda entrega 2,3x de densidade e desenha; a partir de 320 px
 * já começa a amaciar em tela densa. Esse teto é o motivo de a seção inteira
 * ter sido desenhada com a foto pequena, e não uma limitação a corrigir no
 * CSS depois.
 */
const montarFachada = () => {
  const foto = pousada.fotos.find((f) => f.sobre)
  if (!foto || !fotoExiste(foto.arquivo)) return null

  const attrs = atributosDeFoto(foto.arquivo, {
    alt: foto.alt,
    /* A caixa nunca passa de 3 colunas no desktop e da largura do texto no
       celular. Declarar isso evita que o navegador baixe uma largura maior
       do que a que vai ser desenhada. */
    sizes: '(max-width: 47.99em) 92vw, 276px',
  })

  return el('figure', { class: 'casa__figura' }, [
    el('img', {
      ...attrs,
      class: 'casa__foto',
      style: `${attrs.style || ''};object-position:${foto.foco}`,
    }),
    /* Legenda que só afirma o que se vê na foto: a entrada e o número da
       casa. Está escrita no arquivo de dados e é conferível na própria
       imagem, que é a única forma honesta de legendar. */
    foto.legenda ? el('figcaption', { class: 'apoio casa__legenda', text: foto.legenda }) : null,
  ])
}

/** A fileira de quatro destaques: tipográfica, sem ícone dentro de círculo. */
const montarDestaques = () => {
  const destaques = pousada.destaques || []
  if (destaques.length === 0) return null

  return el(
    'ul',
    { class: 'casa__destaques' },
    destaques.map((destaque) =>
      el('li', { class: 'casa__destaque' }, [
        el('h3', { class: 'casa__destaque-titulo', text: destaque.titulo }),
        el('p', { class: 'apoio casa__destaque-texto', text: destaque.texto }),
      ]),
    ),
  )
}

export const criarCasa = () => {
  /* O primeiro parágrafo afirma endereço; o segundo afirma que o canal de
     reserva é o WhatsApp da recepção. Sem os dois dados confirmados a seção
     não teria o que dizer, e meia seção é pior que nenhuma. */
  if (!pousada.endereco?.confirmado || !pousada.contato?.confirmado) return null

  const fachada = montarFachada()

  const texto = el('div', { class: 'casa__texto' }, [
    ...CASA.paragrafos.map((paragrafo, indice) =>
      el('p', {
        /* O primeiro parágrafo é o lead da seção: corpo grande, medida mais
           curta. O segundo volta ao corpo de texto. Dois degraus, e a
           diferença de tamanho é o que diz qual vem primeiro. */
        class: indice === 0 ? 'lead casa__lead' : 'casa__paragrafo',
        text: paragrafo,
      }),
    ),
    gatilhoDeTexto(CASA.gatilho, ANCORA_FORMULARIO),
  ])

  const corpo = el('div', { class: 'casa__corpo' }, [fachada, texto])

  return el(
    'section',
    { class: `secao casa${fachada ? '' : ' casa--sem-foto'}`, id: 'casa' },
    [
      el('div', { class: 'envelope' }, [
        el('div', { class: 'cabeca casa__cabeca' }, [
          el('span', { class: 'olho', text: CASA.olho }),
          montarTitulo(CASA.titulo),
        ]),
        corpo,
        montarDestaques(),
      ]),
    ],
  )
}

/* ==========================================================================
   5. O QUE JÁ ESTÁ NA DIÁRIA
   Responde "o que eu recebo pelo que eu pago" sem ter preço para mostrar, e
   diz o que falta no mesmo tamanho do que sobra.
   ========================================================================== */

const DIARIA = {
  olho: 'A diária',
  titulo: ['O que já está incluso'],
  gatilhoPrimario: 'Consultar as datas',
  gatilhoSecundario: 'O que combinar antes',
}

/**
 * As cinco linhas da lista.
 *
 * Cada linha aponta para as comodidades que a sustentam em pousada.js e só
 * aparece quando TODAS elas existem lá. A quarta linha junta três itens numa
 * frase só porque cinco linhas de uma palavra viram grade de ícones, que é o
 * visual mais genérico de site de hotel; e ela exige os três justamente para
 * a frase não continuar afirmando frigobar depois que alguém tirar o frigobar
 * do arquivo de dados.
 *
 * Pet é fato confirmado e importante, mas é assunto de combinar antes e vive
 * na seção 6. Repetir o mesmo item em duas seções seguidas enfraquece as duas.
 */
const LINHAS_DIARIA = [
  { icones: ['cafe'], texto: 'Café da manhã, todos os dias, já na diária' },
  { icones: ['piscina'], texto: 'Piscina' },
  { icones: ['wifi'], texto: 'Wi-Fi gratuito' },
  { icones: ['ar', 'frigobar', 'tv'], texto: 'Ar-condicionado, frigobar e TV no apartamento' },
  { icones: ['recepcao'], texto: 'Recepção e atendimento direto' },
]

const temComodidade = (icone) => (pousada.comodidades || []).some((c) => c.icone === icone)

/**
 * A foto do café, com a etiqueta na cara do visitante.
 *
 * A etiqueta não é enfeite nem excesso de zelo: a foto é de banco de imagem e
 * ilustra um serviço real. Marcar isso é o que separa ilustrar de fingir, e o
 * hóspede que chega e vê outra coisa no salão é avaliação ruim nova.
 *
 * A etiqueta é ligada pelo campo `tipo` do arquivo de dados. Quando a foto do
 * café de verdade chegar e o tipo virar 'pousada', ela sai sozinha, sem tocar
 * neste componente nem no CSS.
 */
const montarFotoDaDiaria = () => {
  const foto = pousada.fotos.find((f) => f.comodidades)
  if (!foto || !fotoExiste(foto.arquivo)) return null

  const attrs = atributosDeFoto(foto.arquivo, {
    alt: foto.alt,
    sizes: '(max-width: 47.99em) 100vw, 42vw',
  })

  return el('figure', { class: 'diaria__figura' }, [
    el('img', {
      ...attrs,
      class: 'diaria__foto',
      style: `${attrs.style || ''};object-position:${foto.foco}`,
    }),
    foto.tipo === 'ilustracao'
      ? el('figcaption', { class: 'diaria__etiqueta', text: 'Foto ilustrativa' })
      : null,
  ])
}

export const criarDiaria = () => {
  const linhas = LINHAS_DIARIA.filter((linha) => linha.icones.every(temComodidade))

  /* Uma seção chamada "o que já está incluso" com duas linhas anuncia o
     contrário do que promete. Abaixo de três itens ela não vai ao ar. */
  if (linhas.length < 3) return null

  const semEstacionamento = seConfirmado(pousada.operacao?.estacionamento)

  const lista = el(
    'ul',
    { class: 'diaria__lista' },
    linhas.map((linha) => el('li', { class: 'diaria__item', text: linha.texto })),
  )

  const texto = el('div', { class: 'diaria__texto' }, [
    el('div', { class: 'cabeca diaria__cabeca' }, [
      el('span', { class: 'olho', text: DIARIA.olho }),
      montarTitulo(DIARIA.titulo, 'diaria__titulo'),
    ]),
    lista,
    /* O que a casa NÃO tem, no mesmo corpo do que ela tem. Fonte: a própria
       pousada. Dizer isso aqui evita a discussão na chegada em janeiro, e é
       o que separa uma casa que sabe o que é de um anúncio. */
    semEstacionamento ? el('p', { class: 'diaria__ausencia', text: semEstacionamento }) : null,
    el('div', { class: 'diaria__gatilhos' }, [
      el('a', {
        class: 'botao botao--ouro',
        href: ANCORA_FORMULARIO,
        text: DIARIA.gatilhoPrimario,
      }),
      el('a', {
        class: 'botao botao--vazado',
        href: ANCORA_COMBINAR,
        text: DIARIA.gatilhoSecundario,
      }),
    ]),
  ])

  const figura = montarFotoDaDiaria()

  return el(
    'section',
    { class: `secao secao--areia diaria${figura ? '' : ' diaria--sem-foto'}`, id: 'diaria' },
    [el('div', { class: 'envelope diaria__grade' }, [texto, figura])],
  )
}
