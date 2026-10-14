// Télécharge l'image de chaque Pokémon dans legacy/public/sprites/, une seule fois.
// Les images sont © The Pokémon Company : on ne les commite pas, chacun les télécharge chez soi.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const dossier = new URL('../legacy/public/sprites/', import.meta.url);
const pokemon = JSON.parse(readFileSync(new URL('../data/pokemon.json', import.meta.url), 'utf8'));

mkdirSync(dossier, { recursive: true });
const aTelecharger = pokemon.map((p) => p.id).filter((id) => !existsSync(new URL(`${id}.png`, dossier)));

let telecharges = 0;
let absents = 0;

async function telecharger(id) {
  const reponse = await fetch(`${SOURCE}/${id}.png`);
  if (!reponse.ok) {
    absents++;
    return;
  }
  writeFileSync(new URL(`${id}.png`, dossier), Buffer.from(await reponse.arrayBuffer()));
  telecharges++;
}

// 16 téléchargements à la fois.
const file = [...aTelecharger];
await Promise.all(
  Array.from({ length: 16 }, async () => {
    while (file.length) await telecharger(file.shift());
  }),
);

console.log(`Images : ${telecharges} téléchargées, ${pokemon.length - aTelecharger.length} déjà là, ${absents} sans image.`);
