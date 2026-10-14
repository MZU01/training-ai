<?php

/**
 * Lit le fichier .env à la racine du projet (une variable par ligne, NOM=valeur).
 * Les variables déjà définies dans l'environnement ne sont pas écrasées.
 */
function load_env($fichier)
{
    if (!is_file($fichier)) {
        return;
    }
    foreach (file($fichier, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $ligne) {
        $ligne = trim($ligne);
        if ($ligne === '' || $ligne[0] === '#' || strpos($ligne, '=') === false) {
            continue;
        }
        list($nom, $valeur) = explode('=', $ligne, 2);
        $nom = trim($nom);
        $valeur = trim(trim($valeur), '"\'');
        if (getenv($nom) === false) {
            putenv("$nom=$valeur");
        }
    }
}

function env($nom, $defaut = null)
{
    $valeur = getenv($nom);
    return $valeur === false ? $defaut : $valeur;
}
