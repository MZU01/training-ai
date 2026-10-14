<?php

$pokemon = PokemonRepository::trouver($id);
if (!$pokemon) {
    not_found();
}

$defense = [];
foreach (TypeChart::types() as $attaque) {
    $m = TypeChart::multiplicateur($attaque, $pokemon['types']);
    if ($m != 1) {
        $defense[] = ['type' => $attaque, 'multiplicateur' => $m];
    }
}
usort($defense, function ($a, $b) {
    return $b['multiplicateur'] <=> $a['multiplicateur'];
});

render('fiche', [
    'titre' => $pokemon['nom'],
    'pokemon' => $pokemon,
    'defense' => $defense,
    'formes' => PokemonRepository::formes($pokemon),
    'dansEquipe' => in_array($pokemon['id'], Team::ids()),
]);
