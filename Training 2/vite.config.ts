import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Les pages encore servies par PHP (legacy/). Vite les relaie au serveur PHP sur le port 8000.
// Quand une page est migrée vers React, sa route sort de cette liste.
const ROUTES_PHP = [
  "/equipe",
  "/partage",
  "/api",
  "/legacy-assets",
  "/sprites",
];

const PHP = "http://127.0.0.1:8000";

// Les pages React sont toutes servies par index.html, avec le statut 200.
// Pour la fiche d'un Pokémon inconnu, on garde le statut 404 des pages PHP :
// index.html est renvoyé avec ce statut, et React affiche « Page introuvable ».
function fichesIntrouvables(): Plugin {
  const pokemon: { id: number }[] = JSON.parse(
    readFileSync(new URL("data/pokemon.json", import.meta.url), "utf8"),
  );
  const ids = new Set(pokemon.map((p) => String(p.id)));
  return {
    name: "fiches-introuvables",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const chemin = new URL(req.url ?? "/", "http://localhost").pathname;
        if (!chemin.startsWith("/pokemon/")) return next();
        const id = /^\/pokemon\/(\d+)\/?$/.exec(chemin)?.[1];
        if (id && ids.has(String(Number(id)))) return next();
        const html = await server.transformIndexHtml(
          req.url ?? "/",
          readFileSync(new URL("web/index.html", import.meta.url), "utf8"),
        );
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
      });
    },
  };
}

export default defineConfig({
  root: "web",
  plugins: [react(), fichesIntrouvables()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    fs: { allow: [".."] },
    proxy: Object.fromEntries(
      ROUTES_PHP.map((route) => [route, { target: PHP }]),
    ),
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
