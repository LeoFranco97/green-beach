/**
 * AS ATRACOES
 * ---------------------------------------------------------------------------
 * A grade que faz a pagina dar vontade. Sem ela a landing vende um PDF; com
 * ela vende um dia.
 *
 * ===========================================================================
 * DUAS REGRAS, E AS DUAS SAO DE HONESTIDADE
 * ===========================================================================
 *
 * 1. ALTURA MINIMA SO ENTRA MEDIDA. `altura: null` significa que ninguem
 *    conferiu, e o selo simplesmente nao aparece. Errar altura minima nao e
 *    erro de conteudo: e a familia chegando no parque e a crianca nao
 *    entrando no brinquedo que ela passou a viagem inteira esperando.
 *
 *    Este e, por sinal, o dado mais valioso da pagina e nenhum revendedor
 *    mostra. Pai de crianca procura exatamente isso antes de comprar.
 *
 * 2. DESCRICAO SO ENTRA VERIFICADA, E ESCRITA AQUI. Nada copiado do texto do
 *    parque. Onde nao houve fato conferido, a descricao fica vazia e o cartao
 *    mostra so foto, nome e altura, que ja e o suficiente.
 *
 * ---------------------------------------------------------------------------
 * FOTO: ainda nao existe nenhuma. Enquanto o material oficial de parceiro nao
 * chegar, `foto` fica vazio e o cartao renderiza em ESTADO DE COR, que e um
 * bloco chapado com o nome em tipo grande. Fica intencional em vez de
 * quebrado. Para ligar a foto, solte o arquivo em
 * `public/fotos/atracoes/<nome>.webp` e preencha o campo.
 *
 * Nao vale puxar imagem do servidor do parque e nao vale gerar imagem de
 * brinquedo por IA. O porque esta em DIRECAO-DE-ARTE.md, secao 5.
 * ---------------------------------------------------------------------------
 *
 * Fonte das atracoes e das alturas: pagina oficial de atracoes do parque e o
 * FAQ oficial, consultados em 14/10/2026. Apuracao em
 * ../../pesquisa/dossie-beto-carrero.md
 */

const COLETA = '14/10/2026'

/**
 * Categorias, que viram o filtro da grade. Sao as tres que a propria
 * referencia usa no topo da pagina de atracoes.
 */
export const categorias = [
  { id: 'todas', nome: 'Todas' },
  { id: 'radical', nome: 'Radical' },
  { id: 'familia', nome: 'Passeio família' },
  { id: 'infantil', nome: 'Infantil' },
]

/**
 * Degraus do filtro de altura, em centimetros. Mesma regua da referencia.
 * O filtro responde "o que o meu filho de 1,05 m pega", que e a pergunta
 * real, e nao "quais atracoes existem".
 */
export const degrausDeAltura = [
  { cm: 0, rotulo: 'Livre' },
  { cm: 80, rotulo: '80cm' },
  { cm: 90, rotulo: '90cm' },
  { cm: 110, rotulo: '1,10m' },
  { cm: 120, rotulo: '1,20m' },
  { cm: 130, rotulo: '1,30m' },
]

export const atracoes = [
  {
    id: 'fire-whip',
    nome: 'Fire Whip',
    categoria: 'radical',
    altura: 130,
    /** [PARQUE] 14/10/2026, pagina oficial de atracoes. */
    descricao: 'A primeira montanha-russa invertida do Brasil, de 2008.',
    foto: '',
    confirmado: true,
  },
  {
    id: 'big-drop',
    nome: 'Big Drop',
    categoria: 'radical',
    altura: 130,
    /** [PARQUE] 14/10/2026, pagina oficial de atracoes. */
    descricao: 'Cem metros de altura, uma das maiores torres radicais do mundo.',
    foto: '',
    confirmado: true,
  },
  {
    id: 'hot-wheels-turbo-drive',
    nome: 'Hot Wheels Turbo Drive',
    categoria: 'familia',
    altura: 95,
    /** [PARQUE] 14/10/2026, pagina oficial de atracoes. */
    descricao: 'A família pilota um Hot Wheels em tamanho real.',
    foto: '',
    confirmado: true,
  },
  {
    id: 'spin-blast',
    nome: 'Spin Blast',
    categoria: 'radical',
    altura: 120,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'rebulico',
    nome: 'Rebuliço',
    categoria: 'radical',
    altura: 120,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'super-soaker-splash',
    nome: 'Super Soaker Splash',
    categoria: 'familia',
    altura: 90,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'tchibum',
    nome: 'Tchibum',
    categoria: 'radical',
    /** [PARQUE] FAQ oficial, 14/10/2026. */
    altura: 130,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'madagascar-crazy-river',
    nome: 'Madagascar Crazy River Adventure',
    categoria: 'familia',
    /** PENDENTE: altura nao conferida na fonte oficial. Sem numero, sem selo. */
    altura: null,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'barco-pirata',
    nome: 'Barco Pirata',
    categoria: 'familia',
    /** PENDENTE: altura nao conferida. */
    altura: null,
    descricao: '',
    foto: '',
    confirmado: true,
  },
  {
    id: 'galinha-pintadinha',
    nome: 'Turma da Galinha Pintadinha',
    categoria: 'infantil',
    altura: 0,
    /** [PARQUE] 14/10/2026: encontro para foto, sem restricao de altura. */
    descricao: 'Encontro e foto com a turma, sem restrição de altura.',
    foto: '',
    confirmado: true,
  },
]

/** Cabeca da secao. */
export const grade = {
  olho: 'O que tem lá dentro',
  titulo: ['Conheça as', 'atrações'],
  apoio:
    'Arraste a régua e veja o que a sua criança já pega. A altura mínima é do parque, e é a pergunta que mais trava a compra.',
  avisoFoto:
    'As fotos das atrações entram assim que o material oficial de parceiro chegar.',
  coletadoEm: COLETA,
  confirmado: true,
}

/** So o que tem dado confirmado chega ao visitante. */
export const atracoesVisiveis = () => atracoes.filter((a) => a.confirmado)

/**
 * Filtra pela altura do visitante e pela categoria.
 * Altura `null` quer dizer "nao conferida", e nesse caso a atracao NAO
 * aparece quando o filtro de altura esta em uso: prometer que uma crianca de
 * 90 cm pega um brinquedo cuja regra ninguem checou e o erro que esta regra
 * existe para evitar.
 */
export const filtrar = ({ alturaCm = null, categoria = 'todas' } = {}) =>
  atracoesVisiveis().filter((a) => {
    if (categoria !== 'todas' && a.categoria !== categoria) return false
    if (alturaCm === null) return true
    if (a.altura === null) return false
    return a.altura <= alturaCm
  })
