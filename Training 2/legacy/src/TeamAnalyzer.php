<?php

/**
 * Forces et faiblesses d'une équipe face à chaque type d'attaque.
 */
class TeamAnalyzer
{
    /**
     * Pour chaque type d'attaque : les membres faibles (×2 ou plus), résistants (moins de ×1)
     * et immunisés (×0), avec leur multiplicateur.
     */
    public static function analyser(array $membres)
    {
        $lignes = [];
        foreach (TypeChart::types() as $attaque) {
            $ligne = ['type' => $attaque, 'faibles' => [], 'resistants' => [], 'immunises' => []];
            foreach ($membres as $pokemon) {
                $m = TypeChart::multiplicateur($attaque, $pokemon['types']);
                $entree = ['pokemon' => $pokemon, 'multiplicateur' => $m];
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

    /** Le type d'attaque qui touche le plus de membres. */
    public static function pireFaiblesse(array $lignes)
    {
        $pire = null;
        foreach ($lignes as $ligne) {
            if ($pire === null || count($ligne['faibles']) > count($pire['faibles'])) {
                $pire = $ligne;
            }
        }
        return ($pire && count($pire['faibles']) > 0) ? $pire : null;
    }
}
