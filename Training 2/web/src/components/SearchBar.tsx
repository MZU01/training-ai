import { TYPES, libelleType } from "../lib/types";

type Props = {
  texte: string;
  type: string;
  onTexte: (texte: string) => void;
  onType: (type: string) => void;
};

export function SearchBar({ texte, type, onTexte, onType }: Props) {
  return (
    <div className="filtres">
      <input
        type="search"
        value={texte}
        onChange={(e) => onTexte(e.target.value)}
        placeholder="Nom du Pokémon"
        aria-label="Nom du Pokémon"
      />
      <select
        value={type}
        onChange={(e) => onType(e.target.value)}
        aria-label="Type"
      >
        <option value="">Tous les types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {libelleType(t)}
          </option>
        ))}
      </select>
    </div>
  );
}
