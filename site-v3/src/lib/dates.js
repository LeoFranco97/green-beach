/**
 * Utilitarios de data trabalhando sempre em horario local, sem biblioteca.
 * A chave canonica de um dia e a string ISO curta "YYYY-MM-DD".
 */

const MS_DIA = 86400000

/** Data de hoje zerada na meia-noite local. */
export const hoje = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Converte Date para "YYYY-MM-DD" usando o fuso local, nunca UTC. */
export const paraISO = (data) => {
  if (!data) return ''
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/** Converte "YYYY-MM-DD" para Date local a meia-noite. Invalido vira null. */
export const deISO = (iso) => {
  if (typeof iso !== 'string') return null
  const partes = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!partes) return null
  const d = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]))
  d.setHours(0, 0, 0, 0)
  // Rejeita datas que o construtor normalizou, como 2026-02-31.
  return paraISO(d) === iso ? d : null
}

/** Soma dias a uma data, devolvendo nova instancia. */
export const somaDias = (data, dias) => {
  const d = new Date(data.getTime())
  d.setDate(d.getDate() + dias)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Soma meses preservando o dia 1. Usado na navegacao do calendario. */
export const somaMeses = (data, meses) => {
  const d = new Date(data.getFullYear(), data.getMonth() + meses, 1)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Diferenca em noites entre duas datas locais. */
export const noitesEntre = (inicio, fim) => {
  if (!inicio || !fim) return 0
  // Normaliza pelo UTC das partes locais para nao sofrer com horario de verao.
  const a = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
  const b = Date.UTC(fim.getFullYear(), fim.getMonth(), fim.getDate())
  return Math.round((b - a) / MS_DIA)
}

export const mesmoDia = (a, b) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const fmtCurto = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
const fmtLongo = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fmtExtenso = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fmtMesAno = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

/** "12 de set" para exibir dentro dos campos. */
export const formatoCurto = (data) => (data ? fmtCurto.format(data).replace('.', '') : '')

/** "12/09/2026" para a mensagem do WhatsApp. */
export const formatoLongo = (data) => (data ? fmtLongo.format(data) : '')

/** "sexta-feira, 12 de setembro de 2026" para leitores de tela. */
export const formatoExtenso = (data) => (data ? fmtExtenso.format(data) : '')

/** "setembro de 2026" para o cabecalho do calendario. */
export const formatoMesAno = (data) => {
  const texto = fmtMesAno.format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Nomes curtos dos dias da semana comecando no domingo. */
export const diasDaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

/**
 * Monta a grade de um mes: array de semanas, cada semana com 7 posicoes.
 * Posicoes fora do mes vem como null para nao poluir a navegacao por teclado.
 */
export const gradeDoMes = (referencia) => {
  const ano = referencia.getFullYear()
  const mes = referencia.getMonth()
  const primeiro = new Date(ano, mes, 1)
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const deslocamento = primeiro.getDay()

  const celulas = []
  for (let i = 0; i < deslocamento; i += 1) celulas.push(null)
  for (let dia = 1; dia <= totalDias; dia += 1) {
    const d = new Date(ano, mes, dia)
    d.setHours(0, 0, 0, 0)
    celulas.push(d)
  }
  while (celulas.length % 7 !== 0) celulas.push(null)

  const semanas = []
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7))
  return semanas
}

/** Plural simples de noite. */
export const rotuloNoites = (n) => (n === 1 ? '1 noite' : `${n} noites`)
