// Libellés français des types, dans l'ordre de PokéAPI.
const LIBELLES: Record<string, string> = {
  normal: "Normal",
  fighting: "Combat",
  flying: "Vol",
  poison: "Poison",
  ground: "Sol",
  rock: "Roche",
  bug: "Insecte",
  ghost: "Spectre",
  steel: "Acier",
  fire: "Feu",
  water: "Eau",
  grass: "Plante",
  electric: "Électrik",
  psychic: "Psy",
  ice: "Glace",
  dragon: "Dragon",
  dark: "Ténèbres",
  fairy: "Fée",
};

export const TYPES = Object.keys(LIBELLES);

export function libelleType(type: string): string {
  return LIBELLES[type] ?? type;
}
