# Block 3: IDE handoff

**Goal:** hand what you learned to your AI agent through files, then stay in charge of the plan.

1. **Your user into the project.** Copy `.env.example` to `.env` and fill `TOOLSHOP_EMAIL` and `TOOLSHOP_PASSWORD` from your Postman environment. Type or copy them yourself: **never** paste them into an AI chat. `git status` must not list `.env`.
   (A spare user is cheap insurance: `npm run user:create` registers one with a new nick. Keep it for when yours gets locked.)
2. **Teach the agent what you found.** In `AGENTS.md`, under "Host facts", add **three to five** facts from `qa/gaps.md` that change how test code is written (a status the spec gets wrong, a bug to pin), one line each. `qa/gaps.md` stays the full table; `AGENTS.md` is the short list the agent reads every time. That is the handoff: the agent only knows what is written down.
3. **Plan before code.** Run **prompt 01** (`workshop/prompts.md`). The agent writes a test plan into `qa/test-plan.md`. It writes **no code**.
4. **Gate: you decide.** Cut the plan to six to eight rows. Every row must come from the spec or from a gap. Keep at least one login row and one row that pins a bug on purpose. Delete anything you cannot explain, and write what you cut under "Cut list" in the same file.

**Done when:** `.env` works (and nobody else has seen it), `AGENTS.md` has your facts, and `qa/test-plan.md` is a plan you would defend.

The next blocks build only part of the plan: AUTH-01, the favorites chain and two tests of your own choice. The rest is homework.

**Think:** which of your agent's proposals did you cut, and why?
