import { expect, it } from "vitest";
import {
  formatMultiplicateur,
  formatPoids,
  formatTaille,
  numero,
} from "./format";

it("complète le numéro sur quatre chiffres", () => {
  expect(numero(25)).toBe("#0025");
  expect(numero(1025)).toBe("#1025");
});

it("donne la taille en mètres et le poids en kilos, avec une virgule", () => {
  expect(formatTaille(4)).toBe("0,4 m");
  expect(formatTaille(17)).toBe("1,7 m");
  expect(formatTaille(1000)).toBe("100,0 m");
  expect(formatPoids(60)).toBe("6,0 kg");
  expect(formatPoids(9999)).toBe("999,9 kg");
  expect(formatPoids(12345)).toBe("1 234,5 kg");
});

it("écrit les multiplicateurs avec des fractions", () => {
  expect(formatMultiplicateur(4)).toBe("×4");
  expect(formatMultiplicateur(2)).toBe("×2");
  expect(formatMultiplicateur(0.5)).toBe("×½");
  expect(formatMultiplicateur(0.25)).toBe("×¼");
});
