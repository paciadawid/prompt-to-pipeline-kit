import type { ProductsApi } from '../api/products.api';
import type { Brand, Product } from './types';

/**
 * Product ids are ULIDs (long random ids) made fresh whenever the public shop resets its data, so never hard-code them.
 * Names are stable; look the product up by exact name on every run.
 */
export async function productNamed(products: ProductsApi, name: string): Promise<Product> {
  const res = await products.search(name);
  const product = res.body?.data?.find((p) => p.name === name);
  if (res.status !== 200 || !product) {
    throw new Error(`precondition: product "${name}" not found in the catalog (HTTP ${res.status})`);
  }
  return product;
}

/** Brands work the same way: GET /brands, then pick the exact name. */
export async function brandNamed(products: ProductsApi, name: string): Promise<Brand> {
  const res = await products.brands();
  const brand = Array.isArray(res.body) ? res.body.find((b) => b.name === name) : undefined;
  if (res.status !== 200 || !brand) {
    throw new Error(`precondition: brand "${name}" not found (HTTP ${res.status})`);
  }
  return brand;
}
