// Appels à l'API JSON du serveur PHP (legacy/src/pages/api.php), relayée par Vite.

export async function getJson<T>(url: string): Promise<T> {
  const reponse = await fetch(url, { headers: { Accept: "application/json" } });
  if (!reponse.ok) throw new Error(`${url} : ${reponse.status}`);
  return reponse.json() as Promise<T>;
}

export async function postJson<T>(
  url: string,
  corps: unknown,
): Promise<{ statut: number; donnees: T }> {
  const reponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(corps),
  });
  return { statut: reponse.status, donnees: (await reponse.json()) as T };
}
