/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * Paleta oficial do Grupo Green, do manual de marca.
         * Nao e a paleta do molde: e a mesma familia, cor de areia e verde de
         * mata, mas com os valores que a marca ja usa em tudo.
         */
        brand: {
          dark: '#242d21',   // verde quase preto, manual
          green: '#3a452b',  // verde oliva institucional, manual
          light: '#f4ebde',  // areia clara
          cream: '#fbf8f4',  // branco de areia, fundo primario
          gold: '#e5b64e',   // dourado do manual, so superficie e fio
          goldInk: '#85641b', // dourado que aguenta ser texto sobre claro
          soft: '#5e6857',   // texto de apoio. 5,4:1 sobre o creme, ou seja,
                             // passa em AA. O molde original usa o verde
                             // escuro a 50% de opacidade, que da 2,95:1 e
                             // reprova em corpo de texto pequeno.
        },
      },
      fontFamily: {
        'helvetica-neue': ['"Helvetica Neue Light"', 'Helvetica', 'Arial', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
