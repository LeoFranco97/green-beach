/**
 * Quais secoes existem de fato nesta versao do site.
 *
 * Como cada secao some quando nao ha dado confirmado, o menu precisa perguntar
 * antes de criar o link. Sem isso o visitante clica em "Acomodacoes" e nao
 * acontece nada, que e o tipo de detalhe que derruba a confianca na hora de
 * decidir uma reserva.
 */
import { pousada } from '../data/pousada.js'
import { fotoExiste } from './imagens.js'

const TODAS = [
  {
    id: 'a-pousada',
    texto: 'A pousada',
    existe: () => pousada.sobre.confirmado || pousada.destaques.length > 0,
  },
  {
    id: 'acomodacoes',
    texto: 'Acomodações',
    existe: () => pousada.acomodacoes.length > 0,
  },
  {
    id: 'comodidades',
    texto: 'Comodidades',
    existe: () => pousada.comodidades.length > 0,
  },
  {
    id: 'itapema',
    texto: 'Itapema',
    existe: () => pousada.fotos.filter((f) => f.tipo === 'destino' && fotoExiste(f.arquivo)).length >= 4,
  },
  {
    id: 'localizacao',
    texto: 'Localização',
    existe: () => pousada.endereco.confirmado || pousada.proximidades.length > 0,
  },
  {
    id: 'duvidas',
    texto: 'Dúvidas',
    existe: () => true,
  },
]

/** Links do menu, apenas para as secoes que realmente vao para a pagina. */
export const linksDeNavegacao = () =>
  TODAS.filter((secao) => secao.existe()).map(({ id, texto }) => ({ href: `#${id}`, texto }))

/** True quando ha ao menos uma foto pronta para a galeria. */
export const temGaleria = () => pousada.fotos.some((foto) => fotoExiste(foto.arquivo))
