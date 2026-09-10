/** Ponto de entrada. Monta a pagina na ordem da jornada de reserva. */
import './styles/index.css'

import { qs } from './lib/dom.js'
import { hidratarDaURL } from './lib/store.js'
import { iniciarAnalytics } from './lib/analytics.js'
import { injetarSchema } from './lib/schema.js'
import { iniciarMovimento } from './lib/movimento.js'
import { config } from './config.js'
import { pousada } from './data/pousada.js'

import { criarCabecalho } from './components/cabecalho.js'
import { criarHero } from './components/hero.js'
import { criarSobre, criarComodidades, criarLocalizacao, criarAvaliacoes } from './components/secoes.js'
import { criarAcomodacoes } from './components/acomodacoes.js'
import { criarItapema } from './components/itapema.js'
import { criarSecaoMapa } from './components/mapa.js'
import { criarFaixa } from './components/faixa.js'
import { criarDuvidas } from './components/duvidas.js'
import { criarFechamento, criarBarraFixa, criarRodape } from './components/fechamento.js'

// Marca que o JavaScript está vivo ANTES de montar a página. Todo estado
// inicial invisível do movimento fica trancado atrás desta classe, então sem
// JS a página aparece inteira, estática e legível, em vez de ficar em branco.
document.documentElement.classList.add('js')

const montar = () => {
  const app = qs('#app')
  const cabecalho = criarCabecalho()
  const barra = criarBarraFixa()

  const principal = document.createElement('main')
  principal.id = 'conteudo'
  // A ordem segue a jornada de quem reserva: primeiro se encanta, depois
  // entende a casa, depois entende a cidade, e só então decide.
  principal.append(
    ...[
      criarHero(),
      // O mapa vem logo depois do hero: antes de qualquer outra coisa, quem
      // nunca ouviu falar da pousada precisa saber onde isso fica.
      criarSecaoMapa(),
      criarSobre(),
      criarFaixa({
        arquivo: 'itapema-nascer-do-sol',
        frase: 'De manhã cedo, a praia ainda é de quem acorda primeiro.',
        apoio: 'O amanhecer em Itapema, visto do alto.',
        altura: 'alta',
        tinta: 'clara',
      }),
      criarAcomodacoes(),
      criarComodidades(),
      criarItapema(),
      criarLocalizacao(),
      criarAvaliacoes(),
      criarDuvidas(),
      criarFechamento(),
    ].filter(Boolean),
  )

  app.append(cabecalho.raiz, cabecalho.sentinela, principal, criarRodape(), barra.raiz)

  cabecalho.iniciar()
  barra.iniciar()
  // Depois de tudo montado: o fatiamento do título precisa do layout pronto.
  iniciarMovimento()

  document.title = pousada.seo.titulo
  injetarSchema()
  iniciarAnalytics()
  hidratarDaURL()

  if (import.meta.env.DEV && !/^55\d{10,11}$/.test(config.whatsappNumber)) {
    console.warn(
      '[green beach] VITE_WHATSAPP_NUMBER fora do formato E.164 esperado (55 + DDD + numero).',
    )
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar)
else montar()
