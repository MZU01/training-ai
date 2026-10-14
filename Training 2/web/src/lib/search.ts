import type { PokemonResume } from "../api/pokemon";

/** Minuscules, sans accents ni apostrophes typographiques : « Évoli » → « evoli ». */
export function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();
}

type Filtres = { texte?: string; type?: string };

/** Cherche dans le nom français et le nom anglais ; le type doit être l'un des deux types du Pokémon. */
export function filtrerPokedex(
  pokemon: PokemonResume[],
  { texte = "", type = "" }: Filtres,
): PokemonResume[] {
  const recherche = normaliser(texte);
  return pokemon.filter((p) => {
    if (
      recherche &&
      !normaliser(p.nom).includes(recherche) &&
      !p.name.includes(recherche)
    )
      return false;
    if (type && !p.types.includes(type)) return false;
    return true;
  });
}
