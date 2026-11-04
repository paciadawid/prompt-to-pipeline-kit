# Gaps: what the spec says vs what the server does

This is the source of truth for what the server really does. One row per difference you proved with a real request. Use the hunt ID from `workshop/steps/02-gaps.md` (H1 to H7), or a new ID for something you found yourself.

Verdict, one of three:
- **docs wrong**: the spec says something else.
- **undocumented**: the server does something the spec never mentions.
- **bug**: the server does something nobody wants.

| Hunt | Request you sent | Spec says | Server does | Verdict | Test idea |
|---|---|---|---|---|---|
| H2.1 critical | `GET /favorites` (logged in, with one favorite I added) | 200 example is a product object with `brand` and `category` fields (broken circular-reference placeholders) | 200 with a clean product object, no `brand` and no `category` | **docs wrong** | After adding a favorite, the listed item has the product fields and neither `brand` nor `category` |
| H2.2 critical | `POST /favorites` with a real `product_id` | 200 OK | 201 Created | **docs wrong** | `a favorite can be added` expects 201, not 200 |
| H2.4 medium | `POST /favorites` with a product that is already my favorite | 409 body is `{"slug": ["A brand already exists with this slug."]}` (copied from brands) | 409 with `{"message": "Duplicate Entry"}` | **docs wrong** | Adding the same product twice answers 409 with `message` `Duplicate Entry` and no `slug` key |
| H2.3 critical | `POST /favorites` with an invalid `product_id`, and with no `product_id` | 422 example has a null body | 422 with a message per field, e.g. `{"product_id": ["The selected product id is invalid."]}` or `{"product_id": ["The product id field is required."]}` | | Both bad requests answer 422 and the body names `product_id` with those messages |
| H2.5 medium | `GET /favorites` as a logged-in user with no favorites | 404 example | 200 with an empty array `[]`, never 404 | | The list answers 200 and an array (never 404); see the question below on asserting `[]` |
| H2.6 medium | `DELETE /favorites/:favoriteId` twice, and with an id that does not exist | 404 for an unknown id | 204 No Content every time: DELETE is idempotent, the 404 cannot be triggered | | Deleting my own favorite twice answers 204 both times, and the favorite is gone from the list |
| H2.7 low | `POST /favorites` with a `product_id` that does not exist | 404 example | 422 validation error, not 404 | | A non-existent `product_id` answers 422 (not 404) and nothing is added to the list |
| H2.8 low | `GET /favorites/:favoriteId` for a favorite I added, compared with `GET /favorites` | Example does not flag any difference between the two | The list embeds the full product per item; the single item returns only the flat `{id, user_id, product_id}` | | The single favorite has exactly `id`, `user_id`, `product_id`; the same favorite in the list also carries the product |
| | | | | | |

## Questions I could not answer
- H2.5: my user may already have favorites, and a test must never count or delete "all" favorites. How do we pin `[]` for a user with none? (a second user cannot be created from tests)
- H2.6: does deleting a favorite id that belongs to someone else also answer 204? (not tested: it would touch data that is not mine)
