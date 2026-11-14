import type { Course } from './types'

export const course: Course = {
  courseId: 'mastra-101',
  title: '使用 TypeScript 建立你的第一個 AI Agent',
  description: `這門課將帶領你踏上成為 AI 工程師的學習之路。

你會在 90 分鐘內使用 Mastra，以 TypeScript 建立並部署第一個 Agent。在過程中，你將了解 Agent 迴圈的底層運作方式、Tool 如何讓 Agent 存取其他系統、MCP 如何開啟外部資源的大門，以及情境工程與 Memory 如何在對話過程中形塑行為。

完成課程時，你不只會推出第一個 Agent，更重要的是，你會知道如何獨力打造下一個。你在這裡實作的模式，都能直接運用到接下來想建立的任何專案。

AI Agent 正在帶來下一波平台變革。了解如何建立 AI Agent，如今已是工程師的核心技能，而搶先掌握這項技能的人也將擁有實質機會。如果你對未來的可能性感到期待，並想循著清楚、實用的路徑開始行動，這門課正適合你。`,
  lessons: [
    // Module 1：Agent
    {
      slug: 'what-is-an-agent',
      title: '什麼是 Agent？',
      durationMin: 5,
      status: 'published',
      youtubeId: 'G8tXjcseNjg',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '說明 Agent 與基本聊天體驗的差異、介紹 Mastra，以及你能用 TypeScript 建立哪些 AI 應用程式，並預覽你將在整門課中打造的主題樂園嚮導 Agent。',
        bullets: [
          'Agent 與聊天機器人的差異',
          'Mastra 的核心元件：Agent、Tool、Workflow、Memory、檢索與 Observability',
          '快速瀏覽在 Studio 中執行的完成版 Agent',
        ],
      },
      seo: {
        title: '什麼是 Agent？ | Mastra',
        description: '了解什麼是 AI Agent、它與聊天機器人的差異，並預覽你將使用 Mastra 建立的主題樂園嚮導 Agent。',
      },
    },
    {
      slug: 'run-your-first-agent',
      title: '執行你的第一個 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'RaqlPrGBscw',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '介紹開始使用 Mastra 的主要方式、建立專案骨架，以及開啟 Mastra Studio——這是用來在本機建立及測試 Agent 的互動式 UI。',
        bullets: [
          '三種起步方式：整合、使用 create-mastra 建立專案骨架，或從範本開始',
          '在本機建立並執行 Mastra 專案',
          '瀏覽 Studio：Agent、Workflow、Tool 與 Trace',
        ],
      },
      seo: {
        title: '執行你的第一個 Agent | Mastra',
        description: '建立 Mastra 專案骨架、在本機執行，並探索用來建立及測試 Agent 的互動式 UI——Mastra Studio。',
      },
    },
    {
      slug: 'project-structure',
      title: '專案結構',
      durationMin: 4,
      status: 'published',
      youtubeId: 'lDKFFWLmt1Q',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '將 Studio 中看到的內容，對應到 create-mastra 建立的專案結構。以專案骨架中的 Weather Agent、Workflow 與 Tool 作為參考。',
        bullets: [
          '專案結構：src/mastra/agents、tools、workflows 與 index.ts',
          'Mastra 執行個體是什麼，以及 index.ts 為何是進入點',
          '將 Studio 各區塊對應到接下來要編輯的原始碼資料夾',
        ],
      },
      seo: {
        title: '專案結構 | Mastra',
        description: '了解 Mastra 專案結構，包括 Agent、Tool、Workflow、設定，以及 Studio 如何對應到原始碼檔案。',
      },
    },
    {
      slug: 'create-an-agent',
      title: '建立 Agent',
      durationMin: 5,
      status: 'published',
      youtubeId: 'lwhJxPl_loQ',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Agent',
      preview: {
        intro:
          '從零開始以程式碼建立自己的 Agent、在 Mastra 設定中註冊，並確認它出現在 Studio 中。接下來的課程都會持續擴充這個 Agent。',
        bullets: [
          '建立包含名稱、指示與模型的 Agent 檔案',
          '在 src/mastra/index.ts 中註冊 Agent',
          '初探 Trace：「我們會在這裡偵錯所有內容」',
        ],
      },
      seo: {
        title: '建立 Agent | Mastra',
        description: '使用指示與模型設定建立自訂 AI Agent、在 Mastra 中註冊，並於 Studio 中執行。',
      },
    },

    // Module 2：Tool
    {
      slug: 'create-a-tool',
      title: '建立 Tool',
      durationMin: 7,
      status: 'published',
      youtubeId: 'P8voCXTIGVI',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '建立一個簡單的 Tool、在 Studio 中單獨測試、將它連接至 Agent，並提示 Agent 呼叫這個 Tool。接著開啟 Trace，查看 Tool 呼叫及其結果。',
        bullets: [
          'Tool 是 Agent 能呼叫的函式，包含輸入、輸出與說明',
          '在 Agent 使用 Tool 前，先於 Studio 中測試',
          '在 Trace 中顯示 Tool 呼叫的輸入與輸出',
        ],
      },
    },
    {
      slug: 'build-with-ai',
      title: '使用 AI 開發',
      durationMin: 3,
      status: 'published',
      youtubeId: 'PBtct9tG19k',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '補充說明：如果你使用 Cursor、Windsurf、Claude Code、VS Code、Codex，或任何支援 MCP 的Tool，值得啟用 Mastra MCP Docs Server。',
        bullets: ['什麼是 Mastra MCP Docs Server', '如何在編輯器中啟用', '在撰寫程式碼時取得相關的 Mastra 文件'],
      },
    },
    {
      slug: 'fetch-live-data',
      title: '擷取即時資料',
      durationMin: 7,
      status: 'published',
      youtubeId: 'CMofx-DhpoY',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '建立第二個 Tool，使用第一次 Tool 呼叫所傳回的 parkId，擷取樂園的即時等候時間。展示 Agent 串連 Tool 時，它們如何自然地組合運作。',
        bullets: [
          '建立呼叫外部 API 以取得即時資料的 Tool',
          '讓 Agent 在單一對話中串連多次 Tool 呼叫',
          '在 Studio Trace 中驗證完整呼叫鏈',
        ],
      },
    },
    {
      slug: 'connect-to-mcp',
      title: '連線至 MCP',
      durationMin: 7,
      status: 'published',
      youtubeId: 'b8rNHmL4s2s',
      publishedDate: '2026-03-04T00:00:00Z',
      module: 'Tool',
      preview: {
        intro:
          '將 Agent 連線至外部 MCP 伺服器，以存取 MCP 生態系提供的 Tool。展示 Mastra 如何透過 Model Context Protocol，銜接 Agent 與外部能力。',
        bullets: [
          '什麼是 MCP 伺服器，以及它們如何公開 Tool',
          '在 Mastra 專案中設定 MCP 伺服器連線',
          '搭配自訂 Tool 使用 MCP 提供的 Tool',
        ],
      },
    },

    // Module 3：Workflow
    {
      slug: 'build-a-workflow',
      title: '建立 Workflow',
      durationMin: 7.5,
      youtubeId: 'Xu0N43frgMs',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          'Agent 可以呼叫單一 Tool，但有些工作需要可重複執行的多步驟流程。建立 Workflow、串接多個步驟，並在 Studio 中執行。',
        bullets: [
          '適合使用 Workflow 的時機：多步驟、固定順序',
          'createStep() 與 createWorkflow() 基礎',
          '步驟輸入與輸出：資料在步驟間流動',
        ],
      },
    },
    {
      slug: 'agents-vs-workflows',
      title: 'Agent 與 Workflow 的比較',
      durationMin: 3,
      youtubeId: 'kiFhVZyHG84',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro: '繼續開發前，先建立清楚的心智模型，了解何時該使用 Agent、何時該使用 Workflow。',
        bullets: [
          'Agent：開放式目標，由模型決定步驟與停止時機',
          'Workflow：預先定義步驟，由你控制路徑與停止條件',
          '經驗法則：使用 Agent 進行彈性規劃，使用 Workflow 處理可重複的流程',
        ],
      },
    },
    {
      slug: 'agents-in-workflows',
      title: 'Workflow 中的 Agent',
      durationMin: 9,
      youtubeId: 'hHtUcuDqFrY',
      status: 'published',
      module: 'Workflow',
      preview: {
        intro:
          '讓系統真正實用：使用者與主要 Agent 對話，再由 Agent 將多步驟工作交給 Workflow。使用 suspend 與 resume 加入一個 Human-in-the-Loop 核准步驟。',
        bullets: [
          '將 Workflow 作為單一能力，從 Agent 觸發',
          '使用 suspend()、resume() 與 bail() 加入 HITL 核准關卡',
          'Trace 端對端呈現 Workflow 步驟、Tool 呼叫與輸出',
        ],
      },
    },

    // Module 4：Memory
    {
      slug: 'how-memory-works',
      title: 'Memory 如何運作',
      durationMin: 5.5,
      youtubeId: 'RvtDJJhI8FE',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '模型在不同呼叫之間不保留狀態，而 Memory 能讓後續對話延續下去。在 Studio 中追蹤一段真實對話，查看 Agent 實際收到哪些情境，並了解 lastMessages 設定如何控制每次呼叫納入多少歷史記錄。',
        bullets: [
          '模型為何不保留狀態，以及 Mastra 如何處理這個問題',
          '情境工程：決定模型在每次呼叫中能看到什麼',
          'lastMessages：控制情境視窗中近期歷史記錄的設定',
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
          '原始訊息歷史記錄很快就會大量累積。啟用 Observational Memory，將較舊的情境自動壓縮成資訊密度更高的觀察結果，再測試以資源為範圍的 Memory，讓同一位使用者的偏好能跨討論串延續。',
        bullets: [
          'OM 透過 Observer 與 Reflector 背景 Agent 壓縮較舊的歷史記錄',
          '資源範圍：Memory 會隨使用者跨討論串延續，而非只存在於單一對話中',
          'OM 以自動情境管理取代手動調整 lastMessages',
        ],
      },
    },
    {
      slug: 'guardrails-with-processors',
      title: '使用 Processors 設定防護機制',
      durationMin: 5,
      youtubeId: '9XHVGLld8kk',
      status: 'published',
      module: 'Memory',
      preview: {
        intro:
          '當真實使用者開始使用系統，就需要輸入防護機制。加入 PromptInjectionDetector 與 ModerationProcessor，在模型看到惡意要求之前先行封鎖。',
        bullets: [
          'Processors 會在模型呼叫前與回應後攔截訊息',
          'PromptInjectionDetector：封鎖提示詞注入、越獄與覆寫系統指示的嘗試',
          'ModerationProcessor：篩查傳入訊息中的仇恨與騷擾內容',
        ],
      },
    },

    // Module 5：正式環境
    {
      slug: 'deploy-to-mastra-platform',
      title: '部署至 Mastra 平台',
      durationMin: 4,
      youtubeId: 'O1FnS_qrsPs',
      status: 'published',
      module: '正式環境',
      preview: {
        intro: '使用 Mastra Server，將主題樂園 Agent 從本機 Studio 環境部署至公開上線的端點。',
        bullets: [
          '探索 Swagger UI，查看已公開為 HTTP 端點的每個 Agent',
          '執行 mastra server deploy，完成建置與上傳，並取得穩定的公開網址',
          'Mastra 本身就是 HTTP 伺服器，而 Mastra Server 能將它部署到公開環境',
        ],
      },
    },
    {
      slug: 'chat-with-agent-in-slack',
      title: '在 Slack 中與 Agent 對話',
      durationMin: 9,
      youtubeId: 'fD6M6n_OdJI',
      status: 'published',
      module: '正式環境',
      preview: {
        intro:
          '將已部署的主題樂園 Agent 連線至 Slack，讓你能從任何地方傳送訊息給它，並在私訊中使用相同的 Tool、Memory 與 Workflow。',
        bullets: [
          '將 Slack adapter 與 channels 設定加入 Agent',
          'Mastra 會自動公開 webhook 路由，無須撰寫 handler',
          'Channels 也能透過相同模式支援 Discord 與 Telegram',
        ],
      },
    },
  ],
}
