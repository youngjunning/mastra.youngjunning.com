import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR
  ? path.resolve(process.env.MASTRA_MODEL_DOCS_OUTPUT_DIR)
  : path.join(root, 'i18n/zh-HK/docusaurus-plugin-content-docs-models/current')

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

  return files.sort()
}

const exactTranslations = new Map([
  ['title: "Models"', 'title: "模型"'],
  ['title: "Providers"', 'title: "Provider"'],
  ['title: "Gateways"', 'title: "Gateway"'],
  ['title: "Embedding models"', 'title: "嵌入模型"'],
  ['sidebar_label: "Embeddings"', 'sidebar_label: "嵌入模型"'],
  ['title: "Environment variables | Models"', 'title: "環境變數 | 模型"'],
  ['title: "Custom gateways | Models | Mastra"', 'title: "自訂 Gateway | 模型 | Mastra"'],
  ['title: "Azure OpenAI | Gateways | Mastra"', 'title: "Azure OpenAI | Gateway | Mastra"'],
  ['title: "Mastra | Gateways | Mastra"', 'title: "Mastra | Gateway | Mastra"'],
  [
    'description: "Access 168+ AI providers and 5458+ models through Mastra\'s model router."',
    'description: "透過 Mastra 的模型路由器使用超過 168 個 AI Provider 及 5458 個模型。"',
  ],
  [
    'description: "Use embedding models through Mastra\'s model router for semantic search and RAG."',
    'description: "透過 Mastra 的模型路由器使用嵌入模型進行語意搜尋及 RAG。"',
  ],
  [
    'description: "A list of environment variables used by Mastra for each model provider and gateway."',
    'description: "列出 Mastra 為各個模型 Provider 及 Gateway 使用的環境變數。"',
  ],
  ['description: "Direct access to AI model providers."', 'description: "直接存取 AI 模型 Provider。"'],
  [
    'description: "Access AI models through gateway providers with caching, rate limiting, and analytics."',
    'description: "透過具備快取、速率限制及分析功能的 Gateway Provider 存取 AI 模型。"',
  ],
  [
    'description: "Create custom model gateways for private or specialized LLM deployments"',
    'description: "為私有或專用 LLM 部署建立自訂模型 Gateway"',
  ],
  [
    'description: "Use Azure OpenAI Service with custom model deployments."',
    'description: "透過自訂模型部署使用 Azure OpenAI Service。"',
  ],
  [
    'description: "Use the Gateway to route requests across model providers."',
    'description: "使用 Gateway 在不同模型 Provider 之間路由請求。"',
  ],
  ['# Model Providers', '# 模型 Provider'],
  ['# Gateway Providers', '# Gateway Provider'],
  ['# Custom model gateways', '# 自訂模型 Gateway'],
  ['# Embedding models', '# 嵌入模型'],
  ['# Environment variables', '# 環境變數'],
  ['## Features', '## 功能'],
  ['## Basic usage', '## 基本用法'],
  ['## Model directory', '## 模型目錄'],
  ['## Mix and match models', '## 混合配搭模型'],
  ['## Dynamic model selection', '## 動態選擇模型'],
  ['## Provider-specific options', '## Provider 專屬選項'],
  ['## Custom headers', '## 自訂標頭'],
  ['## Model fallbacks', '## 模型後備切換'],
  ['### Per-model settings', '### 個別模型設定'],
  ['## Use local models with Mastra', '## 在 Mastra 使用本機模型'],
  ['## Use AI SDK with Mastra', '## 在 Mastra 使用 AI SDK'],
  ['## Quickstart', '## 快速開始'],
  ['## Supported models', '## 支援的模型'],
  ['## Authentication', '## 驗證'],
  ['## Custom Providers', '## 自訂 Provider'],
  ['## Usage with Memory', '## 配合 Memory 使用'],
  ['## Usage with RAG', '## 配合 RAG 使用'],
  ['## TypeScript Support', '## TypeScript 支援'],
  ['## Error handling', '## 錯誤處理'],
  ['## Next Steps', '## 下一步'],
  ['## Custom gateways', '## 自訂 Gateway'],
  ['## Built-in gateways', '## 內置 Gateway'],
  ['## Get an API key', '## 取得 API 金鑰'],
  ['## Usage', '## 用法'],
  ['## Configuration', '## 設定'],
  ['## Learn more', '## 延伸閱讀'],
  ['## Available models', '## 可用模型'],
  ['## Overview', '## 概覽'],
  ['## Creating a Custom Gateway', '## 建立自訂 Gateway'],
  ['### Gateway-owned authentication', '### 由 Gateway 管理的驗證'],
  ['## Registering Custom Gateways', '## 註冊自訂 Gateway'],
  ['### During Initialization', '### 初始化期間'],
  ['### After Initialization', '### 初始化之後'],
  ['## Using Custom Gateways', '## 使用自訂 Gateway'],
  ['### TypeScript Autocomplete', '### TypeScript 自動完成'],
  ['#### Automatic type generation in development', '#### 在開發環境自動產生類型'],
  ['#### How it works', '#### 運作方式'],
  ['#### Manual Type Generation Alternatives', '#### 手動產生類型的替代方法'],
  ['## Gateway Management', '## Gateway 管理'],
  ['## Gateway Properties', '## Gateway 屬性'],
  ['### Required', '### 必填'],
  ['### Methods', '### 方法'],
  ['## Provider Configuration', '## Provider 設定'],
  ['## Gateway IDs vs Keys', '## Gateway ID 與金鑰的分別'],
  ['## Model ID Format', '## 模型 ID 格式'],
  ['## Advanced example', '## 進階範例'],
  ['## Testing Custom Gateways', '## 測試自訂 Gateway'],
  ['## Best practices', '## 最佳實務'],
  ['## Showing only custom gateways in Studio', '## 在 Studio 只顯示自訂 Gateway'],
  ['## Built-in Gateways', '## 內置 Gateway'],
  ['## How Azure Deployments Work', '## Azure 部署的運作方式'],
  ['## Setup', '## 設定'],
  ['### Static Deployments', '### 靜態部署'],
  ['### Dynamic Discovery', '### 動態探索'],
  ['### Microsoft Entra ID authentication', '### Microsoft Entra ID 驗證'],
  ['### Manual Deployment Names', '### 手動指定部署名稱'],
  ['### Azure Responses API', '### Azure Responses API'],
  ['### Azure Responses WebSocket transport', '### Azure Responses WebSocket 傳輸'],
  ['## Configuration Reference', '## 設定參考'],
  ['## Models', '## 模型 {/* #models */}'],
  ['## Advanced configuration', '## 進階設定 {/* #advanced-configuration */}'],
  ['## Advanced Configuration', '## 進階設定 {/* #advanced-configuration */}'],
  ['### Custom headers', '### 自訂標頭 {/* #custom-headers */}'],
  ['### Custom Headers', '### 自訂標頭 {/* #custom-headers */}'],
  ['### Dynamic model selection', '### 動態選擇模型 {/* #dynamic-model-selection */}'],
  ['### Dynamic Model Selection', '### 動態選擇模型 {/* #dynamic-model-selection */}'],
  ['## Direct provider installation', '## 直接安裝 Provider {/* #direct-provider-installation */}'],
  ['## Installation', '## 安裝 {/* #installation */}'],
  ['## Provider Options', '## Provider 選項 {/* #provider-options */}'],
  ['### Available Options', '### 可用選項 {/* #available-options */}'],
  ['### Example: LMStudio', '### 範例：LMStudio'],
  ['| Name | Model prefix | Environment variables |', '| 名稱 | 模型前綴 | 環境變數 |'],
  ['| Model |', '| 模型 |'],
  ['| Option | Type | Required | Description |', '| 選項 | 類型 | 必填 | 說明 |'],
  ['| Property | Type | Description |', '| 屬性 | 類型 | 說明 |'],
  ['| Method | Description |', '| 方法 | 說明 |'],
  ['Azure OpenAI resource name', 'Azure OpenAI 資源名稱'],
  ['API key from "Keys and Endpoint"', '來自「Keys and Endpoint」的 API 金鑰'],
  ['Microsoft Entra ID authentication', 'Microsoft Entra ID 驗證'],
  ['Authentication mode', '驗證模式'],
  [
    'Azure SDK-compatible credential for `entraId` authentication mode',
    '適用於 `entraId` 驗證模式、與 Azure SDK 相容的憑證',
  ],
  [
    'Token scope (default: `https://cognitiveservices.azure.com/.default`)',
    'token 範圍（預設：`https://cognitiveservices.azure.com/.default`）',
  ],
  [
    'API version (default: `2024-04-01-preview`, or `v1` when `useResponsesAPI` is `true` or `useDeploymentBasedUrls` is `false`)',
    'API 版本（預設：`2024-04-01-preview`；當 `useResponsesAPI` 為 `true` 或 `useDeploymentBasedUrls` 為 `false` 時則為 `v1`）',
  ],
  [
    'Resolve deployments through the Azure OpenAI Responses API (default: `false`)',
    '透過 Azure OpenAI Responses API 解析部署（預設：`false`）',
  ],
  [
    'Use Azure deployment-based URLs (default: `true`, or `false` when `useResponsesAPI` is `true`)',
    '使用以 Azure 部署為基礎的 URL（預設：`true`；當 `useResponsesAPI` 為 `true` 時則為 `false`）',
  ],
  ['Deployment names for static mode', '靜態模式的部署名稱'],
  ['Management API credentials', 'Management API 憑證'],
  ['Azure AD tenant ID', 'Azure AD 租戶 ID'],
  ['Service Principal client ID', 'Service Principal 用戶端 ID'],
  ['Service Principal secret', 'Service Principal 密碼'],
  ['Azure subscription ID', 'Azure 訂閱 ID'],
  ['Resource group name', '資源群組名稱'],
  [
    'Unique identifier for the gateway, used as the gateway prefix for the model string',
    'Gateway 的唯一識別碼，用作模型字串的 Gateway 前綴',
  ],
  ['Human-readable gateway name', '便於閱讀的 Gateway 名稱'],
  ['Fetch provider configurations', '擷取 Provider 設定'],
  ['Build API URL for a model', '為模型建構 API URL'],
  ['Get API key for authentication', '取得用於驗證的 API 金鑰'],
  ['Create language model instance', '建立語言模型實例'],
  ['Get gateway ID (returns `id` or `name`)', '取得 Gateway ID（傳回 `id` 或 `name`）'],
  ['**Available models:**', '**可用模型：**'],
  ['**VoyageAI with MongoDB:**', '**VoyageAI 配合 MongoDB：**'],
  ['**Multimodal embeddings (text + images):**', '**多模態嵌入（文字及圖像）：**'],
  ['**Precedence:**', '**優先次序：**'],
  ['**Option 1: Use type assertion (simplest)**', '**選項 1：使用類型斷言（最簡單）**'],
  ['**Option 2: Create a custom type union (type-safe)**', '**選項 2：建立自訂聯合類型（類型安全）**'],
  ['**Option 3: Extend ModelRouterModelId globally (advanced)**', '**選項 3：全域擴充 ModelRouterModelId（進階）**'],
])

const proseTranslations = new Map([
  [
    'Mastra provides a unified interface for working with LLMs across multiple providers, giving you access to 5458 models from 168 providers through a single API.',
    'Mastra 提供統一介面，讓你透過單一 API 使用多個 Provider 的 LLM，存取來自 168 個 Provider 的 5458 個模型。',
  ],
  [
    '- **One API for any model**: Access any model without having to install and manage additional provider dependencies.',
    '- **一個 API 適用於任何模型**：毋須安裝及管理額外的 Provider 依賴套件，即可存取任何模型。',
  ],
  [
    "- **Access the newest AI**: Use new models the moment they're released, no matter which provider they come from. Avoid vendor lock-in with Mastra's provider-agnostic interface.",
    '- **使用最新 AI**：新模型發佈後即可使用，不受其所屬 Provider 限制。Mastra 不綁定特定 Provider 的介面亦可避免供應商鎖定。',
  ],
  [
    '- [**Mix and match models**](#mix-and-match-models): Use different models for different tasks. For example, run GPT-5-mini for large-context processing, then switch to Claude Opus 4.6 for reasoning tasks.',
    '- [**混合配搭模型**](#mix-and-match-models)：為不同工作使用不同模型。例如，以 GPT-5-mini 處理大型上下文，再切換至 Claude Opus 4.6 執行推理工作。',
  ],
  [
    '- [**Model fallbacks**](#model-fallbacks): If a provider experiences an outage, Mastra can automatically switch to another provider at the application level, minimizing latency compared to API gateways.',
    '- [**模型後備切換**](#model-fallbacks)：如果 Provider 發生服務中斷，Mastra 可在應用程式層級自動切換至另一個 Provider；與 API Gateway 相比，可盡量減少延遲。',
  ],
  [
    'Whether you\'re using OpenAI, Anthropic, Google, or a gateway like OpenRouter, specify the model as `"provider/model-name"` and Mastra handles the rest.',
    '不論你使用 OpenAI、Anthropic、Google，還是 OpenRouter 等 Gateway，只需以 `"provider/model-name"` 指定模型，其餘部分由 Mastra 處理。',
  ],
  [
    "Mastra reads the relevant environment variable (e.g. `ANTHROPIC_API_KEY`) and routes requests to the provider. If an API key is missing, you'll get a clear runtime error showing exactly which variable to set.",
    'Mastra 會讀取相關環境變數（例如 `ANTHROPIC_API_KEY`），並將請求路由至 Provider。如果缺少 API 金鑰，系統會顯示清晰的執行階段錯誤，指出需要設定的變數。',
  ],
  [
    'Browse the directory of available models using the navigation on the left, or explore below.',
    '你可以使用左側導覽瀏覽可用模型目錄，或在下方探索。',
  ],
  [
    'You can also discover models directly in your editor. Mastra provides full autocomplete for the `model` field - just start typing, and your IDE will show available options.',
    '你亦可直接在編輯器中探索模型。Mastra 為 `model` 欄位提供完整自動完成功能；只需開始輸入，IDE 便會顯示可用選項。',
  ],
  [
    'Alternatively, browse and test models in [Studio](/docs/studio/overview) UI.',
    '你也可以在 [Studio](/docs/studio/overview) UI 瀏覽及測試模型。',
  ],
  [
    'In development, we auto-refresh your local model list every hour, ensuring your TypeScript autocomplete and Studio stay up-to-date with the latest models. To disable, set `MASTRA_AUTO_REFRESH_PROVIDERS=false`. Auto-refresh is disabled by default in production.',
    '在開發環境中，系統每小時自動更新本機模型清單，確保 TypeScript 自動完成及 Studio 使用最新模型。如要停用，請設定 `MASTRA_AUTO_REFRESH_PROVIDERS=false`。正式環境預設停用自動更新。',
  ],
  [
    'Some models are faster but less capable, while others offer larger context windows or stronger reasoning skills. Use different models from the same provider, or mix and match across providers to fit each task.',
    '部分模型速度較快但能力較弱，另一些則提供更大的上下文視窗或更強的推理能力。你可以按工作需要使用同一 Provider 的不同模型，或跨 Provider 混合配搭。',
  ],
  [
    'Since models are just strings, you can select them dynamically based on [request context](/docs/server/request-context), variables, or any other logic.',
    '由於模型只是字串，你可以根據[請求上下文](/docs/server/request-context)、變數或其他邏輯動態選擇模型。',
  ],
  ['This enables powerful patterns:', '這可實現以下強大模式：'],
  ['- A/B testing - Compare model performance in production.', '- A/B 測試 — 比較模型在正式環境中的表現。'],
  [
    '- User-selectable models - Let users choose their preferred model in your app.',
    '- 由使用者選擇模型 — 讓使用者在你的應用程式中選擇偏好的模型。',
  ],
  [
    '- Multi-tenant applications - Each customer can bring their own API keys and model preferences.',
    '- 多租戶應用程式 — 每位客戶均可使用自己的 API 金鑰及模型偏好。',
  ],
  [
    'Different model providers expose their own configuration options. With OpenAI, you might adjust the `reasoningEffort`. With Anthropic, you might tune `cacheControl`. Mastra lets you set these specific `providerOptions` either at the agent level or per message.',
    '不同模型 Provider 會提供各自的設定選項。使用 OpenAI 時，你可能會調整 `reasoningEffort`；使用 Anthropic 時，則可能調整 `cacheControl`。Mastra 讓你在 Agent 層級或個別訊息中設定這些特定 `providerOptions`。',
  ],
  [
    'If you need to specify custom headers, such as an organization ID or other provider-specific fields, use this syntax.',
    '如需指定自訂標頭，例如組織 ID 或其他 Provider 專屬欄位，請使用以下語法。',
  ],
  [
    'Configuration differs by provider. See the provider pages in the left navigation for details on custom headers.',
    '各 Provider 的設定有所不同。有關自訂標頭的詳情，請參閱左側導覽中的 Provider 頁面。',
  ],
  [
    'Relying on a single model creates a single point of failure for your application. Model fallbacks provide automatic failover between models and providers. If the primary model becomes unavailable, requests are retried against the next configured fallback until one succeeds.',
    '只依賴單一模型會為應用程式造成單點故障。模型後備切換可在模型及 Provider 之間自動容錯轉移。如果主要模型無法使用，系統會依次向已設定的後備模型重試請求，直至成功為止。',
  ],
  [
    'Mastra tries your primary model first. If it encounters a 500 error, rate limit, or timeout, it automatically switches to your first fallback. If that fails too, it moves to the next. Each model gets its own retry count before moving on.',
    'Mastra 會先嘗試主要模型。如果遇到 500 錯誤、速率限制或逾時，便會自動切換至第一個後備模型；如仍然失敗，則繼續切換至下一個。每個模型均有獨立的重試次數，之後才會切換。',
  ],
  [
    'Your users never experience the disruption - the response comes back with the same format, just from a different model. The error context is preserved as the system moves through your fallback chain, ensuring clean error propagation while maintaining streaming compatibility.',
    '使用者不會感受到服務中斷；回應格式維持不變，只是改由另一個模型提供。系統沿後備鏈切換時會保留錯誤上下文，在維持串流相容性的同時確保錯誤能清晰傳遞。',
  ],
  [
    'Each fallback entry can carry its own `modelSettings`, `providerOptions`, and `headers` — useful when models in the chain need different temperatures or provider-specific knobs to produce comparable output.',
    '每個後備項目均可包含自己的 `modelSettings`、`providerOptions` 及 `headers`；當鏈中的模型需要不同 temperature 或 Provider 專屬設定才能產生可比較的輸出時，這會很有用。',
  ],
  [
    '- `modelSettings` and `providerOptions`: per-fallback entry overrides call-time options, which override agent `defaultOptions`. `modelSettings` shallow-merges by key. `providerOptions` deep-merges recursively, so nested provider config (e.g. `google.thinkingConfig`) preserves sibling keys across layers.',
    '- `modelSettings` 及 `providerOptions`：個別後備項目會覆寫呼叫時選項，而呼叫時選項會覆寫 Agent 的 `defaultOptions`。`modelSettings` 按鍵進行淺層合併；`providerOptions` 則遞迴深層合併，因此巢狀 Provider 設定（例如 `google.thinkingConfig`）可在各層保留同層鍵。',
  ],
  [
    '- `headers`: call-time `modelSettings.headers` overrides per-fallback `headers`, which overrides headers extracted from model-router models. Runtime headers (tracing, auth, tenancy) intentionally take precedence over model-level headers.',
    '- `headers`：呼叫時的 `modelSettings.headers` 會覆寫個別後備項目的 `headers`，後者再覆寫從模型路由器模型擷取的標頭。執行階段標頭（追蹤、驗證及租戶資訊）會刻意優先於模型層級標頭。',
  ],
  [
    'Each field also accepts a function of `requestContext`, matching how dynamic models are resolved.',
    '每個欄位亦接受以 `requestContext` 為參數的函式，與動態模型的解析方式一致。',
  ],
  [
    'Mastra also supports local models like `gpt-oss`, `Qwen3`, `DeepSeek` and many more that you run on your own hardware. The application running your local model needs to provide an OpenAI-compatible API server for Mastra to connect to. We recommend using [LMStudio](https://lmstudio.ai/) (see [Running the LMStudio server](https://lmstudio.ai/docs/developer/core/server)).',
    'Mastra 亦支援在你自己的硬件上運行 `gpt-oss`、`Qwen3`、`DeepSeek` 等多種本機模型。運行本機模型的應用程式須提供與 OpenAI 相容的 API 伺服器，讓 Mastra 連接。我們建議使用 [LMStudio](https://lmstudio.ai/)（請參閱[運行 LMStudio 伺服器](https://lmstudio.ai/docs/developer/core/server)）。',
  ],
  [
    'For custom OpenAI-compatible endpoints, `id` is the routing form that Mastra sends through the model router.',
    '對於自訂的 OpenAI 相容端點，`id` 是 Mastra 經模型路由器傳送的路由格式。',
  ],
  [
    'Use `provider/model` when the remote behaves like a direct provider and expects a bare model name such as `llama3.2`.',
    '當遠端服務的行為類似直接 Provider，並預期收到 `llama3.2` 等不含命名空間的模型名稱時，請使用 `provider/model`。',
  ],
  [
    'Use `gateway/provider/model` when the remote behaves like a model gateway and the upstream model namespace includes the provider, such as `mastra/google/gemini-2.5-flash` or `openrouter/google/gemini-2.5-flash`.',
    '當遠端服務的行為類似模型 Gateway，且上游模型命名空間包含 Provider 時，請使用 `gateway/provider/model`，例如 `mastra/google/gemini-2.5-flash` 或 `openrouter/google/gemini-2.5-flash`。',
  ],
  [
    "For the `url` it's **important** that you use the base URL of the OpenAI-compatible endpoint with Mastra's `model` setting and not the individual chat endpoints.",
    '設定 Mastra 的 `model` 時，`url` **必須**使用 OpenAI 相容端點的基礎 URL，而非個別聊天端點。',
  ],
  [
    'If the remote behaves like a model gateway, include the gateway prefix in `id`:',
    '如果遠端服務的行為類似模型 Gateway，請在 `id` 中加入 Gateway 前綴：',
  ],
  [
    'After starting the LMStudio server, the local server is available at `http://localhost:1234` and it provides endpoints like `/v1/models`, `/v1/chat/completions`, etc. The `url` will be `http://localhost:1234/v1`. For the `id` you can use (`lmstudio/${modelId}`) which will be displayed in the LMStudio interface.',
    '啟動 LMStudio 伺服器後，本機伺服器可透過 `http://localhost:1234` 存取，並提供 `/v1/models`、`/v1/chat/completions` 等端點。`url` 應為 `http://localhost:1234/v1`；`id` 可使用 LMStudio 介面中顯示的 `lmstudio/${modelId}`。',
  ],
  [
    'Mastra supports AI SDK provider modules, should you need to use them directly.',
    '如需直接使用 AI SDK Provider 模組，Mastra 亦提供支援。',
  ],
  [
    'You can use an AI SDK model (e.g. `groq(\'gemma2-9b-it\')`) anywhere that accepts a `"provider/model"` string, including within model router fallbacks and [scorers](/docs/evals/overview).',
    '凡接受 `"provider/model"` 字串的位置均可使用 AI SDK 模型（例如 `groq(\'gemma2-9b-it\')`），包括模型路由器的後備模型及[評分器](/docs/evals/overview)。',
  ],
  [
    "Mastra's model router supports embedding models using the same `provider/model` string format as language models. This provides a unified interface for both chat and embedding models with TypeScript autocomplete support.",
    'Mastra 的模型路由器支援嵌入模型，並採用與語言模型相同的 `provider/model` 字串格式。這為聊天模型及嵌入模型提供統一介面，並支援 TypeScript 自動完成。',
  ],
  [
    'VoyageAI provides specialized embedding models optimized for retrieval tasks. These models are available as standalone packages:',
    'VoyageAI 提供針對擷取工作最佳化的專用嵌入模型。這些模型可作為獨立套件使用：',
  ],
  [
    'VoyageAI works seamlessly with MongoDB Atlas Vector Search:',
    'VoyageAI 可與 MongoDB Atlas Vector Search 無縫配合：',
  ],
  [
    'For more details, see the [MongoDB + VoyageAI integration guide](/reference/vectors/mongodb#vector-embeddings-with-voyageai).',
    '詳情請參閱 [MongoDB + VoyageAI 整合指南](/reference/vectors/mongodb#vector-embeddings-with-voyageai)。',
  ],
  [
    'The model router automatically detects API keys from environment variables:',
    '模型路由器會自動從環境變數偵測 API 金鑰：',
  ],
  [
    'You can use any OpenAI-compatible embedding endpoint with a custom URL:',
    '你可以透過自訂 URL 使用任何與 OpenAI 相容的嵌入端點：',
  ],
  [
    "The embedding model router integrates seamlessly with Mastra's memory system:",
    '嵌入模型路由器可與 Mastra 的記憶體系統無縫整合：',
  ],
  ['The `embedder` field accepts:', '`embedder` 欄位接受：'],
  ['Use embedding models for document chunking and retrieval:', '使用嵌入模型進行文件分段及擷取：'],
  [
    'The model router provides full TypeScript autocomplete for embedding model IDs:',
    '模型路由器為嵌入模型 ID 提供完整的 TypeScript 自動完成功能：',
  ],
  [
    'The model router validates provider and model IDs at construction time:',
    '模型路由器會在建構時驗證 Provider 及模型 ID：',
  ],
  ['Missing API keys are also caught early:', '系統亦會及早偵測缺少 API 金鑰的情況：'],
  [
    '- [Memory & Semantic Recall](/docs/memory/semantic-recall): Use embeddings for agent memory',
    '- [Memory 及語意回想](/docs/memory/semantic-recall)：使用嵌入支援 Agent 記憶',
  ],
  [
    '- [RAG & Chunking](/guides/rag/chunking-and-embedding): Build retrieval-augmented generation systems',
    '- [RAG 及分段](/guides/rag/chunking-and-embedding)：建立檢索增強生成系統',
  ],
  [
    '- [Vector Databases](/guides/rag/vector-databases): Store and query embeddings',
    '- [向量資料庫](/guides/rag/vector-databases)：儲存及查詢嵌入',
  ],
  [
    "List of required environment variables for each model provider and gateway supported by Mastra's [model router](/models).",
    '以下列出 Mastra [模型路由器](/models)所支援各個模型 Provider 及 Gateway 的必要環境變數。',
  ],
  [
    '- `text-embedding-3-small` - 1536 dimensions, 8191 max tokens',
    '- `text-embedding-3-small` — 1536 維，token 上限為 8191',
  ],
  [
    '- `text-embedding-3-large` - 3072 dimensions, 8191 max tokens',
    '- `text-embedding-3-large` — 3072 維，token 上限為 8191',
  ],
  [
    '- `text-embedding-ada-002` - 1536 dimensions, 8191 max tokens',
    '- `text-embedding-ada-002` — 1536 維，token 上限為 8191',
  ],
  [
    '- `gemini-embedding-001` - 768 dimensions, 2048 max tokens',
    '- `gemini-embedding-001` — 768 維，token 上限為 2048',
  ],
  [
    '- `voyage-4-large` - 1024 dimensions (default), supports 256-2048 dimensions, best general-purpose and multilingual retrieval quality (120k max tokens per batch)',
    '- `voyage-4-large` — 1024 維（預設），支援 256 至 2048 維，提供最佳的通用及多語言擷取品質（每批 token 上限為 120k）',
  ],
  [
    '- `voyage-4` - 1024 dimensions (default), supports 256-2048 dimensions, optimized for general-purpose and multilingual retrieval (320k max tokens per batch)',
    '- `voyage-4` — 1024 維（預設），支援 256 至 2048 維，針對通用及多語言擷取最佳化（每批 token 上限為 320k）',
  ],
  [
    '- `voyage-4-lite` - 1024 dimensions (default), supports 256-2048 dimensions, optimized for latency and cost (1M max tokens per batch)',
    '- `voyage-4-lite` — 1024 維（預設），支援 256 至 2048 維，針對延遲及成本最佳化（每批 token 上限為 1M）',
  ],
  [
    '- `voyage-code-3` - 1024 dimensions (default), supports 256-2048 dimensions, optimized for code retrieval',
    '- `voyage-code-3` — 1024 維（預設），支援 256 至 2048 維，針對程式碼擷取最佳化',
  ],
  [
    '- `voyage-finance-2` - 1024 dimensions, optimized for finance retrieval and RAG',
    '- `voyage-finance-2` — 1024 維，針對金融資料擷取及 RAG 最佳化',
  ],
  [
    '- `voyage-law-2` - 1024 dimensions, optimized for legal retrieval and RAG (16k context)',
    '- `voyage-law-2` — 1024 維，針對法律資料擷取及 RAG 最佳化（16k 上下文）',
  ],
  [
    '- `voyage-3-large` - 1024 dimensions (default), supports 256-2048 dimensions (previous generation)',
    '- `voyage-3-large` — 1024 維（預設），支援 256 至 2048 維（上一代）',
  ],
  [
    '- `voyage-3.5` - 1024 dimensions (default), supports 256-2048 dimensions (previous generation)',
    '- `voyage-3.5` — 1024 維（預設），支援 256 至 2048 維（上一代）',
  ],
  [
    '- `voyage-3.5-lite` - 1024 dimensions (default), supports 256-2048 dimensions, optimized for latency and cost (previous generation)',
    '- `voyage-3.5-lite` — 1024 維（預設），支援 256 至 2048 維，針對延遲及成本最佳化（上一代）',
  ],
  [
    '- `voyage-multimodal-3.5` - 1024 dimensions, supports text + images',
    '- `voyage-multimodal-3.5` — 1024 維，支援文字及圖像',
  ],
  [
    '- **Google**: `GOOGLE_API_KEY` (falls back to `GOOGLE_GENERATIVE_AI_API_KEY`)',
    '- **Google**：`GOOGLE_API_KEY`（後備使用 `GOOGLE_GENERATIVE_AI_API_KEY`）',
  ],
  [
    'Gateway providers aggregate multiple model providers and add features like caching, rate limiting, analytics, and automatic failover. Use gateways when you need observability, cost management, or simplified multi-provider access.',
    'Gateway Provider 匯集多個模型 Provider，並加入快取、速率限制、分析及自動容錯轉移等功能。當你需要可觀測性、成本管理或簡化多 Provider 存取時，可使用 Gateway。',
  ],
  [
    'Create custom gateways for private LLM deployments or specialized provider integrations. See [Custom Gateways](/models/gateways/custom-gateways) for implementation details.',
    '你可以為私有 LLM 部署或專用 Provider 整合建立自訂 Gateway。實作詳情請參閱[自訂 Gateway](/models/gateways/custom-gateways)。',
  ],
  ['      description="Private Azure OpenAI deployments"', '      description="私有 Azure OpenAI 部署"'],
  ['      description="Built-in Observational Memory"', '      description="內置 Observational Memory"'],
  [
    'The Gateway is an OpenAI-compatible API proxy with built-in [Observational Memory](https://gateway.mastra.ai/docs/features#observational-memory). Point any HTTP client, SDK, or framework at the gateway and every conversation is automatically remembered without any memory management code.',
    'Gateway 是內置 [Observational Memory](https://gateway.mastra.ai/docs/features#observational-memory)、與 OpenAI 相容的 API 代理。只需將任何 HTTP 用戶端、SDK 或框架指向 Gateway，每段對話便會自動記錄，毋須編寫任何記憶管理程式碼。',
  ],
  [
    "Go to [gateway.mastra.ai](https://gateway.mastra.ai) and sign up for a Mastra account. During the onboarding you'll get your personal API key to authenticate requests.",
    '前往 [gateway.mastra.ai](https://gateway.mastra.ai) 註冊 Mastra 帳戶。完成啟用流程時，你會取得個人 API 金鑰，用於驗證請求。',
  ],
  ['Define your API key as an environment variable:', '將 API 金鑰定義為環境變數：'],
  ['Set your gateway model ID:', '設定 Gateway 模型 ID：'],
  [
    'Use the same prefix for embedding models that should run through the gateway:',
    '對於需要經 Gateway 運行的嵌入模型，請使用相同前綴：',
  ],
  [
    'Pass `memory.thread` and `memory.resource` when you generate/stream responses to enable Observational Memory:',
    '產生或串流回應時傳入 `memory.thread` 及 `memory.resource`，即可啟用 Observational Memory：',
  ],
  ['- [Features](https://gateway.mastra.ai/docs/features)', '- [功能](https://gateway.mastra.ai/docs/features)'],
  ['- [Models](https://gateway.mastra.ai/docs/models)', '- [模型](https://gateway.mastra.ai/docs/models)'],
  ['- [Limits](https://gateway.mastra.ai/docs/limits)', '- [限制](https://gateway.mastra.ai/docs/limits)'],
  [
    '- [API Reference](https://gateway.mastra.ai/docs/api/overview)',
    '- [API 參考](https://gateway.mastra.ai/docs/api/overview)',
  ],
  ['- [Examples](https://gateway.mastra.ai/docs/examples/)', '- [範例](https://gateway.mastra.ai/docs/examples/)'],
  [
    "Neon aggregates models from multiple providers with enhanced features like rate limiting and failover. Access 42 models through Mastra's model router.",
    'Neon 匯集多個 Provider 的模型，並提供速率限制及容錯轉移等增強功能。你可以透過 Mastra 的模型路由器存取 42 個模型。',
  ],
  [
    "Netlify AI Gateway provides unified access to multiple providers with built-in caching and observability. Access 66 models through Mastra's model router.",
    'Netlify AI Gateway 提供對多個 Provider 的統一存取，並內置快取及可觀測性功能。你可以透過 Mastra 的模型路由器存取 66 個模型。',
  ],
  [
    "OpenRouter aggregates models from multiple providers with enhanced features like rate limiting and failover. Access 339 models through Mastra's model router.",
    'OpenRouter 匯集多個 Provider 的模型，並提供速率限制及容錯轉移等增強功能。你可以透過 Mastra 的模型路由器存取 339 個模型。',
  ],
  [
    "Vercel aggregates models from multiple providers with enhanced features like rate limiting and failover. Access 323 models through Mastra's model router.",
    'Vercel 匯集多個 Provider 的模型，並提供速率限制及容錯轉移等增強功能。你可以透過 Mastra 的模型路由器存取 323 個模型。',
  ],
  [
    'Azure OpenAI provides enterprise-grade access to OpenAI models through dedicated deployments with security, compliance, and SLA guarantees.',
    'Azure OpenAI 透過專用部署提供企業級 OpenAI 模型存取，並具備安全、合規及 SLA 保證。',
  ],
  [
    'Unlike other providers that have fixed model names, Azure uses **deployment names** that you configure in the Azure Portal.',
    '其他 Provider 使用固定模型名稱，而 Azure 則使用你在 Azure Portal 設定的**部署名稱**。',
  ],
  [
    'Check [Azure OpenAI model availability](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models) for region-specific options.',
    '如要了解各地區的選項，請查閱 [Azure OpenAI 模型供應情況](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)。',
  ],
  [
    'Azure model IDs follow this pattern: `azure-openai/your-deployment-name`',
    'Azure 模型 ID 採用以下格式：`azure-openai/your-deployment-name`',
  ],
  [
    'The deployment name is **specific to your Azure account** and chosen when you create a deployment in Azure Portal. Common examples:',
    '部署名稱**只適用於你的 Azure 帳戶**，並在 Azure Portal 建立部署時選定。常見範例如下：',
  ],
  [
    'Create deployments in [Azure OpenAI Studio](https://oai.azure.com/). The resource name and API key are in Azure Portal under "Keys and Endpoint".',
    '在 [Azure OpenAI Studio](https://oai.azure.com/) 建立部署。資源名稱及 API 金鑰位於 Azure Portal 的「Keys and Endpoint」之下。',
  ],
  [
    'Instantiate the gateway and pass it to Mastra. The common configuration modes are shown below.',
    '建立 Gateway 實例並傳入 Mastra。以下列出常用設定模式。',
  ],
  ['Provide deployment names from Azure Portal.', '提供 Azure Portal 中的部署名稱。'],
  [
    'Provide Management API credentials. The gateway queries Azure Management API to list deployments.',
    '提供 Management API 憑證。Gateway 會查詢 Azure Management API 以列出部署。',
  ],
  [
    'The Service Principal requires "Cognitive Services User" role. See [Azure documentation](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal).',
    'Service Principal 需要「Cognitive Services User」角色。請參閱 [Azure 文件](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal)。',
  ],
  [
    'Use Microsoft Entra ID authentication when API keys are disabled for your Azure OpenAI resource. Pass any Azure SDK-compatible credential, such as `DefaultAzureCredential` from `@azure/identity`.',
    '如果你的 Azure OpenAI 資源已停用 API 金鑰，請使用 Microsoft Entra ID 驗證。你可以傳入任何與 Azure SDK 相容的憑證，例如 `@azure/identity` 的 `DefaultAzureCredential`。',
  ],
  [
    'Install `@azure/identity` in your Mastra project if you use `DefaultAzureCredential`.',
    '如使用 `DefaultAzureCredential`，請在 Mastra 項目安裝 `@azure/identity`。',
  ],
  [
    'The identity needs permission to call Azure OpenAI, such as the `Cognitive Services OpenAI User` role.',
    '該身分需要呼叫 Azure OpenAI 的權限，例如 `Cognitive Services OpenAI User` 角色。',
  ],
  [
    'For a specific managed identity, pass `ManagedIdentityCredential` instead.',
    '如要指定受控識別，請改為傳入 `ManagedIdentityCredential`。',
  ],
  [
    'Provide resource name and API key only. Specify deployment names when creating agents. No IDE autocomplete.',
    '只提供資源名稱及 API 金鑰，並在建立 Agent 時指定部署名稱。這種方式不提供 IDE 自動完成功能。',
  ],
  [
    'Azure OpenAI supports the Responses API through the `v1` API path used by the AI SDK Azure provider. Set `useResponsesAPI: true` when your Azure resource and deployment support that route. The gateway then uses `apiVersion: "v1"` and `useDeploymentBasedUrls: false` by default.',
    'Azure OpenAI 透過 AI SDK Azure Provider 所用的 `v1` API 路徑支援 Responses API。當你的 Azure 資源及部署支援該路由時，請設定 `useResponsesAPI: true`。Gateway 隨後會預設使用 `apiVersion: "v1"` 及 `useDeploymentBasedUrls: false`。',
  ],
  [
    'Keep `useResponsesAPI` omitted or set it to `false` for the existing Azure chat completions route. That path keeps `apiVersion: "2024-04-01-preview"` and deployment-based URLs by default for compatibility.',
    '如要使用現有 Azure chat completions 路由，請省略 `useResponsesAPI` 或將其設為 `false`。為保持相容性，該路徑預設沿用 `apiVersion: "2024-04-01-preview"` 及以部署為基礎的 URL。',
  ],
  [
    'You can still configure `apiVersion` and `useDeploymentBasedUrls` directly. For example, set `useDeploymentBasedUrls: false` to use the Azure `v1` URL shape with the chat model constructor; the gateway defaults `apiVersion` to `"v1"` for that route. Passing `apiVersion: "v1"` by itself keeps the existing deployment-based URL default for compatibility.',
    '你仍可直接設定 `apiVersion` 及 `useDeploymentBasedUrls`。例如，設定 `useDeploymentBasedUrls: false`，即可讓聊天模型建構函式使用 Azure `v1` URL 格式；Gateway 會為該路由將 `apiVersion` 預設為 `"v1"`。如只傳入 `apiVersion: "v1"`，則會保留現有以部署為基礎的 URL 預設值，以維持相容性。',
  ],
  [
    'Do not combine `useResponsesAPI: true` with `useDeploymentBasedUrls: true`; the gateway rejects that configuration because Responses API support uses the Azure `v1` route.',
    '請勿同時設定 `useResponsesAPI: true` 及 `useDeploymentBasedUrls: true`；由於 Responses API 支援使用 Azure `v1` 路由，Gateway 會拒絕這項設定。',
  ],
  [
    'Use `apiVersion: "v1"` for the GA `v1` route. Microsoft currently exposes preview `v1` features through feature-specific headers, such as `"aoai-evals": "preview"`, or through preview/alpha API paths. The gateway still accepts `apiVersion: "preview"` with `useDeploymentBasedUrls: false` for Azure provider configurations that require the preview query value. Date-based API versions are only for the legacy deployment-based route, so the gateway rejects them when `useResponsesAPI` is `true` or `useDeploymentBasedUrls` is `false`.',
    'GA `v1` 路由請使用 `apiVersion: "v1"`。Microsoft 目前透過功能專屬標頭（例如 `"aoai-evals": "preview"`）或 preview/alpha API 路徑提供預覽版 `v1` 功能。對於需要 preview 查詢值的 Azure Provider 設定，Gateway 仍接受同時使用 `apiVersion: "preview"` 及 `useDeploymentBasedUrls: false`。以日期為基礎的 API 版本只適用於舊有、以部署為基礎的路由，因此當 `useResponsesAPI` 為 `true` 或 `useDeploymentBasedUrls` 為 `false` 時，Gateway 會拒絕這些版本。',
  ],
  [
    'The same API key and Microsoft Entra ID authentication modes work with the `v1` route.',
    '相同的 API 金鑰及 Microsoft Entra ID 驗證模式亦適用於 `v1` 路由。',
  ],
  [
    'Azure OpenAI also supports WebSocket mode on the Responses API. Use it for agent or tool loops with many model-tool round trips. Keep the standard HTTP transport for single-shot requests and short conversations.',
    'Azure OpenAI 的 Responses API 亦支援 WebSocket 模式。當 Agent 或 Tool 迴圈需要在模型與 Tool 之間進行多次來回時，可使用此模式；單次請求及短對話則應沿用標準 HTTP 傳輸。',
  ],
  [
    'WebSocket transport requires `useResponsesAPI: true`, because Azure exposes it on the `v1` Responses path. Then opt in per stream request with `providerOptions.azure.transport: "websocket"`.',
    'WebSocket 傳輸要求設定 `useResponsesAPI: true`，因為 Azure 透過 `v1` Responses 路徑提供此功能。然後在每個串流請求中以 `providerOptions.azure.transport: "websocket"` 啟用。',
  ],
  [
    'Set `closeOnFinish: false` when you want to keep the socket open across follow-up turns. Azure keeps one response chain in connection-local memory, so continuing from the most recent `previous_response_id` can reduce continuation latency. The connection runs one response at a time and does not multiplex parallel runs.',
    '如要在後續輪次之間保持 socket 開啟，請設定 `closeOnFinish: false`。Azure 會在連線本機記憶體保留一條回應鏈，因此從最新的 `previous_response_id` 繼續可降低延續延遲。每條連線一次只運行一個回應，不會多工處理平行運行。',
  ],
  [
    'Do not send overlapping follow-up requests with `previous_response_id` on the same WebSocket transport. Mastra rejects overlapping continuation requests because Azure only keeps one in-flight response per connection. Wait for the active stream to finish before continuing the response chain.',
    '請勿在同一 WebSocket 傳輸上使用 `previous_response_id` 傳送重疊的後續請求。由於 Azure 每條連線只保留一個處理中的回應，Mastra 會拒絕重疊的延續請求。請等待目前串流完成，才繼續回應鏈。',
  ],
  [
    '\\* Provide either `apiKey` or `authentication.type: "entraId"`. Management fields are required if `management` is provided.',
    '\\* 請提供 `apiKey` 或 `authentication.type: "entraId"` 其中一項。如有提供 `management`，則所有 Management 欄位均為必填。',
  ],
  [
    'Custom model gateways allow you to implement private or specialized LLM provider integrations with the `MastraModelGatewayInterface` interface or the `MastraModelGateway` base class.',
    '自訂模型 Gateway 讓你透過 `MastraModelGatewayInterface` 介面或 `MastraModelGateway` 基礎類別，實作私有或專用 LLM Provider 整合。',
  ],
  [
    'Gateways handle provider-specific logic for accessing language models:',
    'Gateway 會處理存取語言模型時的 Provider 專屬邏輯：',
  ],
  ['- Provider configuration and model discovery', '- Provider 設定及模型探索'],
  ['- Authentication and API key management', '- 驗證及 API 金鑰管理'],
  ['- URL construction for API endpoints', '- 建構 API 端點 URL'],
  ['- Language model instance creation', '- 建立語言模型實例'],
  ['Create custom gateways to support:', '建立自訂 Gateway 以支援：'],
  ['- Private or enterprise LLM deployments', '- 私有或企業 LLM 部署'],
  ['- Custom authentication schemes', '- 自訂驗證機制'],
  ['- Specialized routing logic', '- 專用路由邏輯'],
  ['- Gateway versioning with unique IDs', '- 以唯一 ID 管理 Gateway 版本'],
  [
    'Implement `MastraModelGatewayInterface` for a plain object gateway, or extend `MastraModelGateway` when you want base class defaults.',
    '如要使用純物件 Gateway，請實作 `MastraModelGatewayInterface`；如要使用基礎類別的預設值，則擴充 `MastraModelGateway`。',
  ],
  ['The following example extends the `MastraModelGateway` class:', '以下範例擴充 `MastraModelGateway` 類別：'],
  [
    'Add `resolveAuth` when the gateway owns credential lookup. Mastra uses this hook before falling back to `getApiKey()`.',
    '當 Gateway 負責查找憑證時，請加入 `resolveAuth`。Mastra 會先使用此 hook，之後才後備呼叫 `getApiKey()`。',
  ],
  ['Pass gateways as a record when creating your Mastra instance:', '建立 Mastra 實例時，以記錄形式傳入 Gateway：'],
  ['Add gateways dynamically using `addGateway`:', '使用 `addGateway` 動態加入 Gateway：'],
  [
    'Reference models from your custom gateway using the gateway ID as prefix:',
    '以 Gateway ID 作為前綴，參照自訂 Gateway 的模型：',
  ],
  [
    "When you create an agent or use a model, Mastra's model router automatically selects the appropriate gateway based on the model ID. The gateway ID serves as the prefix. If no custom gateways match, it falls back to the built-in gateways.",
    '建立 Agent 或使用模型時，Mastra 的模型路由器會根據模型 ID 自動選擇合適的 Gateway。Gateway ID 會作為前綴；如沒有相符的自訂 Gateway，則後備使用內置 Gateway。',
  ],
  [
    'When running in development mode (`MASTRA_DEV=true`), Mastra automatically generates TypeScript types for your custom gateways.',
    '在開發模式（`MASTRA_DEV=true`）運行時，Mastra 會自動為自訂 Gateway 產生 TypeScript 類型。',
  ],
  ['1. **Set the environment variable**:', '1. **設定環境變數**：'],
  ['1. **Register your gateways**:', '1. **註冊 Gateway**：'],
  ['1. **Types are generated automatically**:', '1. **自動產生類型**：'],
  [
    '   - When you add a gateway, Mastra syncs with the GatewayRegistry',
    '   - 加入 Gateway 時，Mastra 會與 GatewayRegistry 同步',
  ],
  ['   - The registry fetches providers from your custom gateway', '   - 登錄會從自訂 Gateway 擷取 Provider'],
  [
    '   - TypeScript types are regenerated in `~/.cache/mastra/`',
    '   - 系統會在 `~/.cache/mastra/` 重新產生 TypeScript 類型',
  ],
  ['   - Your IDE picks up the new types within seconds', '   - IDE 會在數秒內載入新類型'],
  ['1. **Autocomplete now works**:', '1. **現在可使用自動完成**：'],
  ['The GatewayRegistry runs an hourly sync that:', 'GatewayRegistry 每小時執行一次同步，以：'],
  ['- Calls `fetchProviders()` on all registered gateways', '- 對所有已註冊 Gateway 呼叫 `fetchProviders()`'],
  ['- Generates TypeScript type definitions', '- 產生 TypeScript 類型定義'],
  [
    "- Writes them to both global cache and your project's `dist/` directory",
    '- 將類型寫入全域快取及項目的 `dist/` 目錄',
  ],
  ['- Your TypeScript server automatically picks up the changes', '- TypeScript 伺服器會自動載入變更'],
  [
    'The first time you add a gateway, it may take a few seconds for types to generate. Subsequent updates happen in the background every hour.',
    '首次加入 Gateway 時，產生類型可能需要數秒。之後的更新會每小時在背景執行。',
  ],
  [
    "If you're not running in development mode or need immediate type updates:",
    '如果你並非在開發模式運行，或需要立即更新類型：',
  ],
  [
    'This extends the built-in type to include your custom models, giving you full autocomplete support.',
    '這會擴充內置類型以包含自訂模型，提供完整的自動完成支援。',
  ],
  ['Retrieve a gateway by its registration key:', '以註冊金鑰擷取 Gateway：'],
  ['Retrieve a gateway by its unique ID:', '以唯一 ID 擷取 Gateway：'],
  ['This is useful when:', '以下情況會適合使用：'],
  ['- Gateways have explicit IDs different from their registration keys', '- Gateway 的明確 ID 與註冊金鑰不同'],
  ['- You need to find a gateway by its ID across different instances', '- 需要跨不同實例按 ID 尋找 Gateway'],
  [
    "- Supporting gateway versioning (e.g., `'gateway-v1'`, `'gateway-v2'`)",
    "- 支援 Gateway 版本管理（例如 `'gateway-v1'`、`'gateway-v2'`）",
  ],
  ['Get all registered gateways:', '取得所有已註冊 Gateway：'],
  [
    'The `fetchProviders()` method returns a record of `ProviderConfig` objects:',
    '`fetchProviders()` 方法會傳回 `ProviderConfig` 物件的記錄：',
  ],
  ['Understanding the distinction:', '兩者的分別如下：'],
  [
    '- **Key**: The registration key used when adding the gateway to Mastra (record key)',
    '- **金鑰**：將 Gateway 加入 Mastra 時使用的註冊金鑰（記錄鍵）',
  ],
  [
    "- **ID**: The gateway's unique identifier (via `id` property or `name` if not set)",
    '- **ID**：Gateway 的唯一識別碼（`id` 屬性；如未設定則使用 `name`）',
  ],
  ['Models accessed through custom gateways follow this format:', '透過自訂 Gateway 存取的模型採用以下格式：'],
  ['Examples:', '範例：'],
  ['Token-based gateway with caching:', '具備快取功能、以 token 為基礎的 Gateway：'],
  ['Provide descriptive errors for common failure scenarios:', '為常見失敗情況提供清晰的錯誤訊息：'],
  ['Example test structure:', '測試結構範例：'],
  [
    '1. **Use descriptive IDs for versioning**: Set explicit `id` values when you need to version your gateways',
    '1. **使用具描述性的 ID 管理版本**：需要管理 Gateway 版本時，請設定明確的 `id` 值',
  ],
  [
    '1. **Implement proper error handling**: Throw descriptive errors with actionable messages',
    '1. **妥善處理錯誤**：擲出具描述性且可採取行動的錯誤訊息',
  ],
  [
    '1. **Cache expensive operations**: Cache tokens, URLs, or provider configurations when appropriate',
    '1. **快取高成本操作**：適時快取 token、URL 或 Provider 設定',
  ],
  [
    '1. **Validate environment variables**: Check for required environment variables in `getApiKey` and `buildUrl`',
    '1. **驗證環境變數**：在 `getApiKey` 及 `buildUrl` 檢查必要環境變數',
  ],
  [
    "1. **Document your gateway**: Add JSDoc comments explaining the gateway's purpose and configuration",
    '1. **為 Gateway 撰寫文件**：加入 JSDoc 註解，說明 Gateway 的用途及設定',
  ],
  [
    '1. **Follow naming conventions**: Use clear, consistent naming for providers and models',
    '1. **遵循命名慣例**：為 Provider 及模型使用清晰一致的命名',
  ],
  [
    '1. **Handle async operations**: Use `async/await` for network requests and I/O operations',
    '1. **處理非同步操作**：網絡請求及 I/O 操作使用 `async/await`',
  ],
  [
    '1. **Test thoroughly**: Write unit tests for all gateway methods',
    '1. **全面測試**：為所有 Gateway 方法編寫單元測試',
  ],
  [
    'By default, **Studio** lists every external model provider (such as OpenAI, Anthropic, and Gemini) alongside any custom gateways you register. To hide the external providers, set the `AUTO_BLOCK_EXTERNAL_PROVIDERS` environment variable:',
    '**Studio** 預設會列出所有外部模型 Provider（例如 OpenAI、Anthropic 及 Gemini），以及你註冊的自訂 Gateway。如要隱藏外部 Provider，請設定 `AUTO_BLOCK_EXTERNAL_PROVIDERS` 環境變數：',
  ],
  [
    "When this variable is set to `true` or `1`, Mastra returns only the providers from gateways you register yourself. The static provider registry and the built-in gateways (`models.dev`, `netlify`, and `mastra`) are hidden from the model picker. This is useful when you route all model traffic through a single private gateway and don't want the other providers to appear.",
    '當此變數設為 `true` 或 `1` 時，Mastra 只會傳回你自行註冊的 Gateway 所提供的 Provider。靜態 Provider 登錄及內置 Gateway（`models.dev`、`netlify` 及 `mastra`）會從模型選擇器隱藏。當你透過單一私有 Gateway 路由所有模型流量，並且不希望顯示其他 Provider 時，這項設定會很有用。',
  ],
  [
    'With this variable set and no custom gateway registered, the model picker is empty. Register at least one custom gateway to expose its models.',
    '如果設定了此變數但未註冊任何自訂 Gateway，模型選擇器將會留空。請註冊至少一個自訂 Gateway 以顯示其模型。',
  ],
  ['Mastra includes built-in gateways as reference implementations:', 'Mastra 包含以下內置 Gateway 作為參考實作：'],
  [
    '- **NetlifyGateway**: Netlify AI Gateway integration with token exchange',
    '- **NetlifyGateway**：整合具備 token 交換功能的 Netlify AI Gateway',
  ],
  [
    '- **ModelsDevGateway**: Registry of OpenAI-compatible providers from models.dev',
    '- **ModelsDevGateway**：models.dev 所提供、與 OpenAI 相容的 Provider 登錄',
  ],
  [
    'See [Netlify](/models/gateways/netlify), [OpenRouter](/models/gateways/openrouter), and [Vercel](/models/gateways/vercel) for examples of gateway usage.',
    'Gateway 使用範例請參閱 [Netlify](/models/gateways/netlify)、[OpenRouter](/models/gateways/openrouter) 及 [Vercel](/models/gateways/vercel)。',
  ],
])

function translateGeneratedPatterns(segment) {
  return segment
    .replace(
      "To use Bedrock models through a model router string, use the full ID that [LLM Gateway](/models/providers/llmgateway-providers) lists, including its provider prefix, for example `llmgateway-providers/aws-bedrock/claude-opus-4-6`. Dropping the `llmgateway-providers/` prefix leaves an ID that doesn't resolve.",
      '如要透過模型路由字串使用 Bedrock 模型，請填上 [LLM Gateway](/models/providers/llmgateway-providers) 所列的完整 ID，例如 `llmgateway-providers/aws-bedrock/claude-opus-4-6`。省略 `llmgateway-providers/` 前綴後，路由器便無法解析該 ID。',
    )
    .replace(
      "Some router providers serve Azure-hosted models, for example `llmgateway-providers/azure/gpt-5.4` from [LLM Gateway](/models/providers/llmgateway-providers) and `edenai/azure/gpt-4.1-nano` from [Eden AI](/models/providers/edenai). Use the full ID the provider lists, including its prefix. Dropping the prefix leaves an `azure/...` ID that doesn't resolve. To use your own Azure OpenAI deployments through the model router, register the [Azure OpenAI gateway](/models/gateways/azure-openai).",
      '部分已接入路由器的 Provider 提供由 Azure 託管的模型，例如 [LLM Gateway](/models/providers/llmgateway-providers) 的 `llmgateway-providers/azure/gpt-5.4`、[Eden AI](/models/providers/edenai) 的 `edenai/azure/gpt-4.1-nano`。請使用 Provider 所列的完整 ID。省略前綴後，剩下的 `azure/...` 將無法解析。如要透過模型路由器使用自己的 Azure OpenAI 部署，請註冊 [Azure OpenAI Gateway](/models/gateways/azure-openai)。',
    )
    .replace(
      /^description: "Browse (\d+) (.+?) model IDs and learn how to configure authentication and use the gateway in TypeScript with Mastra's model router\."$/gm,
      'description: "查閱 $2 的 $1 個模型 ID，並了解如何設定驗證，以及如何在 TypeScript 透過 Mastra 的模型路由器使用這個 Gateway。"',
    )
    .replace(
      /^(.+?) aggregates models from multiple providers with enhanced features like rate limiting and failover\. Access (\d+) models through Mastra's model router\.$/gm,
      '$1 匯集多個 Provider 的模型，並提供速率限制、故障轉移等功能。你可透過 Mastra 的模型路由器使用 $2 個模型。',
    )
    .replace(/^## Usage$/gm, '## 用法 {/* #usage */}')
    .replace(/^## Configuration$/gm, '## 設定 {/* #configuration */}')
    .replace(/^## Available models$/gm, '## 可用模型 {/* #available-models */}')
    .replace(/^\| Model \|$/gm, '| 模型 |')
    .replace(/^title: "(.+) Models: IDs, Pricing & Usage"$/gm, 'title: "$1 模型 ID、收費及用法"')
    .replace(/^title: "(.+) Models: IDs, Context & Usage"$/gm, 'title: "$1 模型 ID、上下文視窗及用法"')
    .replace(
      /^description: "Browse (.+) model IDs(, capabilities, context windows, and pricing|, capabilities, and context windows| and capabilities)\. Learn how to use them in TypeScript with Mastra's model router\."$/gm,
      (_, provider, details) => {
        const fields = details.endsWith('pricing')
          ? '模型 ID、功能、上下文視窗及收費'
          : details.endsWith('windows')
            ? '模型 ID、功能及上下文視窗'
            : '模型 ID 及功能'
        return `description: "查閱 ${provider} 的${fields}。了解如何在 TypeScript 透過 Mastra 的模型路由器使用這些模型。"`
      },
    )
    .replace(
      /^description: "Use (.+) models in Mastra through the AI SDK provider package\."$/gm,
      'description: "透過 AI SDK 的 Provider 套件，即可在 Mastra 使用 $1 模型。"',
    )
    .replace(
      /^description: "Direct access to AI model providers through their AI SDK provider packages\."$/gm,
      'description: "透過各 AI SDK Provider 套件直接使用相應的模型。"',
    )
    .replace(
      /^Model availability, capabilities, context windows, and pricing are sourced from \[models\.dev\]\(https:\/\/models\.dev\) and may change\.$/gm,
      '模型供應情況、功能、上下文視窗及收費資料均來自 [models.dev](https://models.dev)，日後或會變更。',
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\.(?: Configure `([^`]+)` as well\.)?$/gm,
      (_, count, provider, variable, requiredVariable) => {
        const intro = `Mastra 的模型路由器可供你使用 ${provider} 提供的這 ${count} 個模型。Mastra 會自動讀取 \`${variable}\` 環境變數進行驗證。`
        return requiredVariable ? intro + `你亦須設定 \`${requiredVariable}\`。` : intro
      },
    )
    .replace(
      /^Access (\d+) (.+?) models? through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: (.+)\.$/gm,
      'Mastra 的模型路由器可供你使用 $2 提供的這 $1 個模型。Mastra 會自動使用以下其中一個環境變數進行驗證：$3。',
    )
    .replace(
      /^(.+?) isn't a model router provider, so model strings like `([^`]+)` don't resolve\. Pass a model instance from `([^`]+)` to the agent's `model` option instead\.$/gm,
      '$1 未有接入模型路由器，因此 `$2` 這類模型字串無法解析。請將 `$3` 提供的模型實例傳入 Agent 的 `model` 選項。',
    )
    .replace(/title: "(.+?) \| Models(?: \| Mastra)?"/g, 'title: "$1 | 模型"')
    .replace(
      /description: "Use (.+?) models with Mastra\. (\d+) models available\."/g,
      'description: "在 Mastra 使用 $1 模型。共有 $2 個可用模型。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "在 Mastra 使用 $1 模型。共有 1 個可用模型。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "透過 AI SDK 使用 $1 模型。"')
    .replace(/description: "Use AI models through (.+?)\."/g, 'description: "透過 $1 使用 AI 模型。"')
    .replace(/description="(\d+) models"/g, 'description="$1 個模型"')
    .replace(/title="Gateways"/g, 'title="Gateway"')
    .replace(/title="Providers"/g, 'title="Provider"')
    .replace(/>\+ (\d+) more</g, '>另有 $1 個<')
    .replace(/\| Yes\*? \|/g, match => (match.includes('*') ? '| 是* |' : '| 是 |'))
    .replace(/\| No \|/g, '| 否 |')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 標誌"')
    .replace(/\(China\)/g, '（中國）')
    .replace(/\(Global\)/g, '（全球）')
    .replace(/\(Singapore\)/g, '（新加坡）')
    .replace(/\(Europe\)/g, '（歐洲）')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\. Configure `([^`]+)` as well\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用 `$3` 環境變數進行驗證，並須同時設定 `$4`。',
    )
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用 `$3` 環境變數進行驗證。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 1 個 $1 模型。系統會自動使用 `$2` 環境變數進行驗證。',
    )
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: `([^`]+)`, `([^`]+)`\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用以下其中一個環境變數進行驗證：`$3`、`$4`。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '詳情請參閱[$1 文件]($2)。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      '$1 可透過 AI SDK 使用。請安裝相應的 Provider 套件，以便在 Mastra 使用其模型。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      '有關此 Provider 的詳細文件，請參閱 [AI SDK $1 Provider 文件]($2)。',
    )
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '直接存取個別 AI 模型 Provider。每個 Provider 均提供具有特定功能及定價的獨有模型。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra 使用與 OpenAI 相容的 `/chat/completions` 端點。部分 Provider 專屬功能可能無法使用，詳情請參閱[$1 文件]($2)。',
    )
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      '此 Provider 亦可直接安裝為獨立套件，用來取代 Mastra 模型路由器字串。詳情請參閱[套件文件]($1)。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      '如要在 Mastra Agent 使用此 Provider，請參閱 [Agent 概覽文件]($1)。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 透過 `providerOptions` 參數支援以下 Provider 專屬選項：',
    )
    .replace(
      /Controls whether OpenAI stores your API requests for model training\. Required to be \\"false\\" if your organization has zero data retention enabled\. See: https:\/\/platform\.openai\.com\/docs\/guides\/your-data#zero-data-retention/g,
      '控制 OpenAI 是否儲存你的 API 請求以訓練模型。如果你的組織已啟用零資料保留，必須設為 \\"false\\"。請參閱：https://platform.openai.com/docs/guides/your-data#zero-data-retention',
    )
}

function translateOutsideCode(segment) {
  let translated = translateGeneratedPatterns(segment)

  for (const [source, target] of exactTranslations) {
    translated = source.startsWith('#')
      ? translated
          .split('\n')
          .map(line => (line === source ? target : line))
          .join('\n')
      : translated.replaceAll(source, target)
  }
  for (const [source, target] of proseTranslations) {
    translated = translated.replaceAll(source, target)
  }

  return translated
}

function localize(content) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((segment, index) => (index % 2 === 0 ? translateOutsideCode(segment) : segment))
    .join('')
}

const files = await listMdxFiles(sourceRoot)
if (files.length < 188) {
  throw new Error(`Expected at least 188 English model files, found ${files.length}`)
}

const generatedFiles = files.filter(file => file.startsWith(`providers${path.sep}`) || isGeneratedGateway(file))
for (const relativePath of generatedFiles) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)
  const source = await fs.readFile(sourcePath, 'utf8')

  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localize(source))
}

console.log(
  `Generated ${generatedFiles.length} zh-HK model localization files; skipped ${files.length - generatedFiles.length} manual files.`,
)
