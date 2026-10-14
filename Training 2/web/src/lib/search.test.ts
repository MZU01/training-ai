import { describe, expect, it } from "vitest";
import type { PokemonResume } from "../api/pokemon";
import { filtrerPokedex, normaliser } from "./search";

const evoli: PokemonResume = {
  id: 133,
  nom: "Évoli",
  name: "eevee",
  types: ["normal"],
  generation: 1,
};
const nymphali: PokemonResume = {
  id: 700,
  nom: "Nymphali",
  name: "sylveon",
  types: ["fairy"],
  generation: 6,
};
const ectoplasma: PokemonResume = {
  id: 94,
  nom: "Ectoplasma",
  name: "gengar",
  types: ["ghost", "poison"],
  generation: 1,
};
const pokedex = [evoli, nymphali, ectoplasma];

describe("normaliser", () => {
  it("retire les accents et les majuscules", () => {
    expect(normaliser("Évoli")).toBe("evoli");
  });

  it("unifie les apostrophes", () => {
    expect(normaliser("Raichu d’Alola")).toBe("raichu d'alola");
  });
});

describe("filtrerPokedex", () => {
  it("trouve un Pokémon sans les accents", () => {
    expect(filtrerPokedex(pokedex, { texte: "evoli" })).toEqual([evoli]);
  });

  it("cherche aussi dans le nom anglais", () => {
    expect(filtrerPokedex(pokedex, { texte: "gengar" })).toEqual([ectoplasma]);
  });

  it("garde un Pokémon dont le second type correspond", () => {
    expect(filtrerPokedex(pokedex, { type: "poison" })).toEqual([ectoplasma]);
  });

  it("combine le texte et le type", () => {
    expect(filtrerPokedex(pokedex, { texte: "nymph", type: "normal" })).toEqual(
      [],
    );
  });

  it("renvoie tout sans filtre", () => {
    expect(filtrerPokedex(pokedex, {})).toHaveLength(3);
  });
});
