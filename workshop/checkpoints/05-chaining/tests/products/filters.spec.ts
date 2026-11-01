import { test, expect } from '../../src/fixtures';
import { brandNamed } from '../../src/domain/catalog';

// Area B. Read-only, so cleanup: none.
test.describe('product filters', () => {
  test('filtering by brand returns only products of that brand', async ({ guest }) => {
    const brand = await brandNamed(guest.products, 'ForgeFlex Tools');
    const res = await guest.products.filter({ by_brand: brand.id });
    expect(res.body.data.length, `precondition: ${brand.name} has products on page 1`).toBeGreaterThan(0);
    // Expected value comes from our input: the brand we asked for.
    for (const p of res.body.data) expect(p.brand.id, `${p.name} belongs to ${brand.name}`).toBe(brand.id);
  });

  test('the brand totals add up to the whole catalog', async ({ guest }) => {
    const brands = await guest.products.brands();
    expect(brands.body.length, 'precondition: the catalog has brands to filter by').toBeGreaterThan(1);

    let sum = 0;
    for (const brand of brands.body) sum += (await guest.products.filter({ by_brand: brand.id })).body.total;
    // Two independent views of one fact: per-brand totals and the unfiltered total.
    expect(sum, 'every product has exactly one brand, so the brand totals sum to the catalog total').toBe(
      (await guest.products.list(1)).body.total,
    );
  });

  test('sorting by price works in both directions', async ({ guest }) => {
    const asc = (await guest.products.filter({ sort: 'price,asc' })).body.data.map((p) => p.price);
    const desc = (await guest.products.filter({ sort: 'price,desc' })).body.data.map((p) => p.price);
    expect(asc.length, 'precondition: both pages have prices').toBeGreaterThan(1);
    expect(asc, 'ascending prices never go down').toEqual([...asc].sort((a, b) => a - b));
    expect(desc, 'descending prices never go up').toEqual([...desc].sort((a, b) => b - a));
    // Control: a sort that did nothing could also look "sorted" by luck on one page.
    expect(asc[0], 'the cheapest first page differs from the dearest first page').not.toBe(desc[0]);
  });

  test(
    'KNOWN ISSUE: an unknown brand id is an empty list with 200, although the spec lists 404',
    { tag: '@known-issue' },
    async ({ guest }) => {
      // Positive control: the same filter finds products for a real brand.
      const real = await brandNamed(guest.products, 'ForgeFlex Tools');
      const control = await guest.products.filter({ by_brand: real.id });
      expect(control.body.total, 'control: a real brand has products').toBeGreaterThan(0);

      const unknown = await guest.products.filter({ by_brand: 'NO-SUCH-BRAND' });
      // Pinned: if this starts answering 404, the spec and the server finally agree; flip the test.
      expect(unknown.status, 'unknown brand is answered with 200').toBe(200);
      expect(unknown.body.data, 'and with an empty list').toEqual([]);
    },
  );

  test(
    'KNOWN ISSUE: a nonsense sort key breaks the list with a 500 instead of a client error',
    { tag: '@known-issue' },
    async ({ guest }) => {
      const control = await guest.products.filter({ sort: 'price,asc' });
      expect(control.status, 'control: a real sort key works').toBe(200);

      const bogus = await guest.products.filter({ sort: 'bogus,asc' });
      // Pinned: a wrong sort key is the client's mistake and should be a 4xx. When this changes, the server was fixed.
      expect(bogus.status, 'a nonsense sort key is answered with 500 today').toBe(500);
    },
  );
});
