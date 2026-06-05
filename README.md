# RegexAI · AI 正则表达式生成器

用自然语言描述需求，AI 帮你生成正则表达式，并在浏览器里实时高亮测试、逐段解释、一键导出多语言代码。

> 纯前端应用，零后端。API Key 仅保存在你的浏览器本地，不会上传到任何服务器。

## 功能特性

- **自然语言生成正则**：输入"匹配中国手机号"，AI 流式生成正则，逐 token 写入编辑框。
- **实时高亮测试**：编辑正则或测试文本时，命中片段即时高亮，相邻匹配用不同颜色区分。
- **匹配 / 捕获组详情**：列出每个匹配的位置区间、分组（含命名捕获组）内容。
- **Flag 可视化开关**：`g i m s u y` 一键切换，悬停查看说明。
- **AI 解释**：把当前正则翻译成人类可读的逐段拆解，并给出匹配/不匹配示例。
- **多语言导出**：一键生成 JavaScript / Python / Java 可用代码片段并复制。
- **常用示例预设**：手机号、邮箱、URL、日期、IPv4、十六进制颜色、中文、身份证等。
- **健壮的边界处理**：非法正则提示、零宽匹配防死循环、AI 报错与中断、空状态。

## 技术栈

| 方面 | 选型 |
| --- | --- |
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS（暗色模式、响应式） |
| AI | 浏览器直连 OpenAI 兼容接口（默认 DeepSeek），SSE 流式输出 |
| 部署 | 纯静态，可直接上 Vercel / GitHub Pages |

## 实现亮点

- **流式解析**：`src/lib/aiClient.ts` 用 `fetch` + `ReadableStream` 手写 SSE 解析，逐 token 回调，支持 `AbortController` 中断。
- **高亮渲染**：`src/lib/regexEngine.ts` 把文本按匹配区间切成片段，配合 `TestArea` 的「透明文本框 + 背景高亮层 + 滚动同步」方案，不使用 `innerHTML` 注入，安全且高性能。
- **抽象解耦**：AI 调用统一收敛在 `aiClient`，若日后改为自建 Serverless 代理，只需替换该文件实现。
- **零依赖的轻量 Markdown 渲染**：`src/components/Markdown.tsx` 自实现标题/列表/加粗/行内代码渲染，避免引入重型依赖。

## 快速开始

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

打开页面后，点击右上角设置图标，填入你的 API Key（DeepSeek / OpenAI 等 OpenAI 兼容服务均可），即可开始生成。

## 配置说明

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| API Key | 空 | 仅存于浏览器 `localStorage` |
| Base URL | `https://api.deepseek.com/v1` | OpenAI 兼容接口地址 |
| Model | `deepseek-chat` | 可改为 `gpt-4o-mini`、`qwen-plus` 等 |

## 目录结构

```
src/
  lib/
    aiClient.ts      # 流式 AI 调用、prompt 封装
    regexEngine.ts   # 正则匹配、分组、高亮分段
    codegen.ts       # 多语言代码导出
    presets.ts       # 常用正则示例
  components/         # PromptBar / RegexEditor / TestArea / MatchList / ExplainPanel / ExportPanel ...
  hooks/useDebounced.ts
  store.ts           # 设置持久化
  App.tsx            # 页面编排
```

## 截图

> 运行 `npm run dev` 后将界面截图放到 `docs/screenshot.png`，并在此处引用。

## License

MIT
