<h1>Mon équipe</h1>

<?php if (!$membres): ?>
    <p>Votre équipe est vide. Ajoutez des Pokémon depuis le <a href="/pokedex">Pokédex</a>.</p>
<?php else: ?>
    <ul class="grille" data-equipe>
        <?php foreach ($membres as $p): ?>
            <li class="carte">
                <span class="numero"><?= numero($p['id']) ?></span>
                <a class="nom" href="/pokemon/<?= (int) $p['id'] ?>"><?= h($p['nom']) ?></a>
                <span class="types"><?php foreach ($p['types'] as $badge) { require ROOT . '/templates/partials/type-badge.php'; } ?></span>
                <form method="post" action="/equipe/retirer" class="inline" data-confirmer="Retirer <?= h($p['nom']) ?> de l'équipe ?">
                    <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
                    <button type="submit" class="secondaire">Retirer</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>

    <?php if ($pire): ?>
        <p class="alerte" data-pire-faiblesse>
            Pire faiblesse : <?php $badge = $pire['type']; require ROOT . '/templates/partials/type-badge.php'; ?>
            (<?= count($pire['faibles']) ?> membre<?= count($pire['faibles']) > 1 ? 's' : '' ?> sur <?= count($membres) ?>)
        </p>
    <?php endif; ?>

    <h2>Faiblesses de l'équipe</h2>
    <table class="analyse" data-analyse>
        <thead>
            <tr><th>Attaque</th><th>Faibles</th><th>Résistants</th><th>Immunisés</th></tr>
        </thead>
        <tbody>
            <?php foreach ($analyse as $ligne): ?>
                <tr data-type="<?= h($ligne['type']) ?>">
                    <th><?php $badge = $ligne['type']; require ROOT . '/templates/partials/type-badge.php'; ?></th>
                    <?php foreach (['faibles', 'resistants', 'immunises'] as $colonne): ?>
                        <td data-colonne="<?= $colonne ?>">
                            <?php foreach ($ligne[$colonne] as $entree): ?>
                                <span class="membre"><?= h($entree['pokemon']['nom']) ?> <?= format_multiplicateur($entree['multiplicateur']) ?></span>
                            <?php endforeach; ?>
                        </td>
                    <?php endforeach; ?>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <form method="post" action="/equipe/vider" data-confirmer="Vider toute l'équipe ?">
        <button type="submit" class="secondaire">Vider l'équipe</button>
    </form>
<?php endif; ?>
