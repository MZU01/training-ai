<?php

define('ROOT', dirname(__DIR__));
define('DATA_DIR', dirname(ROOT) . '/data');

require_once ROOT . '/src/env.php';
require_once ROOT . '/src/helpers.php';
require_once ROOT . '/src/PokemonRepository.php';
require_once ROOT . '/src/TypeChart.php';
require_once ROOT . '/src/Team.php';
require_once ROOT . '/src/TeamAnalyzer.php';
require_once ROOT . '/src/DiscordNotifier.php';

load_env(dirname(ROOT) . '/.env');

ini_set('display_errors', env('APP_ENV') === 'local' ? '1' : '0');
error_reporting(E_ALL);

session_name('coach_session');
session_start();
