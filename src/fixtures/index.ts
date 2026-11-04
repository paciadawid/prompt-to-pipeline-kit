import { test as base, expect } from '@playwright/test';
import { FavoritesApi } from '../api/favorites.api';
import { ProductsApi } from '../api/products.api';
import { UsersApi } from '../api/users.api';
import { credentials } from '../config/env';

export type Toolshop = { products: ProductsApi; users: UsersApi; favorites: FavoritesApi };

export const test = base.extend<{ guest: Toolshop; account: ReturnType<typeof credentials>; shopper: Toolshop }>({
  // No token: the clients share the plain request context.
  guest: async ({ request }, use) => {
    await use({ products: new ProductsApi(request), users: new UsersApi(request), favorites: new FavoritesApi(request) });
  },

  account: async ({}, use) => {
    await use(credentials());
  },

  // My user, logged in again for EACH test, so the token is fresh.
  shopper: async ({ request, account }, use) => {
    const users = new UsersApi(request);
    const { status, body } = await users.login(account.email, account.password);
    if (status !== 200) {
      const locked = status === 423 ? ' The account is locked: stop and do not retry.' : '';
      throw new Error(`precondition: login as the shopper user must answer 200, got ${status}.${locked}`);
    }
    const token = (body as { access_token?: unknown } | null)?.access_token;
    if (typeof token !== 'string' || token === '') {
      throw new Error('precondition: the login reply for the shopper user must carry a non-empty access_token.');
    }

    // Every favorite this test creates; teardown removes exactly these and nothing else.
    const created: string[] = [];
    const favorites = new FavoritesApi(request, token, (id) => created.push(id));
    await use({ products: new ProductsApi(request), users: users.withToken(token), favorites });

    // Runs even when the test failed. 404 means the test already removed it.
    const failed: string[] = [];
    for (const id of created) {
      const { status: deleted } = await favorites.remove(id);
      if (deleted !== 204 && deleted !== 404) failed.push(`${id} (DELETE answered ${deleted})`);
    }
    if (failed.length > 0) {
      throw new Error(`cleanup: could not remove favorite(s) ${failed.join(', ')}. Remove them by hand with DELETE /favorites/<id>.`);
    }
  },
});

export { expect };
