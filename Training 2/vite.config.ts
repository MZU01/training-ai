import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Les pages encore servies par PHP (legacy/). Vite les relaie au serveur PHP sur le port 8000.
// Quand une page est migrée vers React, sa route sort de cette liste.
const ROUTES_PHP = [
  "/pokemon",
  "/equipe",
  "/partage",
  "/api",
  "/legacy-assets",
];

const PHP = "http://127.0.0.1:8000";

export default defineConfig({
  root: "web",
  plugins: [react()],
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
