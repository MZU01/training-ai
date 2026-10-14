#!/usr/bin/env bash
# Installe tout ce qu'il faut pour l'atelier, sur Ubuntu (WSL2). On peut le relancer sans risque.
set -euo pipefail
cd "$(dirname "$0")"

etape() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }
en_root() { if [ "$(id -u)" -eq 0 ]; then "$@"; else sudo "$@"; fi; }

if [ "$(uname -s)" != "Linux" ]; then
  echo "Ce script est prévu pour Ubuntu, dans WSL2."
  exit 1
fi
case "$PWD" in
  /mnt/*) echo "⚠ Le projet est sur le disque Windows ($PWD) : tout sera lent. Clonez-le plutôt dans votre dossier Linux : cd ~ && git clone …" ;;
esac

etape "Paquets système : PHP, Git, GitHub CLI, outils du sandbox"
en_root apt-get update -qq
en_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq php-cli git gh bubblewrap socat curl ca-certificates

etape "Node.js 24"
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 24 ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | en_root bash -
  en_root env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
fi

etape "Claude Code"
if ! command -v claude >/dev/null && [ ! -x "$HOME/.local/bin/claude" ]; then
  # Le téléchargement échoue parfois sur un délai dépassé : on retente une fois, puis on continue.
  curl -fsSL https://claude.ai/install.sh | bash || curl -fsSL https://claude.ai/install.sh | bash ||
    echo "⚠ Claude Code ne s'est pas installé. Relancez ./setup.sh plus tard."
fi

etape "Dépendances du projet"
npm install --no-fund --no-audit
npx playwright install --with-deps chromium

etape "Images des Pokémon"
npm run sprites || echo "⚠ Images non téléchargées : l'application marche sans. Relancez npm run sprites plus tard."

etape "Fichier .env"
if [ ! -f .env ]; then
  jeton="faux-$(head -c 12 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  sed "s/remplacez-moi/$jeton/" .env.example > .env
  echo ".env créé."
else
  echo ".env existe déjà, on n'y touche pas."
fi

etape "Vérification"
PATH="$HOME/.local/bin:$PATH" npm run doctor
