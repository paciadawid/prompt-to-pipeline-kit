// The first test everybody writes: it only proves the toolchain and the host work.
// It checks almost nothing. In block 5 you replace it with tests that can fail.
import { test, expect } from '../../src/fixtures';

test('smoke: the product search answers', async ({ guest }) => {
  const { status } = await guest.products.search('pliers');
  expect(status).toBe(200);
});
