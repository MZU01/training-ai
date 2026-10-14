<?php

// Routeur du serveur intégré de PHP (php -S) : sert les fichiers statiques tels quels,
// envoie tout le reste à index.php.
$chemin = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($chemin !== '/' && is_file(__DIR__ . $chemin)) {
    return false;
}
require __DIR__ . '/index.php';
