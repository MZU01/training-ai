import { expect, test } from "@playwright/test";
import { composerEquipe } from "./helpers";

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

test("un chemin non numérique donne une page introuvable", async ({ page }) => {
  const reponse = await page.goto("/pokemon/abc");
  expect(reponse?.status()).toBe(404);
});

test("met le nom du Pokémon dans le titre de l’onglet", async ({ page }) => {
  await page.goto("/pokemon/25");
  await expect(page).toHaveTitle("Pikachu · Coach Pokémon");
});

test("affiche les six statistiques de base", async ({ page }) => {
  await page.goto("/pokemon/25");
  await expect(page.locator(".stats th")).toHaveText([
    "PV",
    "Attaque",
    "Défense",
    "Attaque spéciale",
    "Défense spéciale",
    "Vitesse",
  ]);
  await expect(page.locator(".stats .valeur")).toHaveText([
    "35",
    "55",
    "40",
    "50",
    "50",
    "90",
  ]);
});

test("ajoute le Pokémon à l’équipe depuis sa fiche", async ({ page }) => {
  await page.goto("/pokemon/25");
  await page.getByRole("button", { name: "Ajouter à l'équipe" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Pokémon ajouté à l'équipe.",
  );
  await expect(page.getByText("Ce Pokémon est dans votre équipe.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ajouter à l'équipe" }),
  ).toHaveCount(0);
});

test("un Pokémon déjà dans l’équipe n’a pas de bouton d’ajout", async ({
  page,
}) => {
  await composerEquipe(page, [25]);
  await page.goto("/pokemon/25");
  await expect(page.getByText("Ce Pokémon est dans votre équipe.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ajouter à l'équipe" }),
  ).toHaveCount(0);
});

test("refuse l’ajout quand l’équipe est complète", async ({ page }) => {
  await composerEquipe(page, [1, 4, 7, 10, 13, 16]);
  await page.goto("/pokemon/25");
  await page.getByRole("button", { name: "Ajouter à l'équipe" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Équipe complète : 6 Pokémon au maximum.",
  );
});

// Reprend la table des pages PHP telle quelle : table de 5e génération, sans le type Fée,
// et les immunités (×0) n'apparaissent pas (Ectoplasma est pourtant immunisé contre Normal et Combat).
test("calcule la défense d’un double type comme les pages PHP", async ({
  page,
}) => {
  await page.goto("/pokemon/94");
  await expect(page.locator(".defense tr")).toHaveText([
    "Sol×2",
    "Spectre×2",
    "Psy×2",
    "Ténèbres×2",
    "Combat×½",
    "Plante×½",
    "Poison×¼",
    "Insecte×¼",
  ]);
  await expect(page.locator(".defense tr.faible")).toHaveCount(4);
  await expect(page.locator(".defense tr.resiste")).toHaveCount(4);
});
