// 命令行参数解析与交互逻辑骨架 (ESM 版本, ESM-only inquirer 兼容)

import { Command } from 'commander';
import chalk from 'chalk';
import { getRegistryList, getSetRegistryCommand } from './registry.js';
import { t, LOCALES, detectLanguage } from './i18n.js';

/**
 * 解析命令行参数
 * return: {all, npm, yarn, pnpm, to, lang, list}
 */
function parseArguments() {
  const lang = detectLanguage();
  const isZh = lang === 'zh';
  const program = new Command();

  program
    .name('change-source')
    .description(
      isZh
        ? '支持 npm/yarn/pnpm 一键切换源（帮助自动中英文切换）。'
        : 'Easily switch registries for npm, yarn, and pnpm (auto zh/en help).'
    )
    .usage('[options]')
    .option('--all', isZh ? '切换所有包管理器源' : 'Switch all package manager registries')
    .option('--npm', isZh ? '仅切换 npm 源' : 'Switch npm registry')
    .option('--yarn', isZh ? '仅切换 yarn 源' : 'Switch yarn registry')
    .option('--pnpm', isZh ? '仅切换 pnpm 源' : 'Switch pnpm registry')
    .option('--to <registry>', isZh ? '目标源（官方/淘宝/CNPM 或自定义 URL）' : 'Target registry (official/taobao/cnpm/URL)')
    .option('--list', isZh ? '显示可用源列表' : 'List available registries')

    .option('--show', isZh ? '显示当前各包管理器的源' : 'Show current registries')
    .option('--lang <lang>', isZh ? '语言切换: en 或 zh（默认自动）' : 'Set interface language: en or zh (auto-detect by default)')
    .helpOption('-h, --help', isZh ? '显示帮助信息' : 'Show help')
    .addHelpText(
      'after',
      isZh
        ? `
示例用法（建议用 npx 直接体验）:
  $ npx change-source
  $ npx change-source --npm
  $ npx change-source --all --to taobao
  $ npx change-source --list
  $ npx change-source --show
  $ npx change-source --lang zh

说明:
  --all      切换全部（npm/yarn/pnpm）
  --to       可为源 key（official/taobao/cnpm）或完整 URL
  --show     一键显示所有包管理器当前源
  --lang     自动侦测，或手工指定（en/zh）

change-source 让你快速一键切换三大包管理器源，命令行中英文自动。
`
        : `
Examples (recommended npx usage):
  $ npx change-source
  $ npx change-source --npm
  $ npx change-source --all --to taobao
  $ npx change-source --list
  $ npx change-source --show
  $ npx change-source --lang en

Description:
  --all      Switch all (npm/yarn/pnpm)
  --to       Key (official/taobao/cnpm) or full URL for registry
  --show     Show all current registries
  --lang     Auto-detect or manually set (en/zh)

Change-source lets you quickly change registries for npm, yarn, pnpm. All commands auto describe in English or Chinese.
`
    )
    .parse(process.argv);

  return program.opts();
}

/**
 * 加载 inquirer（异步方式，支持 ESM）
 */
async function getInquirer() {
  const mod = await import('inquirer');
  // inquirer@9+ only has default export
  return mod.default || mod;
}

/**
 * 选择语言
 * @returns {Promise<string>} 返回选定语言
 */
async function chooseLanguage(forceLang) {
  if (forceLang && LOCALES.includes(forceLang)) return forceLang;
  if (process.env.NODE_LANG && LOCALES.includes(process.env.NODE_LANG)) return process.env.NODE_LANG;

  // 看环境变量能否推断，否则交互选择
  const detected = detectLanguage();
  if (detected) return detected;

  const inquirer = await getInquirer();
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'lang',
      message: t('selectLanguage', 'en'),
      choices: [
        { name: 'English', value: 'en' },
        { name: '中文', value: 'zh' },
      ],
    }
  ]);
  return answer.lang;
}

/**
 * 选择包管理器（npm/yarn/pnpm/all）
 */
async function chooseManagers(lang) {
  const inquirer = await getInquirer();
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'managers',
      message: t('selectManager', lang),
      choices: [
        { name: t('npm', lang), value: 'npm' },
        { name: t('yarn', lang), value: 'yarn' },
        { name: t('pnpm', lang), value: 'pnpm' },
        { name: t('all', lang), value: 'all' },
      ],
      validate: v => v.length > 0 || t('confirm', lang)
    }
  ]);
  // 如果勾选了 all，就只切 all
  if (answer.managers.includes('all')) return ['npm', 'yarn', 'pnpm'];
  return answer.managers;
}

/**
 * 选择源
 * @param {'npm'|'yarn'|'pnpm'} manager
 * @param {string} lang
 */
async function chooseRegistry(manager, lang) {
  const inquirer = await getInquirer();
  const registryList = getRegistryList(manager === 'all' ? 'npm' : manager, lang);
  const choices = [
    ...registryList.map(item => ({
      name: `${item.label} (${item.url})`,
      value: item.key,
    })),
    { name: t('manualInput', lang), value: 'manual' },
  ];

  // 动态确定 manager label
  let label = manager === 'all'
    ? (lang === 'zh' ? '全部' : 'All')
    : t(manager, lang);

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'registry',
      message: `${t('chooseTarget', lang)} (${label})`,
      choices,
    }
  ]);
  if (answer.registry === 'manual') {
    const manual = await inquirer.prompt([
      {
        type: 'input',
        name: 'custom',
        message: t('enterCustom', lang)
      }
    ]);
    return manual.custom;
  }
  return registryList.find(r => r.key === answer.registry).url;
}

/**
 * 显示源列表
 * @param {string} lang
 */
function showRegistryList(lang) {
  ['npm', 'yarn', 'pnpm'].forEach(manager => {
    const list = getRegistryList(manager, lang);
    console.log(chalk.bold(`${t('listRegistries', lang)} [${manager}]:`));
    list.forEach(item => {
      console.log(`  ${item.label.padEnd(10)}:  ${chalk.green(item.url)}`);
    });
  });
}

/**
 * 执行实际 registry 切换操作
 * @param {Array<'npm'|'yarn'|'pnpm'>} managers
 * @param {string} registry
 * @param {string} lang
 */
async function doSwitch(managers, registry, lang) {
  const { execSync } = await import('node:child_process');
  // 收集执行结果而非立即输出
  const results = [];
  managers.forEach(manager => {
    const cmd = getSetRegistryCommand(manager, registry);
    try {
      // execSync静默执行，丢弃其stdout
      execSync(cmd, { stdio: 'pipe' });
      results.push({ manager, ok: true });
    } catch (e) {
      // 失败时尝试输出stderr内容
      let detail = '';
      if (e.stderr) {
        detail = e.stderr.toString().trim();
      } else if (e.message) {
        detail = e.message;
      }
      results.push({ manager, ok: false, message: detail });
    }
  });
  // 统一输出成功/失败提示
  results.forEach(({ manager, ok, message }) => {
    if (ok) {
      console.log(chalk.blue(`[${manager}] ${t('success', lang)}`));
    } else {
      console.error(chalk.red(`[${manager}] ${t('errorOccurred', lang)} ${message}`));
    }
  });
}

/**
 * 显示当前 registry
 */
async function showCurrentRegistries(lang) {
  const { execSync } = await import('node:child_process');
  const managers = [
    { name: 'npm', cmd: 'npm config get registry' },
    { name: 'yarn', cmd: 'yarn config get registry' },
    { name: 'pnpm', cmd: 'pnpm config get registry' }
  ];
  console.log(
    lang === 'zh'
      ? '当前各包管理器源：'
      : 'Current registries:'
  );
  managers.forEach(({ name, cmd }) => {
    try {
      const result = execSync(cmd).toString().trim();
      console.log(`${name}: ${result}`);
    } catch {
      console.log(`${name}: not available`);
    }
  });
}

/**
 * CLI 主流程（供 index.js 调用）
 */
async function run() {
  const args = parseArguments();
  const lang = await chooseLanguage(args.lang);

  if (args.show) {
    await showCurrentRegistries(lang);
    return;
  }

  if (args.list) {
    showRegistryList(lang);
    return;
  }

  let managers = [];
  // 优先参数控制
  if (args.all) managers = ['npm', 'yarn', 'pnpm'];
  if (args.npm) managers.push('npm');
  if (args.yarn) managers.push('yarn');
  if (args.pnpm) managers.push('pnpm');
  if (managers.length === 0) {
    // 进入交互选择管理器
    managers = await chooseManagers(lang);
  } else {
    managers = [...new Set(managers)];
  }

  let targetRegistry = '';
  // --to 支持官方 key 或直接 url
  if (args.to) {
    // 检查是否是 key（如 taobao/official/cnpm)
    const tryKey = args.to.toLowerCase();
    const tryManager = managers.length === 1 ? managers[0] : 'npm';
    const regList = getRegistryList(tryManager, lang);
    const found = regList.find(r => r.key === tryKey);
    if (found) targetRegistry = found.url;
    else targetRegistry = args.to;
  } else {
    // 只要选择了多个且“全部”，只选择一次源并复用
    if (managers.length === 1) {
      targetRegistry = await chooseRegistry(managers[0], lang);
    } else {
      // 选择全部（npm/yarn/pnpm）时，无需再重复选择包管理器，直接让用户选择一次源（传'全/all'用于友好提示）
      targetRegistry = await chooseRegistry('all', lang);
    }
  }

  console.log(chalk.yellow(`${t('switching', lang)}`));
  await doSwitch(managers, targetRegistry, lang);
  // 把完成提示放在最后
  console.log('\n' + chalk.green(t('done', lang)));
}

export {
  run,
  parseArguments,
  chooseLanguage,
  chooseManagers,
  chooseRegistry,
  showRegistryList,
  doSwitch,
  showCurrentRegistries,
};
