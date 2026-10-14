<?php

/**
 * L'équipe du joueur, gardée en session : six Pokémon au plus, sans doublon.
 */
class Team
{
    const TAILLE_MAX = 6;

    public static function ids()
    {
        return $_SESSION['equipe'] ?? [];
    }

    public static function membres()
    {
        $membres = [];
        foreach (self::ids() as $id) {
            $pokemon = PokemonRepository::trouver($id);
            if ($pokemon) {
                $membres[] = $pokemon;
            }
        }
        return $membres;
    }

    /** Renvoie null si l'ajout a réussi, sinon le message d'erreur. */
    public static function ajouter($id)
    {
        $id = (int) $id;
        $ids = self::ids();
        if (!PokemonRepository::trouver($id)) {
            return 'Pokémon inconnu.';
        }
        if (in_array($id, $ids)) {
            return 'Ce Pokémon est déjà dans l\'équipe.';
        }
        if (count($ids) >= self::TAILLE_MAX) {
            return 'Équipe complète : ' . self::TAILLE_MAX . ' Pokémon au maximum.';
        }
        $ids[] = $id;
        $_SESSION['equipe'] = $ids;
        return null;
    }

    public static function retirer($id)
    {
        $_SESSION['equipe'] = array_values(array_diff(self::ids(), [(int) $id]));
    }

    public static function vider()
    {
        $_SESSION['equipe'] = [];
    }
}
