<form method="post" action="/equipe/ajouter" class="inline">
    <input type="hidden" name="id" value="<?= (int) $idAjout ?>">
    <input type="hidden" name="retour" value="<?= h($_SERVER['REQUEST_URI']) ?>">
    <button type="submit">Ajouter à l'équipe</button>
</form>
