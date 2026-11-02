# Block 5: chaining, and your own pick

**Goal:** tests that follow a chain (product → favorite → list → remove) and clean up after themselves, plus a test you choose yourself.

**Part 1: the chain (20 min).** Read **prompt 04** (`workshop/prompts.md`) before you paste it: where are the precondition, the side effect and the cleanup? Then run it. It builds the favorites client and a test of the whole chain. Read the fixture: where does the cleanup run, and why is it not the last line of the test? (If an `expect` fails halfway, the test stops and that last line never runs. The fixture's teardown still does.)

**Part 2: hunt the hallucination (10 min).** Open `workshop/hallucination-hunt/README.md`. An AI wrote `flawed.spec.ts`. Find the flaws by reading it (do not run it). Compare with your neighbour.

**Part 3: your own pick (15 min).** Choose ONE area (the one you explored in block 2 is an easy start) and cover it with the agent (**prompt 05**), using rules steps 2 and 3:
- **A. Search and paging:** search finds what it should, no hits is an empty list, pages do not overlap.
- **B. Filters and sorting:** filtering by brand returns only that brand, sorting by price really sorts, an unknown brand id, a nonsense sort key (that is hunt H7: check what the server really does). Look brands up by name from `GET /brands`.
- **C. Favorites edge cases (needs your login):** the same product twice, favorites without a token, a favorite that does not exist.
- **D. Login and tokens (needs your login):** login is refused for an e-mail that does not exist (with a positive control: the real login still works), a token is dead after logout, the old token is dead after a refresh (hunts H1 and H4). Never send a wrong password for your own user.

Explored carts in block 2? Carts is the challenge in block 7, so pick A to D now: your cart rows are the input for the challenge.

The agent proposes three tests; you build **one**. Done early? Build a second. The rest is homework.

**Part 4: before coffee, start your pipeline (3 min).** Only when `npm test` is green; if it is not, skip this and do it in block 6. Started from the ZIP? Skip it too: block 6 shows you how.

First give GitHub your login. The pipeline has no `.env`: it reads your e-mail and password from **secrets** (values GitHub hides and hands to the run). On GitHub: your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add `TOOLSHOP_EMAIL` and `TOOLSHOP_PASSWORD`. Type them in the browser; do not paste them anywhere else. Without them the first run is red.
```bash
git status        # .env must not be listed
mkdir -p .github/workflows
cp workshop/pipeline.yml .github/workflows/api-tests.yml
git add . && git commit -m "Tests and pipeline"
git push
```
The push starts the run on GitHub; it finishes while you get coffee. It reads the two secrets you just added.

**Done when:**
- the chain test and one test from your pick are green;
- each one shows a precondition or a positive control;
- nothing is left behind. Check your favorites list in Postman: send the login request again first (the token from block 1 expired long ago), then `GET /favorites`;
- your pipeline is pushed (or you know why not yet).

Areas A and B only read, so for them the cleanup is "none". In D each test logs in itself and logs out at the end. The rest of your test plan is homework.

**Stuck?** `workshop/checkpoints/05-chaining/` has the chain and one example for each area (login tests are the D example). Save your work, then `rm -rf src tests && cp -R workshop/checkpoints/05-chaining/. .` (see `workshop/checkpoints/README.md`).
