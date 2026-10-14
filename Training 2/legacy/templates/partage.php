<h1>Partager mon équipe</h1>

<p>Votre équipe sera publiée sur le salon Discord du club.</p>

<?php if ($erreur): ?>
    <p class="flash flash-erreur" role="alert"><?= h($erreur) ?></p>
<?php endif; ?>

<?php if (!$membres): ?>
    <p>Votre équipe est vide. Ajoutez des Pokémon depuis le <a href="/pokedex">Pokédex</a>.</p>
<?php else: ?>
    <p>
        <?php foreach ($membres as $p): ?>
            <span class="membre"><?= h($p['nom']) ?></span>
        <?php endforeach; ?>
    </p>
    <form method="post" action="/partage" class="formulaire">
        <label for="pseudo">Votre pseudo</label>
        <input type="text" id="pseudo" name="pseudo" value="<?= h($pseudo) ?>" maxlength="32">
        <button type="submit">Publier sur Discord</button>
    </form>
<?php endif; ?>
