# Pousada & Hotel Green Beach

Landing page de reservas da Pousada & Hotel Green Beach (Grupo Green), em Itapema, Santa Catarina.

O visitante conhece a pousada, escolhe check-in, check-out e quantidade de hóspedes, e cai no WhatsApp da pousada com a consulta inteira já escrita.

```
green-beach/
├── site/                    a landing page
│   ├── index.html
│   ├── src/
│   │   ├── config.js        WhatsApp, domínio, analytics e mapa
│   │   ├── data/pousada.js  TODO o conteúdo do site
│   │   ├── components/      cabeçalho, hero, galeria, calendário, seções
│   │   ├── lib/             datas, WhatsApp, imagens, movimento, analytics
│   │   └── styles/          tokens, CSS por componente e movimento.css
│   └── public/
│       ├── fotos/           fotos otimizadas, geradas por script
│       └── marca/           logo em WebP nas três versões
├── assets-raw/originais/    fotos originais, entram por aqui
├── scripts/                 preparar fotos, gerar OG, capturar telas, QA
├── pesquisa/                dossiê com as fontes de cada dado
├── direcao-de-arte.md       o sistema visual explicado
├── direcao-de-movimento.md  o sistema de movimento explicado
├── QA.md                    relatório dos testes
└── PENDENCIAS.md            o que ainda precisa vir do cliente
```

## Rodar

Precisa de Node 20 ou mais novo.

```bash
cd site && npm install && npm run dev
```

Abre em http://localhost:5180

```bash
npm run build      # gera site/dist, pronto para publicar
npm run preview    # serve o dist para conferir antes de subir
```

## Configurar

Tudo que muda de ambiente está em `site/src/config.js`, com sobrescrita por variável de ambiente. Copie `site/.env.example` para `site/.env` e ajuste.

### Número do WhatsApp

```
VITE_WHATSAPP_NUMBER=5547997948332
```

Formato E.164 sem espaço, parêntese ou traço: `55` + DDD + número. O número que está no código é o que a própria pousada divulga no Instagram, (47) 99794-8332. O número não aparece em nenhum outro arquivo: `src/lib/whatsapp.js` lê sempre do config.

### Domínio

```
VITE_SITE_URL=https://www.pousadagreenbeach.com.br
```

Sem barra no fim. Ele alimenta a URL canônica, o Open Graph, o `sitemap.xml` e os dados estruturados. Depois de definir o domínio real, atualize também:

- `site/index.html`: `link rel=canonical` e as metatags `og:url` e `og:image`
- `site/public/sitemap.xml`
- `site/public/robots.txt`

O domínio ainda não foi registrado. Ver `PENDENCIAS.md`.

### Analytics

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=
```

Vazio significa não carregar nada, e o site funciona igual. Com o ID preenchido, o `gtag.js` entra sozinho e estes eventos passam a ser enviados:

| Evento | Quando dispara |
|---|---|
| `consulta_iniciada` | primeiro toque em qualquer campo do formulário |
| `datas_selecionadas` | período fechado no calendário, com o número de noites |
| `hospedes_alterados` | mudança de adultos ou crianças |
| `galeria_aberta` | abertura do lightbox |
| `whatsapp_clique` | clique que abre o WhatsApp, com origem e protocolo |
| `acomodacao_cta` | CTA de uma acomodação específica |
| `mapa_aberto` | clique em abrir rota no Google Maps |

Todos passam também pelo `window.dataLayer`, então funcionam com Google Tag Manager sem mudar código. Os nomes ficam em `src/lib/analytics.js`.

### Mapa

```
VITE_MAP_QUERY=Pousada e Hotel Green Beach, Rua 141, 58, Centro, Itapema, SC, 88220-000
VITE_MAP_PLACE_ID=ChIJCbzvCqOx2JQRMgYOV9J4-ys
```

Não precisa de chave de API. O `Place ID` faz o botão de rota cair no pino certo em vez de depender da busca por texto.

### Fotos

As fotos otimizadas são geradas, não commitadas à mão.

1. Coloque o arquivo original em `assets-raw/originais/` com nome semântico: `piscina.jpg`, `apartamento-casal.jpg`, `cafe-da-manha.jpg`
2. Rode o script:

```bash
python3 scripts/preparar-fotos.py
```

Ele gera em `site/public/fotos/` até três larguras em WebP (800, 1280 e 1920), uma miniatura de 24px usada como fundo durante o carregamento, e o manifesto `fotos.json`. O script nunca amplia mais que 2x o original, então foto pequena não vira foto borrada.

3. Registre a foto em `site/src/data/pousada.js`, no array `fotos`:

```js
{
  arquivo: 'piscina',           // o nome do arquivo, sem extensão nem largura
  alt: 'Descrição do que se vê na foto, para quem não enxerga',
  categoria: 'Piscina',         // etiqueta no mosaico
  legenda: 'Frase curta no lightbox',
}
```

Foto listada no arquivo de dados mas sem arquivo gerado é ignorada em silêncio, então o site nunca aponta para imagem que não existe.

Para regerar a imagem de compartilhamento depois de trocar a foto de capa:

```bash
python3 scripts/og.py
```

### Papéis de foto

Cada foto declara onde aparece, e é isso que impede a mesma imagem de surgir duas vezes na mesma rolagem:

| Papel | Onde aparece |
|---|---|
| `destaque` | fundo do hero |
| `sobre` | a foto vertical da seção "A pousada" |
| `faixa` | a faixa sangrada entre seções |
| `comodidades` | a foto alta que sangra na seção de estrutura |
| `recorte` | um dos quatro cartões da seção Itapema |
| `comodidades` | a foto alta da seção de estrutura |

O campo `tipo` separa três coisas: `pousada` mostra a pousada de verdade, `destino` mostra Itapema e a legenda diz isso, e `ilustracao` é foto de banco de imagem. Ilustração entra só onde é decoração, e fica **fora do lightbox e do Schema.org**: lá dentro só vai acervo real.
| `fechamento` | fundo do CTA final |

O lightbox continua mostrando o acervo inteiro, independente dos papéis. Uma foto sem papel nenhum aparece só no lightbox, que é aberto pela foto da pousada, pela foto das comodidades e pelos quatro recortes de Itapema.

O campo `foco` define o recorte no formato `"x% y%"`. Serve para a parte importante da foto não ser cortada quando o espaço muda de forma, e é por foto, não por CSS, porque depende do que cada imagem mostra.

### Mapa

A segunda seção da página traz um mapa que faz uma viagem: começa no Brasil inteiro, fecha em Santa Catarina, fecha de novo em Itapema e larga o alfinete em cima da pousada. É uma câmera só, andando num espaço de coordenadas só, sem corte entre as etapas.

No canto do mapa há dois controles: um anda de etapa e fica onde parou, o outro, redondo, refaz a viagem. São dois de propósito: quando o mesmo botão fazia as duas coisas, voltar ao Brasil disparava o zoom automático e o Brasil sumia em um segundo.

A página tem **dois mapas, e eles não se repetem**. O animado, no topo, responde "onde fica Itapema", e por isso o alfinete dele diz ITAPEMA e não o nome da pousada. O de rua, embutido do Google na seção de chegada, responde "qual é a rua e como eu chego". Um serve a quem ainda está escolhendo o destino, o outro a quem já reservou.

A geometria é gerada:

```bash
python3 scripts/gerar-mapa.py
```

O script baixa a malha por unidade da federação da API do IBGE, reprojeta a malha municipal de Santa Catarina para o mesmo espaço, simplifica cada camada de acordo com o zoom em que ela é vista e escreve `site/src/data/mapa-sc.js`. Sem a simplificação o arquivo passa de 260 KB; com ela fica em 93 KB, ou 32 KB compactado.

A conversão de coordenada para o mapa está em `projetar()`, dentro de `components/mapa.js`, e usa os parâmetros do próprio arquivo gerado, então não existe número solto para desencontrar. Se o endereço mudar, é só trocar `coordenadas` no arquivo de conteúdo: o alfinete se reposiciona sozinho.

Três regras do componente que não são opcionais:

1. **Os dois eixos em radiano.** Mercator só preserva forma assim. Grau no x com radiano no y esmaga o mapa numa faixa horizontal, e o erro é silencioso.
2. **O alfinete vive dentro da câmera**, então herda o movimento dela e não tem como sair do lugar.
3. **A escala do alfinete é compensada pelo inverso do zoom.** Ele é marcador de interface e tem tamanho fixo na tela, não cresce junto com o mapa.
4. **A viagem só toca quando metade do mapa está de fato na tela**, e não tem gatilho por tempo. O resto do sistema de movimento tem rede de segurança por tempo porque lá o risco é deixar conteúdo invisível. Aqui o estado inicial já é um mapa completo, então o risco é o oposto: a viagem acontecer sem ninguém olhando.

### Cantos

Toda seção que tem fundo próprio, cor ou foto, leva a classe `tem-fundo` e vira uma laje de canto macio. O raio é fluido em `--radius-secao`, e uma laje entra por baixo da outra pelo tanto do raio, para não sobrar filete de fundo entre elas. O `overflow` recortado é parte da regra: sem ele, foto que sangra passa por cima do canto e o corte reto volta.

### Movimento

O sistema de movimento está em `site/src/styles/movimento.css` (o desenho) e `site/src/lib/movimento.js` (o motor que liga e desliga as classes). A documentação das decisões, com o porquê de cada duração, está em `direcao-de-movimento.md`.

Duas regras que valem para qualquer mexida ali:

1. **Nada fica escondido sem JavaScript.** Todo estado inicial invisível está trancado atrás da classe `.js`, que o `main.js` põe no `<html>` antes de montar. Sem JS a página aparece inteira, estática e legível.
2. **`prefers-reduced-motion` desliga tudo de verdade.** Quem pediu menos movimento no sistema recebe a página inteira visível e parada, sem parallax congelado num enquadramento errado.

### Textos

Tudo que o visitante lê está em `site/src/data/pousada.js`. Nenhum texto de conteúdo mora nos componentes.

A regra do arquivo é a chave `confirmado`:

```js
cancelamento: { valor: '', confirmado: false },
```

Com `confirmado: false`, o site não inventa resposta: a pergunta aparece nas dúvidas frequentes com um convite honesto a confirmar pelo WhatsApp, e o dado fica fora do Schema.org. Quando a pousada informar, preencha `valor` e vire para `true`.

O mesmo vale para blocos inteiros: `acomodacoes: []` esconde a seção de acomodações, e o link some do menu automaticamente, sem link quebrado.

## Publicar

O build gera arquivos estáticos em `site/dist`. Serve em qualquer hospedagem.

**Netlify ou Vercel**: apontar para a pasta `site`, comando `npm run build`, diretório de publicação `dist`. As variáveis `VITE_*` entram no painel do serviço.

**GitHub Pages**: se publicar em subpasta (`usuario.github.io/repositorio`), ajuste `base` em `site/vite.config.js` para `'/repositorio/'`. Em domínio próprio, deixe `'/'`.

**Hospedagem comum por FTP**: suba o conteúdo de `site/dist` para a raiz do site.

Antes de publicar, confira `PENDENCIAS.md`.

## Verificar

```bash
node scripts/qa.mjs          # 116 verificações no fluxo de reserva, com o site rodando
node scripts/capturar.mjs    # a página inteira em 5 larguras, em ./capturas
node scripts/provas.mjs      # os estados interativos, em ./capturas/provas
```

O QA sobe o Chrome em modo headless, navega de verdade, clica no calendário, mexe nos hóspedes, tenta enviar formulário inválido e lê a URL do WhatsApp que sai no fim. Sai com código 1 se algo falhar, então dá para plugar em CI.

O `provas.mjs` fotografa os estados que não aparecem numa captura de página inteira: calendário aberto, seletor de hóspedes, lightbox, menu mobile, barra fixa e o mapa. Iframe de outra origem, como o mapa do Google, só é pintado em captura do tamanho da tela, então é ali que dá para ver que ele funciona.

Nenhum dos três precisa de dependência de npm. Usam o protocolo DevTools direto, pelo cliente mínimo em `scripts/cdp.mjs`.

Os scripts de imagem usam Python com Pillow:

```bash
python3 scripts/preparar-fotos.py   # gera as versões otimizadas e o manifesto
python3 scripts/og.py               # gera a imagem de compartilhamento
python3 scripts/icones.py           # gera favicon e ícones do app
```

O relatório completo dos testes, incluindo os bugs que eles pegaram, está em `QA.md`.
