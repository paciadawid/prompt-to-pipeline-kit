# Checkpoints

A working state to jump to when you are stuck or behind. They are a safety net, not the plan: try your own version first.

| Folder | What you get | Same as the end of |
|---|---|---|
| `04-auth/` | the layers, a users and a products client, the `guest` and `shopper` fixtures, AUTH-01 (`tests/auth/login.spec.ts`) and the still-weak search test (`tests/products/search.spec.ts`) | block 4 |
| `05-chaining/` | all of the above, plus the favorites client with cleanup in the fixture, the favorites chain, one example for each pick (A search and paging, B filters and sorting with two known issues, C favorites edge cases) and three more login tests | block 5 |

Both need your own user in `.env`.

## Use one
A checkpoint **replaces your whole `src/` and `tests/`**. Save yours first:

```bash
mkdir -p ../my-work && cp -R src tests ../my-work/   # keep your own version
rm -rf src tests                                      # the rm matters: your old files would no longer fit
cp -R workshop/checkpoints/04-auth/. .                # or 05-chaining
npm run verify && npm test
```

Your `.env`, `AGENTS.md` and `qa/` are not touched.

On Windows, run these in **Git Bash** or WSL, not in PowerShell or cmd.

The cart is not here: it is part of the challenge.
