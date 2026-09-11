#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Publica o site no GitHub Pages.
# ---------------------------------------------------------------------------
# O Pages serve a branch gh-pages, que contem apenas o resultado do build.
# O codigo fonte fica na main e nunca se mistura com o site publicado.
#
#   bash scripts/publicar.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> construindo"
npm --prefix site ci --silent
npm --prefix site run build

echo "==> preparando a branch gh-pages"
git worktree remove .gh-pages --force 2>/dev/null || true
git fetch -q origin gh-pages 2>/dev/null || true
git worktree add -q -B gh-pages .gh-pages origin/gh-pages 2>/dev/null \
  || git worktree add -q -B gh-pages .gh-pages

# Limpa o conteudo antigo preservando o .git do worktree. Sem isso, arquivo
# apagado do site continuaria no ar para sempre.
find .gh-pages -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R site/dist/. .gh-pages/

# Sem este arquivo o Pages roda Jekyll, que ignora pasta comecada com _.
touch .gh-pages/.nojekyll

echo "==> enviando"
git -C .gh-pages add -A
if git -C .gh-pages -c commit.gpgsign=false commit -q -m "Publica o site em $(date '+%d/%m/%Y %H:%M')"; then
  git -C .gh-pages push -q -f origin gh-pages
  echo "==> no ar em https://greenbeach.com.br"
else
  echo "==> nada mudou desde a ultima publicacao"
fi

git worktree remove .gh-pages --force
