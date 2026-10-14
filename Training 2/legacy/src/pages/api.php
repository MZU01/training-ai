<?php

// API JSON ajoutée pour la migration vers React. Elle ne couvre que ce dont la page Pokédex a besoin.

function resume($p)
{
    return [
        'id' => $p['id'],
        'nom' => $p['nom'],
        'name' => $p['name'],
        'types' => $p['types'],
        'generation' => $p['generation'],
    ];
}

if ($chemin === '/api/pokemon' && $methode === 'GET') {
    $resultats = PokemonRepository::rechercher(
        trim($_GET['q'] ?? ''),
        $_GET['type'] ?? '',
        (int) ($_GET['generation'] ?? 0)
    );
    json_response(array_map('resume', $resultats));
}

if (preg_match('#^/api/pokemon/(\d+)$#', $chemin, $m) && $methode === 'GET') {
    $pokemon = PokemonRepository::trouver((int) $m[1]);
    $pokemon ? json_response($pokemon) : json_response(['erreur' => 'Pokémon inconnu.'], 404);
}

if ($chemin === '/api/equipe' && $methode === 'POST') {
    $corps = json_decode(file_get_contents('php://input'), true) ?: [];
    $erreur = Team::ajouter($corps['id'] ?? 0);
    if ($erreur) {
        json_response(['erreur' => $erreur], 400);
    }
    json_response(['equipe' => Team::ids()], 201);
}

json_response(['erreur' => 'Route inconnue.'], 404);
