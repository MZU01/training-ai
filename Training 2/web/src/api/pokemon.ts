import { getJson, postJson } from "./client";

export type PokemonResume = {
  id: number;
  nom: string;
  name: string;
  types: string[];
  generation: number;
};

export function listerPokemon(): Promise<PokemonResume[]> {
  return getJson<PokemonResume[]>("/api/pokemon");
}

export type Fiche = PokemonResume & {
  taille: number;
  poids: number;
  stats: Record<string, number>;
  defense: { type: string; multiplicateur: number }[];
  formes: { id: number; nom: string }[];
  dansEquipe: boolean;
};

/** La fiche d'un Pokémon, ou null s'il n'existe pas. */
export async function chargerFiche(id: string): Promise<Fiche | null> {
  const reponse = await fetch(`/api/pokemon/${id}/fiche`, {
    headers: { Accept: "application/json" },
  });
  if (reponse.status === 404) return null;
  if (!reponse.ok) throw new Error(`Fiche ${id} : ${reponse.status}`);
  return reponse.json() as Promise<Fiche>;
}

type ReponseAjout =
  { ok: true; equipe: number[] } | { ok: false; erreur: string };

export async function ajouterAEquipe(id: number): Promise<ReponseAjout> {
  const { statut, donnees } = await postJson<{
    equipe?: number[];
    erreur?: string;
  }>("/api/equipe", { id });
  if (statut === 201 && donnees.equipe)
    return { ok: true, equipe: donnees.equipe };
  return { ok: false, erreur: donnees.erreur ?? "Ajout impossible." };
}
