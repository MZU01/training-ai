import { useEffect, useState } from "react";
import { listerPokemon, type PokemonResume } from "../api/pokemon";

// Charge tout le Pokédex une fois ; le filtrage se fait côté navigateur.
export function usePokedex() {
  const [pokemon, setPokemon] = useState<PokemonResume[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;
    listerPokemon()
      .then((liste) => !annule && setPokemon(liste))
      .catch(
        () =>
          !annule &&
          setErreur(
            "Impossible de charger le Pokédex. Le serveur PHP tourne-t-il ?",
          ),
      )
      .finally(() => !annule && setChargement(false));
    return () => {
      annule = true;
    };
  }, []);

  return { pokemon, chargement, erreur };
}
