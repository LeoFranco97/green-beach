/**
 * Botao flutuante de WhatsApp, canto inferior direito.
 *
 * Existe para quem quer PERGUNTAR, nao para quem quer reservar: quem quer
 * reservar tem o formulario no hero, a barra fixa no celular e o CTA do fim
 * da pagina. Por isso ele nunca empurra ninguem de volta para o formulario,
 * ele so abre a conversa.
 *
 * Duas regras de convivencia, as duas com motivo:
 *
 *   Ele nao aparece sobre o hero. Ali o formulario e o assunto, e um botao
 *   verde piscando no canto competiria com o unico lead que a recepcao
 *   consegue responder de primeira, o que ja vem com data.
 *
 *   No celular ele some quando a barra fixa sobe. As duas moram no mesmo
 *   canto, e a barra e melhor: ela ja leva as datas escolhidas.
 */
import { el, qs } from '../lib/dom.js'
import { assinar, validar, lerEstado } from '../lib/store.js'
import { montarLinkWhatsApp, montarLinkDePergunta } from '../lib/whatsapp.js'
import { rastrear, EVENTOS } from '../lib/analytics.js'
import { ICONE_WHATSAPP } from './busca.js'

export const criarBotaoWhatsApp = () => {
  const rotulo = el('span', { class: 'zap__rotulo', text: 'Falar no WhatsApp' })

  const botao = el(
    'a',
    {
      class: 'zap is-oculto',
      href: montarLinkDePergunta({ origem: 'botao-flutuante' }),
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': 'Falar com a pousada no WhatsApp',
    },
    [
      el('span', { class: 'zap__icone', 'aria-hidden': 'true', html: ICONE_WHATSAPP }),
      rotulo,
    ],
  )

  /*
   * O destino muda conforme o que ja foi preenchido.
   *
   * Com datas validas, manda a consulta inteira, igual ao resto do site.
   * Sem datas, manda a mensagem curta: a `montarMensagem` completa assume
   * dois adultos quando ninguem escolheu, e isso faria a recepcao orcar para
   * um numero de pessoas que o visitante nunca disse.
   */
  const atualizarDestino = (estado) => {
    const { valido } = validar(estado)
    botao.href = valido
      ? montarLinkWhatsApp({ ...estado, origem: 'botao-flutuante' })
      : montarLinkDePergunta({ origem: 'botao-flutuante', protocolo: estado.protocolo })
    return valido
  }

  // Quem decide se o botao cede o canto e a barra fixa, que marca
  // .tem-barra-fixa no documento quando sobe. O CSS cuida do resto: nao ha
  // nada aqui para manter em sincronia.
  assinar(atualizarDestino)
  atualizarDestino(lerEstado())

  botao.addEventListener('click', () => {
    const estado = lerEstado()
    const { valido } = validar(estado)
    rastrear(EVENTOS.WHATSAPP_CLIQUE, {
      origem: 'botao-flutuante',
      comDatas: valido,
      protocolo: estado.protocolo,
    })
  })

  /*
   * Aparece depois do hero.
   *
   * Duas fontes para a mesma decisao, de proposito. O observador e o caminho
   * barato, mas ele so entrega o primeiro resultado num quadro futuro, e nas
   * provas isso deixou o botao invisivel por mais de um segundo depois da
   * rolagem. A medicao direta, atada ao scroll e cortada por
   * requestAnimationFrame, fecha essa janela sem custo perceptivel.
   *
   * Sem hero na pagina, mostra: botao escondido para sempre por causa de um
   * seletor que nao casou e pior que botao visivel cedo demais.
   */
  const observarHero = () => {
    const hero = qs('.hero')
    if (!hero) {
      botao.classList.remove('is-oculto')
      return
    }

    const decidir = () => {
      const r = hero.getBoundingClientRect()
      const altura = window.innerHeight || document.documentElement.clientHeight
      const dentro = Math.min(r.bottom, altura) - Math.max(r.top, 0)
      botao.classList.toggle('is-oculto', dentro > altura * 0.12)
    }

    let agendado = false
    const aoRolar = () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(() => {
        agendado = false
        decidir()
      })
    }

    decidir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(decidir, { threshold: [0, 0.12, 0.5] }).observe(hero)
    }
  }

  return { raiz: botao, observarHero }
}
