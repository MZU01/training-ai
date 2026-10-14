// Régénère data/pokemon.json et data/types.json depuis PokéAPI.
// L'application n'appelle jamais PokéAPI en fonctionnement : elle lit ces deux fichiers.
// PokéAPI demande de mettre en cache ce qu'on télécharge : cet instantané est ce cache.
import { writeFile } from 'node:fs/promises';

const ENDPOINT = 'https://graphql.pokeapi.co/v1beta2';
const FRENCH = 5;

async function query(gql) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: gql }),
  });
  if (!response.ok) throw new Error(`PokéAPI a répondu ${response.status}`);
  const { data, errors } = await response.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data;
}

const { type: rawTypes } = await query(`query {
  type(where: { id: { _lte: 18 } }, order_by: { id: asc }) {
    id name
    typenames(where: { language_id: { _eq: ${FRENCH} } }) { name }
    typeefficacies { damage_factor target_type_id }
  }
}`);

const typeNameById = Object.fromEntries(rawTypes.map((t) => [t.id, t.name]));
const types = rawTypes.map((t) => ({
  name: t.name,
  nom: t.typenames[0]?.name ?? t.name,
  // Multiplicateur quand ce type attaque chaque type défenseur.
  attaque: Object.fromEntries(
    t.typeefficacies
      .filter((e) => typeNameById[e.target_type_id])
      .map((e) => [typeNameById[e.target_type_id], e.damage_factor / 100]),
  ),
}));

const { pokemon: rawPokemon } = await query(`query {
  pokemon(order_by: { id: asc }) {
    id name is_default height weight
    pokemontypes(order_by: { slot: asc }) { type { name } }
    pokemonstats { base_stat stat { name } }
    pokemonforms { form_name pokemonformnames(where: { language_id: { _eq: ${FRENCH} } }) { pokemon_name } }
    pokemonspecy { id generation_id pokemonspeciesnames(where: { language_id: { _eq: ${FRENCH} } }) { name } }
  }
}`);

const pokemon = rawPokemon.map((p) => {
  const form = p.pokemonforms[0];
  const species = p.pokemonspecy;
  return {
    id: p.id,
    name: p.name,
    nom: form?.pokemonformnames[0]?.pokemon_name ?? species.pokemonspeciesnames[0]?.name ?? p.name,
    espece: species.id,
    forme: form?.form_name || null,
    parDefaut: p.is_default,
    generation: species.generation_id,
    types: p.pokemontypes.map((t) => t.type.name),
    taille: p.height, // décimètres
    poids: p.weight, // hectogrammes
    stats: Object.fromEntries(p.pokemonstats.map((s) => [s.stat.name, s.base_stat])),
  };
});

await writeFile(new URL('../data/types.json', import.meta.url), JSON.stringify(types, null, 1) + '\n');
await writeFile(new URL('../data/pokemon.json', import.meta.url), JSON.stringify(pokemon) + '\n');
console.log(`${pokemon.length} Pokémon et ${types.length} types enregistrés dans data/.`);
