/**
 * Ponto de entrada da v3.
 *
 * A ordem das seções É a arquitetura da página, e cada uma está justificada
 * em arquitetura-v3.md. Mudar a ordem aqui sem atualizar o documento deixa os
 * dois em desacordo, e o documento é o que sobrevive à próxima pessoa.
 *
 * O que esta versão deliberadamente NÃO tem: reveal por rolagem. A referência
 * (Woolmers Estate) tem quatro animações na página inteira e nenhuma atada ao
 * scroll. O único gesto de entrada é o fade do hero, uma vez, no carregamento.
 */
import './styles/index.css'

import { criarCabecalho } from './components/cabecalho.js'
import { criarHero } from './components/hero.js'
import { criarFatos, criarCasa, criarDiaria } from './components/secoes-topo.js'
import { criarCombinar, criarFaixaRespiro, criarItapema } from './components/secoes-meio.js'
import { criarComoChegar, criarNome, criarFechamento, criarRodape } from './components/secoes-fim.js'

import { hidratarDaURL } from './lib/store.js'
import { injetarSchema } from './lib/schema.js'

const app = document.getElementById('app')

// Campanha que chega com data na URL já abre o formulário preenchido.
hidratarDaURL()

const { cabecalho, gaveta, observarHero } = criarCabecalho()
document.body.prepend(cabecalho)
document.body.append(gaveta)

const conteudo = document.createElement('main')
conteudo.id = 'conteudo'

/*
 * Cada função devolve o elemento ou null quando o dado não está confirmado.
 * O filter no fim é o que faz a promessa do projeto valer: bloco sem dado
 * confirmado simplesmente não chega ao visitante, em vez de chegar vazio.
 */
const secoes = [
  criarHero(),
  criarFatos(),
  criarCasa(),
  criarDiaria(),
  criarCombinar(),
  criarFaixaRespiro(),
  criarItapema(),
  criarComoChegar(),
  criarNome(),
  criarFechamento(),
]

secoes.filter(Boolean).forEach((s) => conteudo.append(s))
app.append(conteudo)

const rodape = criarRodape()
if (rodape) app.append(rodape)

observarHero()

// Dados estruturados: LodgingBusiness e FAQPage, deliberadamente SEM
// aggregateRating. A nota que circula sobre este endereço é da gestão
// anterior, e declarar ela como nossa seria mentir para o Google também.
injetarSchema()
