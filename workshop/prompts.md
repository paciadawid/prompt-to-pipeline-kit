# Prompts

Copy-paste prompts for your AI agent, one per block. They work in any agent that can read the repo and edit files (Copilot Chat, Cursor, Cline, Claude Code, ...).

- The prompt is a starting point. Read the answer, then **review it with `workshop/rules.md`** before you accept anything.
- Each prompt ends with a stopping rule. Keep it: agents do more than you asked unless told where to stop.
- If the agent invents an endpoint, a field or a status code, ask: *"Where in the spec, `qa/gaps.md` or a replayed request does that come from?"*
- Never paste `.env`, a password or a token into the chat.
- The agent may not edit `AGENTS.md` or `workshop/rules.md`. Those are yours; if it wants a change it should tell you.
- Never send a wrong password for your own user, not even once: a few failures lock the account (HTTP 423) for good. A "login is refused" test uses an e-mail that does not exist.

| Prompt | Block |
|---|---|
| [01 read and plan](#01-read-and-plan-block-3) | 3: plan before code |
| [02 layers](#02-from-smoke-test-to-layers-block-4) | 4: from smoke test to layers |
| [03 login and token](#03-login-and-token-block-4) | 4 |
| [04 chain with cleanup](#04-a-chain-with-cleanup-block-5) | 5 |
| [05 your own area](#05-your-own-area-block-5) | 5 |
| [06 failing pipeline](#06-failing-pipeline-block-6) | 6 |
| [07 new API](#07-new-api-first-steps-block-7) | 7 |
| [08 review](#08-ask-for-a-review-then-judge-it-block-8) | 8 |

---

## 01 read and plan (block 3)

```text
Read AGENTS.md, workshop/rules.md, qa/gaps.md and workshop/toolshop-openapi.3.1.json.
Do NOT write any code yet.

Fill in qa/test-plan.md. Keep its table columns. Replace the three example rows with 8 to 10 candidate tests (ID, one behaviour that must be true, in one plain sentence, and its source: a spec path or a hunt ID from qa/gaps.md). Use AUTH-01 for "a user logs in and the token identifies them", AUTH-02 for "login is refused for an e-mail that does not exist", FAV-01 for the favorites chain, and number the rest the same way (SEARCH-01, ...).
Cover: login and token use, favorites (add, list, remove), products search, and at least one row that pins a gap from qa/gaps.md as a known issue.
Every row must be traceable to the spec or to qa/gaps.md. If you are unsure about a behaviour, put it under the "Questions" heading of qa/test-plan.md instead of guessing. Leave "Cut list" for me. Do not edit any other file.
Stop after writing the plan and wait for me.
```

**Check:** can you find the source of every row? Delete the rows you cannot defend. This is the gate: the agent proposes, you decide.

---

## 02 from smoke test to layers (block 4)

```text
Follow the layout in AGENTS.md. Turn tests/smoke.spec.ts into the layered structure, without changing what it checks:
- src/config/env.ts exports credentials(): TOOLSHOP_EMAIL and TOOLSHOP_PASSWORD from environment variables only, failing loudly with a hint when missing, no defaults. The base URL stays in playwright.config.ts.
- src/api/reply.ts: a small helper that returns { status, body } and does not crash on an empty or non-JSON body.
- src/api/products.api.ts: a class with a search(q) method. It asserts nothing.
- src/fixtures/index.ts: export `type Toolshop = { products: ProductsApi }` (later blocks add more clients to this one object) and a `guest` fixture of that type, a client set without a token.
- Move the check from tests/smoke.spec.ts into tests/products/search.spec.ts, using the fixture; no raw URL in the spec. Delete tests/smoke.spec.ts. The check stays as weak as it is: block 5 strengthens it.
Run `npm run verify` and `npm test` and show me the real output.
Do not add features, tests or dependencies beyond this. Stop when both pass.
```

**Check:** is there still a raw URL in a spec? Does `src/api` contain any `expect`? (It must not.)

---

## 03 login and token (block 4)

```text
Implement AUTH-01 from qa/test-plan.md: a user logs in, gets a bearer token, and the token identifies them.
- src/api/users.api.ts: login(email, password), me(), logout(). The class takes an optional token in its constructor and has `withToken(token)` that returns a copy of the client with that token; protected endpoints send it as `Authorization: Bearer <token>`. No assertions in it.
- src/fixtures/index.ts: add `users: UsersApi` to the `Toolshop` type. Add an `account` fixture that returns credentials() from src/config, and a `shopper` fixture of type Toolshop that logs in as MY user for EACH test, so the token is fresh. If the login does not return 200, throw an error that starts with "precondition:" and says which precondition failed. Never print the password, the token or my e-mail.
- AUTH-01 lives in tests/auth/login.spec.ts and uses the `shopper` fixture: the fixture does the login, the test calls /users/me with that token. It asserts the business result (not just the status): /users/me returns the e-mail we logged in with. The expected value comes from our input (the `account` fixture), not from a reply. Compare the e-mails as true/false, so a failure does not print my e-mail. Name the test so a failure says which fact broke; the true/false e-mail comparison gets a message, because "expected true, received false" says nothing.
Run `npm run verify` and `npm test` and show me the real output (a type error does not fail `npm test`). Stop after AUTH-01.
```

**Check (rules step 1):** which assertion would still pass if `/users/me` returned someone else's data? (Hint: any check that only looks at the status or at the shape, or that compares with a value taken from a reply.) If you find one, fix it by hand.

---

## 04 a chain with cleanup (block 5)

```text
Implement the favorites chain from qa/test-plan.md: look up a product by its exact name, add it as a favorite, find it in the list, remove it, and prove it is gone.
- src/domain/catalog.ts: productNamed(products, name), where `products` is the ProductsApi client, looks a product up by exact name through search. Product ids change whenever the public shop resets its data, so never hard-code an id. Search can return several hits for one term: pick the exact match and throw a clear error when none is found.
- src/api/favorites.api.ts: list(), add(productId), remove(id), get(id). No assertions in it. Add `favorites: FavoritesApi` to the `Toolshop` type.
- The `shopper` fixture records the favorite ids that add() returns and removes exactly those in teardown (it runs even when the test fails). Check the status of each delete (204, or 404 when the test removed it already) and throw if one failed. Do not delete "all" favorites and do not compare list sizes: other tests share the user, so compare ids.
- The test needs: a precondition (the product is not a favorite before we start; if it is, an earlier crashed run left it behind: fail with a message that says so and how to remove it, do not delete it silently), the side effect after the add (read the list again), a check after the removal that the favorite is really gone (get returns not found AND the list no longer has it).
Use the spec and qa/gaps.md for the status codes; where they disagree, the server's real behaviour in qa/gaps.md wins (for example a second DELETE of the same favorite).
Run the tests, show me the real output, and tell me how you know nothing is left behind in my favorites. (After the run I will check the list myself in Postman.)
```

**Check (rules step 2):** is the precondition really checked, or only assumed? What would fail if the removal silently did nothing?

---

## 05 your own area (block 5)

Fill in the blank (your area), then paste.

```text
I chose area <A search and paging | B filters and sorting | C favorites edge cases> from workshop/steps/05-chaining.md.
Read qa/gaps.md and the relevant paths in workshop/toolshop-openapi.3.1.json first. If my area has no row in qa/gaps.md yet, tell me which request to replay before you write anything. Brands come from GET /brands, looked up by name: never hard-code an id.
Propose three tests for this area as a table (behaviour, which rule each one shows) and wait for my go-ahead. Then implement the one I pick, following AGENTS.md and workshop/rules.md steps 1 and 2:
- every "nothing happened" check has a positive control,
- every state change is read back after the call,
- each test creates and cleans up its own data (areas A and B only read: write "cleanup: none, read-only" instead),
- a failure says which business fact broke (a clear test title; a message only on true/false checks).
Run it and show me the real output. Then stop: I ask for a second test only if I have time.
```

**Check:** for your test, ask the agent: *"Show me how this test would fail if the endpoint were broken."* Then break the endpoint and see if it does.

---

## 06 failing pipeline (block 6)

Redact anything secret from the log before you paste it. A log can contain e-mails and headers.

```text
My GitHub Actions run failed. Here is the relevant part of the log:
<paste the failing step, not the whole log>

Do NOT fix anything yet. First answer:
1. Which step failed, and what is the first real error (not the last line)?
2. Classify the cause as exactly one of: config (the workflow file), environment (secrets, versions, network), test (our code), application (the server). Say why.
3. How would I prove your diagnosis before changing anything?
Wait for me.
```

Then, after you agree with the diagnosis:

```text
Make the smallest change that fixes this one cause. Explain the diff in two sentences. Do not touch anything else.
```

**Check:** did the agent pick the first error or the loudest one? Reproduce the cause locally when you can (`unset` a variable, run the same command).

---

## 07 new API, first steps (block 7)

```text
We are testing a new API: <name and base URL>. Read nothing but its public documentation at <docs URL> (for the Toolshop cart: the spec in workshop/toolshop-openapi.3.1.json; the cart needs no login).
Do not write tests yet. First:
1. List the endpoints that matter for <the feature I chose> and what each returns (only things you can show me from the docs or from a request).
2. Send the requests yourself (or give me curl commands to send) and report what the server REALLY does: statuses, bodies, anything the docs do not say.
3. Write what you learned into qa/<api>-gaps.md as a table (one file per API).
4. Propose six tests as a table: behaviour, the rule it shows, its source (docs section, spec path or the request you replayed), and how cleanup will work.
Stop and wait for me after step 4. Then I will say which test to write first.
```

---

## 08 ask for a review, then judge it (block 8)

```text
Review tests/ and src/ against AGENTS.md and workshop/rules.md. Do not change any file.
For each spec file list: raw URLs or parsing that leaked into the spec; assertions that check only a status; expected values copied from a reply; checks of absence with no positive control; shared state between tests.
Also list, for src/: logic inside src/api (a helper that changes what the caller sent); fixture teardown that never checks the result of its deletes; anything that prints an e-mail, password or token.
Quote the line for every finding and say which rule it breaks. If you find nothing for a category, say "none found" and do not invent a finding.
```

**Check:** open three of the findings. Is each one real? An AI review is a list of suspects, not a verdict.
