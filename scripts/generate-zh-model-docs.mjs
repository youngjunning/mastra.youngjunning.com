import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR
  ? path.resolve(process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR)
  : path.join(root, 'i18n/zh-CN/docusaurus-plugin-content-docs-models/current')

function isGeneratedGateway(file) {
  return file === path.join('gateways', 'merge-gateway.mdx') || file === path.join('gateways', 'requesty.mdx')
}

async function listMdxFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listMdxFiles(path.join(directory, entry.name), relativePath)))
    } else if (entry.name.endsWith('.mdx')) {
      files.push(relativePath)
    }
  }

  return files
}

function translateProse(segment) {
  return segment
    .replace(
      "To use Bedrock models through a model router string, use the full ID that [LLM Gateway](/models/providers/llmgateway-providers) lists, including its provider prefix, for example `llmgateway-providers/aws-bedrock/claude-opus-4-6`. Dropping the `llmgateway-providers/` prefix leaves an ID that doesn't resolve.",
      '要通过模型路由字符串调用 Bedrock 模型，请使用 [LLM Gateway](/models/providers/llmgateway-providers) 列出的完整 ID，例如 `llmgateway-providers/aws-bedrock/claude-opus-4-6`。省略 `llmgateway-providers/` 前缀会导致 ID 无法解析。',
    )
    .replace(
      "Some router providers serve Azure-hosted models, for example `llmgateway-providers/azure/gpt-5.4` from [LLM Gateway](/models/providers/llmgateway-providers) and `edenai/azure/gpt-4.1-nano` from [Eden AI](/models/providers/edenai). Use the full ID the provider lists, including its prefix. Dropping the prefix leaves an `azure/...` ID that doesn't resolve. To use your own Azure OpenAI deployments through the model router, register the [Azure OpenAI gateway](/models/gateways/azure-openai).",
      '部分接入路由器的 Provider 提供托管在 Azure 上的模型，例如 [LLM Gateway](/models/providers/llmgateway-providers) 的 `llmgateway-providers/azure/gpt-5.4`、[Eden AI](/models/providers/edenai) 的 `edenai/azure/gpt-4.1-nano`。请使用 Provider 列出的完整 ID。省略前缀会导致剩下的 `azure/...` 无法解析。要通过模型路由器调用自己的 Azure OpenAI 部署，请注册 [Azure OpenAI Gateway](/models/gateways/azure-openai)。',
    )
    .replace(
      /^description: "Browse (\d+) (.+?) model IDs and learn how to configure authentication and use the gateway in TypeScript with Mastra's model router\."$/gm,
      'description: "查看 $2 的 $1 个模型 ID，并了解如何配置身份验证，以及如何在 TypeScript 中通过 Mastra 的模型路由器使用此 Gateway。"',
    )
    .replace(
      /^(.+?) aggregates models from multiple providers with enhanced features like rate limiting and failover\. Access (\d+) models through Mastra's model router\.$/gm,
      '$1 汇集了多个 Provider 的模型，并提供限流、故障转移等功能。可通过 Mastra 的模型路由器访问 $2 个模型。',
    )
    .replace(/^## Usage$/gm, '## 用法 {/* #usage */}')
    .replace(/^## Configuration$/gm, '## 配置 {/* #configuration */}')
    .replace(/^## Available models$/gm, '## 可用模型 {/* #available-models */}')
    .replace(/^\| Model \|$/gm, '| 模型 |')
    .replace(/^title: "(.+) Models: IDs, Pricing & Usage"$/gm, 'title: "$1 模型 ID、价格与用法"')
    .replace(/^title: "(.+) Models: IDs, Context & Usage"$/gm, 'title: "$1 模型 ID、上下文窗口与用法"')
    .replace(
      /^description: "Browse (.+) model IDs(, capabilities, context windows, and pricing|, capabilities, and context windows| and capabilities)\. Learn how to use them in TypeScript with Mastra's model router\."$/gm,
      (_, provider, details) => {
        const fields = details.endsWith('pricing')
          ? '模型 ID、功能、上下文窗口和价格'
          : details.endsWith('windows')
            ? '模型 ID、功能和上下文窗口'
            : '模型 ID 和功能'
        return `description: "查看 ${provider} 的${fields}。了解如何在 TypeScript 中通过 Mastra 的模型路由器调用这些模型。"`
      },
    )
    .replace(
      /^description: "Use (.+) models in Mastra through the AI SDK provider package\."$/gm,
      'description: "在 Mastra 中使用 AI SDK 的 Provider 软件包即可调用 $1 模型。"',
    )
    .replace(
      /^description: "Direct access to AI model providers through their AI SDK provider packages\."$/gm,
      'description: "通过对应的 AI SDK Provider 软件包直接调用各服务的模型。"',
    )
    .replace(/^title: "Providers"$/gm, 'title: "模型 Provider"')
    .replace(
      /^Model availability, capabilities, context windows, and pricing are sourced from \[models\.dev\]\(https:\/\/models\.dev\) and may change\.$/gm,
      '模型的可用情况、功能、上下文窗口和价格均来自 [models.dev](https://models.dev)，可能会有变化。',
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\.(?: Configure `([^`]+)` as well\.)?$/gm,
      (_, count, provider, variable, requiredVariable) => {
        const intro = `要访问 ${provider} 提供的这 ${count} 个模型，可使用 Mastra 的模型路由器。Mastra 会自动读取 \`${variable}\` 环境变量进行身份验证。`
        return requiredVariable ? intro + `还需设置 \`${requiredVariable}\`。` : intro
      },
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: (.+)\.$/gm,
      '通过 Mastra 的模型路由器可访问 $2 提供的这 $1 个模型。Mastra 会自动使用下列环境变量中的任意一个进行身份验证：$3。',
    )
    .replace(
      /^(.+?) isn't a model router provider, so model strings like `([^`]+)` don't resolve\. Pass a model instance from `([^`]+)` to the agent's `model` option instead\.$/gm,
      '$1 未接入模型路由器，因此无法解析 `$2` 这类模型字符串。请将 `$3` 提供的模型实例传给 Agent 的 `model` 选项。',
    )
    .replace(/title: "(.+?) \| Models(?: \| Mastra)?"/g, 'title: "$1 | 模型"')
    .replace(
      /description: "Use (.+?) models with Mastra\. (\d+) models available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 $2 个可用模型。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 1 个可用模型。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "通过 AI SDK 使用 $1 模型。"')
    .replace(/description: "Direct access to AI model providers\."/g, 'description: "直接访问 AI 模型 Provider。"')
    .replace(/description="(\d+) models"/g, 'description="$1 个模型"')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 标志"')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '通过 Mastra 的模型路由器访问 $1 个 $2 模型。系统会自动使用 `$3` 环境变量完成身份验证。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '通过 Mastra 的模型路由器访问 1 个 $1 模型。系统会自动使用 `$2` 环境变量完成身份验证。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '更多信息请参阅[$1 文档]($2)。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      'AI SDK 支持 $1。安装相应的 Provider 软件包，即可在 Mastra 中调用其模型。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      '有关此 Provider 的详细说明，请参阅 [AI SDK $1 Provider 文档]($2)。',
    )
    .replace(/^# Model Providers$/gm, '# 模型 Provider')
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '直接访问各个 AI 模型 Provider。每个 Provider 都提供具有不同能力和定价的模型。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra 使用兼容 OpenAI 的 `/chat/completions` 端点。部分 Provider 专属功能可能不可用，详情请参阅[$1 文档]($2)。',
    )
    .replace(/^## Models$/gm, '## 模型 {/* #models */}')
    .replace(/^## Advanced configuration$/gm, '## 高级配置 {/* #advanced-configuration */}')
    .replace(/^## Advanced Configuration$/gm, '## 高级配置 {/* #advanced-configuration */}')
    .replace(/^### Custom headers$/gm, '### 自定义请求头 {/* #custom-headers */}')
    .replace(/^### Custom Headers$/gm, '### 自定义请求头 {/* #custom-headers */}')
    .replace(/^### Dynamic model selection$/gm, '### 动态选择模型 {/* #dynamic-model-selection */}')
    .replace(/^### Dynamic Model Selection$/gm, '### 动态选择模型 {/* #dynamic-model-selection */}')
    .replace(/^## Direct provider installation$/gm, '## 直接安装 Provider {/* #direct-provider-installation */}')
    .replace(/^## Installation$/gm, '## 安装 {/* #installation */}')
    .replace(/^## Provider Options$/gm, '## Provider 选项 {/* #provider-options */}')
    .replace(/^### Available Options$/gm, '### 可用选项 {/* #available-options */}')
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      '也可以安装此 Provider 的独立软件包，用它代替 Mastra 模型路由字符串。详情请参阅[软件包文档]($1)。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      '如需在 Mastra Agent 中使用此 Provider，请参阅[Agent 概览文档]($1)。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 通过 `providerOptions` 参数支持以下 Provider 特有选项：',
    )
}

function localizeGeneratedPage(content) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((segment, index) => (index % 2 === 0 ? translateProse(segment) : segment))
    .join('')
}

const files = await listMdxFiles(sourceRoot)
let generated = 0
let preserved = 0

for (const relativePath of files) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)

  if (!relativePath.startsWith(`providers${path.sep}`) && !isGeneratedGateway(relativePath)) {
    preserved += 1
    continue
  }

  const content = await fs.readFile(sourcePath, 'utf8')
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localizeGeneratedPage(content))
  generated += 1
}

console.log(`Generated ${generated} model localization files; preserved ${preserved} manual files.`)
