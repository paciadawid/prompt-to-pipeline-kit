# Test plan

Written in block 3 with your agent, approved by YOU before any test code exists. The agent proposes 8 to 10 rows; you cut the plan to 6 to 8.

One row is one test. **ID** is its name. **Behaviour** is one thing that must be true, in a sentence (for example: "after login, `/users/me` returns the same user"). **Source** is the proof: a spec path (`GET /users/me`) or a hunt ID from `qa/gaps.md` (`H2`).

Status words in a behaviour (refused, rejected, not found) are the spec's promise. Where the spec and the server may differ, the row says "replay first": the exact status goes into the test only after a real request has shown it (`qa/gaps.md`).

| ID | Behaviour (one thing that must be true) | Source (spec path or hunt ID) |
|---|---|---|
| AUTH-01 | After login with my real credentials the reply has a non-empty `access_token`, `token_type` Bearer and a positive `expires_in`, and that token makes `GET /users/me` answer with my user (the e-mail I logged in with). | `POST /users/login`, `GET /users/me` |
| AUTH-02 | Login with an e-mail that does not exist is refused (401) and returns no `access_token`; a login with my real credentials in the same test still works (positive control). Never a wrong password for my user. | H1, rule 6 |
| AUTH-03 | `GET /favorites` without a token is refused (401), while the same call with my token succeeds (positive control). | `GET /favorites` (401) |
| AUTH-04 | After `GET /users/logout`, the same token no longer works on `/users/me`. Replay first: H4 is not proven yet. | H4, `GET /users/logout` |
| FAV-01 | A favorite can be added, is listed, and is gone after removal: the list contains it by the id I got back, and no longer contains it after the delete. | `POST /favorites`, `GET /favorites`, `DELETE /favorites/{favoriteId}`, H2 |
| FAV-02 | A favorite I added can be fetched by its id, and the reply carries the `product_id` I sent and a `user_id` that matches my user. | `GET /favorites/{favoriteId}`, `FavoriteResponse` |
| FAV-03 | Adding the same product a second time is rejected (409 per the spec) and the list still holds that product once. Replay first. | `POST /favorites` (409), H2, gaps spec review #4 |
| FAV-04 | Deleting the same favorite twice: the first answers 204, the second answers what the server really does (spec: 404). If it differs from the spec, pin it as `@known-issue`. Replay first. | `DELETE /favorites/{favoriteId}`, H2, gaps spec review #8 |
| FAV-05 | Each entry in `GET /favorites` for a favorite I added embeds a `product` whose id equals the `product_id` I sent. | `GET /favorites` (`FavoriteWithProductResponse`) |
| FAV-06 | `POST /favorites` without a `product_id` is rejected (422) and my favorites list is unchanged afterwards (side-effect check). Replay first. | `POST /favorites` (422) |

## Cut list
What we deliberately do NOT test today, and why.

- (yours to fill in: each ID you delete, with a few words why)

Left out by the agent before proposing, because `AGENTS.md` forbids or cannot support it:
- Wrong password for my user: locks the account (423).
- Registering a user or changing a password: users cannot be deleted on this host.
- A favorite owned by another user (403/404 for someone else's id): needs a second user. Gaps spec review #6.
- Counting or deleting "all" favorites: tests touch only their own data.
- Carts, products, brands, search and filters: not the area picked in block 2. Products are only read, to get a `product_id`.

## Questions
Behaviours the agent was unsure about. Answer them with a request, or leave them out of the plan.

1. **Product id type.** The spec's `ProductResponse` example id is a ULID string (`01JFG8Q5...`), and `product_id` is a string in `FavoriteRequest`. Gaps spec review #3 says product ids are numeric integers. Which is it on the live server? It decides how the product lookup helper and the POST body are typed.
2. **Response schema.** The spec does define `FavoriteResponse` (`id`, `user_id`, `product_id`, all strings) and `FavoriteWithProductResponse`, so gaps spec review #2 ("undocumented") may be too strong. What is missing is the real values and types, not a schema. Replay to see which.
3. **POST status.** The spec lists only 200 for `POST /favorites`. FAV-01 does not pin 201 or 200 until a real POST shows it.
4. **Empty list.** The spec lists 404 for `GET /favorites`. Does a user with no favorites get 200 `[]` or 404? FAV-01 must not assume the list starts empty or non-empty: my user may already have favorites.
5. **Which product to favorite.** H6 says a name search can return several hits. Should the helper take the first product from `GET /products`, or look one up by name and take a specific hit? Either way the id comes from a request, never a hard-coded value.
6. **Logout.** Is the token dead after `GET /users/logout`? If it is not, AUTH-04 becomes a `@known-issue` pin instead.
