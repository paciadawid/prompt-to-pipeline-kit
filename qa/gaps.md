# Gaps: what the spec says vs what the server does

This is the source of truth for what the server really does. One row per difference you proved with a real request. Use the hunt ID from `workshop/steps/02-gaps.md` (H1 to H7), or a new ID for something you found yourself.

Verdict, one of three:
- **docs wrong**: the spec says something else.
- **undocumented**: the server does something the spec never mentions.
- **bug**: the server does something nobody wants.

| Hunt | Request you sent | Spec says | Server does | Verdict | Test idea |
|---|---|---|---|---|---|
| H1 | `POST /users/login` with an e-mail that does not exist (never a wrong password for your own user: that locks it) | (fill in) | (fill in) | | |
| H2 | `POST /favorites` with `{ product_id }` of an existing product (my user, token from login), then removed the favorite | `200` (the only success status listed) | `201` | docs wrong | Assert 201 on the add, in the favorites chain (FAV-01) |
| A1 | `GET /products/search?q=pliers` (no token, `Accept: application/json`) | `200`, `404`, `405` listed; response schema not documented | `200` with a paged body: `current_page`, `data[]`, `from`, `last_page`, `per_page` (9), `to`, `total`. 4 hits: Combination Pliers, Pliers, Long Nose Pliers, Slip Joint Pliers. Each hit has `id`, `name`, `description`, `price`, `category`, `brand`, ... | undocumented | Search finds the pliers by name (positive control for the no-hits test); `total` equals the number of hits on a single page |
| A2 | `GET /products/search?q=zzzqqxx-no-such-tool` | `404` is listed; nothing says what a search with no hits returns | `200` with `data: []`, `total: 0`, `from: null`, `to: null`, `last_page: 1` (no 404) | docs wrong | No hits is `200` and an empty list; needs the A1 search as positive control |
| A3 | `GET /products/search?q=e&page=1`, `&page=2`, `&page=3` | `page` is an integer ("pagenumber"); page size not documented | `per_page` 9, `total` 49, `last_page` 6; every page has 9 hits, `from`/`to` run 1-9, 10-18, 19-27; no id appears on two pages | undocumented | Pages do not overlap; ids of page 1 and page 2 are disjoint |
| | | | | | |

## Questions I could not answer
- (what would you ask the API team?)

## Spec review: favorites (read from the spec, not yet replayed)
Found by reading the four favorites endpoints in `workshop/toolshop-openapi.3.1.json`. None of these is proven against the live server yet, so they are not rows in the table above. Replay each one, then move it up with a verdict.

| # | Type | Detail | To replay |
|---|---|---|---|
| 1 | Gap | `GET /favorites` has no pagination param (`?page=`), unlike `/users`, `/invoices` and `/products`. | Send `?page=2`: is it ignored or rejected? |
| 2 | Gap | The response schema of all 4 endpoints is undocumented: field names, types and nesting are unknown. | Record a real body for each call. |
| 3 | Gap | `product_id` is typed `string` in the POST body, but product IDs across the API are numeric integers. | Send it as a string and as an integer. |
| 4 | Inconsistency | The 409 example says "unique slug already taken", copied from brands/categories. Favorites have no slugs. | Add the same product twice. |
| 5 | Gap | The POST success response does not say 200 or 201. REST convention for creation is 201. | Proven: the server answers 201, see row H2. |
| 6 | Gap | No 403 is documented on GET/DELETE by ID. Unclear what happens when a user reaches another user's favorite. | Cannot be tested without a second user (see `AGENTS.md`: no new users). Ask the API team. |
| 7 | Inconsistency | DELETE lists 409 "entity used elsewhere" and 422, which GET does not. They look copied from product/brand deletes; a favorite being "used elsewhere" has no meaning. | Delete a favorite and look for any 409 or 422. |
| 8 | Gap | No idempotency guidance: a second DELETE on the same ID may return 404 or 200. | Delete the same favorite twice (hunt H2). |
