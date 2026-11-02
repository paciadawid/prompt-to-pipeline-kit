# Escape room: a pipeline that will not go green

`api-tests.yml` in this folder is your workflow with a few things broken, the way real pipelines break. Your job: make it green again, **one cause at a time, one commit per fix**.

How:
1. `cp workshop/escape-room/api-tests.yml .github/workflows/api-tests.yml` (it replaces your working workflow), commit, push.
2. Open the failing run. Find the **first** real error: not the last line, not the loudest one.
3. Before you change anything, name the cause: *config* (the workflow file), *environment* (secrets, versions, network), *test* (your code) or *application* (the server). Use prompt 06 in `workshop/prompts.md`.
4. Prove the diagnosis on your laptop if you can (unset a variable, run the same command).
5. Make the smallest fix, push, read the next failure.

Green is not the end. Ask one more question: **when a test fails, does the report still arrive?** A pipeline that hides its evidence on a red run is broken too. Prove it: change one expected value in the search test so it fails, push, look for the report, then revert.

Rules of the room:
- Do not look at the answer key and do not diff against `workshop/pipeline.yml`: that is copying, not diagnosing.
- Remove secrets (and your e-mail) before you paste a log anywhere.
- Hiding the symptom (for example making a step `continue-on-error`) does not count.

When you are done: how many separate causes did you find, and which ones could ONLY have been found in CI?
