<?php

/**
 * Accès aux Pokémon de data/pokemon.json (instantané de PokéAPI, voir scripts/snapshot.mjs).
 */
class PokemonRepository
{
    private static $tous = null;

    public static function tous()
    {
        if (self::$tous === null) {
            $json = file_get_contents(DATA_DIR . '/pokemon.json');
            self::$tous = [];
            foreach (json_decode($json, true) as $p) {
                self::$tous[$p['id']] = $p;
            }
        }
        return self::$tous;
    }

    /** Les formes par défaut seulement : une ligne par espèce dans le Pokédex. */
    public static function pokedex()
    {
        return array_values(array_filter(self::tous(), function ($p) {
            return $p['parDefaut'];
        }));
    }

    public static function trouver($id)
    {
        $tous = self::tous();
        return $tous[$id] ?? null;
    }

    public static function rechercher($texte = '', $type = '', $generation = 0)
    {
        return array_values(array_filter(self::pokedex(), function ($p) use ($texte, $type, $generation) {
            if ($texte !== '' && stripos($p['nom'], $texte) === false && stripos($p['name'], $texte) === false) {
                return false;
            }
            if ($type !== '' && !in_array($type, $p['types'])) {
                return false;
            }
            if ($generation && $p['generation'] != $generation) {
                return false;
            }
            return true;
        }));
    }

    /** Les autres formes de la même espèce (formes régionales, Méga-Évolutions…). */
    public static function formes($pokemon)
    {
        return array_values(array_filter(self::tous(), function ($p) use ($pokemon) {
            return $p['espece'] == $pokemon['espece'] && $p['id'] != $pokemon['id'];
        }));
    }
}
