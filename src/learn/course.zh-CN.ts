import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: '使用 TypeScript 构建你的第一个 AI Agent',
  description: `本课程将为你提供一条成为 AI Engineer 的清晰路径。

在 90 分钟内，你将使用 Mastra 和 TypeScript 构建并部署自己的第一个 Agent。在此过程中，你会了解 Agent loop 的底层工作方式、Tool 如何让 Agent 与其他系统交互、MCP 如何接入外部资源，以及上下文工程和 Memory 如何影响整个对话中的行为。

课程结束时，你不仅会交付第一个 Agent，更重要的是，你将掌握独立构建下一个 Agent 的方法。这里实践的模式可以直接运用到今后的各类项目中。

AI Agent 正在带来新一轮平台变革。掌握其构建方法已成为工程师的核心技能，先行者也将拥有更多机会。如果你期待探索 AI Agent 的可能性，并希望通过清晰、实用的路径入门，这门课程正适合你。`,
  lessons: [
    // Module 1: Getting Started
    {
      slug: 'what-is-an-agent',
      title: '什么是 Agent？',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '了解 Agent 与普通聊天体验的区别，认识 Mastra 以及可以用 TypeScript 构建的 AI 应用，并预览贯穿本课程的主题公园伴侣 Agent。',
        bullets: [
          'Agent 与 chatbot 的关键区别',
          'Mastra 的核心构建模块：Agent、Tool、Workflow、Memory、检索和Observability',
          '快速演示在 Studio 中运行的完整 Agent',
        ],
      },
      seo: {
        title: '什么是 Agent？| Mastra',
        description: '了解什么是 AI Agent、它与 chatbot 有何不同，并预览将使用 Mastra 构建的主题公园伴侣 Agent。',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: '运行你的第一个 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '了解开始使用 Mastra 的主要方式，搭建项目脚手架，并打开 Mastra Studio——用于在本地构建和测试 Agent 的交互式界面。',
        bullets: [
          '三种起步方式：集成到现有项目、使用 create-mastra 创建脚手架，或从模板开始',
          '在本地创建并运行 Mastra 项目',
          '熟悉 Studio 中的 Agent、Workflow、Tool 和 Trace',
        ],
      },
      seo: {
        title: '运行你的第一个 Agent | Mastra',
        description: '搭建 Mastra 项目脚手架并在本地运行，然后探索用于构建和测试 Agent 的交互式界面 Mastra Studio。',
      },
    },
    {
      slug: 'project-structure',
      title: '项目结构',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '将 Studio 中看到的内容与 create-mastra 创建的项目结构对应起来，并以脚手架自带的 Weather Agent、Workflow 和 Tool 为参照。',
        bullets: [
          '项目结构：src/mastra/agents、tools、workflows 和 index.ts',
          'Mastra 实例是什么，以及为什么 index.ts 是入口文件',
          '将 Studio 各区域映射到接下来要编辑的源码目录',
        ],
      },
      seo: {
        title: '项目结构 | Mastra',
        description: '了解 Mastra 的项目结构，包括 Agent、Tool、Workflow 和配置，以及 Studio 与源码文件的对应关系。',
      },
    },
    {
      slug: 'create-an-agent',
      title: '创建 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '从零开始编写自己的 Agent，将其注册到 Mastra 配置中，并确认它出现在 Studio 里。后续课程将持续扩展这个 Agent。',
        bullets: [
          '创建包含 name、instructions 和 model 的 Agent 文件',
          '在 src/mastra/index.ts 中注册 Agent',
          '初识 Trace：今后的所有调试都将在这里进行',
        ],
      },
      seo: {
        title: '创建 Agent | Mastra',
        description: '使用 instructions 和 model 配置构建自定义 AI Agent，在 Mastra 中注册，并通过 Studio 运行。',
      },
    },

    // Module 2: Tools
    {
      slug: 'create-a-tool',
      title: '创建 Tool',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '创建一个简单的 Tool，先在 Studio 中单独测试，再将它挂载到 Agent，并通过 prompt 让 Agent 调用它。最后打开 Trace 查看 Tool 调用及其结果。',
        bullets: [
          'Tool 是 Agent 可以调用的函数，包含输入、输出和描述',
          '在 Agent 使用 Tool 之前先通过 Studio 测试',
          '在 Trace 中查看 Tool 调用的输入和输出',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: '借助 AI 构建',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '补充说明：如果你正在使用 Cursor、Windsurf、Claude Code、VS Code、Codex 或其他支持 MCP 的Tool，建议启用 Mastra MCP Docs Server。',
        bullets: ['Mastra MCP Docs Server 是什么', '如何在编辑器中启用它', '编写代码时获取与上下文相关的 Mastra 文档'],
      },
    },
    {
      slug: 'fetch-live-data',
      title: '获取实时数据',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '创建第二个 Tool，使用第一次 Tool 调用返回的 parkId 获取实时排队时间，并观察 Agent 如何自然地串联多个 Tool。',
        bullets: [
          '构建调用外部 API 获取实时数据的 Tool',
          '让 Agent 在一次对话中串联多个 Tool 调用',
          '在 Studio 的 Trace 中验证完整调用链',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: '连接 MCP',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '将 Agent 连接到外部 MCP Server，使用 MCP 生态中的 Tool，并了解 Mastra 如何通过 Model Context Protocol 扩展 Agent 能力。',
        bullets: [
          'MCP Server 是什么，以及它如何提供 Tool',
          '在 Mastra 项目中配置 MCP Server 连接',
          '将 MCP 提供的 Tool 与自定义 Tool 结合使用',
        ],
      },
    },

    // Module 3: Workflows
    {
      slug: 'build-a-workflow',
      title: '构建 Workflow',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'Agent 可以调用单个 Tool，但有些任务需要可重复执行的多步骤流程。你将构建一个 Workflow，串联多个步骤并在 Studio 中运行。',
        bullets: [
          '何时适合使用 Workflow：多步骤、固定顺序',
          'createStep() 和 createWorkflow() 的基础用法',
          '步骤的输入与输出：数据如何在步骤间流动',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agent 与 Workflow 的区别',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro: '继续构建之前，先建立清晰的思维模型，理解何时使用 Agent、何时使用 Workflow。',
        bullets: [
          'Agent：面对开放式目标，由模型决定执行步骤和停止时机',
          'Workflow：预先定义步骤，由你控制路径和停止条件',
          '经验法则：灵活规划使用 Agent，可重复流程使用 Workflow',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: '在 Workflow 中使用 Agent',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          '让系统真正可用：用户与主 Agent 对话，Agent 将多步骤工作交给 Workflow。再使用 suspend 和 resume 添加 Human-in-the-Loop 审批步骤。',
        bullets: [
          '让 Agent 将整个 Workflow 作为一项能力触发',
          '使用 suspend()、resume() 和 bail() 添加 HITL 审批门禁',
          '通过 Trace 端到端查看 Workflow 步骤、Tool 调用和输出',
        ],
      },
    },

    // Module 4: Memory
    {
      slug: 'how-memory-works',
      title: 'Memory 的工作方式',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '模型在不同调用之间没有状态，Memory 让后续追问成为可能。你将在 Studio 中追踪一次真实对话，准确查看 Agent 收到的上下文，并了解 lastMessages 如何控制每次调用包含的历史消息量。',
        bullets: [
          '模型为什么没有状态，以及 Mastra 如何处理这一问题',
          '上下文工程：决定模型在每次调用中能看到什么',
          'lastMessages：控制上下文窗口中近期历史消息的设置',
        ],
      },
    },
    {
      slug: 'observational-memory',
      title: 'Observational Memory',
      durationMin: 5,
      youtubeId: 'x2UQ7zIdrbI',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '原始消息历史会迅速累积。启用 Observational Memory 后，旧上下文会自动压缩为更紧凑的观察结果；随后测试 resource 级别的 Memory，让同一用户的偏好可以跨 thread 保留。',
        bullets: [
          'OM 通过 Observer 和 Reflector 后台 Agent 压缩较早的历史记录',
          'Resource scope：Memory 会跟随用户跨 thread 保留，而不只局限于一次对话',
          'OM 通过自动上下文管理取代手动调整 lastMessages',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: '使用 Processor 设置 Guardrail',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '面向真实用户后，你需要设置输入 Guardrail。添加 PromptInjectionDetector 和 ModerationProcessor，在恶意请求到达模型之前将其阻止。',
        bullets: [
          'Processor 会在模型调用前以及响应后拦截消息',
          'PromptInjectionDetector：阻止注入、越狱和覆盖系统指令的尝试',
          'ModerationProcessor：检查传入消息中的仇恨和骚扰内容',
        ],
      },
    },

    // Module 5: Production
    {
      slug: 'deploy-to-mastra-platform',
      title: '部署到 Mastra 平台',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: '生产环境',
      preview: {
        intro: '使用 Mastra Server，将主题公园 Agent 从本地 Studio 环境部署到可公开访问的线上 endpoint。',
        bullets: [
          '通过 Swagger UI 查看已作为 HTTP endpoint 暴露的每个 Agent',
          '运行 mastra server deploy 完成构建和上传，并获得稳定的公开 URL',
          'Mastra 本身已经是 HTTP Server，而 Mastra Server 负责将它发布到公网',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: '在 Slack 中与 Agent 对话',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: '生产环境',
      preview: {
        intro:
          '将已部署的主题公园 Agent 连接到 Slack，以便从任何地方通过私信与它交流，同时复用同样的 Tool、Memory 和 Workflow。',
        bullets: [
          '为 Agent 添加 Slack adapter 和 channels 配置',
          'Mastra 会自动暴露 webhook 路由，无需编写 handler',
          'Channels 也通过同样的模式支持 Discord 和 Telegram',
        ],
      },
    },
  ],
}
