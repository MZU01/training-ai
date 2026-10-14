import { useMemo, useState } from "react";
import { ajouterAEquipe, type PokemonResume } from "../api/pokemon";
import { PokemonCard } from "../components/PokemonCard";
import { SearchBar } from "../components/SearchBar";
import { usePokedex } from "../hooks/usePokedex";
import { filtrerPokedex } from "../lib/search";

const LIMITE_AFFICHAGE = 60;

// Migrée depuis legacy/templates/pokedex.php. Différence voulue : la recherche ignore les accents.
export function PokedexPage() {
  const { pokemon, chargement, erreur } = usePokedex();
  const [texte, setTexte] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState<{
    texte: string;
    genre: "succes" | "erreur";
  } | null>(null);

  const resultats = useMemo(
    () => filtrerPokedex(pokemon, { texte, type }),
    [pokemon, texte, type],
  );
  const affiches = resultats.slice(0, LIMITE_AFFICHAGE);

  async function ajouter(p: PokemonResume) {
    const reponse = await ajouterAEquipe(p.id);
    setMessage(
      reponse.ok
        ? {
            texte: `${p.nom} ajouté à l'équipe (${reponse.equipe.length}/6).`,
            genre: "succes",
          }
        : { texte: reponse.erreur, genre: "erreur" },
    );
  }

  return (
    <>
      <h1>Pokédex</h1>
      {message && (
        <p className={`flash flash-${message.genre}`} role="status">
          {message.texte}
        </p>
      )}
      <SearchBar
        texte={texte}
        type={type}
        onTexte={setTexte}
        onType={setType}
      />
      {chargement && <p className="discret">Chargement…</p>}
      {erreur && <p className="flash flash-erreur">{erreur}</p>}
      {!chargement && !erreur && (
        <p className="discret">
          {resultats.length} Pokémon
          {resultats.length > affiches.length
            ? `, ${affiches.length} affichés`
            : ""}
          .
        </p>
      )}
      <ul className="grille">
        {affiches.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onAjouter={ajouter} />
        ))}
      </ul>
    </>
  );
}
