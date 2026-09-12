/**
 * Biblioteca de icones do site.
 * Todos desenhados na mesma grade de 24, traco de 1.5, pontas arredondadas,
 * para nao existir aquele ar de icone pescado de pacote aleatorio.
 * Uso: icone('wifi') devolve a string de <svg>.
 */

const CAMINHOS = {
  wifi: '<path d="M2.5 8.5a15 15 0 0 1 19 0"/><path d="M5.5 12a10.5 10.5 0 0 1 13 0"/><path d="M8.5 15.4a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none"/>',
  piscina: '<path d="M4 18.5c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2"/><path d="M4 14c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2"/><path d="M8 12V5.6A2.1 2.1 0 0 1 10.1 3.5"/><path d="M16 12V5.6A2.1 2.1 0 0 0 13.9 3.5"/><path d="M8 7.5h8"/>',
  cafe: '<path d="M4 8h12v6.5A4.5 4.5 0 0 1 11.5 19h-3A4.5 4.5 0 0 1 4 14.5V8Z"/><path d="M16 9.5h1.8a2.4 2.4 0 0 1 0 4.8H16"/><path d="M7.5 4.6c.5-.7.5-1.4 0-2.1M11 4.6c.5-.7.5-1.4 0-2.1"/><path d="M3 21.2h14"/>',
  ar: '<circle cx="12" cy="12" r="2.1"/><path d="M12 3v6.9M12 14.1V21M3 12h6.9M14.1 12H21"/><path d="m5.6 5.6 4.1 4.1M14.3 14.3l4.1 4.1M18.4 5.6l-4.1 4.1M9.7 14.3l-4.1 4.1"/>',
  tv: '<rect x="2.8" y="5" width="18.4" height="12" rx="2"/><path d="M8.5 20.5h7M12 17v3.5"/>',
  frigobar: '<rect x="5.5" y="2.8" width="13" height="18.4" rx="2.2"/><path d="M5.5 10h13"/><path d="M8.6 6.2v1.8M8.6 13.2V15"/>',
  estacionamento: '<rect x="3" y="3" width="18" height="18" rx="4.5"/><path d="M9.6 17V7.6h3.2a2.9 2.9 0 0 1 0 5.8H9.6"/>',
  praia: '<path d="M13.8 20.4 8.2 8.1"/><path d="M3.2 21h17.6"/><path d="M6.4 9.6c2.2-4.6 6.6-6.9 10.8-5.2-1.6 1-2.3 2.4-2.4 4 1.9-1.4 3.9-1.4 5.6.2-2.5.4-3.9 1.6-4.6 3.5-1.4-1.5-3-2-4.7-1.5.4-1.3.2-2.5-.6-3.6-1.6.6-3 1.5-4.1 2.6Z"/>',
  vista: '<path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3"/>',
  banho: '<path d="M3 12.5h18v2a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 14.5v-2Z"/><path d="M6 12.5V5.9A2.4 2.4 0 0 1 8.4 3.5c1.2 0 2.1.8 2.3 2"/><path d="M9 6.2h3.4"/><path d="M7 19v2M17 19v2"/>',
  familia: '<circle cx="8.4" cy="7.4" r="2.6"/><circle cx="16.4" cy="9.2" r="2"/><path d="M3.4 19.4a5 5 0 0 1 10 0"/><path d="M14.2 19.4a4 4 0 0 1 6.4-3.2"/>',
  cama: '<path d="M3 18.5V7"/><path d="M3 11.6h18v6.9"/><path d="M3 15.4h18"/><path d="M6.6 11.6V9.4a1.8 1.8 0 0 1 1.8-1.8h7.2a1.8 1.8 0 0 1 1.8 1.8v2.2"/><path d="M3 21v-2.5M21 21v-2.5"/>',
  chuveiro: '<path d="M4 20.5V8.4A4.4 4.4 0 0 1 8.4 4h.4"/><path d="M8.8 4a2.3 2.3 0 1 1 4.6 0"/><path d="M11.1 4v3.2"/><path d="M6.6 10.5h9"/><path d="M9.4 14v1.4M12.6 13.4v1.8M15.4 14.4v1.2"/>',
  pet: '<ellipse cx="6.6" cy="9.4" rx="1.9" ry="2.4"/><ellipse cx="17.4" cy="9.4" rx="1.9" ry="2.4"/><ellipse cx="10" cy="5.4" rx="1.7" ry="2.2"/><ellipse cx="14" cy="5.4" rx="1.7" ry="2.2"/><path d="M12 12.4c2.7 0 4.8 1.9 4.8 4.2 0 1.9-1.5 3-3.3 2.7-.5-.1-1-.2-1.5-.2s-1 .1-1.5.2c-1.8.3-3.3-.8-3.3-2.7 0-2.3 2.1-4.2 4.8-4.2Z"/>',
  local: '<path d="M12 21.2s7-5.6 7-10.6a7 7 0 1 0-14 0c0 5 7 10.6 7 10.6Z"/><circle cx="12" cy="10.4" r="2.6"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2"/>',
  cartao: '<rect x="2.6" y="5" width="18.8" height="14" rx="2.6"/><path d="M2.6 9.6h18.8"/><path d="M6.4 14.6h3.4"/>',
  recepcao: '<path d="M3.4 19.4h17.2"/><path d="M5.2 19.4v-4.6a6.8 6.8 0 0 1 13.6 0v4.6"/><path d="M12 8V5.4"/><circle cx="12" cy="4" r="1.4"/>',
  varanda: '<path d="M3 21V9.6L12 3.4l9 6.2V21"/><path d="M3 14h18"/><path d="M8 21v-7M16 21v-7"/>',
  churrasco: '<path d="M4 7.5h16l-2.6 7.2a4 4 0 0 1-3.8 2.6h-3.2a4 4 0 0 1-3.8-2.6L4 7.5Z"/><path d="M9.4 17.3 7.8 21M14.6 17.3 16.2 21"/><path d="M9.6 4.4c.6-.7.6-1.4 0-2.1M14.4 4.4c.6-.7.6-1.4 0-2.1"/>',
  seguranca: '<path d="M12 2.8 4.6 5.9v5.5c0 4.3 3 8.3 7.4 9.8 4.4-1.5 7.4-5.5 7.4-9.8V5.9L12 2.8Z"/><path d="m9.2 11.9 2 2 3.6-3.7"/>',
  estrela: '<path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9L12 3.2Z"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
}

/**
 * @param {string} nome  Chave em CAMINHOS.
 * @param {string} classe Classe extra no svg.
 */
export const icone = (nome, classe = '') => {
  const caminho = CAMINHOS[nome]
  if (!caminho) return ''
  const classes = classe ? `icone ${classe}` : 'icone'
  return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${caminho}</svg>`
}

export const temIcone = (nome) => Boolean(CAMINHOS[nome])
export const nomesDeIcone = Object.keys(CAMINHOS)
