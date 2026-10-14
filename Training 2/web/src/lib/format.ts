/** 25 → « #0025 », comme dans les pages PHP. */
export function numero(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}
