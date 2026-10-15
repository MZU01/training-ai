import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ajouterAEquipe, chargerFiche, type Fiche } from "../api/pokemon";
import { TypeBadge } from "../components/TypeBadge";
import {
  formatMultiplicateur,
  formatPoids,
  formatTaille,
  numero,
} from "../lib/format";
import { NotFoundPage } from "./NotFoundPage";

const LIBELLES_STATS: [string, string][] = [
  ["hp", "PV"],
  ["attack", "Attaque"],
  ["defense", "Défense"],
  ["special-attack", "Attaque spéciale"],
  ["special-defense", "Défense spéciale"],
  ["speed", "Vitesse"],
];

type Etat =
  | { statut: "chargement" }
  | { statut: "introuvable" }
  | { statut: "erreur" }
  | { statut: "pret"; fiche: Fiche };

// Migrée depuis legacy/templates/fiche.php, à l'identique.
export function FichePage() {
  const { id = "" } = useParams();
  const [etat, setEtat] = useState<Etat>({ statut: "chargement" });
  const [message, setMessage] = useState<{
    texte: string;
    genre: "succes" | "erreur";
  } | null>(null);

  useEffect(() => {
    let annule = false;
    setEtat({ statut: "chargement" });
    setMessage(null);
    chargerFiche(id)
      .then(
        (fiche) =>
          !annule &&
          setEtat(fiche ? { statut: "pret", fiche } : { statut: "introuvable" }),
      )
      .catch(() => !annule && setEtat({ statut: "erreur" }));
    return () => {
      annule = true;
    };
  }, [id]);

  const titre =
    etat.statut === "pret"
      ? etat.fiche.nom
      : etat.statut === "introuvable"
        ? "Page introuvable"
        : null;
  useEffect(() => {
    if (!titre) return;
    const precedent = document.title;
    document.title = `${titre} · Coach Pokémon`;
    return () => {
      document.title = precedent;
    };
  }, [titre]);

  if (etat.statut === "chargement")
    return <p className="discret">Chargement…</p>;
  if (etat.statut === "introuvable") return <NotFoundPage />;
  if (etat.statut === "erreur")
    return (
      <p className="flash flash-erreur">
        Impossible de charger la fiche. Le serveur PHP tourne-t-il ?
      </p>
    );

  const { fiche } = etat;

  async function ajouter() {
    const reponse = await ajouterAEquipe(fiche.id);
    if (reponse.ok) {
      setMessage({ texte: "Pokémon ajouté à l'équipe.", genre: "succes" });
      setEtat({ statut: "pret", fiche: { ...fiche, dansEquipe: true } });
    } else {
      setMessage({ texte: reponse.erreur, genre: "erreur" });
    }
  }

  return (
    <>
      {message && (
        <p className={`flash flash-${message.genre}`} role="status">
          {message.texte}
        </p>
      )}
      <p className="discret">
        <Link to="/pokedex">← Pokédex</Link>
      </p>

      {/* Servie par PHP depuis legacy/public/sprites/ ; masquée si l'image n'a pas été téléchargée. */}
      <img
        className="sprite"
        src={`/sprites/${fiche.id}.png`}
        alt=""
        width={192}
        height={192}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      <h1>
        {fiche.nom} <span className="numero">{numero(fiche.id)}</span>
      </h1>

      {/* L'espace après chaque badge est celle du template PHP. */}
      <p className="types">
        {fiche.types.map((type) => (
          <Fragment key={type}>
            <TypeBadge type={type} />{" "}
          </Fragment>
        ))}
      </p>

      <dl className="mesures">
        <dt>Taille</dt>
        <dd data-mesure="taille">{formatTaille(fiche.taille)}</dd>
        <dt>Poids</dt>
        <dd data-mesure="poids">{formatPoids(fiche.poids)}</dd>
        <dt>Génération</dt>
        <dd>{fiche.generation}</dd>
      </dl>

      {fiche.dansEquipe ? (
        <p className="discret">Ce Pokémon est dans votre équipe.</p>
      ) : (
        <form
          className="inline"
          onSubmit={(e) => {
            e.preventDefault();
            void ajouter();
          }}
        >
          <button type="submit">Ajouter à l'équipe</button>
        </form>
      )}

      <h2>Statistiques de base</h2>
      <table className="stats">
        <tbody>
          {LIBELLES_STATS.map(([cle, libelle]) => {
            const valeur = fiche.stats[cle] ?? 0;
            return (
              <tr key={cle}>
                <th>{libelle}</th>
                <td className="valeur">{valeur}</td>
                <td>
                  <span
                    className="barre"
                    style={{ width: `${Math.min(100, Math.round(valeur / 2.55))}%` }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>En défense</h2>
      <table className="defense">
        <tbody>
          {fiche.defense.map((ligne) => (
            <tr
              key={ligne.type}
              className={ligne.multiplicateur > 1 ? "faible" : "resiste"}
            >
              <th>
                <TypeBadge type={ligne.type} />
              </th>
              <td>{formatMultiplicateur(ligne.multiplicateur)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {fiche.formes.length > 0 && (
        <>
          <h2>Autres formes</h2>
          <ul className="formes">
            {fiche.formes.map((forme) => (
              <li key={forme.id}>
                <Link to={`/pokemon/${forme.id}`}>{forme.nom}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
