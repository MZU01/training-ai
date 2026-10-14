<?php

if ($methode === 'POST') {
    if ($chemin === '/equipe/ajouter') {
        $erreur = Team::ajouter($_POST['id'] ?? 0);
        flash($erreur ?: 'Pokémon ajouté à l\'équipe.', $erreur ? 'erreur' : 'succes');
        $retour = $_POST['retour'] ?? '/equipe';
        redirect(strpos($retour, '/') === 0 ? $retour : '/equipe');
    }
    if ($chemin === '/equipe/retirer') {
        Team::retirer($_POST['id'] ?? 0);
        flash('Pokémon retiré de l\'équipe.', 'succes');
        redirect('/equipe');
    }
    if ($chemin === '/equipe/vider') {
        Team::vider();
        redirect('/equipe');
    }
}

if ($chemin !== '/equipe' || $methode !== 'GET') {
    not_found();
}

$membres = Team::membres();
$analyse = TeamAnalyzer::analyser($membres);

render('equipe', [
    'titre' => 'Mon équipe',
    'membres' => $membres,
    'analyse' => $analyse,
    'pire' => TeamAnalyzer::pireFaiblesse($analyse),
]);
