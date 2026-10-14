<?php

function h($texte)
{
    return htmlspecialchars((string) $texte, ENT_QUOTES, 'UTF-8');
}

function redirect($url)
{
    header('Location: ' . $url);
    exit;
}

function render($template, array $vars = [])
{
    extract($vars);
    ob_start();
    require ROOT . '/templates/' . $template . '.php';
    $contenu = ob_get_clean();
    require ROOT . '/templates/layout.php';
}

function json_response($donnees, $statut = 200)
{
    http_response_code($statut);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE);
    exit;
}

function not_found()
{
    http_response_code(404);
    render('404', ['titre' => 'Page introuvable']);
    exit;
}

function flash($message = null, $genre = 'info')
{
    if ($message !== null) {
        $_SESSION['flash'] = ['message' => $message, 'genre' => $genre];
        return null;
    }
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $flash;
}

/** 2 → « ×2 », 0.5 → « ×½ », 0.25 → « ×¼ ». */
function format_multiplicateur($m)
{
    $fractions = ['0.5' => '½', '0.25' => '¼'];
    $cle = (string) $m;
    return '×' . ($fractions[$cle] ?? $cle);
}

/** PokéAPI donne la taille en décimètres. */
function format_taille($decimetres)
{
    return number_format($decimetres / 10, 1, ',', ' ') . ' m';
}

/** PokéAPI donne le poids en hectogrammes. */
function format_poids($hectogrammes)
{
    return number_format($hectogrammes / 10, 1, ',', ' ') . ' kg';
}

function numero($id)
{
    return '#' . str_pad($id, 4, '0', STR_PAD_LEFT);
}
