<header class="nav">
    <a class="logo" href="/pokedex">Coach Pokémon</a>
    <nav>
        <a href="/pokedex">Pokédex</a>
        <a href="/equipe">Mon équipe <span class="compteur" data-compteur-equipe><?= count(Team::ids()) ?>/<?= Team::TAILLE_MAX ?></span></a>
        <a href="/partage">Partager</a>
    </nav>
</header>
