# Block 3: IDE handoff

**Goal:** hand what you learned to your AI agent through files, then stay in charge of the plan.

1. **Teach the agent what you found.** In `AGENTS.md`, under "Host facts", add **three to five** facts from `qa/gaps.md` that change how test code is written (a status the spec gets wrong, a bug to pin), one line each. For example, the gaps row `H2 | POST /favorites | spec 200 | server 201` becomes the line "`POST /favorites` answers 201 (the spec says 200)". `qa/gaps.md` stays the full table; `AGENTS.md` is the short list the agent reads every time. That is the handoff: the agent only knows what is written down, and a test written from a guess allows several answers.
2. **Plan before code.** Run **prompt 01** (`workshop/prompts.md`). The agent writes a test plan into `qa/test-plan.md`. It writes **no code**.
3. **Cut the plan: you decide.** Open `qa/test-plan.md`. The agent proposed 8 to 10 rows and some may be guesses. For each row ask: where does it come from (a spec path or a row in `qa/gaps.md`), and can I say it in one sentence? If not, delete the row. Keep the login row (AUTH-01), the favorites chain row (FAV-01) and at least one row that comes from your gaps: you build the first two next. End with six to eight rows, and write each deleted ID and a few words why under "Cut list" in the same file.
4. **Your user into the project.** Copy `.env.example` to `.env` and fill `TOOLSHOP_EMAIL` and `TOOLSHOP_PASSWORD` from your Postman environment. Type or copy them yourself: **never** paste them into an AI chat. `git status` must not list `.env`. Before the first `npm test`, log in once in Postman with the same e-mail and password. Every test logs in, so a typo in `.env` sends wrong passwords again and again and can lock your user.
   (A spare user is cheap insurance: `npm run user:create` registers one with a new name. Keep it for when yours gets locked.)

**Done when:** `AGENTS.md` has your facts, `qa/test-plan.md` is a plan you would defend, and `.env` works (and nobody else has seen it).

The next blocks build only part of the plan: AUTH-01, the favorites chain and one test of your own choice. The rest is homework.

**Think:** which of your agent's proposals did you cut, and why?
