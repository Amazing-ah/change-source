change-source/README.md
# change-source

[English | 中文]

A simple and interactive CLI tool to quickly switch package manager registries (npm, yarn, pnpm), supporting both English and Chinese.  
一款简单交互式的包管理器源一键切换工具，支持 npm/yarn/pnpm，支持中英文界面。

---

## Features 特性

- One-click switch registry for npm, yarn, pnpm
- Interactive CLI, easy to use
- Built-in English and Chinese support (auto-detects system, or specify via flag)
- Supports common registries (official, Taobao, CNPM, etc) and custom registries
- Fast npx usage, or install globally

---

## Installation 安装

**Recommended 推荐用法（无需全局安装、使用最新版）：**

```shell
npx change-source
```

或

```shell
npx change-source@latest
```

**(Optionally) install globally 也可以全局安装**

```shell
npm install -g change-source
# Then use
change-source
```

---

## Usage 使用

### English

```shell
npx change-source            # Interactive registry switch for all (npm/yarn/pnpm)
npx change-source --npm      # Only switch npm registry
npx change-source --yarn     # Only switch yarn registry
npx change-source --pnpm     # Only switch pnpm registry

npx change-source --all --to taobao    # Switch all sources to Taobao registry
npx change-source --npm --to official  # Switch npm to official registry

npx change-source --list      # Show available registries
npx change-source --manual    # Manually input a custom registry URL

npx change-source --lang en   # Force interface language to English
npx change-source --lang zh   # 切换为中文界面

npx change-source --show      # Show current registries for all managers
```

### 中文

```shell
npx change-source            # 进入交互，一键切换全部源
npx change-source --npm      # 只切换 npm 源
npx change-source --yarn     # 只切换 yarn 源
npx change-source --pnpm     # 只切换 pnpm 源

npx change-source --all --to taobao    # 全部切换为淘宝源
npx change-source --npm --to official  # 只切 npm 源为官方源

npx change-source --list      # 列出可用源
npx change-source --manual    # 手动输入自定义源地址

npx change-source --lang zh   # 强制切换中文界面
npx change-source --lang en   # Switch to English interface

npx change-source --show      # 查看所有包管理器当前源地址
```

---

## Supported Registries 支持的默认源

- official 官方源
- taobao 淘宝镜像
- cnpm CNPM 镜像
- (Custom 任意自定义)

---

## FAQ

**Q: Is it safe to use? 会破坏我的配置吗？**  
A: This tool only runs official config set commands like `npm config set registry ...` and does NOT delete or corrupt your other settings. 本工具只会调用官方的 registry 配置命令，并不会破坏你的其他设置。

**Q: How does the language switch work? 语言如何切换？**  
A: The tool auto-detects your system with LANG/LC_ALL or you may use `--lang zh` or `--lang en` explicitly. 工具会自动检测环境变量，也可通过 --lang 参数强制指定。

---

## Contribution 贡献

Feel free to submit Pull Requests for more features or new registries.

欢迎 PR，共同完善功能与新的镜像源方案！

---

## License

MIT