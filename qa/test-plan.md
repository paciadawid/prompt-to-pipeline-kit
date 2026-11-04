# Test plan

Written in block 3 with your agent, approved by YOU before any test code exists. The agent proposes 8 to 10 rows; you cut the plan to 6 to 8.

One row is one test. **ID** is its name. **Behaviour** is one thing that must be true, in a sentence (for example: "after login, `/users/me` returns the same user"). **Source** is the proof: a spec path (`GET /users/me`) or a hunt ID from `qa/gaps.md` (`H2`).

| ID | Behaviour (one thing that must be true) | Source (spec path or hunt ID) |
|---|---|---|
| FAV-01 | Adding a product to favorites answers 201, and the reply carries the `product_id` I sent; the favorite is then in my list | `POST /favorites`, `GET /favorites`, `H2.2` |
| FAV-02 | A favorite in my list carries a `product` whose `id` is the `product_id` I added, and that product has no `brand` and no `category` | `GET /favorites`, `H2.1` |
| FAV-03 | Adding a product that is already my favorite answers 409 with `{"message": "Duplicate Entry"}` (no `slug` key), and my list still holds that product once | `POST /favorites`, `H2.4` |

## Cut list
What we deliberately do NOT test today, and why.

## Questions
Behaviours the agent was unsure about. Answer them with a request, or leave them out of the plan.

- **FAV-01, precondition:** my user may already have the product I pick as a favorite, and then `POST /favorites` would answer 409, not 201. Which product is safe? Proposal: look up a product by name through the product search, and check first that it is not in my list (rule 4). Nothing in the spec or `qa/gaps.md` says how many hits a name gives (H6), so which name do we use?
- **FAV-01, reply body:** the spec says the reply is `FavoriteResponse` (`id`, `user_id`, `product_id`), but `qa/gaps.md` has no row that proves what the 201 body really holds. May the test assert more than `product_id`? Needs one replayed `POST /favorites`.
- **FAV-02, what "clean" means:** `qa/gaps.md` (H2.1) only says the product has no `brand` and no `category`. It does not list which fields it does have. The plan asserts the absence of those two and the product `id` only. Do you want more fields pinned?
- **FAV-02, list or single:** H2.1 is about `GET /favorites`. H2.8 says the single `GET /favorites/:favoriteId` has no product. The plan uses the list only; I did not plan a test for H2.8.
- **FAV-03, side effect:** `GET /favorites` has no filter in the spec, so "my list holds that product once" means reading the whole list and filtering by `product_id`. Never counting "all" favorites is the rule, so the test counts only entries for its own product. Is that fine?
- **FAV-01 to FAV-03, cleanup:** the fixture removes each favorite it created with `DELETE /favorites/:favoriteId`. The spec says 204 for a delete, and H2.6 says the server answers 204 even for an id that is gone. So a 204 in teardown does not prove the favorite was removed. Should teardown also re-read the list and check the favorite is gone (rule 9)? I do not plan a test for H2.6 itself.
