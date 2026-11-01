# Block 2: gap analysis

**Goal:** find where the spec and the live server disagree, and write each difference down with proof.

A spec is a claim. A *gap* is a claim you disproved with a request. Work in pairs, send real requests from Postman, and **try four hunts**. Not every hunt finds a gap: three proven rows are enough. (Want filters and sorting in block 5? Take H7.)

| Hunt | Try this | Ask yourself |
|---|---|---|
| H1 | Log in with an e-mail that **does not exist** (any password) | Which status and body? Does the spec list that answer at all? Never try a wrong password for your own user: a few failures lock it (HTTP 423). |
| H2 | Add a product to favorites. Add the same one again. Then delete that favorite twice. | Which status does the spec promise for each call, and which do you get? |
| H3 | Send a request that fails validation (for example set a cart quantity to 0), once with the header `Accept: application/json` and once without | Does the answer change shape? Why would that matter for a test? |
| H4 | Log out, then use the same token on `/users/me`. Then refresh a token and use the OLD one | Is a token really dead after logout and after refresh? |
| H5 | Carts (no login needed): add 99 of a product, then 1 more. Set the quantity of a product that is not in the cart | Does the server keep its own limit? Does "success" mean something happened? |
| H6 | Search `Claw Hammer` | How many hits? What does that mean for a test that looks a product up by name? |
| H7 | `GET /brands`, then `GET /products?by_brand=<a real brand id>` and `by_brand=<an id that does not exist>`. Then `GET /products?sort=bogus,asc` | The spec lists 404 for the list: what does the unknown brand really get? What does a nonsense sort key do to the server? |

For each difference: one row in `qa/gaps.md` with the hunt ID, the request, what the spec says, what the server did, and a verdict: **docs wrong**, **undocumented** or **bug**.

**Then ask Postbot** to generate tests for one request you explored. Judge every generated check with rules 1 to 3 in `workshop/rules.md`: *keep*, *fix* or *delete*. Which would still pass if the endpoint were broken?

**Done when:** `qa/gaps.md` has at least three rows with real evidence, and you can name the Postbot check you would delete.

**Share:** one surprising row per pair, one sentence.
