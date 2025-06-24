import { run } from './cli.js';

(async () => {
  try {
    await run();
  } catch (err) {
    console.error('[change-source] Unexpected error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
