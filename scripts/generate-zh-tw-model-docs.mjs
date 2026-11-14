import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR
  ? path.resolve(process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR)
  : path.join(root, 'i18n/zh-TW/docusaurus-plugin-content-docs-models/current')

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
      '若要使用模型路由字串呼叫 Bedrock 模型，請填入 [LLM Gateway](/models/providers/llmgateway-providers) 列出的完整 ID，例如 `llmgateway-providers/aws-bedrock/claude-opus-4-6`。省略 `llmgateway-providers/` 前綴會使該 ID 無法解析。',
    )
    .replace(
      "Some router providers serve Azure-hosted models, for example `llmgateway-providers/azure/gpt-5.4` from [LLM Gateway](/models/providers/llmgateway-providers) and `edenai/azure/gpt-4.1-nano` from [Eden AI](/models/providers/edenai). Use the full ID the provider lists, including its prefix. Dropping the prefix leaves an `azure/...` ID that doesn't resolve. To use your own Azure OpenAI deployments through the model router, register the [Azure OpenAI gateway](/models/gateways/azure-openai).",
      '部分已接入路由器的 Provider 提供在 Azure 上託管的模型，例如 [LLM Gateway](/models/providers/llmgateway-providers) 的 `llmgateway-providers/azure/gpt-5.4`、[Eden AI](/models/providers/edenai) 的 `edenai/azure/gpt-4.1-nano`。請使用 Provider 列出的完整 ID。省略前綴後，剩下的 `azure/...` 將無法解析。若要透過模型路由器存取自己的 Azure OpenAI 部署，請註冊 [Azure OpenAI Gateway](/models/gateways/azure-openai)。',
    )
    .replace(
      /^description: "Browse (\d+) (.+?) model IDs and learn how to configure authentication and use the gateway in TypeScript with Mastra's model router\."$/gm,
      'description: "查看 $2 的 $1 個模型 ID，並了解如何設定身分驗證，以及如何在 TypeScript 中透過 Mastra 的模型路由器使用此 Gateway。"',
    )
    .replace(
      /^(.+?) aggregates models from multiple providers with enhanced features like rate limiting and failover\. Access (\d+) models through Mastra's model router\.$/gm,
      '$1 整合多個 Provider 的模型，並提供速率限制、容錯移轉等功能。透過 Mastra 的模型路由器可以存取 $2 個模型。',
    )
    .replace(/^## Usage$/gm, '## 使用方式 {/* #usage */}')
    .replace(/^## Configuration$/gm, '## 設定 {/* #configuration */}')
    .replace(/^## Available models$/gm, '## 可用模型 {/* #available-models */}')
    .replace(/^\| Model \|$/gm, '| 模型 |')
    .replace(/^title: "(.+) Models: IDs, Pricing & Usage"$/gm, 'title: "$1 模型 ID、定價與用法"')
    .replace(/^title: "(.+) Models: IDs, Context & Usage"$/gm, 'title: "$1 模型 ID、上下文視窗與用法"')
    .replace(
      /^description: "Browse (.+) model IDs(, capabilities, context windows, and pricing|, capabilities, and context windows| and capabilities)\. Learn how to use them in TypeScript with Mastra's model router\."$/gm,
      (_, provider, details) => {
        const fields = details.endsWith('pricing')
          ? '模型 ID、功能、上下文視窗與定價'
          : details.endsWith('windows')
            ? '模型 ID、功能與上下文視窗'
            : '模型 ID 與功能'
        return `description: "查看 ${provider} 的${fields}。了解如何在 TypeScript 中透過 Mastra 的模型路由器使用這些模型。"`
      },
    )
    .replace(
      /^description: "Use (.+) models in Mastra through the AI SDK provider package\."$/gm,
      'description: "使用 AI SDK 的 Provider 套件，即可在 Mastra 中使用 $1 模型。"',
    )
    .replace(
      /^description: "Direct access to AI model providers through their AI SDK provider packages\."$/gm,
      'description: "使用各 AI SDK Provider 套件，直接存取對應的模型。"',
    )
    .replace(/^title: "Providers"$/gm, 'title: "模型 Provider"')
    .replace(
      /^Model availability, capabilities, context windows, and pricing are sourced from \[models\.dev\]\(https:\/\/models\.dev\) and may change\.$/gm,
      '模型的供應情況、功能、上下文視窗及定價皆以 [models.dev](https://models.dev) 的資料為準，日後可能變更。',
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\.(?: Configure `([^`]+)` as well\.)?$/gm,
      (_, count, provider, variable, requiredVariable) => {
        const intro = `透過 Mastra 的模型路由器可使用 ${provider} 提供的這 ${count} 個模型。Mastra 會自動讀取 \`${variable}\` 環境變數進行身分驗證。`
        return requiredVariable ? intro + `另外也要設定 \`${requiredVariable}\`。` : intro
      },
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: (.+)\.$/gm,
      '透過 Mastra 的模型路由器可使用 $2 提供的這 $1 個模型。Mastra 會自動使用下列任一環境變數進行身分驗證：$3。',
    )
    .replace(
      /^(.+?) isn't a model router provider, so model strings like `([^`]+)` don't resolve\. Pass a model instance from `([^`]+)` to the agent's `model` option instead\.$/gm,
      '$1 並未接入模型路由器，因此無法解析 `$2` 這類模型字串。請將 `$3` 提供的模型執行個體傳入 Agent 的 `model` 選項。',
    )
    .replace(/title: "(.+?) \| Models(?: \| Mastra)?"/g, 'title: "$1 | 模型"')
    .replace(
      /description: "Use (.+?) models with Mastra\. (\d+) models available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 $2 個可用模型。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 1 個可用模型。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "透過 AI SDK 使用 $1 模型。"')
    .replace(/description: "Direct access to AI model providers\."/g, 'description: "直接存取 AI 模型 Provider。"')
    .replace(/description="(\d+) models"/g, 'description="$1 個模型"')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 標誌"')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用 `$3` 環境變數完成身分驗證。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 1 個 $1 模型。系統會自動使用 `$2` 環境變數完成身分驗證。',
    )
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: (.+?)\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用下列其中一個環境變數完成身分驗證：$3。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '如需進一步了解，請參閱[$1 文件]($2)。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      '$1 可透過 AI SDK 使用。安裝對應的 Provider 套件後，即可在 Mastra 中使用其模型。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      '如需此 Provider 的詳細說明，請參閱 [AI SDK $1 Provider 文件]($2)。',
    )
    .replace(/^# Model Providers$/gm, '# 模型 Provider')
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '直接存取各個 AI 模型 Provider。每個 Provider 都提供具備不同能力與定價的模型。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra 使用與 OpenAI 相容的 `/chat/completions` 端點。部分 Provider 專屬功能可能無法使用，詳情請參閱[$1 文件]($2)。',
    )
    .replace(/^## Models$/gm, '## 模型 {/* #models */}')
    .replace(/^## Advanced configuration$/gm, '## 進階設定 {/* #advanced-configuration */}')
    .replace(/^## Advanced Configuration$/gm, '## 進階設定 {/* #advanced-configuration */}')
    .replace(/^### Custom headers$/gm, '### 自訂標頭 {/* #custom-headers */}')
    .replace(/^### Custom Headers$/gm, '### 自訂標頭 {/* #custom-headers */}')
    .replace(/^### Dynamic model selection$/gm, '### 動態選擇模型 {/* #dynamic-model-selection */}')
    .replace(/^### Dynamic Model Selection$/gm, '### 動態選擇模型 {/* #dynamic-model-selection */}')
    .replace(/^## Direct provider installation$/gm, '## 直接安裝 Provider {/* #direct-provider-installation */}')
    .replace(/^## Installation$/gm, '## 安裝 {/* #installation */}')
    .replace(/^## Provider Options$/gm, '## Provider 選項 {/* #provider-options */}')
    .replace(/^### Available Options$/gm, '### 可用選項 {/* #available-options */}')
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      '你也可以直接將此 Provider 安裝為獨立套件，用它取代 Mastra 模型路由字串。詳情請參閱[套件文件]($1)。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      '如需在 Mastra Agent 中使用此 Provider，請參閱 [Agent 概覽文件]($1)。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 透過 `providerOptions` 參數支援以下 Provider 特有選項：',
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
let skippedManual = 0

for (const relativePath of files) {
  if (!relativePath.startsWith(`providers${path.sep}`) && !isGeneratedGateway(relativePath)) {
    skippedManual += 1
    continue
  }

  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)
  const content = await fs.readFile(sourcePath, 'utf8')
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localizeGeneratedPage(content))
  generated += 1
}

console.log(`Generated ${generated} zh-TW model localization files; skipped ${skippedManual} manual files.`)
