<h1 data-nom-equipe><?= h($nom) ?></h1>

<?php if (!$membres): ?>
    <p>Votre équipe est vide. Ajoutez des Pokémon depuis le <a href="/pokedex">Pokédex</a>.</p>
<?php else: ?>
    <form method="post" action="/equipe/renommer" class="filtres">
        <input type="text" name="nom" value="<?= h($nom) ?>" maxlength="40" aria-label="Nom de l'équipe">
        <button type="submit" class="secondaire">Renommer</button>
    </form>

    <ul class="grille" data-equipe>
        <?php foreach ($membres as $i => $p): ?>
            <li class="carte<?= $i === 0 ? ' chef' : '' ?>">
                <?php if ($i === 0): ?><span class="etiquette">Chef d'équipe</span><?php endif; ?>
                <?= sprite($p['id']) ?>
                <span class="numero"><?= numero($p['id']) ?></span>
                <a class="nom" href="/pokemon/<?= (int) $p['id'] ?>"><?= h($p['nom']) ?></a>
                <span class="types"><?php foreach ($p['types'] as $badge) { require ROOT . '/templates/partials/type-badge.php'; } ?></span>
                <span class="actions">
                    <?php if ($i > 0): ?>
                        <form method="post" action="/equipe/en-tete" class="inline">
                            <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
                            <button type="submit" class="secondaire">Mettre en tête</button>
                        </form>
                    <?php endif; ?>
                    <form method="post" action="/equipe/retirer" class="inline" data-confirmer="Retirer <?= h($p['nom']) ?> de l'équipe ?">
                        <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
                        <button type="submit" class="secondaire">Retirer</button>
                    </form>
                </span>
            </li>
        <?php endforeach; ?>
    </ul>

    <?php if ($pire): ?>
        <p class="alerte" data-pire-faiblesse>
            Pire faiblesse : <?php $badge = $pire['type']; require ROOT . '/templates/partials/type-badge.php'; ?>
            (<?= count($pire['faibles']) ?> membre<?= count($pire['faibles']) > 1 ? 's' : '' ?> sur <?= count($membres) ?>)
        </p>
    <?php endif; ?>
    <?php foreach ($enDouble as $type => $noms): ?>
        <p class="alerte" data-type-en-double="<?= h($type) ?>">
            <?= count($noms) ?> Pokémon de type <?php $badge = $type; require ROOT . '/templates/partials/type-badge.php'; ?>
            (<?= h(implode(', ', $noms)) ?>) : ils partagent les mêmes faiblesses.
        </p>
    <?php endforeach; ?>

    <h2>Profil de l'équipe</h2>
    <p class="discret">Moyenne des statistiques de base des membres.</p>
    <table class="stats" data-profil>
        <?php foreach ($profil as $cle => $stat): ?>
            <tr data-stat="<?= h($cle) ?>">
                <th><?= h($stat['libelle']) ?></th>
                <td class="valeur"><?= $stat['moyenne'] ?></td>
                <td><span class="barre" style="width: <?= min(100, round($stat['moyenne'] / 2.55)) ?>%"></span></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <h2>Faiblesses de l'équipe</h2>
    <p class="legende">
        Dégâts reçus par chaque membre, selon le type de l'attaque :
        <span class="mult mult-4">×4</span> <span class="mult mult-2">×2</span> faible ·
        <span class="mult mult-05">×½</span> <span class="mult mult-025">×¼</span> résiste ·
        <span class="mult mult-0">×0</span> immunisé · case vide : dégâts normaux.
    </p>
    <table class="matrice" data-analyse>
        <thead>
            <tr>
                <th>Attaque</th>
                <?php foreach ($membres as $p): ?>
                    <th class="membre-col"><?= sprite($p['id'], 48) ?><span><?= h($p['nom']) ?></span></th>
                <?php endforeach; ?>
                <th>Bilan</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($analyse as $ligne):
                $faibles = count($ligne['faibles']);
                $resistent = count($ligne['resistants']) + count($ligne['immunises']);
                ?>
                <tr data-type="<?= h($ligne['type']) ?>">
                    <th><?php $badge = $ligne['type']; require ROOT . '/templates/partials/type-badge.php'; ?></th>
                    <?php foreach ($ligne['cellules'] as $cellule): $m = $cellule['multiplicateur']; ?>
                        <td data-membre="<?= (int) $cellule['pokemon']['id'] ?>">
                            <?php if ($m != 1): ?>
                                <span class="mult mult-<?= str_replace('.', '', (string) $m) ?>"><?= format_multiplicateur($m) ?></span>
                            <?php endif; ?>
                        </td>
                    <?php endforeach; ?>
                    <td data-bilan class="bilan <?= $faibles > $resistent ? 'negatif' : ($resistent > $faibles ? 'positif' : '') ?>">
                        <?php if ($faibles): ?><?= $faibles ?> faible<?= $faibles > 1 ? 's' : '' ?><?php endif; ?>
                        <?php if ($faibles && $resistent): ?> · <?php endif; ?>
                        <?php if ($resistent): ?><?= $resistent ?> résiste<?= $resistent > 1 ? 'nt' : '' ?><?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <textarea data-export hidden><?= h($export) ?></textarea>
    <p class="actions">
        <button type="button" data-copier>Copier l'équipe</button>
        <span class="discret" data-copie-ok hidden>Équipe copiée.</span>
    </p>

    <form method="post" action="/equipe/vider" data-confirmer="Vider toute l'équipe ?">
        <button type="submit" class="secondaire">Vider l'équipe</button>
    </form>
<?php endif; ?>
