// Reference after your own attempt. Copy into tests/additional.spec.js to run.
const { test, expect } = require('../fixtures');

test('deletes one todo and preserves another', async ({ todo }) => {
  await todo.add('Remove me');
  await todo.add('Keep me');
  const item = todo.items.filter({ hasText: 'Remove me' });
  await item.hover();
  await item.getByRole('button', { name: 'Delete' }).click();
  await expect(todo.items).toHaveText(['Keep me']);
});

test('filters active and completed todos', async ({ page, todo }) => {
  await todo.add('Completed item');
  await todo.add('Active item');
  await todo.items.filter({ hasText: 'Completed item' }).getByRole('checkbox').check();
  await page.getByRole('link', { name: 'Active', exact: true }).click();
  await expect(todo.items).toHaveText(['Active item']);
  await page.getByRole('link', { name: 'Completed', exact: true }).click();
  await expect(todo.items).toHaveText(['Completed item']);
  await page.getByRole('link', { name: 'All', exact: true }).click();
  await expect(todo.items).toHaveText(['Completed item', 'Active item']);
});

test('rejects a whitespace only todo', async ({ todo }) => {
  await todo.add('Existing item');
  await todo.add('   ');
  await expect(todo.items).toHaveText(['Existing item']);
});

test('persists text and completion after reload', async ({ page, todo }) => {
  await todo.add('Remember me');
  await todo.items.getByRole('checkbox').check();
  await page.reload();
  await expect(todo.items).toHaveText(['Remember me']);
  await expect(todo.items.getByRole('checkbox')).toBeChecked();
});
