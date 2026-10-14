// Comportements des pages PHP (jQuery).
$(function () {
    // Demande confirmation avant de retirer un Pokémon ou de vider l'équipe.
    $('form[data-confirmer]').on('submit', function (e) {
        if (!window.confirm($(this).data('confirmer'))) {
            e.preventDefault();
        }
    });

    // Met en évidence les lignes de la matrice où au moins la moitié de l'équipe est faible.
    var taille = $('[data-equipe] > li').length;
    $('[data-analyse] tbody tr').each(function () {
        var faibles = $(this).find('.mult-2, .mult-4').length;
        if (taille > 0 && faibles >= taille / 2) {
            $(this).addClass('critique');
        }
    });

    // Copie l'équipe en texte, pour la coller dans un message.
    $('[data-copier]').on('click', function () {
        navigator.clipboard.writeText($('[data-export]').val()).then(function () {
            $('[data-copie-ok]').prop('hidden', false);
        });
    });
});
