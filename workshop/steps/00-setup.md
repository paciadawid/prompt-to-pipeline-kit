# Block 0: setup

**Goal:** the tools work, one tiny test is green, and your AI agent has seen the project.

1. **Get your own copy of the kit.** Open https://github.com/paciadawid/prompt-to-pipeline-kit, click **Use this template → Create a new repository** (private is fine). Then, in a terminal:
   ```bash
   git clone <the URL of YOUR new repository>
   cd <its folder>
   node -v        # 20.12 or newer
   ```
   No GitHub account? Use *Code → Download ZIP* for now; you need an account in block 6.
   On Windows, use **Git Bash** (or WSL) for every command today: PowerShell does not know `cp -R` or `rm -rf`.
2. `npm ci`, then `npm run preflight`.
3. `npx playwright test` shows `1 passed`. That is the smoke test: it proves the tools work, and it checks almost nothing. You replace it in block 4.
4. Open the folder in your IDE and start your AI agent (Copilot, Cursor, Cline, Claude Code, ...) in **agent mode**: it must be able to read and edit files in the project, not only chat.
   Ask: `Read AGENTS.md and workshop/rules.md and tell me in three lines what this repo is for and what you must never do. Change nothing.`
   Most agents read `AGENTS.md` on their own. If yours does not, start every new chat with `Read AGENTS.md first.`
5. Postman is installed and you are signed in (a free account is fine).
6. Skim `README.md` in the kit: it says where each block lives.

**What you should see:** preflight prints a `PASS` line for Node, dependencies, type check and "Toolshop reachable", one `TODO` line for your user (that comes in block 1, nothing to fix now), then `Pre-flight OK`. A `FAIL` line says what is missing.

**Done when:** preflight says OK, the smoke test is green, and the agent repeated the rules back correctly.

**Stuck?** Say so now: installs are a team sport. No Postman account? Use the browsable docs at https://api.practicesoftwaretesting.com/api/documentation and any REST client for block 1.
