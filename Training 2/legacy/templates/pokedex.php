<h1>Pokédex</h1>

<form method="get" action="/pokedex" class="filtres">
    <input type="search" name="q" value="<?= h($texte) ?>" placeholder="Nom du Pokémon" aria-label="Nom du Pokémon">
    <select name="type" aria-label="Type">
        <option value="">Tous les types</option>
        <?php foreach (TypeChart::types() as $t): ?>
            <option value="<?= h($t) ?>" <?= $t === $type ? 'selected' : '' ?>><?= h(TypeChart::libelle($t)) ?></option>
        <?php endforeach; ?>
    </select>
    <button type="submit">Chercher</button>
</form>

<p class="discret"><?= $total ?> Pokémon<?= $total > count($resultats) ? ', ' . count($resultats) . ' affichés' : '' ?>.</p>

<ul class="grille">
    <?php foreach ($resultats as $p): ?>
        <li class="carte">
            <span class="numero"><?= numero($p['id']) ?></span>
            <a class="nom" href="/pokemon/<?= (int) $p['id'] ?>"><?= h($p['nom']) ?></a>
            <span class="types"><?php foreach ($p['types'] as $badge) { require ROOT . '/templates/partials/type-badge.php'; } ?></span>
            <?php $idAjout = $p['id']; require ROOT . '/templates/partials/bouton-ajouter.php'; ?>
        </li>
    <?php endforeach; ?>
</ul>
