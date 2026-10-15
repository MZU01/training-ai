import { Link } from "react-router-dom";
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
      {/* Servie par PHP depuis legacy/public/sprites/ ; masquée si l'image n'a pas été téléchargée. */}
      <img
        className="sprite"
        src={`/sprites/${pokemon.id}.png`}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <span className="numero">{numero(pokemon.id)}</span>
      <Link className="nom" to={`/pokemon/${pokemon.id}`}>
        {pokemon.nom}
      </Link>
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
