<?php

$membres = Team::membres();
$erreur = null;
$pseudo = '';

if ($methode === 'POST') {
    $pseudo = trim($_POST['pseudo'] ?? '');
    if ($pseudo === '') {
        $erreur = 'Indiquez votre pseudo.';
    } elseif (count($membres) === 0) {
        $erreur = 'Votre équipe est vide.';
    } else {
        $noms = array_map(function ($p) {
            return $p['nom'];
        }, $membres);
        $message = "Équipe de $pseudo :\n" . implode(', ', $noms);
        if (DiscordNotifier::envoyer($message)) {
            flash('Équipe partagée sur Discord.', 'succes');
            redirect('/equipe');
        }
        $erreur = 'Le partage a échoué. Réessayez plus tard.';
    }
}

render('partage', [
    'titre' => 'Partager mon équipe',
    'membres' => $membres,
    'pseudo' => $pseudo,
    'erreur' => $erreur,
]);
