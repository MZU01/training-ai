import type { Page } from "@playwright/test";

/** Ajoute des Pokémon à l'équipe par leur numéro, comme le bouton du Pokédex. */
export async function composerEquipe(page: Page, ids: number[]) {
  for (const id of ids) {
    const reponse = await page.request.post("/api/equipe", { data: { id } });
    if (reponse.status() !== 201)
      throw new Error(`Ajout de ${id} : ${await reponse.text()}`);
  }
}

/** Les pages PHP demandent confirmation avant de retirer : on accepte. */
export function accepterLesConfirmations(page: Page) {
  page.on("dialog", (dialogue) => dialogue.accept());
}
