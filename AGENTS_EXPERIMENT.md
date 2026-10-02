# Planner + generator experiment (option B)

Optional, for later. Time-box: 20–30 minutes. If setup takes more than 10 minutes, stop.

Goal: let the planner explore the app and write a test plan, let the generator turn 1–2 scenarios into tests, then review the generated code the same way you reviewed the healer's patch.

## 0. Before you start

This file must be committed on `main`, otherwise `git clean` in the last step deletes it.

```sh
git status        # AGENTS_EXPERIMENT.md should not show as untracked
```

## 1. Work on a separate branch

```sh
git checkout -b try-agents
npx playwright init-agents --loop=claude
git status
```

Same generated files as the healer experiment: `.claude/agents/`, `.mcp.json`, `specs/`, `tests/seed.spec.ts`.

## 2. Make the agents start from our fixture

The planner (`planner_setup_page`) and generator (`generator_setup_page`) run the seed test first and continue from the page it leaves behind. The default seed is empty, so they start on a blank page.

Replace `tests/seed.spec.ts` with a seed that uses our `todo` fixture. The fixture already opens the app:

```js
// tests/seed.spec.ts
const { test } = require('../fixtures');

test('seed', async ({ todo }) => {
  // the todo fixture opens the TodoMVC app
});
```

Then teach the generator our conventions. Its definition says nothing about fixtures and records raw `page.*` actions, so add this section at the end of `.claude/agents/playwright-test-generator.md`:

```markdown
# Project conventions (override the example above)
- Write JavaScript (CommonJS), file extension `.spec.js`, saved in `tests/`
- Import with `const { test, expect } = require('../fixtures');`, never from `@playwright/test`
- Use the `todo` fixture instead of navigating yourself:
  - `todo.add(text)` adds a todo
  - `todo.items` is the list of todo items (`getByTestId('todo-item')`)
  - `todo.input` is the new-todo input
- Do not call `page.goto`; the fixture already opens the app
- Prefer `getByRole` / `getByTestId` locators; no `waitForTimeout`
```

⚠️ Running `init-agents` again overwrites these edits.

Restart Claude Code (exit, then `claude` in this folder) so it loads the agents and the MCP server.

## 3. Run the planner

In Claude Code:

> Use the Playwright planner agent to explore the TodoMVC app and save a test plan to specs/plan.md. Explain each step.

Compare `specs/plan.md` with `TEST_PLAN.md` (our 6 scenarios):

- [ ] Which of our 6 scenarios did it also find?
- [ ] What new ones did it suggest? (likely: edit by double-click, toggle all, Clear completed, "items left" counter)
- [ ] Are any of its expected results wrong? Check them by hand in the app. The planner can be wrong too.
- [ ] Which new scenarios are worth adding, and which would you skip on purpose? Why?

## 4. Run the generator for 1–2 scenarios

Pick one or two new scenarios from the plan, e.g. "Clear completed":

> Use the Playwright generator agent to generate the test for scenario "<name>" from specs/plan.md. Explain each step.

Then run it:

```sh
npx playwright test tests/<generated-file>
```

## 5. Review the generated test (most important part)

```sh
git status
cat tests/<generated-file>
```

Check:

- [ ] It imports from `../fixtures`, not `@playwright/test`
- [ ] It uses `todo.add` / `todo.items` instead of repeating locators and `page.goto`
- [ ] It's JavaScript like our tests (if it's `.ts`, did it ignore the conventions?)
- [ ] Locators are role/test-id based, no `.first()` or `nth()` without reason
- [ ] No `waitForTimeout` or other sleeps
- [ ] Assertions check the real outcome, not just "something is visible"
- [ ] The expected values match what you confirmed by hand in step 3
- [ ] Break it on purpose (change an expected value): does it fail? A test that can't fail tests nothing.

Also note: did the seed alone get it to use the fixture, or only the definition edit?

## 6. Optional: keep one test

If one scenario is worth keeping, write it into `tests/todo.spec.js` yourself, in our style, on `main` after cleanup. Don't commit the generated file as-is.

## 7. Clean up

```sh
git checkout -- .        # discard changes to tracked files
git checkout main
git branch -D try-agents
git clean -n             # preview: generated files only
git clean -fd
npx playwright test      # should be our 6 tests, all green
```

## 8. Write down what you saw

1–2 lines in the README under "Πού χρησιμοποίησα AI", for example:

- what the planner found that our plan didn't, and what you chose not to add
- whether the generated test followed our fixture and style, and what you had to change

## Interview version

> "I used the Playwright planner to check my coverage. It suggested scenarios I'd missed, and I verified its expected results by hand before trusting them. The generator wrote a working test; [what it did with our fixture and style]. I reviewed it like any other code before keeping anything."

Fill in the brackets with what actually happened. Don't quote it before you've done it.
