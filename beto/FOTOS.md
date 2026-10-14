# As fotos das atrações

## O estado de hoje, em uma frase

As nove fotos de atração que estão na página agora **são do próprio parque,
baixadas do site oficial, e servem só como amostra local**. Elas não estão
versionadas e **não podem ir ao ar**.

## Por que elas não estão no git

O repositório `LeoFranco97/green-beach` é **público**. Commitar uma foto do
Beto Carrero nele é publicar essa foto, mesmo que a landing nunca seja
colocada no ar. Então ficam fora, pelo `.gitignore`:

```
beto/public/fotos/atracao-*
beto/public/fotos/fotos-atracoes.json
```

O manifesto delas é um arquivo separado de propósito. `src/lib/imagens.js`
junta os dois com `import.meta.glob`, que devolve objeto vazio quando o
arquivo não existe. Consequência prática: **em clone limpo a grade cai no
estado de cor**, que é um estado desenhado e não um erro. Ninguém que clonar
este repositório vai receber imagem do parque, e a página continua inteira.

## O que isso significa na prática

| Situação | Pode |
|---|---|
| Rodar local para ver o layout | sim, é o que elas existem para fazer |
| Mandar captura para o cliente avaliar o design | sim |
| Publicar em `greenbeach.com.br` | **não** |
| Rodar anúncio com essas imagens | **não** |
| Commitar no repositório público | **não**, o `.gitignore` já impede |

## Como sair deste estado

Pedir o material oficial de parceiro. Você é revendedor autorizado, então
isso te cabe. Canais:

- `pacotes@betocarrero.com.br`
- central (47) 3261-2222
- portal do agente, que é a via oficial para conseguir artes com permissão

Peça três coisas, nesta ordem de importância: **fotos das atrações em alta**,
**logo e regras de uso da marca**, e **o que pode e o que não pode** na
comunicação de um revendedor.

## Como trocar quando o material chegar

1. Jogue os arquivos originais numa pasta qualquer, um por atração, com o
   nome do `id` que está em `src/data/atracoes.js`.
2. Rode o conversor abaixo, que gera 800, 1280 e 1920 em WebP mais a
   miniatura borrada de 24 px, e atualiza `fotos-atracoes.json`.
3. Apague as linhas do `.gitignore` acima, porque material licenciado pode
   ser versionado.

```bash
python3 - <<'PY'
from PIL import Image
import json, os, glob
ORIGEM = 'CAMINHO/DA/PASTA'      # troque
DESTINO = 'beto/public/fotos'
LARG = [800, 1280, 1920]
cam = f'{DESTINO}/fotos-atracoes.json'
m = json.load(open(cam)) if os.path.exists(cam) else {}
for arq in sorted(glob.glob(f'{ORIGEM}/*')):
    ident = 'atracao-' + os.path.splitext(os.path.basename(arq))[0]
    im = Image.open(arq).convert('RGB'); w, h = im.size
    larguras = []
    for alvo in LARG:
        if alvo > w and larguras: break
        larg = min(alvo, w)
        im.resize((larg, round(h*larg/w)), Image.LANCZOS).save(f'{DESTINO}/{ident}-{larg}.webp', 'WEBP', quality=82, method=6)
        larguras.append(larg)
    im.resize((24, max(1, round(h*24/w))), Image.LANCZOS).save(f'{DESTINO}/{ident}-mini.webp', 'WEBP', quality=45)
    m[ident] = {'larguras': larguras, 'w': w, 'h': h, 'proporcao': round(w/h, 4)}
    print(ident, w, h, larguras)
json.dump(m, open(cam, 'w'), indent=2, ensure_ascii=False)
PY
```

Nada mais precisa mudar: `src/data/atracoes.js` já aponta para esses nomes.

## O que continua proibido mesmo depois

Gerar imagem de brinquedo por IA. Numa página que vende ingresso de verdade
isso não é estética, é propaganda enganosa, e o cliente descobre no portão.
