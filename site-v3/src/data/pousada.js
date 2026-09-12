/**
 * CONTEUDO DA POUSADA
 * ---------------------------------------------------------------------------
 * Este e o unico arquivo de conteudo do site. Texto, foto, acomodacao,
 * comodidade, endereco e pergunta frequente ficam todos aqui.
 *
 * Convencao do projeto:
 *   confirmado: true   dado verificado em fonte publica ou dito pela propria
 *                      pousada. Vai para o ar.
 *   confirmado: false  placeholder. O site NAO renderiza o bloco, entao nada
 *                      inventado chega ao visitante. Preencha e vire para true.
 *
 * Fontes usadas nesta versao (dossie completo em ../../pesquisa/):
 *   [IG]     Instagram @pousadagreenbeach, posts de 30/08 a 05/09/2026
 *   [GOOGLE] Ficha do Google Maps da Pousada e Hotel Green Beach
 *   [OSM]    OpenStreetMap, no do estabelecimento
 *
 * ATENCAO: a pousada ocupa o endereco do antigo Hotel Recanto Natural e foi
 * rebatizada em agosto de 2026. A nota 4,4 e as 287 avaliacoes que aparecem no
 * Google sao da gestao anterior, por isso a secao de avaliacoes esta desligada.
 */

import logoDourada from '../assets/green-beach-logo.webp'
import logoClara from '../assets/green-beach-logo-clara.webp'
import simbolo from '../assets/green-beach-simbolo.webp'

export const pousada = {
  nome: 'Pousada & Hotel Green Beach',
  nomeCurto: 'Green Beach',
  grupo: 'Grupo Green',

  marca: {
    /** Lockup completo em dourado, para fundo claro. */
    logoDourada,
    /** Lockup completo em branco quente, para foto e fundo escuro. */
    logoClara,
    /** Rosacea isolada. O lockup so e legivel acima de 135px de altura,
     *  entao o cabecalho solido usa o simbolo. Ver direcao-de-arte.md. */
    simbolo,
  },

  /** Primeira dobra. Promessa curta, so com o que a pousada afirma. [IG] */
  hero: {
    /**
     * O título vem quebrado em três linhas de propósito, e a ordem importa.
     * É a assinatura tipográfica da página: as duas primeiras em romano, a
     * terceira em itálico e em dourado. Quebrar em outro lugar desmonta o
     * gesto, então a quebra é dado e não resultado de largura de tela.
     *
     * A terceira linha é sempre a que "fecha" a frase, nunca um adjetivo.
     */
    olho: 'Centro de Itapema, Santa Catarina',
    titulo: ['A praia de Itapema', 'e uma casa'],
    tituloItalico: 'logo atrás',
    apoio:
      'Pousada e hotel numa rua paralela à orla, no centro. Café da manhã incluso na diária, piscina, e a reserva feita direto com a recepção, pelo WhatsApp.',
    chamada: 'Consulte as datas da sua estadia',
    confirmado: true,
  },

  contato: {
    /** [IG] publicado pela pousada como canal de reserva. */
    telefoneExibicao: '(47) 99794-8332',
    telefoneLink: '+5547997948332',
    /** [GOOGLE] telefone fixo da recepcao. */
    fixoExibicao: '(47) 3368-2466',
    fixoLink: '+554733682466',
    instagram: 'pousadagreenbeach',
    instagramUrl: 'https://www.instagram.com/pousadagreenbeach/',
    /** PENDENTE: o e-mail antigo perdeu o dominio. Aguardando o novo. */
    email: '',
    confirmado: true,
  },

  endereco: {
    logradouro: 'Rua 141, 58',
    bairro: 'Centro',
    cidade: 'Itapema',
    estado: 'SC',
    cep: '88220-000',
    pais: 'BR',
    linhaUnica: 'Rua 141, 58, Centro, Itapema, SC',
    /** [GOOGLE] cruzado com [OSM], divergencia de 8 metros. */
    coordenadas: { lat: -27.098438, lng: -48.614563 },
    placeId: 'ChIJCbzvCqOx2JQRMgYOV9J4-ys',
    /**
     * Frase da seção de localização. Descreve o que o mapa mostra e não crava
     * distância: as fontes públicas se contradizem, de 20 a 500 metros.
     * PENDENTE: medir na rua e trocar por um número.
     */
    nota: 'A pousada fica em uma rua paralela à orla, no centro. Do quarteirão dá para ir a pé até a areia, até o comércio e até os restaurantes do calçadão.',
    confirmado: true,
  },

  /**
   * Horarios e politicas.
   * Item com confirmado false vira, na pagina, um convite honesto a perguntar
   * pelo WhatsApp, em vez de uma resposta inventada.
   */
  operacao: {
    checkin: { valor: 'O check-in começa às 14h.', horario: '14:00', confirmado: true },
    checkout: { valor: 'O check-out é até as 12h.', horario: '12:00', confirmado: true },
    cafeDaManha: {
      valor: 'Sim, o café da manhã está incluso na diária.',
      confirmado: true,
    },
    estacionamento: {
      valor: 'A pousada não tem estacionamento próprio. Se você vem de carro, combine antes pelo WhatsApp onde deixar o veículo.',
      confirmado: true,
    },
    pets: {
      valor: 'Sim, a pousada aceita animais de estimação. Confirme o porte do seu pet pelo WhatsApp antes de reservar.',
      confirmado: true,
    },
    /** PENDENTE: politica de crianca, berco e idade de cortesia. */
    criancas: { valor: '', confirmado: false },
    /** PENDENTE: prazo de cancelamento gratuito e regra de no-show. */
    cancelamento: { valor: '', confirmado: false },
    /** PENDENTE: cartoes aceitos, Pix, parcelamento e valor do sinal. */
    pagamento: { valor: '', confirmado: false },
  },

  sobre: {
    titulo: 'No centro de Itapema, com o mar logo ali',
    paragrafos: [
      'A Green Beach fica na Rua 141, no centro de Itapema, a poucos passos da faixa de areia. É o tipo de endereço em que o dia começa na praia, o almoço é ali na esquina e ninguém precisa pegar o carro para nada.',
      'A casa é do Grupo Green e recebe hóspedes desde agosto de 2026. O atendimento é direto: quem responde no WhatsApp é quem vai te receber na recepção.',
    ],
    confirmado: true,
  },

  /** Diferenciais afirmados pela propria pousada. [IG] */
  destaques: [
    {
      icone: 'praia',
      titulo: 'Perto da praia',
      texto: 'No centro de Itapema, a poucos passos da faixa de areia.',
    },
    {
      icone: 'piscina',
      titulo: 'Piscina',
      texto: 'Para o fim de tarde, quando a praia esvazia e a preguiça bate.',
    },
    {
      icone: 'cafe',
      titulo: 'Café da manhã incluso',
      texto: 'Servido todo dia, já na diária, sem taxa escondida.',
    },
    {
      icone: 'familia',
      titulo: 'Conforto para a família',
      texto: 'Apartamentos confortáveis e lazer para todo mundo da casa.',
    },
  ],

  /**
   * Fotos.
   * O campo arquivo aponta para a chave do manifesto gerado por
   * scripts/preparar-fotos.py. Para acrescentar uma foto: coloque o original
   * em assets-raw/originais, rode o script e adicione o item aqui.
   *
   * tipo separa tres coisas:
   *   'pousada'    mostra a pousada de verdade
   *   'destino'    mostra Itapema, e a legenda diz isso
   *   'ilustracao' foto de banco de imagem, entra so onde e decoracao e fica
   *                FORA do lightbox e do Schema.org
   * Nunca marque como 'pousada' uma foto que nao mostra a pousada.
   *
   * Os papéis dizem onde a foto já aparece, e servem para o mosaico da galeria
   * não repetir uma imagem que a pessoa acabou de ver:
   *   destaque   foto do hero
   *   faixa      faixa sangrada entre seções
   *   fechamento fundo do CTA final
   *   recorte    um dos quatro cartões da seção Itapema
   *   sobre      a foto grande da seção "A pousada"
   *   comodidades a foto alta que sangra na seção de estrutura
   *   mosaico    posição da peça na grade da galeria, de 1 a 6. A grade
   *              mistura três proporções de propósito: quatro fotos do mesmo
   *              tamanho lado a lado viram catálogo de estoque.
   * O lightbox continua mostrando o acervo inteiro, independente dos papéis.
   *
   * foco define o object-position do recorte, no formato "x% y%". Serve para a
   * parte importante da foto nao ser cortada quando o espaco muda de forma.
   * focoFechamento, quando existe, e o recorte usado so no CTA final.
   *
   * As aereas sao de dezembro de 2023 e janeiro de 2024, acervo proprio.
   * PENDENTE: continuam faltando as fotos internas da pousada. Ver PENDENCIAS.md.
   */
  fotos: [
    {
      arquivo: 'itapema-meia-praia-aerea',
      tipo: 'destino',
      alt: 'Vista aérea da Meia Praia em Itapema: a faixa de areia em curva, guarda-sóis coloridos, os prédios do centro à esquerda e o morro verde ao fundo',
      categoria: 'Meia Praia',
      legenda: 'A Meia Praia vista do alto. A pousada fica no centro, poucos passos atrás dessa faixa de areia.',
      foco: '50% 46%',
      recorte: true,
    },
    {
      arquivo: 'itapema-por-do-sol',
      tipo: 'destino',
      alt: 'Pôr do sol em Itapema: o céu vermelho sobre o morro, a curva da praia e a cidade já iluminada',
      categoria: 'Fim de tarde',
      legenda: 'O fim de tarde em Itapema, com o céu vermelho por trás do morro.',
      foco: '50% 50%',
      fechamento: true,
      focoFechamento: '58% 52%',
    },
    {
      arquivo: 'itapema-orla-a-noite',
      mosaico: 6,
      tipo: 'destino',
      alt: 'A orla de Itapema à noite, vista de cima, com a linha de luzes desenhando a curva da praia e as ondas em prata',
      categoria: 'À noite',
      legenda: 'A orla acesa à noite, desenhando a curva da praia.',
      foco: '50% 50%',
    },
    {
      arquivo: 'itapema-guarda-sois',
      mosaico: 2,
      tipo: 'destino',
      alt: 'Praia de Itapema vista quase de cima, com dezenas de guarda-sóis coloridos na areia e a espuma das ondas',
      categoria: 'Meia Praia',
      legenda: 'Verão na Meia Praia, guarda-sol por guarda-sol.',
      foco: '50% 55%',
    },
    {
      arquivo: 'fachada-green-beach',
      mosaico: 4,
      tipo: 'pousada',
      sobre: true,
      alt: 'Fachada da Pousada Green Beach: parede clara, madeira escura, sacadas brancas e a placa verde com o símbolo dourado da marca sobre a entrada em arco',
      categoria: 'A pousada',
      legenda: 'A entrada da pousada, na Rua 141, número 58.',
      foco: '52% 46%',
    },
    {
      arquivo: 'itapema-baia-aberta',
      mosaico: 1,
      tipo: 'destino',
      alt: 'A baía de Itapema vista do alto, com a praia em curva à esquerda e o mar aberto se estendendo à direita',
      categoria: 'Meia Praia',
      legenda: 'A baía inteira, do centro até a ponta.',
      foco: '50% 48%',
    },
    {
      arquivo: 'cafe-da-manha',
      /**
       * ATENÇÃO: foto de banco de imagem, não é o café da manhã da Green
       * Beach. Entrou porque a pousada anuncia café incluso e não existe
       * nenhuma foto do café real. Trocar assim que a foto de verdade chegar:
       * salve em assets-raw/originais/cafe-da-manha.jpg e rode
       * scripts/preparar-fotos.py, que o resto continua igual.
       *
       * Por isso o tipo é 'ilustracao' e não 'pousada': ela não entra no
       * lightbox junto com as fotos reais nem no Schema.org.
       */
      tipo: 'ilustracao',
      comodidades: true,
      alt: 'Duas xícaras de café com creme, em pires azuis, ao lado de dois croissants sobre uma mesa de madeira',
      categoria: 'Café da manhã',
      legenda: 'O café da manhã está incluso na diária.',
      foco: '50% 50%',
    },
    {
      arquivo: 'itapema-praia-grossa',
      tipo: 'destino',
      alt: 'A península verde da Praia Grossa, com mata fechada até a beira e o mar claro batendo nas pedras',
      categoria: 'Praia Grossa',
      legenda: 'A Praia Grossa, mata fechada descendo até a água.',
      foco: '50% 52%',
    },
    {
      arquivo: 'itapema-ilha-praia-grossa',
      recorte: true,
      tipo: 'destino',
      alt: 'A ilha em frente à Praia Grossa, cercada de água turquesa, com uma embarcação passando ao lado do molhe',
      categoria: 'Praia Grossa',
      legenda: 'A ilhota em frente à Praia Grossa.',
      foco: '50% 50%',
    },
    {
      arquivo: 'itapema-canto-da-praia',
      /**
       * FOTO DO HERO, escolhida por medição e não por gosto, em 11/09/2026.
       *
       * A candidata natural era `itapema-meia-praia-aerea`, que mostra a
       * praia e o centro no mesmo quadro. Mas o texto do hero cai em cima
       * de areia branca e mar claro nela, e para ficar legível o véu teria
       * que derrubar o brilho do quadro para 34%: a foto passa a parecer
       * que tem filtro escuro por cima.
       *
       * Aqui o texto cai sobre água funda, que já é escura. Resultado com
       * véu leve: 5,89:1 no pior pixel, dourado em 3,36:1, preservando 50%
       * do brilho. Ver a tabela em arquitetura-v3.md.
       *
       * O `foco` é 0% e não 50% pela mesma razão: puxa a água funda para
       * debaixo da coluna de texto. Trocar isso invalida a medição.
       */
      destaque: true,
      tipo: 'destino',
      alt: 'O Canto da Praia em Itapema, com barcos de pesca ancorados na água calma e a cidade ao fundo',
      categoria: 'Canto da Praia',
      legenda: 'O Canto da Praia, onde os barcos de pesca ficam ancorados.',
      foco: '0% 50%',
    },
    {
      arquivo: 'itapema-barcos-de-pesca',
      mosaico: 3,
      tipo: 'destino',
      alt: 'Barcos de pesca ancorados no Canto da Praia, com as casas e os quiosques da vila na encosta',
      categoria: 'Canto da Praia',
      legenda: 'A vila de pescadores, a poucos minutos do centro.',
      foco: '50% 55%',
    },
    {
      arquivo: 'itapema-nascer-do-sol',
      faixa: true,
      tipo: 'destino',
      alt: 'Nascer do sol em Itapema, com o mar prateado sob nuvens baixas e o molhe avançando na água',
      categoria: 'Amanhecer',
      legenda: 'O amanhecer, quando a praia ainda é só de quem acorda cedo.',
      /* Puxado para baixo: no recorte alto da faixa, com o foco no meio, sobra
         só céu cinza e o molhe some. */
      foco: '50% 64%',
    },
    {
      arquivo: 'itapema-baia-do-mirante',
      recorte: true,
      tipo: 'destino',
      alt: 'A baía de Itapema vista do mirante, com nuvens altas sobre o mar e a orla se estendendo ao longe',
      categoria: 'Do alto',
      legenda: 'Itapema vista do mirante, no fim da tarde.',
      foco: '50% 55%',
    },
    {
      arquivo: 'itapema-verao-na-praia',
      recorte: true,
      tipo: 'destino',
      alt: 'Praia de Itapema cheia em dia de verão, com guarda-sóis, banhistas na água e os prédios da orla',
      categoria: 'Meia Praia',
      legenda: 'Dezembro na Meia Praia.',
      foco: '50% 52%',
    },
    {
      arquivo: 'itapema-faixa-de-areia',
      mosaico: 5,
      tipo: 'destino',
      alt: 'A faixa de areia de Itapema vista do alto, com o mar esverdeado de um lado e a orla de prédios do outro',
      categoria: 'Meia Praia',
      legenda: 'A areia larga que sobra mesmo em dia cheio.',
      foco: '50% 50%',
    },
  ],

  /**
   * Acomodacoes.
   * PENDENTE: os tipos reais nao estao em nenhuma fonte publica, e a pousada
   * nao esta em Booking nem Airbnb. Lista vazia esconde a secao inteira.
   * Modelo de item, para preencher quando a pousada informar:
   *
   *   {
   *     nome: 'Apartamento Casal',
   *     capacidade: 'Ate 2 hospedes',
   *     camas: '1 cama de casal',
   *     area: '22 m2',
   *     ocupacaoMaxima: 2,
   *     descricao: 'Uma frase honesta sobre o quarto.',
   *     comodidades: [{ icone: 'ar', nome: 'Ar-condicionado' }],
   *     fotos: [{ arquivo: 'apartamento-casal', alt: '...' }],
   *   }
   */
  acomodacoes: [],

  /** Comodidades com duas ou mais fontes independentes. [IG] [GOOGLE] */
  comodidades: [
    { icone: 'piscina', nome: 'Piscina' },
    { icone: 'cafe', nome: 'Café da manhã incluso' },
    { icone: 'wifi', nome: 'Wi-Fi gratuito' },
    { icone: 'ar', nome: 'Ar-condicionado' },
    { icone: 'frigobar', nome: 'Frigobar no apartamento' },
    { icone: 'tv', nome: 'TV no apartamento' },
    { icone: 'pet', nome: 'Aceita animais de estimação' },
    { icone: 'recepcao', nome: 'Recepção e atendimento direto' },
    { icone: 'praia', nome: 'Perto da praia de Itapema' },
  ],

  /**
   * Pontos proximos.
   * PENDENTE: a distancia exata ate a areia nao esta fechada. As fontes vao de
   * 20 a 500 metros e se contradizem, entao o site fala em "poucos passos" e
   * nao crava numero. Quando alguem medir na rua, preencha aqui.
   */
  proximidades: [],

  /**
   * Avaliacoes DESLIGADAS de proposito.
   * A nota 4,4 com 287 avaliacoes que o Google mostra e do Hotel Recanto
   * Natural, a operacao anterior no mesmo endereco. Atribuir aquelas notas a
   * Green Beach seria falso. Ligar so quando houver avaliacao da marca nova.
   */
  avaliacoes: {
    nota: null,
    total: null,
    fonte: '',
    fonteUrl: '',
    depoimentos: [],
    confirmado: false,
  },

  duvidasExtras: [],

  seo: {
    titulo: 'Pousada & Hotel Green Beach | Hospedagem no centro de Itapema, SC',
    descricao:
      'Pousada no centro de Itapema, a poucos passos da praia, com piscina e café da manhã incluso. Escolha suas datas e consulte disponibilidade pelo WhatsApp.',
    ogImagem: '/og-green-beach.jpg',
  },
}

/** Atalho: devolve o valor apenas quando o dado esta confirmado. */
export const seConfirmado = (campo) => (campo && campo.confirmado ? campo.valor : null)
