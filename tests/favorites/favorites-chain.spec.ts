import { test, expect } from '../../src/fixtures';
import { productNamed } from '../../src/domain/catalog';
import { asFavorites, sameId } from '../../src/domain/favorites';

// "Claw Hammer" also matches two longer product names, so the lookup has to pick the exact one.
const PRODUCT_NAME = 'Claw Hammer';

test('a favorite can be added, is listed, and is gone after removal', async ({ shopper }) => {
  const product = await productNamed(shopper.products, PRODUCT_NAME);

  // Precondition: the product is not a favorite yet. If it is, an earlier run crashed and left it behind.
  const before = await shopper.favorites.list();
  expect(before.status, 'GET /favorites before the test').toBe(200);
  const leftover = asFavorites(before.body).find((f) => sameId(f.product_id, product.id));
  expect(
    leftover,
    `precondition: "${PRODUCT_NAME}" is already a favorite (favorite id ${leftover?.id}). An earlier run crashed and left it behind. Remove it with DELETE /favorites/${leftover?.id} (Postman), then run again.`,
  ).toBeUndefined();

  // Add. The spec says 200 but the server answers 201 (qa/gaps.md, H2).
  const added = await shopper.favorites.add(product.id);
  expect(added.status, `POST /favorites for "${PRODUCT_NAME}"`).toBe(201);
  const created = added.body as { id: string | number; product_id: string | number };
  expect(sameId(created.product_id, product.id), 'the new favorite points at the product we sent').toBe(true);

  // Side effect: read the list again.
  const listed = await shopper.favorites.list();
  expect(listed.status, 'GET /favorites after the add').toBe(200);
  const found = asFavorites(listed.body).find((f) => sameId(f.id, created.id));
  expect(found, `the favorite ${created.id} is in GET /favorites after the add`).toBeDefined();
  expect(sameId(found!.product_id, product.id), 'the listed favorite points at the product we sent').toBe(true);

  // Remove, then prove it is gone from both views.
  const removed = await shopper.favorites.remove(String(created.id));
  expect(removed.status, `DELETE /favorites/${created.id}`).toBe(204);

  const fetched = await shopper.favorites.get(String(created.id));
  expect(fetched.status, `GET /favorites/${created.id} after the removal`).toBe(404);

  const after = await shopper.favorites.list();
  expect(after.status, 'GET /favorites after the removal').toBe(200);
  expect(
    asFavorites(after.body).some((f) => sameId(f.id, created.id)),
    `the favorite ${created.id} is no longer in GET /favorites`,
  ).toBe(false);
});
