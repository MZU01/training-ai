import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// Même en-tête que les pages PHP (legacy/templates/partials/nav.php).
// Les liens vers des pages PHP sont des <a> : ils rechargent la page.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="nav">
        <Link className="logo" to="/pokedex">
          Coach Pokémon
        </Link>
        <nav>
          <Link to="/pokedex">Pokédex</Link>
          <a href="/equipe">Mon équipe</a>
          <a href="/partage">Partager</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        Projet pédagogique, non affilié à Nintendo ni à The Pokémon Company.
        Données : PokéAPI.
      </footer>
    </>
  );
}
