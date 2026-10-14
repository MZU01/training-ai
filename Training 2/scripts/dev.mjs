// Lance les deux serveurs : PHP sur le port 8000 (pages pas encore migrées, API) et Vite sur le port 5173.
// On ouvre toujours http://localhost:5173 : Vite relaie à PHP ce qu'il ne sert pas lui-même.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const racine = fileURLToPath(new URL('..', import.meta.url));

const serveurs = [
  { nom: 'php', commande: 'php', args: ['-S', '127.0.0.1:8000', '-t', 'legacy/public', 'legacy/public/router.php'] },
  { nom: 'vite', commande: 'node', args: ['node_modules/vite/bin/vite.js'] },
];

// Le serveur de PHP journalise chaque connexion : on ne garde que les erreurs et les réponses 4xx ou 5xx.
function estBruit(ligne) {
  return / (Accepted|Closing)$|Failed to poll event|\[(1|2|3)\d\d\]: /.test(ligne);
}

const processus = serveurs.map(({ nom, commande, args }) => {
  const enfant = spawn(commande, args, {
    cwd: racine,
    stdio: ['ignore', 'pipe', 'pipe'],
    // Plusieurs requêtes PHP en parallèle (Linux et Mac seulement), utile aux tests e2e.
    env: { ...process.env, PHP_CLI_SERVER_WORKERS: '4' },
  });
  const prefixer = (flux) => (morceau) => {
    for (const ligne of morceau.toString().split('\n')) {
      if (ligne.trim() && !estBruit(ligne)) flux.write(`[${nom}] ${ligne}\n`);
    }
  };
  enfant.stdout.on('data', prefixer(process.stdout));
  enfant.stderr.on('data', prefixer(process.stderr));
  enfant.on('error', (erreur) => {
    console.error(`[${nom}] impossible de lancer « ${commande} » : ${erreur.message}. Lancez npm run doctor.`);
    arreter(1);
  });
  enfant.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`[${nom}] arrêté (code ${code}).`);
      arreter(code);
    }
  });
  return enfant;
});

function arreter(code = 0) {
  for (const enfant of processus) enfant.kill();
  process.exit(code);
}

process.on('SIGINT', () => arreter(0));
process.on('SIGTERM', () => arreter(0));

console.log('Coach Pokémon : http://localhost:5173');
