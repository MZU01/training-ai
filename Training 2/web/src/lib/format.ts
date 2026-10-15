/** 25 → « #0025 », comme dans les pages PHP. */
export function numero(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/** PokéAPI donne la taille en décimètres : 4 → « 0,4 m ». */
export function formatTaille(decimetres: number): string {
  return `${uneDecimale(decimetres / 10)} m`;
}

/** PokéAPI donne le poids en hectogrammes : 60 → « 6,0 kg ». */
export function formatPoids(hectogrammes: number): string {
  return `${uneDecimale(hectogrammes / 10)} kg`;
}

/** 2 → « ×2 », 0.5 → « ×½ », 0.25 → « ×¼ ». */
export function formatMultiplicateur(m: number): string {
  const fractions: Record<number, string> = { 0.5: "½", 0.25: "¼" };
  return `×${fractions[m] ?? m}`;
}

// Comme number_format() des pages PHP : une décimale, une virgule, une espace pour les milliers.
function uneDecimale(nombre: number): string {
  const [entier, decimale] = nombre.toFixed(1).split(".");
  return `${entier.replace(/\B(?=(\d{3})+$)/g, " ")},${decimale}`;
}
