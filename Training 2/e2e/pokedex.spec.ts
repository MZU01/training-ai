import { expect, test } from "@playwright/test";

test("affiche les Pokémon par défaut, sans les formes", async ({ page }) => {
  await page.goto("/pokedex");
  await expect(page.getByText("1025 Pokémon, 60 affichés.")).toBeVisible();
  await expect(page.locator(".carte").first()).toContainText("Bulbizarre");
});

test("trouve un Pokémon sans taper les accents", async ({ page }) => {
  await page.goto("/pokedex");
  await page.getByLabel("Nom du Pokémon").fill("evoli");
  await expect(page.locator(".carte")).toHaveCount(1);
  await expect(page.locator(".carte")).toContainText("Évoli");
});

test("filtre par type, premier ou second", async ({ page }) => {
  await page.goto("/pokedex");
  await page.getByLabel("Nom du Pokémon").fill("ectoplasma");
  await page.getByLabel("Type").selectOption("poison");
  await expect(page.locator(".carte")).toHaveCount(1);
});

test("ajoute un Pokémon à l’équipe", async ({ page }) => {
  await page.goto("/pokedex");
  await page.getByLabel("Nom du Pokémon").fill("pikachu");
  await page.getByRole("button", { name: "Ajouter à l'équipe" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Pikachu ajouté à l'équipe (1/6).",
  );

  await page.getByRole("link", { name: "Mon équipe" }).click();
  await expect(page.locator("[data-equipe] .carte")).toContainText(["Pikachu"]);
});

test("refuse un septième Pokémon", async ({ page }) => {
  await page.goto("/pokedex");
  for (const nom of [
    "bulbizarre",
    "salameche",
    "carapuce",
    "pikachu",
    "evoli",
    "ronflex",
    "mewtwo",
  ]) {
    await page.getByLabel("Nom du Pokémon").fill(nom);
    await Promise.all([
      page.waitForResponse("**/api/equipe"),
      page.locator(".carte").first().getByRole("button").click(),
    ]);
  }
  await expect(page.getByRole("status")).toHaveText(
    "Équipe complète : 6 Pokémon au maximum.",
  );
});
