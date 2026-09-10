# Green Beach v2

Segunda direção da landing da Pousada & Hotel Green Beach. Uma tela só: barra fixa e hero de altura cheia. Nada além disso, de propósito.

É um teste de comparação com a v1, que fica em `../site`. As duas mostram a mesma pousada com a mesma verdade nos dados, e discordam no resto.

| | v1 (`../site`) | v2 (esta) |
|---|---|---|
| Stack | Vite e JavaScript puro, zero dependência de runtime | React, TypeScript, Tailwind, lucide-react |
| Página | onze seções, jornada de reserva inteira | uma tela, só a promessa |
| Tipografia | Playfair Display, serifada, editorial | Helvetica Neue Light, sem serifa, silenciosa |
| Texto e foto | tinta clara por cima da foto | tinta escura sobre creme, foto embaixo |
| Reserva | calendário, hóspedes e validação na página | botão que leva direto ao WhatsApp |

## Rodar

```bash
npm install && npm run dev
```

Abre em http://localhost:5181

```bash
npm run build      # gera dist, pronto para publicar
npm run preview
```

## Onde mexer

Todo o texto e o número de WhatsApp estão em `src/conteudo.ts`. A página inteira está em `src/App.tsx`, dividida em `Navbar`, `Hero` e `Comodidades`. Cores e fontes em `tailwind.config.js`.

## Três decisões que valem explicação

**A foto não fica atrás do texto.** O molde que originou esta versão põe vídeo de tela cheia atrás de tinta escura. Medi as catorze aéreas do acervo, pixel a pixel, na zona exata onde o hero escreve: no pior pixel a melhor delas dá **1,87:1**, e corpo de texto precisa de 4,5:1. Nenhuma passa. As saídas eram escurecer a foto com véu, virar o texto para claro, ou separar as camadas. Escurecer com véu apaga a foto, e virar o texto para claro faria esta versão virar a v1. Então: tinta escura sobre creme em cima, fotografia sangrando embaixo. Sem véu, sem gradiente, contraste conferido em todos os textos.

**Fotografia com deriva, no lugar de vídeo.** Não existe vídeo da pousada e o acervo é de foto aérea. Um zoom de 5,5% em 32 segundos entrega a mesma sensação de imagem viva por 155 KB, contra os megabytes de um vídeo, e sem depender de CDN de terceiro. Se um dia houver vídeo de drone da pousada, é trocar a `<img>` por `<video>` no `Hero`.

**A fileira embaixo do título é de comodidades, não de parceiros.** No molde original ela lista investidores em cinco tipografias diferentes. A Green Beach não tem investidor para listar, e inventar cinco marcas seria mentira. Ficaram as cinco comodidades que a pousada afirma ter, numa tipografia só: cinco fontes display para cinco comodidades leem como cinco marcas, que é justamente o efeito errado.

## Conferido

- Sem rolagem lateral em 1700, 1440, 1280, 834, 390 e 320 px
- Título em duas linhas em todas as larguras, três em 320px
- Nenhum texto cortado
- Nenhum alvo de toque abaixo de 40px
- Contraste medido na página renderizada, não estimado: o menor é 5,52:1, no rótulo da fileira
- Menu de tela cheia abre, trava a rolagem do fundo e fecha no Esc
- Marca centrada só a partir de 768px: abaixo disso ela colidia com o hambúrguer
- `prefers-reduced-motion` desliga a deriva e as entradas
- Nenhum erro no console
