# Healer experiment: watch the agent loop

Optional step from the preparation guide (Playwright Test Agents). If setup takes more than 10 minutes, stop and continue with the rest of the preparation.

Goal: watch the healer agent run its loop (run → debug → inspect the page → patch → run again) and review what it changes.

## 1. Work on a separate branch

```sh
git checkout -b try-healer
```

Nothing from this experiment goes into `main`, so CI stays clean.

## 2. Set up the agents

```sh
npx playwright init-agents --loop=claude    # with Copilot: --loop=vscode
git status
```

`git status` shows what was generated. Expect:

- agent definitions for planner, generator and healer
- an MCP config for the Playwright tools
- possibly a seed test

Read the healer's definition file. It contains the agent's instructions for the loop.

⚠️ If a seed test was created inside `tests/`, it will also run with `npm test`.

Restart Claude Code (exit, then run `claude` again in this folder) so it loads the new agents and the MCP server.

## 3. Break a test on purpose

In `tests/todo.spec.js`, in the `removes a todo` test, change:

```js
{ name : 'Delete' }   →   { name : 'Remove' }
```

Confirm it fails:

```sh
npx playwright test --grep "removes"
```

Expected: a timeout, because no button is called `Remove`.

## 4. Ask the healer to fix it

In Claude Code:

> Use the Playwright healer agent to fix the failing test "removes a todo". Explain each step.

Watch the loop:

1. runs the test and sees it fail
2. debugs and stops at the failing step
3. takes a snapshot of the page
4. finds that the button is called `Delete`
5. patches the test
6. runs it again until it passes

## 5. Review the patch (most important part)

```sh
git diff
```

Check:

- [X] It only changed the locator back to `Delete`
- [X] It did not add `.first()`
- [X] It did not add `waitForTimeout` or any other sleep
- [X] It did not add `test.fixme`, `test.skip` or remove the test
- [X] It did not change the expected value `['Keep me']`

## 6. Bonus: the dangerous case

First restore the delete test (`git checkout tests/todo.spec.js`). Then change the expected value to something wrong:

```js
await expect(todo.items).toHaveText(['Keep me!']);
```

Ask the healer again and watch how it decides:

- Does it change the expected value without asking?
- Does it explain why it thinks the test is wrong and not the app?

Here the test really is wrong, so changing the expected value is a valid fix. But in a real app, if the app had broken, the same move would hide the bug. A green test is not proof that the app is correct, so every patch that changes expected behaviour needs a human to confirm it.

## 7. Clean up

```sh
git checkout -- .            # discard the experiment's changes
git checkout main
git branch -D try-healer
```

If `init-agents` created new files, `git checkout -- .` won't remove them. Check `git status` on `main`. If any new files are left, delete them or run `git clean -n` (preview), then `git clean -f`.

## 8. Write down what you saw

Add 1–2 lines to the README under "Πού χρησιμοποίησα AI", for example:

- what the healer changed in the locator test, and whether the patch was minimal
- what it did with the wrong expected value, and why that needs human review

## Interview version

> "I tried the Playwright healer on a test I broke on purpose. It ran the test, debugged the failing step, inspected the page, found the real button name and patched the locator, then re-ran until green. Then I gave it a wrong expected value. It's useful for intentional UI changes, but it can also make a test pass by changing what the test expects. So I review every patch: did it fix a locator, or did it change the expected behaviour?"

Check the details for your version at https://playwright.dev/docs/test-agents before quoting them.

---

## Also still open from the preparation guide

1. `npm run report`: find the name, result and duration of each test
2. `npm run report:broken`: open the trace yourself, click `fill`, find the placeholder in the snapshot
3. Download the CI artifact and open `index.html`
4. README: run `npx playwright test --workers=1 --repeat-each=3` yourself (or delete that row), add the repo and CI links, then commit and push
5. Read: Anthropic *Building effective agents* ("What are agents", "Agents") and the Microsoft Learn intro to Playwright
6. Write two questions of your own for Danaos
7. Practise: the 6 questions from the guide, the 5-minute demo and the 90-second pitch in English
