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
    if ($chemin === '/equipe/en-tete') {
        Team::mettreEnTete($_POST['id'] ?? 0);
        redirect('/equipe');
    }
    if ($chemin === '/equipe/renommer') {
        Team::renommer($_POST['nom'] ?? '');
        flash('Équipe renommée.', 'succes');
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
    'titre' => Team::nom(),
    'nom' => Team::nom(),
    'membres' => $membres,
    'analyse' => $analyse,
    'pire' => TeamAnalyzer::pireFaiblesse($analyse),
    'profil' => TeamAnalyzer::profil($membres),
    'enDouble' => TeamAnalyzer::typesEnDouble($membres),
    'export' => TeamAnalyzer::exporter(Team::nom(), $membres),
]);
