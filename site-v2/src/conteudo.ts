/**
 * CONTEÚDO
 * ---------------------------------------------------------------------------
 * Tudo que o visitante lê está aqui, e nada aqui é invenção. As fontes de
 * cada dado estão no dossiê em ../pesquisa/dossie-green-beach.md.
 *
 * O que sustenta cada frase:
 *   endereço, coordenadas e horários  ficha do Google, cruzada com OSM
 *   WhatsApp                          publicado pela própria pousada no
 *                                     Instagram como canal de reserva
 *   piscina, café e proximidade       afirmados pela pousada nos posts
 *   ausência de OTA                   Booking, Airbnb, Expedia, Decolar e
 *                                     Hotéis.com não listam a pousada
 */

/** WhatsApp em E.164, sem sinal nem espaço. Só existe aqui. */
export const WHATSAPP = '5547997948332'

export const pousada = {
  nome: 'Green Beach',
  nomeCompleto: 'Pousada & Hotel Green Beach',
  grupo: 'Grupo Green',
  endereco: 'Rua 141, 58, Centro, Itapema, SC',
  telefoneExibicao: '(47) 99794-8332',
}

/** Mensagem que chega na pousada quando alguém clica no CTA. */
export const mensagemWhatsApp = (origem: string) =>
  [
    'Olá! Vim pelo site da Pousada Green Beach e gostaria de consultar disponibilidade.',
    '',
    `Origem: ${origem}`,
    `Página: ${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}`,
  ].join('\n')

export const linkWhatsApp = (origem: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagemWhatsApp(origem))}`

/** Foto do hero. As larguras vêm do pipeline em scripts/preparar-fotos.py. */
export const heroFoto = {
  base: '/fotos/itapema-baia-do-mirante',
  larguras: [800, 1280, 1920, 2560],
  largura: 4032,
  altura: 2268,
  alt: 'Vista aérea da baía de Itapema: o mar aberto à esquerda, a faixa de areia em curva e a orla de prédios ao longe, sob um céu de nuvens altas',
}

export const menu = [
  { rotulo: 'A pousada', tipo: 'menu' as const },
  { rotulo: 'Comodidades', tipo: 'link' as const },
  { rotulo: 'Itapema', tipo: 'link' as const },
]

/**
 * A fileira embaixo do título. No molde original é uma lista de investidores
 * em cinco tipografias diferentes. Aqui são as comodidades que a pousada
 * afirma ter, numa tipografia só: cinco fontes display para cinco comodidades
 * leem como cinco marcas diferentes, que é justamente o efeito errado.
 */
export const rodapeHero = {
  rotulo: 'A pousada oferece',
  itens: ['Piscina', 'Café da manhã incluso', 'Wi-Fi', 'Estacionamento', 'Aceita pets'],
}

export const chamada = {
  aviso: 'Reserva direta com a pousada, sem intermediário.',
  tituloLinha1: 'No centro de Itapema,',
  tituloLinha2: 'a poucos passos da praia',
  cta: 'Consultar datas',
}
