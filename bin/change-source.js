#!/usr/bin/env node

// bin/change-source.js - ESM 入口 (Node 18+ 支持 ESM)
// 通过动态 import 兼容 src/index.js 的 ESM 导出

import('../src/index.js').catch(e => {
  console.error('[change-source] Failed to start:', e && e.stack ? e.stack : e);
  process.exit(1);
});
