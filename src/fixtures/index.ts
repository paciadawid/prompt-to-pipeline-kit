import { test as base } from '@playwright/test';
import { FavoritesApi } from '../api/favorites.api';
import { ProductsApi } from '../api/products.api';
import { UsersApi } from '../api/users.api';
import { credentials } from '../config/env';
import { FAVORITE_PRODUCT, productNamed } from '../domain/catalog';
import type { Favorite, Product } from '../domain/types';

// One client per endpoint group; later blocks add more.
export type Toolshop = { products: ProductsApi; users: UsersApi; favorites: FavoritesApi };

// Removes exactly the favorites this test created, then re-reads the list to prove they are gone. Throws if anything failed.
async function removeAdded(favorites: FavoritesApi, ids: string[]) {
  const problems: string[] = [];
  for (const id of ids) {
    // 204 for a first delete, and also for a second one (the server is idempotent, qa/gaps.md H2.6).
    const { status } = await favorites.remove(id);
    if (status !== 204) problems.push(`DELETE /favorites/${id} answered ${status}, expected 204`);
  }
  const { status, body } = await favorites.list();
  if (status !== 200 || !Array.isArray(body)) problems.push(`GET /favorites answered ${status} after cleanup, expected 200 and a list`);
  else {
    const left = ids.filter((id) => (body as Favorite[]).some((f) => f.id === id));
    if (left.length) problems.push(`still in the list after cleanup: ${left.join(', ')}`);
  }
  if (problems.length) throw new Error(`cleanup: favorites this test created were not removed. ${problems.join('; ')}.`);
}

export const test = base.extend<{ account: ReturnType<typeof credentials>; guest: Toolshop; shopper: Toolshop; favoritable: Product }>({
  account: async ({}, use) => {
    await use(credentials());
  },

  // No token: every call goes out as an anonymous visitor.
  guest: async ({ request }, use) => {
    await use({ products: new ProductsApi(request), users: new UsersApi(request), favorites: new FavoritesApi(request) });
  },

  // My user, logged in again for every test, so the token is fresh. Never put the e-mail, password or token in a message.
  shopper: async ({ request, account }, use) => {
    const users = new UsersApi(request);
    const { status, body } = await users.login(account.email, account.password);
    if (status !== 200) {
      throw new Error(`precondition: login as the test user must answer 200, got ${status}. A 423 means the account is locked: stop, do not retry.`);
    }
    const token = (body as { access_token?: unknown } | undefined)?.access_token;
    if (typeof token !== 'string' || token === '') {
      throw new Error('precondition: the login reply must carry a non-empty access_token, and it did not.');
    }
    const added: string[] = [];
    const favorites = new FavoritesApi(request, token, (id) => added.push(id));
    await use({ products: new ProductsApi(request), users: users.withToken(token), favorites });
    // Runs even when the test failed.
    await removeAdded(favorites, added);
  },

  // A product that is NOT a favorite of mine yet: the precondition of the favorites tests, proven before the test body runs.
  // A leftover means an earlier run crashed; we never delete it silently.
  favoritable: async ({ shopper }, use) => {
    const product = await productNamed(shopper.products, FAVORITE_PRODUCT);
    const { status, body } = await shopper.favorites.list();
    if (status !== 200 || !Array.isArray(body)) {
      throw new Error(`precondition: GET /favorites must answer 200 and a list before the test starts, got ${status}.`);
    }
    const leftover = (body as Favorite[]).find((f) => f.product_id === product.id);
    if (leftover) {
      throw new Error(
        `precondition: "${FAVORITE_PRODUCT}" is already a favorite (id ${leftover.id}), so an earlier run left it behind. ` +
          `Remove it yourself (DELETE /favorites/${leftover.id} with your token, e.g. in Postman) and run again.`,
      );
    }
    await use(product);
  },
});

export { expect } from '@playwright/test';
