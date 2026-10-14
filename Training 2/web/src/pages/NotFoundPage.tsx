import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <>
      <h1>Page introuvable</h1>
      <p>
        <Link to="/pokedex">Retour au Pokédex</Link>
      </p>
    </>
  );
}
