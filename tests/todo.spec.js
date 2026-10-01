const { test, expect } = require('../fixtures');

test('adds a todo and clears the input', async ({ todo }) => {
  await todo.add('Prepare interview demo');
  await expect(todo.items).toHaveText(['Prepare interview demo']);
  await expect(todo.items.getByRole('checkbox')).not.toBeChecked();
  await expect(todo.input).toHaveValue('');
});

test('marks a todo as completed', async ({ todo }) => {
  await todo.add('Review assertions');
  await todo.items.getByRole('checkbox').check();
  await expect(todo.items.getByRole('checkbox')).toBeChecked();
  await expect(todo.items).toHaveClass(/completed/);
});

test('removes a todo', async ({ todo }) => {
  await todo.add('Remove me');
  await todo.add('Keep me');
  const item = todo.items.filter({hasText: 'Remove me'});
  await item.hover();
  await item.getByRole('button', {name : 'Delete' }).click();
  await expect(todo.items).toHaveText(['Keep me']);
});

test('filters completed and active todos', async ({ page, todo }) => {
  await todo.add('Completed item');
  await todo.add('Active item');
  const item = todo.items.filter({ hasText: 'Completed item' });
  await item.getByRole('checkbox').check();
  await expect(item.getByRole('checkbox')).toBeChecked();
  await page.getByRole('link', { name: 'Completed', exact: true }).click();
  await expect(todo.items).toHaveText(['Completed item']);
  await page.getByRole('link', { name: 'Active', exact: true }).click();
  await expect(todo.items).toHaveText(['Active item']);
  await page.getByRole('link', { name: 'All', exact: true }).click();
  await expect(todo.items).toHaveText(['Completed item', 'Active item']);
});

test('rejects a whitespace only todo', async ({ todo }) => {
  await todo.add('Existing item');
  await todo.add('   ');
  await expect(todo.items).toHaveText(['Existing item']);
});

test('keeps text and completion after reload', async ({ page, todo }) => {
  await todo.add('Remember me');
  await todo.items.getByRole('checkbox').check();
  await page.reload();
  await expect(todo.items).toHaveText(['Remember me']);
  await expect(todo.items.getByRole('checkbox')).toBeChecked();
});

