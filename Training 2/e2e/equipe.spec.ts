import { expect, test } from "@playwright/test";
import { accepterLesConfirmations, composerEquipe } from "./helpers";

const BULBIZARRE = 1;
const DRACAUFEU = 6;
const TORTANK = 9;

test("une équipe vide renvoie vers le Pokédex", async ({ page }) => {
  await page.goto("/equipe");
  await expect(page.getByText("Votre équipe est vide.")).toBeVisible();
});

test("liste les membres de l’équipe", async ({ page }) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  await expect(page.locator("[data-equipe] .carte .nom")).toHaveText([
    "Bulbizarre",
    "Dracaufeu",
  ]);
});

test("montre les faiblesses de chaque membre, avec le multiplicateur", async ({
  page,
}) => {
  await composerEquipe(page, [BULBIZARRE, DRACAUFEU]);
  await page.goto("/equipe");
  // Dracaufeu (Feu/Vol) prend ×4 contre la Roche.
  await expect(
    page.locator('tr[data-type="rock"] [data-colonne="faibles"]'),
  ).toHaveText("Dracaufeu ×4");
  // Bulbizarre (Plante/Poison) prend ×2 contre le Feu, Dracaufeu y résiste.
  await expect(
    page.locator('tr[data-type="fire"] [data-colonne="faibles"]'),
  ).toHaveText("Bulbizarre ×2");
  await expect(
    page.locator('tr[data-type="fire"] [data-colonne="resistants"]'),
  ).toHaveText("Dracaufeu ×½");
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
