import type { ProductsApi } from '../api/products.api';

export type Product = { id: string; name: string };

// The paged body of GET /products/search (qa/gaps.md, A1). Only the fields the tests read.
export type SearchPage = { current_page: number; data: Product[]; last_page: number; per_page: number; total: number };

export function asSearchPage(body: unknown): SearchPage {
  const page = body as Partial<SearchPage> | null;
  if (!page || !Array.isArray(page.data) || typeof page.total !== 'number') {
    throw new Error('precondition: the search reply must be a paged body with a "data" list and a numeric "total".');
  }
  return page as SearchPage;
}

// Search returns every product whose name contains the term ("Claw Hammer" finds three), so pick the exact name.
// Ids change whenever the public shop resets its data: always look the product up, never hard-code the id.
export async function productNamed(products: ProductsApi, name: string): Promise<Product> {
  const { status, body } = await products.search(name);
  const hits = (body as { data?: Product[] } | null)?.data;
  if (status !== 200 || !Array.isArray(hits)) {
    throw new Error(`precondition: searching for the product "${name}" must answer 200 with a list, got ${status}.`);
  }
  const exact = hits.find((product) => product.name === name);
  if (!exact) {
    throw new Error(`precondition: no product is named exactly "${name}". The search found: ${hits.map((p) => p.name).join(', ') || 'nothing'}.`);
  }
  return exact;
}
