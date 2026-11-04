import type { ProductsApi } from '../api/products.api';
import type { Product } from './types';

// The product the favorites tests use.
export const FAVORITE_PRODUCT = 'Thor Hammer';

// Product ids change whenever the public shop resets its data: find a product by its exact name, never by a saved id.
// Search can return several hits for one term (and the exact name may be one of many), so only the exact match counts.
export async function productNamed(products: ProductsApi, name: string): Promise<Product> {
  const { status, body } = await products.search(name);
  if (status !== 200) throw new Error(`product lookup: searching for "${name}" answered ${status}, expected 200.`);
  const hits = (body as { data?: Product[] } | undefined)?.data;
  if (!Array.isArray(hits)) throw new Error(`product lookup: the search reply for "${name}" has no "data" list.`);
  const match = hits.find((p) => p.name === name);
  if (!match) {
    throw new Error(`product lookup: no product is named exactly "${name}". The search returned: ${hits.map((p) => p.name).join(', ') || 'no hits'}.`);
  }
  return match;
}
