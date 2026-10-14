# Ingressos do Beto Carrero World, pela Green Beach

Landing de venda de ingresso do Beto Carrero World com transfer saindo de
Itapema e região, operada pela Pousada & Hotel Green Beach.

O visitante escolhe o dia, quem vai, o ingresso, o ponto de embarque e os
adicionais, e cai no WhatsApp da pousada com o pedido inteiro já escrito.

A página **não processa pagamento**. Isso é decisão, não falta: valida a
demanda sem custo de integração. O porquê e o resto das decisões estão em
[ARQUITETURA.md](ARQUITETURA.md).

```
beto/
├── index.html
├── src/
│   ├── config.js              WhatsApp, domínio e analytics
│   ├── data/
│   │   ├── oferta.js          TODO o texto da página
│   │   └── produtos.js        ingresso, adicional, embarque e PREÇO
│   ├── components/
│   │   ├── configurador.js    o bloco que vende
│   │   ├── hero.js, cabecalho.js, secoes.js
│   ├── lib/                   datas, WhatsApp, imagens, estado, analytics
│   └── styles/                tokens e CSS por componente
└── public/fotos/              acervo da pousada e da região
```

## Rodar

Precisa de Node 20 ou mais novo.

```bash
cd beto && npm install && npm run dev
```

Abre em http://localhost:5195

```bash
npm run build      # gera beto/dist
npm run preview    # serve o dist para conferir
```

Captura de tela em cinco larguras, com o Chrome do sistema:

```bash
node ../scripts/capturar.mjs http://localhost:5195 ../capturas-beto
```

## As duas regras da casa

**1. Dado sem fonte não vai ao ar.** Todo bloco em `oferta.js` e todo item em
`produtos.js` carrega `confirmado: true` ou `false`. Com `false`, o bloco
simplesmente não renderiza. A página fica menor e continua verdadeira. Nada de
`Lorem ipsum`, nada de "a partir de R$ XX", nada de "consulte".

**2. Preço carrega a data da coleta.** Preço de parque muda. Todo valor em
`produtos.js` tem `fonte` (URL) e `coletadoEm`. Quando o parque reajustar, a
correção acontece nesse arquivo e em nenhum outro.

## Configurar

Copie `.env.example` para `.env` e ajuste. Tudo que muda de ambiente está em
`src/config.js`, com sobrescrita por variável.

| Variável | Para quê |
|---|---|
| `VITE_WHATSAPP_NUMBER` | E.164 sem sinais. Padrão: o da pousada |
| `VITE_SITE_URL` | endereço público desta página |
| `VITE_SITE_HOTEL` | site da pousada, para o link de volta |
| `VITE_GA_MEASUREMENT_ID` | GA4. Vazio desliga |
| `VITE_META_PIXEL_ID` | Pixel da Meta. Vazio desliga |

## Campanha com link pronto

A página lê da URL e já abre preenchida, para anúncio e post:

```
?data=2026-12-20&adultos=4&ingresso=um-dia&utm_source=instagram
```

Os UTMs entram na mensagem do WhatsApp, junto com um protocolo `BC-XXXX-XXXX`.
É por esse protocolo que se cruza lead com venda fechada.

## O que falta antes de publicar

A lista viva está no fim de [ARQUITETURA.md](ARQUITETURA.md). O resumo: preço,
calendário do parque, horário e preço do transfer, política de cancelamento, e
o material oficial de parceiro, que é o que libera foto do parque na página.
