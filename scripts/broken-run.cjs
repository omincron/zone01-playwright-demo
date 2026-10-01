// Cross-platform intentional failure. No source files are changed.
const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath,
  [require.resolve('@playwright/test/cli'), 'test', '--grep', 'adds a todo', '--timeout', '10000'],
  { stdio: 'inherit', env: { ...process.env, BROKEN_SELECTOR: '1' } });
process.exit(result.status ?? 1);
