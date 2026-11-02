# Block 8: architecture review

**Goal:** judge your own framework as a stranger would, and prove it can fail.

1. **Layer and rules check (5 min).** Open one spec. Is there a raw URL, a `fetch`, a parser or a magic id in it? Each one is a leak: it belongs a layer lower. Then tick `workshop/rules.md` against your best test, row by row. Which rule does it miss?
2. **Break it, twice (10 min).** Change one thing in `src/` (a path, a field name, a value you send, but never the login e-mail or password: a wrong password locks your user). Run **only the area you broke** (`npx playwright test tests/<area>`), not the whole suite. Did something go red? Put it back.
   - Red means the break was caught. Green means it survived: write the test that would notice it. Green because the server answers the same either way (for example `GET /products?q=` also searches)? Nothing really broke: try another break.
   - Make one of the two breaks **inside a fixture or helper** (a cleanup that does nothing, a helper that changes what the caller sent). Those survive most often.
   - A break nobody notices is a gap: write down the test that would have caught it.
   - A broken fixture can leave a favorite behind. If your next run stops at "not a favorite yet", log in again in Postman and remove it (`DELETE /favorites/<id>`).
3. **Ask for a review (5 min).** Run prompt 08, then judge it: open three findings. Are they real? Which of your breaks would the review **not** have found?
4. **Take home.** `AGENTS.md` and `workshop/rules.md` are the parts you reuse on Monday. Which three facts about YOUR own API would you write into an `AGENTS.md`?

**Done when:** every break turned something red, or you wrote down the test that would make it so.
