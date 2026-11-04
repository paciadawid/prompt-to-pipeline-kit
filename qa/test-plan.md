# Test plan

Written in block 3 with your agent, approved by YOU before any test code exists. The agent proposes 8 to 10 rows; you cut the plan to 6 to 8.

One row is one test. **ID** is its name. **Behaviour** is one thing that must be true, in a sentence (for example: "after login, `/users/me` returns the same user"). **Source** is the proof: a spec path (`GET /users/me`) or a hunt ID from `qa/gaps.md` (`H2`).

| ID | Behaviour (one thing that must be true) | Source (spec path or hunt ID) |
|---|---|---|
| FAV-01 | Adding a product to favorites answers 201, and the reply has the whole `FavoriteResponse` structure (`id`, `user_id`, `product_id`) with the `product_id` I sent; the favorite is then in my list | `POST /favorites`, `GET /favorites`, `H2.2` |
| FAV-02 | A favorite in my list carries a `product` whose `id` is the `product_id` I added, and that product has no `brand` and no `category` | `GET /favorites`, `H2.1` |
| FAV-03 | Adding a product that is already my favorite answers 409 with `{"message": "Duplicate Entry"}` (no `slug` key), and my list still holds that product once | `POST /favorites`, `H2.4` |

## Cut list
What we deliberately do NOT test today, and why.

## Questions
Behaviours the agent was unsure about. Answer them with a request, or leave them out of the plan.

- **FAV-01, precondition (answered):** my user may already have the product I pick as a favorite, and then `POST /favorites` would answer 409, not 201. Decision: the test always proves first that the product is not in my favorites (rule 4), and it finds the product `id` by name (`GET /products/search?q=<name>`) and takes the `id` from the hit, never a hard-coded id. The product name is `Thor Hammer`. Still open: what the test does when that name gives more than one hit, or none. Nothing in the spec or `qa/gaps.md` says how many hits `Thor Hammer` gives (H6).
- **FAV-01, reply body (answered):** assert the whole response structure. The only source for it is the spec's `FavoriteResponse` (`id`, `user_id`, `product_id`); `qa/gaps.md` has no row that proves the 201 body. The first run is the proof: if the server's reply differs from the spec, that is a new gap for `qa/gaps.md`, not a reason to loosen the test. Still open: `user_id` cannot be computed from my input, so the test only checks that it is present.
- **FAV-02, what "clean" means (answered):** no more fields pinned. The test asserts the product `id` and the absence of `brand` and `category` only.
- **FAV-02, list or single (answered):** always the list (`GET /favorites`). No test for H2.8.
- **FAV-03, side effect (open):** `GET /favorites` has no filter in the spec, so "my list holds that product once" means reading the whole list and filtering by `product_id`. Never counting "all" favorites is the rule, so the test counts only entries for its own product. Is that fine?
- **FAV-01 to FAV-03, cleanup (answered):** the fixture removes each favorite it created with `DELETE /favorites/:favoriteId`, and teardown then re-reads the list and checks the favorite is gone (rule 9), because H2.6 says a delete answers 204 even for an id that is gone. No test for H2.6 itself.
