import { test, expect } from '../../src/fixtures';

// Moved here from tests/smoke.spec.ts by prompt 02, and still as weak as the smoke test: it checks only a status.
// Block 5 turns it into a real test.
test('the product search answers', async ({ guest }) => {
  const res = await guest.products.search('pliers');
  expect(res.status, 'search is open to guests').toBe(200);
});
