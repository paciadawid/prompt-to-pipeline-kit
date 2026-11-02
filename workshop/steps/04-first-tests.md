# Block 4: your first real tests (login and token)

**Goal:** the layered framework exists, plus one test you can trust: log in, get a token, prove it identifies you.

Everyone builds this same login test, whatever area you picked in block 2: every area needs a logged-in user. Your own area comes in block 5.

Two words you will meet:
- A **fixture** is setup a test asks for by name (here: a logged-in client called `shopper`). It also tidies up after the test.
- The tidy-up part is the **teardown**. It runs after the test, even when the test failed.

1. **Layers.** Run **prompt 02** (`workshop/prompts.md`). The agent turns the smoke test into the layout from `AGENTS.md` (config, api, domain, fixtures, tests), moves it to `tests/products/search.spec.ts` and deletes `tests/smoke.spec.ts`. Run `npm test` and `npm run verify`. (Why search, whatever your area? It is the one test you already have, and every area needs the products client in block 5.)
2. **Login test.** Open `qa/test-plan.md` and find your login row (AUTH-01: "after login, `/users/me` returns the same user"). No login row, or you renamed it? Add or fix it now. Run **prompt 03**. The agent writes the users client, the `shopper` fixture (it logs in before each test) and the test for that row. The test uses `shopper`: the fixture does the login, the test checks what the token gives you.
3. **Review it with the checklist** (rules step 1):
   - Does it check the business result, not only the status?
   - Does the expected value come from your input?
   - Would a failure say which fact broke? (A clear test title is enough; a `true`/`false` check needs a message.)

   Fix the one thing you like least by hand, without the agent.
4. **Can it fail?** Break two things, one at a time, and put each one back:
   - Change `/users/login` in `src/api/users.api.ts` to `/users/log1n`. Run it: it goes red **in the fixture** (the message starts with `precondition`), not in AUTH-01's own checks. The test never started.
   - Stop sending the `Authorization` header in `me()`. Run it: now AUTH-01's own assertion goes red.

   Undo each change in your editor.
5. **Check:** `tests/smoke.spec.ts` is gone. `tests/products/search.spec.ts` still checks only a status: leave it, block 5 makes it stronger.

**Done when:** AUTH-01 is green, it goes red for both breaks, and the smoke test is gone.

**Stuck?** `workshop/checkpoints/04-auth/` holds the same state. It replaces your whole `src/` and `tests/`, so save yours first:
```bash
mkdir -p ../my-work && cp -R src tests ../my-work/
rm -rf src tests && cp -R workshop/checkpoints/04-auth/. .
npm run verify && npm test
```
