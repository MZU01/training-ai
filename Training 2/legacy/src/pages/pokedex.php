<?php

$texte = trim($_GET['q'] ?? '');
$type = $_GET['type'] ?? '';
$resultats = PokemonRepository::rechercher($texte, $type);

render('pokedex', [
    'titre' => 'Pokédex',
    'texte' => $texte,
    'type' => $type,
    'resultats' => array_slice($resultats, 0, 60),
    'total' => count($resultats),
]);
