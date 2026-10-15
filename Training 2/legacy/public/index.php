<?php

require_once __DIR__ . '/../src/bootstrap.php';

$chemin = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/') ?: '/';
$methode = $_SERVER['REQUEST_METHOD'];

if ($chemin === '/') {
    redirect('/pokedex');
}

// Pages
if ($chemin === '/pokedex' && $methode === 'GET') {
    // Remplacée par la page React (web/src/pages/PokedexPage.tsx), conservée le temps de la migration.
    require ROOT . '/src/pages/pokedex.php';
    exit;
}
if (preg_match('#^/pokemon/(\d+)$#', $chemin, $m) && $methode === 'GET') {
    // Remplacée par la page React (web/src/pages/FichePage.tsx), conservée le temps de la migration.
    $id = (int) $m[1];
    require ROOT . '/src/pages/fiche.php';
    exit;
}
if (strpos($chemin, '/equipe') === 0) {
    require ROOT . '/src/pages/equipe.php';
    exit;
}
if ($chemin === '/partage') {
    require ROOT . '/src/pages/partage.php';
    exit;
}

// API JSON, utilisée par les pages React
if (strpos($chemin, '/api/') === 0) {
    require ROOT . '/src/pages/api.php';
    exit;
}

not_found();
