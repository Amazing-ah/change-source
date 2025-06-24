// 各包管理器的可选 registry 列表及切换命令封装 (ESM模块)

const REGISTRIES = {
  npm: {
    official: 'https://registry.npmjs.org/',
    taobao: 'https://registry.npmmirror.com/',
    cnpm: 'https://r.cnpmjs.org/',
  },
  yarn: {
    official: 'https://registry.yarnpkg.com/',
    taobao: 'https://registry.npmmirror.com/',
  },
  pnpm: {
    official: 'https://registry.npmjs.org/',
    taobao: 'https://registry.npmmirror.com/',
  },
};

const EN_REGISTRY_NAMES = {
  official: 'Official',
  taobao: 'Taobao',
  cnpm: 'CNPM',
};

const ZH_REGISTRY_NAMES = {
  official: '官方',
  taobao: '淘宝',
  cnpm: 'CNPM（中国）',
};

/**
 * 获取支持的 registry 选项
 * @param {"npm"|"yarn"|"pnpm"} manager
 * @param {"en"|"zh"} lang
 * @returns {Array<{ key: string, url: string, label: string }>}
 */
function getRegistryList(manager = 'npm', lang = 'en') {
  const names = lang === 'zh' ? ZH_REGISTRY_NAMES : EN_REGISTRY_NAMES;
  const registries = REGISTRIES[manager] || {};
  return Object.keys(registries).map(key => ({
    key,
    url: registries[key],
    label: names[key] || key,
  }));
}

/**
 * 获取切换 registry 的命令
 * @param {"npm"|"yarn"|"pnpm"} manager
 * @param {string} url
 * @returns {string}
 */
function getSetRegistryCommand(manager, url) {
  switch (manager) {
    case 'npm':
      return `npm config set registry ${url}`;
    case 'yarn':
      return `yarn config set registry ${url}`;
    case 'pnpm':
      return `pnpm config set registry ${url}`;
    default:
      throw new Error(`Unknown package manager: ${manager}`);
  }
}

export {
  REGISTRIES,
  getRegistryList,
  getSetRegistryCommand,
  EN_REGISTRY_NAMES,
  ZH_REGISTRY_NAMES,
};
