/**
 * Ponto de entrada.
 *
 * A ordem das secoes E a arquitetura da pagina, e cada uma esta justificada
 * em ARQUITETURA.md, secao 3. Mudar a ordem aqui sem atualizar o documento
 * deixa os dois em desacordo, e o documento e o que sobrevive a proxima
 * pessoa.
 *
 * O configurador vem ALTO, logo depois da faixa de fatos. Ele e o unico
 * bloco que converte: enterrar ele no fim para "aquecer o visitante antes"
 * e o erro classico de landing de produto conhecido. Quem chega decidido
 * precisa comprar na primeira rolagem, e quem chega indeciso rola, le o
 * resto e volta pelo botao do fechamento.
 */
import './styles/index.css'

import { criarCabecalho } from './components/cabecalho.js'
import { criarHero } from './components/hero.js'
import { criarAtracoes } from './components/atracoes.js'
import { criarConfigurador, criarBarraFixa } from './components/configurador.js'
import {
  criarFatos, criarComoFunciona, criarDiaNoParque, criarRespiro,
  criarHospedagem, criarDuvidas, criarFechamento, criarRodape,
} from './components/secoes.js'

import { hidratarDaURL } from './lib/store.js'
import { iniciarAnalytics } from './lib/analytics.js'
import { injetarSchema } from './lib/schema.js'

const app = document.getElementById('app')

// Campanha que chega com data na URL ja abre o pedido preenchido.
hidratarDaURL()
iniciarAnalytics()

const { cabecalho, observarHero } = criarCabecalho()
document.body.prepend(cabecalho)

const conteudo = document.createElement('main')
conteudo.id = 'conteudo'

/*
 * Cada funcao devolve o elemento ou null quando o dado nao esta confirmado.
 * O filter no fim e o que faz a promessa do projeto valer: bloco sem dado
 * confirmado simplesmente nao chega ao visitante, em vez de chegar vazio.
 */
const secoes = [
  criarHero(),
  criarFatos(),
  // A grade vem ANTES do configurador porque ela e quem cria a vontade:
  // ninguem compra "passaporte 1 dia", as pessoas compram a Fire Whip. Quem
  // ja chegou decidido pula ela pelo botao do hero, que aponta direto para
  // o pedido.
  criarAtracoes(),
  criarConfigurador(),
  criarComoFunciona(),
  criarDiaNoParque(),
  criarRespiro(),
  criarHospedagem(),
  criarDuvidas(),
  criarFechamento(),
]

secoes.filter(Boolean).forEach((s) => conteudo.append(s))
app.append(conteudo)

const rodape = criarRodape()
if (rodape) app.append(rodape)

// A barra fixa do mobile mora fora do main, porque ela nao e conteudo da
// pagina: e um controle que flutua sobre ela.
document.body.append(criarBarraFixa())

observarHero()
injetarSchema()
