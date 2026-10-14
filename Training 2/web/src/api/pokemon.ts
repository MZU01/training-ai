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
