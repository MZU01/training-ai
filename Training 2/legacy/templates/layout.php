<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($titre ?? 'Coach Pokémon') ?> · Coach Pokémon</title>
    <link rel="stylesheet" href="/legacy-assets/style.css">
</head>
<body>
    <?php require ROOT . '/templates/partials/nav.php'; ?>
    <main>
        <?php $flash = flash(); if ($flash): ?>
            <p class="flash flash-<?= h($flash['genre']) ?>" role="status"><?= h($flash['message']) ?></p>
        <?php endif; ?>
        <?= $contenu ?>
    </main>
    <footer>Projet pédagogique, non affilié à Nintendo ni à The Pokémon Company. Données : PokéAPI.</footer>
    <script src="/legacy-assets/jquery-3.7.1.min.js"></script>
    <script src="/legacy-assets/app.js"></script>
</body>
</html>
