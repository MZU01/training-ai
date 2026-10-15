# Coach Pokémon

Le projet d'exercice de l'atelier Claude Code. C'est une petite application web qui aide à composer une équipe de six Pokémon équilibrée.

Projet pédagogique et fictif, non affilié à Nintendo ni à The Pokémon Company. Les données viennent de [PokéAPI](https://pokeapi.co). Les images des Pokémon (© The Pokémon Company) ne sont pas dans le dépôt : `setup.sh` les télécharge depuis [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (`npm run sprites`).

## Ce que fait l'application

- **Pokédex** : chercher parmi les 1 025 Pokémon, filtrer par type, en ajouter un à l'équipe.
- **Fiche d'un Pokémon** : taille, poids, statistiques, faiblesses en défense, autres formes de l'espèce.
- **Mon équipe** : six Pokémon au plus, et le tableau de leurs faiblesses face à chaque type d'attaque.
- **Partager** : publie l'équipe sur le salon Discord du club.

## Où en est le code

C'est une vieille application PHP qu'on migre vers React, page par page.

| Dossier    | Contenu                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `legacy/`  | L'application PHP d'origine, sans framework : les pages Mon équipe et Partager, et l'API JSON                                 |
| `web/`     | La nouvelle interface en React et TypeScript. Les pages Pokédex et Fiche sont migrées                                         |
| `data/`    | Les données, copiées de PokéAPI. `npm run snapshot` les télécharge à nouveau                                                  |
| `e2e/`     | Les tests de bout en bout (Playwright). Ils passent par l'adresse de l'application, quelle que soit la technologie de la page |
| `scripts/` | Le lancement (`dev`), la vérification du poste (`doctor`) et la mise à jour des données (`snapshot`)                          |

On ouvre toujours l'application sur http://localhost:5173. Vite sert les pages React et relaie les autres au serveur PHP (port 8000) : la liste est dans `vite.config.ts`.

## Installer (Windows)

1. Dans **PowerShell, lancé en administrateur** :

   ```powershell
   wsl --install
   ```

   Redémarrez l'ordinateur. Au redémarrage, Ubuntu s'ouvre et vous demande de créer un nom d'utilisateur et un mot de passe.

2. Dans **Ubuntu** :

   ```bash
   cd ~
   git clone https://github.com/Next-Frontier-Studio/training-ai.git
   cd "training-ai/Training 2"
   ./setup.sh
   ```

   Le script installe PHP, Node, la GitHub CLI et Claude Code, puis vérifie le poste. Il demande votre mot de passe Ubuntu.

3. Toujours dans Ubuntu, connectez-vous :

   ```bash
   gh auth login
   claude
   ```

Gardez le projet dans votre dossier Linux (`~`), pas sous `/mnt/c` : sur le disque Windows, tout est beaucoup plus lent.

## Lancer

```bash
npm run dev
```

Puis ouvrez http://localhost:5173 dans votre navigateur Windows.

## Commandes

| Commande            | Ce qu'elle fait                                              |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Lance l'application                                          |
| `npm test`          | Tests unitaires (Vitest)                                     |
| `npm run test:e2e`  | Tests de bout en bout (Playwright), lance l'application seul |
| `npm run typecheck` | Vérifie les types TypeScript                                 |
| `npm run check`     | Les trois vérifications à la suite                           |
| `npm run doctor`    | Vérifie que le poste est prêt                                |

## Pour le TP

Au début du TP, vous écrivez vous-même vos réglages : `.claude/settings.json` (permissions), le sandbox et un hook.

Le dossier `atelier/` contient de quoi aller plus vite ensuite :

- `atelier/.claude/skills/cadrer-issue/` : le skill qui transforme une issue en demande cadrée (`/cadrer-issue 12`) ;
- `atelier/.claude/agents/relecteur.md` : un sous-agent relecteur, en lecture seule ;
- `atelier/modele-pr.md` : le modèle de description de PR, avec sa section Vérification.

Pour les copier dans le projet : `cp -r atelier/.claude .`

Pour ouvrir une PR, travaillez sur votre fork : `gh repo fork --remote`, puis `gh pr create`.
