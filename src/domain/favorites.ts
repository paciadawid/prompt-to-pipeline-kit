export type Favorite = { id: string | number; product_id: string | number };

// The list body must be an array of favorites; anything else is a failed precondition, not an empty list.
export function asFavorites(body: unknown): Favorite[] {
  if (!Array.isArray(body)) throw new Error('precondition: GET /favorites must answer with a list.');
  return body as Favorite[];
}

// Ids can come back as numbers or strings: compare them as text.
export function sameId(a: string | number, b: string | number): boolean {
  return String(a) === String(b);
}
