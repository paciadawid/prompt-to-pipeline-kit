# Hunt the hallucination

`flawed.spec.ts` was written by an AI from a good-looking prompt. It compiles, and it looks like something you would merge. **It has more than ten flaws** that this workshop's rules would catch.

**Do not run it.** It prints a token, leaves a favorite on the host, and sends a wrong password for your own user, which is how you get locked out.

So find the flaws by reading (10 minutes):
1. **Alone.** Read it top to bottom. Mark each flaw with the rule number from `workshop/rules.md`, or with "invented", "leak" or "secret".
2. **With your neighbour.** Did you find the same ones?
3. **With your agent.** Ask: `Review workshop/hallucination-hunt/flawed.spec.ts against AGENTS.md and workshop/rules.md. Quote each flaw. Do not run it.` How many did it find? Did it invent any?

Takeaway: the flaws that hurt most are the ones that look like normal code.
