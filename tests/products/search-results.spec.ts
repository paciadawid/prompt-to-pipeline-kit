import { test, expect } from '../../src/fixtures';
import { asSearchPage } from '../../src/domain/catalog';

// cleanup: none, read-only. Search only reads the catalog, so there is nothing to create or remove.
const TERM = 'pliers';
// The shop's own example product (qa/gaps.md, A1): proves the search finds a real product, not just "something".
const EXPECTED_PRODUCT = 'Combination Pliers';

test('searching for a word finds the product that has it in its name, and nothing without it', async ({ guest }) => {
  const { status, body } = await guest.products.search(TERM);
  expect(status, `GET /products/search?q=${TERM}`).toBe(200);
  const page = asSearchPage(body);
  const names = page.data.map((product) => product.name);

  // Precondition: the search returned hits at all, so "nothing without the word" below means something.
  expect(names.length, `the search for "${TERM}" returned hits`).toBeGreaterThan(0);
  expect(names).toContain(EXPECTED_PRODUCT);

  // Expected value comes from the input: every hit has the searched word in its name.
  const strangers = names.filter((name) => !name.toLowerCase().includes(TERM));
  expect(strangers, `hits whose name does not contain "${TERM}"`).toEqual([]);

  // Two views of one fact: the total the server reports and the hits we received (all fit on one page).
  expect(page.last_page, 'the "pliers" hits fit on a single page').toBe(1);
  expect(page.total, 'total matches the number of hits on the page').toBe(names.length);
});
