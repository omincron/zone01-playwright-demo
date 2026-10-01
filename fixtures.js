const base = require('@playwright/test');
const test = base.test.extend({
  todo: async ({ page }, use) => {
    await page.goto('./');
    const input = process.env.BROKEN_SELECTOR
      ? page.getByPlaceholder('INTENTIONALLY WRONG PLACEHOLDER')
      : page.getByPlaceholder('What needs to be done?');
    await use({
      input,
      items: page.getByTestId('todo-item'),
      add: async (text) => { await input.fill(text); await input.press('Enter'); }
    });
  }
});
module.exports = { test, expect: base.expect };
