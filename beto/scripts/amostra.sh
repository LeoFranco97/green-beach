#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Publica a AMOSTRA da landing no GitHub Pages.
#
#   bash beto/scripts/amostra.sh com-fotos   publica COM as fotos do parque
#   bash beto/scripts/amostra.sh sem-fotos   publica SEM as fotos do parque
#
# No ar em https://leofranco97.github.io/beto-carrero-green-beach/
# Repositorio da amostra: LeoFranco97/beto-carrero-green-beach, que carrega
# SO o resultado do build. O codigo fonte vive em LeoFranco97/green-beach.
#
# ---------------------------------------------------------------------------
# POR QUE EXISTEM DOIS MODOS
# ---------------------------------------------------------------------------
# As fotos das atracoes sao do parque. Enquanto o material oficial de parceiro
# nao chegar, elas valem para o Leonardo MOSTRAR a peca, e nao para a peca
# ficar no ar. `com-fotos` e um estado temporario e com hora para acabar;
# `sem-fotos` e o estado de repouso, em que a grade cai nos blocos de cor.
#
# Os dois modos geram um robots.txt que proibe indexacao. Mostrar por link e
# uma coisa, aparecer na busca do Google com foto de terceiro e outra.
# ---------------------------------------------------------------------------
set -euo pipefail

MODO="${1:-sem-fotos}"
REPO="https://github.com/LeoFranco97/beto-carrero-green-beach.git"
BASE_PAGES="/beto-carrero-green-beach/"

cd "$(dirname "$0")/.."
RAIZ="$PWD"
GUARDA="$(mktemp -d)"

case "$MODO" in
  com-fotos|sem-fotos) ;;
  *) echo "uso: amostra.sh [com-fotos|sem-fotos]"; exit 1 ;;
esac

# Tira as fotos do parque de public/ antes do build quando o modo pede. O
# build copia public/ inteiro, entao esconder os arquivos e a unica forma de
# garantir que eles nao entrem no pacote publicado.
devolver() {
  if compgen -G "$GUARDA/*" > /dev/null; then mv "$GUARDA"/* public/fotos/ 2>/dev/null || true; fi
  rmdir "$GUARDA" 2>/dev/null || true
}
trap devolver EXIT

if [ "$MODO" = "sem-fotos" ]; then
  mv public/fotos/atracao-*.webp "$GUARDA"/ 2>/dev/null || true
  mv public/fotos/fotos-atracoes.json "$GUARDA"/ 2>/dev/null || true
fi

echo "==> construindo ($MODO)"
BASE="$BASE_PAGES" npm run build --silent

# Amostra nao vai para busca. Em nenhum dos dois modos.
cat > dist/robots.txt <<'ROBOTS'
# Amostra de layout, nao e pagina comercial. Fora da busca de proposito.
User-agent: *
Disallow: /
ROBOTS
rm -f dist/sitemap.xml

echo "==> enviando"
ENVIO="$(mktemp -d)"
cp -R dist/. "$ENVIO/"
touch "$ENVIO/.nojekyll"

cat > "$ENVIO/README.md" <<README
# Amostra: ingressos do Beto Carrero World pela Green Beach

Landing de venda de ingresso do Beto Carrero World com transfer saindo de
Itapema, operada pela Pousada & Hotel Green Beach.

**Isto e uma amostra de layout.** Nao esta em operacao comercial.

Estado deste build: \`$MODO\`, publicado em $(date '+%d/%m/%Y %H:%M').

Beto Carrero World e marca e propriedade do parque, em Penha, Santa Catarina.
A Pousada & Hotel Green Beach nao opera o parque.

Codigo fonte: https://github.com/LeoFranco97/green-beach (pasta \`beto/\`)
README

cd "$ENVIO"
git init -q -b main
git add -A
git -c user.email=leonardojtfranco@gmail.com -c user.name=LeoFranco97 \
    -c commit.gpgsign=false commit -q -m "Amostra $MODO, $(date '+%d/%m/%Y %H:%M')"
git remote add origin "$REPO"
git push -q -f origin main

cd "$RAIZ"
rm -rf "$ENVIO"
echo "==> no ar em https://leofranco97.github.io/beto-carrero-green-beach/ ($MODO)"
