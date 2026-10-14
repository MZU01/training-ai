<?php

/**
 * L'équipe du joueur, gardée en session : six Pokémon au plus, sans doublon.
 */
class Team
{
    const TAILLE_MAX = 6;
    const NOM_PAR_DEFAUT = 'Mon équipe';

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
        unset($_SESSION['nom_equipe']);
    }

    public static function nom()
    {
        return $_SESSION['nom_equipe'] ?? self::NOM_PAR_DEFAUT;
    }

    public static function renommer($nom)
    {
        // 40 caractères au plus (preg plutôt que mb_substr : l'extension mbstring n'est pas toujours installée).
        $nom = trim(preg_replace('/^(.{40}).+$/us', '$1', (string) $nom));
        if ($nom === '') {
            unset($_SESSION['nom_equipe']);
        } else {
            $_SESSION['nom_equipe'] = $nom;
        }
    }

    /** Le premier membre de l'équipe est son chef : c'est lui qui entre en combat en premier. */
    public static function mettreEnTete($id)
    {
        $id = (int) $id;
        $ids = self::ids();
        if (in_array($id, $ids)) {
            $_SESSION['equipe'] = array_values(array_merge([$id], array_diff($ids, [$id])));
        }
    }
}
