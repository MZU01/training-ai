<p class="discret"><a href="/pokedex">← Pokédex</a></p>

<h1><?= h($pokemon['nom']) ?> <span class="numero"><?= numero($pokemon['id']) ?></span></h1>

<p class="types"><?php foreach ($pokemon['types'] as $badge) { require ROOT . '/templates/partials/type-badge.php'; } ?></p>

<dl class="mesures">
    <dt>Taille</dt><dd data-mesure="taille"><?= format_taille($pokemon['taille']) ?></dd>
    <dt>Poids</dt><dd data-mesure="poids"><?= format_poids($pokemon['poids']) ?></dd>
    <dt>Génération</dt><dd><?= (int) $pokemon['generation'] ?></dd>
</dl>

<?php if ($dansEquipe): ?>
    <p class="discret">Ce Pokémon est dans votre équipe.</p>
<?php else: ?>
    <?php $idAjout = $pokemon['id']; require ROOT . '/templates/partials/bouton-ajouter.php'; ?>
<?php endif; ?>

<h2>Statistiques de base</h2>
<table class="stats">
    <?php
    $libellesStats = ['hp' => 'PV', 'attack' => 'Attaque', 'defense' => 'Défense',
        'special-attack' => 'Attaque spéciale', 'special-defense' => 'Défense spéciale', 'speed' => 'Vitesse'];
    foreach ($libellesStats as $cle => $libelle): $valeur = $pokemon['stats'][$cle] ?? 0; ?>
        <tr>
            <th><?= h($libelle) ?></th>
            <td class="valeur"><?= (int) $valeur ?></td>
            <td><span class="barre" style="width: <?= min(100, round($valeur / 2.55)) ?>%"></span></td>
        </tr>
    <?php endforeach; ?>
</table>

<h2>En défense</h2>
<table class="defense">
    <?php foreach ($defense as $ligne): ?>
        <tr class="<?= $ligne['multiplicateur'] > 1 ? 'faible' : 'resiste' ?>">
            <th><?php $badge = $ligne['type']; require ROOT . '/templates/partials/type-badge.php'; ?></th>
            <td><?= format_multiplicateur($ligne['multiplicateur']) ?></td>
        </tr>
    <?php endforeach; ?>
</table>

<?php if ($formes): ?>
    <h2>Autres formes</h2>
    <ul class="formes">
        <?php foreach ($formes as $forme): ?>
            <li><a href="/pokemon/<?= (int) $forme['id'] ?>"><?= h($forme['nom']) ?></a></li>
        <?php endforeach; ?>
    </ul>
<?php endif; ?>
