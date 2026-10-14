import { expect, test, type Page } from "@playwright/test";
import { accepterLesConfirmations, composerEquipe } from "./helpers";

const BULBIZARRE = 1;
const DRACAUFEU = 6;
const TORTANK = 9;
const ECTOPLASMA = 94;

/** La case de la matrice des faiblesses pour un type d'attaque et un membre. */
function cellule(page: Page, attaque: string, membre: number) {
  return page.locator(`tr[data-type="${attaque}"] td[data-membre="${membre}"]`);
}

test("une équipe vide renvoie vers le Pokédex", async ({ page }) => {
  await page.goto("/equipe");
  await expect(page.getByText("Votre équipe est vide.")).toBeVisible();
});

test("liste les membres, le premier est chef d'équipe", async ({ page }) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  await expect(page.locator("[data-equipe] .carte .nom")).toHaveText([
    "Bulbizarre",
    "Dracaufeu",
  ]);
  await expect(page.locator("[data-equipe] .carte").first()).toContainText(
    "Chef d'équipe",
  );
});

test("met un membre en tête de l'équipe", async ({ page }) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  await page
    .locator(".carte", { hasText: "Dracaufeu" })
    .getByRole("button", { name: "Mettre en tête" })
    .click();
  await expect(page.locator("[data-equipe] .carte .nom")).toHaveText([
    "Dracaufeu",
    "Bulbizarre",
  ]);
});

test("renomme l'équipe", async ({ page }) => {
  await composerEquipe(page, [DRACAUFEU]);
  await page.goto("/equipe");
  await page.getByLabel("Nom de l'équipe").fill("Les Flammes");
  await page.getByRole("button", { name: "Renommer" }).click();
  await expect(page.locator("[data-nom-equipe]")).toHaveText("Les Flammes");
});

test("la matrice donne le multiplicateur de chaque membre", async ({
  page,
}) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  // Dracaufeu (Feu/Vol) prend ×4 contre la Roche ; Bulbizarre, des dégâts normaux.
  await expect(cellule(page, "rock", DRACAUFEU)).toHaveText("×4");
  await expect(cellule(page, "rock", BULBIZARRE)).toHaveText("");
  // Contre le Feu : Bulbizarre (Plante/Poison) prend ×2, Dracaufeu résiste.
  await expect(cellule(page, "fire", BULBIZARRE)).toHaveText("×2");
  await expect(cellule(page, "fire", DRACAUFEU)).toHaveText("×½");
  await expect(page.locator('tr[data-type="fire"] [data-bilan]')).toHaveText(
    "1 faible · 1 résiste",
  );
});

test("signale la pire faiblesse", async ({ page }) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU, TORTANK]);
  await page.goto("/equipe");
  // Électrik : Dracaufeu ×2 et Tortank ×2. Les autres types ne touchent qu'un membre.
  await expect(page.locator("[data-pire-faiblesse]")).toContainText("Électrik");
  await expect(page.locator("[data-pire-faiblesse]")).toContainText(
    "2 membres sur 3",
  );
});

test("signale les types partagés par plusieurs membres", async ({ page }) => {
  // Bulbizarre (Plante/Poison) et Ectoplasma (Spectre/Poison).
  await composerEquipe(page, [BULBIZARRE, ECTOPLASMA]);
  await page.goto("/equipe");
  await expect(page.locator('[data-type-en-double="poison"]')).toContainText(
    "2 Pokémon de type",
  );
  await expect(page.locator('[data-type-en-double="poison"]')).toContainText(
    "Bulbizarre, Ectoplasma",
  );
});

test("calcule le profil moyen de l'équipe", async ({ page }) => {
  // Vitesse : Bulbizarre 45, Dracaufeu 100 → 72,5, arrondi à 73.
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  await expect(
    page.locator('[data-profil] tr[data-stat="speed"] .valeur'),
  ).toHaveText("73");
});

test("copie l'équipe en texte", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await composerEquipe(page, [DRACAUFEU, BULBIZARRE]);
  await page.goto("/equipe");
  await page.getByRole("button", { name: "Copier l'équipe" }).click();
  await expect(page.locator("[data-copie-ok]")).toBeVisible();
  const texte = await page.evaluate(() => navigator.clipboard.readText());
  expect(texte).toBe(
    "Mon équipe\n1. Dracaufeu (Feu/Vol), chef d'équipe\n2. Bulbizarre (Plante/Poison)\n",
  );
});

test("retire un membre", async ({ page }) => {
  accepterLesConfirmations(page);
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  await page
    .locator(".carte", { hasText: "Bulbizarre" })
    .getByRole("button", { name: "Retirer" })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "Pokémon retiré de l'équipe.",
  );
  await expect(page.locator("[data-equipe] .carte .nom")).toHaveText([
    "Dracaufeu",
  ]);
});
