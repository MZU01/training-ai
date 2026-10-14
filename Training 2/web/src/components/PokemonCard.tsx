import type { PokemonResume } from "../api/pokemon";
import { numero } from "../lib/format";
import { TypeBadge } from "./TypeBadge";

type Props = {
  pokemon: PokemonResume;
  onAjouter: (pokemon: PokemonResume) => void;
};

export function PokemonCard({ pokemon, onAjouter }: Props) {
  return (
    <li className="carte">
      <span className="numero">{numero(pokemon.id)}</span>
      {/* La fiche est encore une page PHP. */}
      <a className="nom" href={`/pokemon/${pokemon.id}`}>
        {pokemon.nom}
      </a>
      <span className="types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </span>
      <button type="button" onClick={() => onAjouter(pokemon)}>
        Ajouter à l'équipe
      </button>
    </li>
  );
}
