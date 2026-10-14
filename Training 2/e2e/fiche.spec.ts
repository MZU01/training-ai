import { expect, test } from "@playwright/test";

test("affiche la taille et le poids en mètres et en kilos", async ({
  page,
}) => {
  await page.goto("/pokemon/25");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Pikachu",
  );
  await expect(page.locator('[data-mesure="taille"]')).toHaveText("0,4 m");
  await expect(page.locator('[data-mesure="poids"]')).toHaveText("6,0 kg");
});

test("liste les autres formes de l’espèce", async ({ page }) => {
  await page.goto("/pokemon/26");
  await expect(page.locator(".formes")).toContainText("Raichu d’Alola");
});

test("montre les faiblesses en défense", async ({ page }) => {
  await page.goto("/pokemon/6");
  await expect(page.locator(".defense tr").first()).toContainText("Roche");
  await expect(page.locator(".defense tr").first()).toContainText("×4");
});

test("un numéro inconnu donne une page introuvable", async ({ page }) => {
  const reponse = await page.goto("/pokemon/99999");
  expect(reponse?.status()).toBe(404);
});
