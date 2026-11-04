import { test, expect } from '../../src/fixtures';
import type { Favorite } from '../../src/domain/types';

// The precondition (the product is not a favorite yet) is proven by the `favoritable` fixture, before this test starts.
test('a favorite can be added, is listed, and is gone after removal', async ({ shopper, favoritable: product }) => {
  let favorite!: Favorite;

  await test.step('add the product to favorites', async () => {
    const added = await shopper.favorites.add(product.id);
    expect(added.status, `POST /favorites for "${product.name}"`).toBe(201);
    favorite = added.body as Favorite;
    // The whole FavoriteResponse structure, with the product I sent.
    expect(favorite).toEqual({ id: expect.any(String), user_id: expect.any(String), product_id: product.id });
  });

  await test.step('the favorites LIST shows it', async () => {
    const list = await shopper.favorites.list();
    expect(list.status, 'GET /favorites after the add').toBe(200);
    const entry = (list.body as Favorite[]).find((f) => f.id === favorite.id);
    expect(entry?.product_id, 'the list has an entry with the new favorite id and the product I added').toBe(product.id);
  });

  await test.step('the SINGLE favorite shows it', async () => {
    const single = await shopper.favorites.get(favorite.id);
    expect(single.status, 'GET /favorites/:id while it exists').toBe(200);
    expect((single.body as Favorite).product_id, 'the single favorite is for the product I added').toBe(product.id);
  });

  await test.step('remove the favorite', async () => {
    const removed = await shopper.favorites.remove(favorite.id);
    expect(removed.status, 'DELETE /favorites/:id').toBe(204);
  });

  await test.step('the SINGLE favorite is gone', async () => {
    const single = await shopper.favorites.get(favorite.id);
    expect(single.status, 'GET /favorites/:id after the removal').toBe(404);
  });

  await test.step('the favorites LIST no longer has it', async () => {
    const list = await shopper.favorites.list();
    expect(list.status, 'GET /favorites after the removal').toBe(200);
    const stillThere = (list.body as Favorite[]).some((f) => f.id === favorite.id);
    expect(stillThere, 'the removed favorite is no longer in the list').toBe(false);
  });
});
