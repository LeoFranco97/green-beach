/**
 * Fotos responsivas.
 * As larguras disponiveis de cada foto vem do manifesto gerado por
 * scripts/preparar-fotos.py, entao nunca pedimos um arquivo que nao existe.
 */
import manifesto from '../../public/fotos/fotos.json'

const BASE = '/fotos'

/** Dados brutos de uma foto do manifesto. Nome desconhecido devolve null. */
export const dadosDaFoto = (nome) => manifesto[nome] || null

/** Caminho de uma largura especifica, ou da maior disponivel. */
export const caminho = (nome, largura) => {
  const dados = dadosDaFoto(nome)
  if (!dados) return ''
  const escolhida = dados.larguras.includes(largura)
    ? largura
    : dados.larguras[dados.larguras.length - 1]
  return `${BASE}/${nome}-${escolhida}.webp`
}

/** Miniatura borrada de 24px, usada como fundo enquanto a foto carrega. */
export const miniatura = (nome) => (dadosDaFoto(nome) ? `${BASE}/${nome}-mini.webp` : '')

/** String de srcset com todas as larguras geradas. */
export const srcset = (nome) => {
  const dados = dadosDaFoto(nome)
  if (!dados) return ''
  return dados.larguras.map((l) => `${BASE}/${nome}-${l}.webp ${l}w`).join(', ')
}

/**
 * Monta os atributos de uma <img> responsiva de uma vez.
 * @param {string} nome    Chave da foto no manifesto.
 * @param {object} opcoes
 * @param {string} opcoes.alt
 * @param {string} opcoes.sizes      Valor do atributo sizes.
 * @param {boolean} opcoes.prioritaria  True apenas para a foto do hero.
 */
export const atributosDeFoto = (nome, { alt = '', sizes = '100vw', prioritaria = false } = {}) => {
  const dados = dadosDaFoto(nome)
  if (!dados) return null

  return {
    src: caminho(nome, dados.larguras[dados.larguras.length - 1]),
    srcset: srcset(nome),
    sizes,
    alt,
    width: String(dados.w),
    height: String(dados.h),
    decoding: 'async',
    loading: prioritaria ? 'eager' : 'lazy',
    fetchpriority: prioritaria ? 'high' : 'auto',
    // O fundo borrado evita o salto de layout e o branco na entrada da foto.
    style: `background-image:url(${miniatura(nome)});background-size:cover;background-position:center`,
  }
}

/** True quando a foto existe de fato no manifesto. */
export const fotoExiste = (nome) => Boolean(manifesto[nome])

/**
 * Transforma a lista crua de fotos do arquivo de dados em objetos prontos
 * para renderizar, descartando em silencio o que ainda nao tem arquivo.
 * Assim a pagina nunca aponta para uma imagem que nao existe.
 */
/** Só o acervo real: fora ilustração de banco de imagem. */
export const apenasReais = (fotos = []) => fotos.filter((f) => f.tipo !== 'ilustracao')

export const prepararFotos = (lista = [], sizes = '100vw') =>
  lista
    .filter((foto) => foto && fotoExiste(foto.arquivo))
    .map((foto) => {
      const dados = dadosDaFoto(foto.arquivo)
      return {
        ...foto,
        src: caminho(foto.arquivo, dados.larguras[dados.larguras.length - 1]),
        srcset: srcset(foto.arquivo),
        sizes,
        mini: miniatura(foto.arquivo),
        largura: dados.w,
        altura: dados.h,
        proporcao: dados.proporcao,
        orientacao: dados.proporcao >= 1 ? 'paisagem' : 'retrato',
        // Ponto focal do recorte. Vive no dado, e nao no CSS, porque depende
        // do que cada foto mostra. Padrao: centro.
        foco: foto.foco || '50% 50%',
      }
    })
