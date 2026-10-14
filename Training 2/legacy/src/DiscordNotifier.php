<?php

/**
 * Publie un message sur un salon Discord par webhook.
 * L'adresse du webhook, secrète, est dans .env (DISCORD_WEBHOOK_URL).
 * En local (APP_ENV=local), rien ne part : le message est écrit dans legacy/var/partages.log.
 */
class DiscordNotifier
{
    public static function envoyer($message)
    {
        if (env('APP_ENV') === 'local') {
            $ligne = date('c') . ' ' . str_replace("\n", ' | ', $message) . "\n";
            return file_put_contents(ROOT . '/var/partages.log', $ligne, FILE_APPEND) !== false;
        }

        $webhook = env('DISCORD_WEBHOOK_URL');
        if (!$webhook) {
            return false;
        }
        $contexte = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode(['content' => $message]),
            'timeout' => 5,
            'ignore_errors' => true,
        ]]);
        $reponse = @file_get_contents($webhook, false, $contexte);
        return $reponse !== false;
    }
}
