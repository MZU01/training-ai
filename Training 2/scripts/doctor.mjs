// Vérifie que le poste est prêt pour l'atelier. Chaque ligne en échec donne la commande qui corrige.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { createServer } from 'node:net';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const racine = fileURLToPath(new URL('..', import.meta.url));
let echecs = 0;

function sortie(commande, args) {
  try {
    return execFileSync(commande, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function verifier(libelle, ok, correction, bloquant = true) {
  if (ok) {
    console.log(`  ✔ ${libelle}`);
  } else {
    console.log(`  ${bloquant ? '✘' : '!'} ${libelle}\n      → ${correction}`);
    if (bloquant) echecs++;
  }
}

function portLibre(port) {
  return new Promise((resolve) => {
    const serveur = createServer()
      .once('error', () => resolve(false))
      .once('listening', () => serveur.close(() => resolve(true)))
      .listen(port, '127.0.0.1');
  });
}

console.log('\nCoach Pokémon : vérification du poste\n');

const majeurNode = Number(process.versions.node.split('.')[0]);
verifier(`Node ${process.versions.node} (24 ou plus)`, majeurNode >= 24, 'relancez ./setup.sh');

const php = sortie('php', ['-r', 'echo PHP_VERSION;']);
verifier(php ? `PHP ${php} (8.1 ou plus)` : 'PHP', php && php.localeCompare('8.1', undefined, { numeric: true }) >= 0, 'sudo apt install -y php-cli');

const git = sortie('git', ['--version']);
verifier(git ?? 'Git', git, 'sudo apt install -y git');

const gh = sortie('gh', ['--version']);
verifier(gh ? gh.split('\n')[0] : 'GitHub CLI (gh)', gh, 'sudo apt install -y gh');
if (gh) {
  verifier('gh connecté à GitHub', sortie('gh', ['auth', 'status']) !== null, 'gh auth login', false);
}

const claude = sortie('claude', ['--version']);
verifier(claude ? `Claude Code ${claude}` : 'Claude Code', claude, 'curl -fsSL https://claude.ai/install.sh | bash, puis ouvrez un nouveau terminal');

verifier('Dépendances npm installées', existsSync(`${racine}/node_modules/vite`), 'npm install');

const cachePlaywright = `${homedir()}/.cache/ms-playwright`;
const chromium = existsSync(cachePlaywright) && readdirSync(cachePlaywright).some((d) => d.startsWith('chromium'));
verifier('Navigateur des tests e2e (Chromium)', chromium, 'npx playwright install --with-deps chromium');

verifier('Images des Pokémon', existsSync(`${racine}/legacy/public/sprites/25.png`), 'npm run sprites', false);

verifier('Fichier .env présent', existsSync(`${racine}/.env`), 'relancez ./setup.sh');

verifier('Port 8000 libre (PHP)', await portLibre(8000), 'un autre programme utilise le port 8000 : fermez-le');
verifier('Port 5173 libre (Vite)', await portLibre(5173), 'un autre programme utilise le port 5173 : fermez-le');

if (process.platform === 'linux') {
  verifier(
    'Projet dans le disque Linux (pas sous /mnt/c)',
    !racine.startsWith('/mnt/'),
    'clonez le dépôt dans votre dossier Linux : cd ~ && git clone …',
    false,
  );
  const sandbox = sortie('which', ['bwrap']) && sortie('which', ['socat']);
  verifier('Sandbox de Claude Code (bubblewrap, socat)', sandbox, 'sudo apt install -y bubblewrap socat', false);
}

console.log(echecs === 0 ? '\nTout est prêt. Lancez : npm run dev\n' : `\n${echecs} point(s) à corriger.\n`);
process.exit(echecs === 0 ? 0 : 1);
