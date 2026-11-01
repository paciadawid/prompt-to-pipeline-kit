# Block 5: chaining, and your own pick

**Goal:** tests that follow a chain (product → favorite → list → remove) and clean up after themselves, plus two tests you choose yourself.

**Part 1: the chain (20 min).** Run **prompt 04** (`workshop/prompts.md`). It builds the favorites client and a test of the whole chain. Then read the fixture: where does the cleanup run, and why is it not at the end of the test body?

**Part 2: hunt the hallucination (12 min).** Open `workshop/hallucination-hunt/README.md`. An AI wrote `flawed.spec.ts`. Find the flaws by reading it (do not run it). Compare with your neighbour.

**Part 3: your own pick (25 min).** Choose ONE area and cover it with the agent (**prompt 05**), using rules step 2:
- **A. Search and paging:** search finds what it should, no hits is an empty list, pages do not overlap.
- **B. Filters and sorting:** filtering by brand returns only that brand, sorting by price really sorts, an unknown brand id, a nonsense sort key (that is hunt H7: check what the server really does). Look brands up by name from `GET /brands`.
- **C. Favorites edge cases (the only pick that needs your login):** the same product twice, favorites without a token, a favorite that does not exist.

The agent proposes three tests; you build **two**. The third is homework.

**Done when:**
- the chain test and two tests from your pick are green;
- each one shows a precondition or a positive control;
- nothing is left behind. Check your favorites list in Postman: send the login request again first (the token from block 1 expired long ago), then `GET /favorites`.

Areas A and B only read, so for them the cleanup is "none". The rest of your test plan is homework.

**Stuck?** `workshop/checkpoints/05-chaining/` has the chain and one example for each area. Save your work, then `rm -rf src tests && cp -R workshop/checkpoints/05-chaining/. .` (see `workshop/checkpoints/README.md`).
