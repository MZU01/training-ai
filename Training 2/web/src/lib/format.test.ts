import { expect, it } from "vitest";
import { numero } from "./format";

it("complète le numéro sur quatre chiffres", () => {
  expect(numero(25)).toBe("#0025");
  expect(numero(1025)).toBe("#1025");
});
