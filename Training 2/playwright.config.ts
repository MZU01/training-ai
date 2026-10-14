import { defineConfig, devices } from "@playwright/test";

// Les tests e2e passent par http://localhost:5173, comme un utilisateur.
// Ils ne savent pas si une page est servie par PHP ou par React : c'est ce qui permet
// de vérifier qu'une page migrée se comporte comme l'ancienne.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/pokedex",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
