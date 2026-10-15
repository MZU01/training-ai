<?php

$pokemon = PokemonRepository::trouver($id);
if (!$pokemon) {
    not_found();
}

render('fiche', [
    'titre' => $pokemon['nom'],
    'pokemon' => $pokemon,
    'defense' => table_defense($pokemon['types']),
    'formes' => PokemonRepository::formes($pokemon),
    'dansEquipe' => in_array($pokemon['id'], Team::ids()),
]);
