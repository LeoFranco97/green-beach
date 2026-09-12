/**
 * Ponto de entrada da v3.
 *
 * A ordem das seções é a arquitetura da página, e ela está justificada
 * seção por seção em arquitetura-v3.md. Alterar a ordem aqui sem atualizar
 * o documento deixa os dois em desacordo, e o documento é o que sobrevive.
 */
import './styles/index.css'
import { criarCabecalho } from './components/cabecalho.js'
import { criarHero } from './components/hero.js'
import { hidratarDaURL } from './lib/store.js'

const app = document.getElementById('app')

// Campanha que chega com data na URL já abre o formulário preenchido.
hidratarDaURL()

const { cabecalho, gaveta, observarHero } = criarCabecalho()
document.body.prepend(cabecalho)
document.body.append(gaveta)

const conteudo = document.createElement('main')
conteudo.id = 'conteudo'

const secoes = [
  criarHero(),
]

secoes.filter(Boolean).forEach((s) => conteudo.append(s))
app.append(conteudo)

observarHero()
