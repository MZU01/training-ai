<?php

/**
 * Forces et faiblesses d'une équipe face à chaque type d'attaque, et son profil.
 */
class TeamAnalyzer
{
    const STATS = [
        'hp' => 'PV',
        'attack' => 'Attaque',
        'defense' => 'Défense',
        'special-attack' => 'Attaque spéciale',
        'special-defense' => 'Défense spéciale',
        'speed' => 'Vitesse',
    ];

    /**
     * Une ligne par type d'attaque : le multiplicateur de chaque membre (dans l'ordre de l'équipe),
     * puis les membres faibles (plus de ×1), résistants (moins de ×1, mais pas ×0) et immunisés (×0).
     */
    public static function analyser(array $membres)
    {
        $lignes = [];
        foreach (TypeChart::types() as $attaque) {
            $ligne = ['type' => $attaque, 'cellules' => [], 'faibles' => [], 'resistants' => [], 'immunises' => []];
            foreach ($membres as $pokemon) {
                $m = TypeChart::multiplicateur($attaque, $pokemon['types']);
                $entree = ['pokemon' => $pokemon, 'multiplicateur' => $m];
                $ligne['cellules'][] = $entree;
                if ($m == 0) {
                    $ligne['immunises'][] = $entree;
                } elseif ($m > 1) {
                    $ligne['faibles'][] = $entree;
                } elseif ($m < 1) {
                    $ligne['resistants'][] = $entree;
                }
            }
            $lignes[] = $ligne;
        }
        return $lignes;
    }

    /** Le type d'attaque qui touche le plus de membres ; à égalité, celui auquel le moins de membres résistent. */
    public static function pireFaiblesse(array $lignes)
    {
        $pire = null;
        foreach ($lignes as $ligne) {
            if ($pire === null || self::gravite($ligne) > self::gravite($pire)) {
                $pire = $ligne;
            }
        }
        return ($pire && count($pire['faibles']) > 0) ? $pire : null;
    }

    private static function gravite($ligne)
    {
        return count($ligne['faibles']) * 10 - count($ligne['resistants']) - count($ligne['immunises']);
    }

    /** Moyenne des statistiques de base de l'équipe, arrondie. */
    public static function profil(array $membres)
    {
        $profil = [];
        foreach (self::STATS as $cle => $libelle) {
            $total = 0;
            foreach ($membres as $pokemon) {
                $total += $pokemon['stats'][$cle] ?? 0;
            }
            $profil[$cle] = ['libelle' => $libelle, 'moyenne' => $membres ? (int) round($total / count($membres)) : 0];
        }
        return $profil;
    }

    /** Les types que partagent au moins deux membres : ils ont les mêmes faiblesses. */
    public static function typesEnDouble(array $membres)
    {
        $parType = [];
        foreach ($membres as $pokemon) {
            foreach ($pokemon['types'] as $type) {
                $parType[$type][] = $pokemon['nom'];
            }
        }
        return array_filter($parType, function ($noms) {
            return count($noms) >= 2;
        });
    }

    /** L'équipe en texte, pour la coller dans un message. */
    public static function exporter($nom, array $membres)
    {
        $texte = $nom . "\n";
        foreach ($membres as $i => $pokemon) {
            $types = array_map(['TypeChart', 'libelle'], $pokemon['types']);
            $texte .= ($i + 1) . '. ' . $pokemon['nom'] . ' (' . implode('/', $types) . ')' . ($i === 0 ? ', chef d\'équipe' : '') . "\n";
        }
        return $texte;
    }
}
