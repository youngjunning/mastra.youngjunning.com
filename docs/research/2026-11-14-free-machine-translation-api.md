# Mastra 中文文档免费机翻 API 选型

核对日期：2026-11-14

## 结论

后续增量同步建议把机翻阶段从非公开 Google 端点切换到 **Azure Translator F0**，但不重做现有首次机翻基线。

推荐流程：

1. 英文可翻译文本调用一次 `en → zh-Hans`，作为 `zh-CN` 机翻稿。
2. 同一英文文本调用一次 `en → zh-Hant`，作为 `zh-TW` 与 `zh-HK` 的共同繁体机翻稿。
3. 大模型分别读取完整英文原文和对应机翻稿，独立润色 `zh-CN`、`zh-TW`、`zh-HK`。香港版使用香港书面技术中文，不把粤语 `yue` 当成 `zh-HK`。
4. 只把完成大模型润色并记录源文、成品指纹的页面标记为完成。

Azure 当前官方 F0 定价为每月免费 200 万字符，比 Google Cloud NMT 和 DeepL 的长期免费额度更高；它是正式、带认证的公开 API，也比项目当前使用的非公开 Google Web 端点更适合持续维护。[Azure Translator 定价](https://azure.microsoft.com/en-us/pricing/details/translator/)

## 方案比较

| 服务 | 免费额度与期限 | 中文区域能力 | 对本项目的判断 |
| --- | --- | --- | --- |
| Azure Translator F0 | 每月 200 万字符；官方定价页没有列出 12 个月失效条件 | `zh-Hans`、`zh-Hant`；另有粤语 `yue`，但没有独立 `zh-HK` 书面中文目标 | **首选**。以简体一次、繁体一次生成草稿，再由 LLM 分别本地化三种中文 |
| Google Cloud Translation NMT | 每月前 50 万字符免费，以每月 10 美元 credit 体现 | 免费额度属于 NMT；Google Translation LLM 才明确列出 `zh-CN`、`zh-TW`、`zh-HK` | 稳定但免费额度仅 Azure 的四分之一；不能把 LLM 的地区支持误算成免费 NMT 能力 |
| Amazon Translate | 每月 200 万字符，但仅从首次调用起 12 个月 | 简体 `zh`、繁体 `zh-TW`，没有 `zh-HK` | 可作一年期备用，不适合长期免费链路 |
| DeepL API | 旧 API Free 为每月 50 万字符，但官方已说明该方案不能再购买；新 Developer 方案是累计 100 万字符，不按月重置 | 中文支持不解决台湾与香港的独立书面本地化问题 | 不应把旧免费额度当作新项目可持续方案 |
| LibreTranslate 自托管 | 软件和本机 API 免费，实际成本是机器、带宽与维护 | 有英文与中文、繁体中文模型；没有台湾与香港书面用语保证 | 无云账号时的备用选项；先抽样评测质量，不作为默认生产基线 |

### Azure Translator

Azure F0 官方价格表列出每月 200 万字符免费。[Azure Translator 定价](https://azure.microsoft.com/en-us/pricing/details/translator/)

官方语言表提供简体中文 `zh-Hans`、繁体中文 `zh-Hant`，并单列粤语（繁体）`yue`。[Azure Translator 语言支持](https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support)

`yue` 表示粤语，不等于香港技术文档使用的标准书面中文。Mastra 的 `zh-HK` 应以 `zh-Hant` 机翻稿为底稿，再由大模型按香港技术用语独立润色。

Azure 按每个目标语言分别计费；同一段源文同时请求多个目标语言时，每个目标都会重复计算源文字符。文本翻译单次请求上限为所有目标合计 50,000 字符，F0 的小时限额为 200 万字符，官方建议均匀发送以避免限流。[Azure Translator 服务限制](https://learn.microsoft.com/en-us/azure/ai-services/translator/service-limits) [Azure Translator 字符计费说明](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/translator-faq)

### Google Cloud Translation

Google Cloud NMT 对每月前 500,000 字符提供免费 credit；批量请求按“源文字符数 × 目标语言数”计量。[Google Cloud Translation 定价](https://cloud.google.com/products/translate/pricing)

Google 的 Translation LLM 官方列出 `zh-CN`、`zh-TW`、`zh-HK`，但 Translation LLM 按输入和输出分别收费，不属于 NMT 的 500,000 字符免费档。Google 的自定义模型说明还明确把 `zh-HK` 映射到 `zh-TW` 基础模型，因此不能仅凭 API 接受 `zh-HK` 代码，就认定免费 NMT 会生成独立香港用语。[Google Cloud Translation 语言支持](https://cloud.google.com/translate/docs/languages)

项目当前使用的 `clients5.google.com/translate_a/t` 是非公开 Web 端点，没有正式 API 合约、额度说明或稳定性承诺，不适合作为长期同步基础。

### Amazon Translate

AWS 免费层为每月 200 万字符，但只持续 12 个月，未用额度也不会结转。[Amazon Translate 定价](https://aws.amazon.com/translate/pricing/)

官方语言表提供简体中文 `zh` 与繁体中文 `zh-TW`，没有独立 `zh-HK`。[Amazon Translate 支持语言](https://docs.aws.amazon.com/translate/latest/dg/what-is-languages.html)

### DeepL API

DeepL 当前帮助中心同时保留旧 API Free 的每月 500,000 字符说明，但也明确表示 API Free 已不能再购买；新的 API Developer 方案只提供累计 1,000,000 字符，耗尽后不重置。[DeepL API 方案](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans) [DeepL 用量与计费](https://support.deepl.com/hc/en-us/articles/360020685720-Usage-count-and-billing-in-DeepL-API)

因此，新项目不能把“DeepL 每月免费 500,000 字符”当成稳定可获取的长期额度。即便已有旧账号，台湾与香港仍需要后续 LLM 地区化。

### LibreTranslate

LibreTranslate 是基于 Argos Translate 的开源机翻 API，可在本机免费自托管。[LibreTranslate 文档](https://docs.libretranslate.com/)

官方模型表列出中文与繁体中文模型；如果没有直接语言对，系统可能经由英文中转。[LibreTranslate 支持语言](https://docs.libretranslate.com/guides/supported_languages/)

它解决的是 API 费用和外部依赖问题，不自动解决翻译质量、吞吐、模型更新、服务监控和台湾/香港地区化问题。若采用，应先用固定样本比较技术术语、MDX 保护后的句段完整性和后续 LLM 修改率。

## 当前仓库规模估算

统计对象是 `UPSTREAM_INCREMENTAL.json` 中的 1,024 个英文页面集合。

| 口径 | 字符量 |
| --- | ---: |
| 英文 MDX 原文件 UTF-8 字节 | 10,079,410 |
| 英文 MDX Unicode code point | 10,076,634 |
| 粗略可翻译文本 | 3,591,852 |
| 三个目标分别机翻的粗略计费量 | 10,775,556 |
| 简体一次、繁体一次的粗略计费量 | 7,183,704 |
| 节省量 | 3,591,852（33.3%） |

“粗略可翻译文本”通过确定性方式去掉 frontmatter、代码围栏、import/export、MDX 标签、链接地址、行内代码和 Markdown 结构后计算，再合并空白。它用于容量规划，不是云厂商账单的精确复刻；实际计费取决于最终发送给 API 的占位符、空白和分段内容。

如果把完整 MDX 直接提交给 API，三个目标约计费 30,229,902 字符，简体一次加繁体一次约计费 20,153,268 字符。两种方式都节省三分之一，但都浪费代码和结构字符，因此实现时必须只发送可翻译文本片段。

按粗略文本口径，首次全量的“简体一次 + 繁体一次”仍约需 718 万字符，超过 Azure F0 单月 200 万字符，需要约 3.6 个月免费额度。当前首次机翻已经完成，所以不应为了更换 API 重新消耗这部分额度；后续仅处理上游增量，免费额度更有机会覆盖真实需求。

## 落地建议

1. 保留现有首次机翻稿，继续执行已开始的 Codex 大模型润色。首个 Agent 概览已经证明，大模型能够修复错误术语、中英文半句混排和损坏的 MDX 提示块；重新机翻不能替代这一步。
2. 后续上游增量默认使用 Azure F0。发送前保护代码、MDX、URL、标识符和 placeholder，只提交读者可见文本。
3. 机翻只生成 `zh-Hans` 与 `zh-Hant` 两份草稿。繁体草稿可同时作为 `zh-TW` 与 `zh-HK` 的输入，但两地最终稿必须分别对照英文源页进行 LLM 润色。
4. 在同步账本中记录机翻 Provider、目标语言、源文指纹和结果指纹；AI 润色仍使用现有独立指纹，避免 Provider 切换让已完成页面被误判为未完成。
5. 设置本地字符预算和失败恢复。Azure 返回限额错误时按重试策略延后，不自动切回非公开 Google Web 端点。
6. 先用 20–30 个代表性增量页面做 Azure 与现有 Google 机翻稿的盲评，比较术语错误、遗漏、结构损坏和 LLM 修改量；评测结果决定是否需要保留 LibreTranslate 作为离线降级方案。
