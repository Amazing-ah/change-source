// 简单中英文国际化实现及文案集中管理 (ESM模块)

const LOCALES = ['en', 'zh'];

const MESSAGES = {
  en: {
    welcome: 'Change package manager registries easily!',
    selectLanguage: 'Select language',
    selectManager: 'Which registries do you want to change?',
    selectRegistry: 'Select a registry',
    switching: 'Switching registries...',
    done: 'Registry has been switched!',
    currentRegistry: 'Current registry:',
    chooseTarget: 'Choose the target registry',
    all: 'All',
    npm: 'npm',
    yarn: 'yarn',
    pnpm: 'pnpm',
    confirm: 'Confirm',
    cancel: 'Cancel',
    manualInput: 'Manual input',
    enterCustom: 'Enter a custom registry URL',
    usage: 'Usage: npx change-source [options]',
    listRegistries: 'Available registries for',
    errorOccurred: 'An error occurred:',
    success: 'Success',
    languageSet: 'Language switched to English!',
    switchingAll: 'Switching all package managers to',
    selectAction: 'What do you want to do?',
  },
  zh: {
    welcome: '一键切换包管理器源！',
    selectLanguage: '选择语言',
    selectManager: '请选择要切换的包管理器',
    selectRegistry: '请选择一个镜像源',
    switching: '正在切换源...',
    done: '源已切换完成！',
    currentRegistry: '当前源地址：',
    chooseTarget: '选择目标源',
    all: '全部',
    npm: 'npm',
    yarn: 'yarn',
    pnpm: 'pnpm',
    confirm: '确认',
    cancel: '取消',
    manualInput: '手动输入',
    enterCustom: '请输入自定义源地址',
    usage: '使用方法：npx change-source [options]',
    listRegistries: '可用源列表：',
    errorOccurred: '发生错误：',
    success: '成功',
    languageSet: '语言已切换为中文！',
    switchingAll: '正在将所有包管理器源切换为：',
    selectAction: '请选择你的操作',
  }
};

/**
 * 检测当前终端或环境的首选语言
 * @returns {string} 'zh' or 'en'
 */
function detectLanguage() {
  const env = process.env;
  // NODE_LANG 环境变量优先，其次根据系统 locale
  if (env.NODE_LANG && LOCALES.includes(env.NODE_LANG)) {
    return env.NODE_LANG;
  }
  const locale = (env.LANG || env.LC_ALL || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  if (locale.startsWith('zh')) return 'zh';
  return 'en';
}

/**
 * 获取指定 key 的文案，带语言参数
 * @param {string} key
 * @param {string} lang
 * @returns {string}
 */
function t(key, lang = detectLanguage()) {
  return (MESSAGES[lang] && MESSAGES[lang][key]) || MESSAGES.en[key] || key;
}

export {
  t,
  detectLanguage,
  MESSAGES,
  LOCALES,
};
