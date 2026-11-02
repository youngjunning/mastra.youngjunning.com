import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import Translate, { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import SiteVisitStats from '@site/src/components/SiteVisitStats'
import Layout from '@theme/Layout'
import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  BrainCircuit,
  Check,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Telescope,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './index.module.css'

const capabilities = [
  {
    icon: Bot,
    title: translate({ id: 'homepage.capabilities.agents.title', message: 'Agents' }),
    description: translate({
      id: 'homepage.capabilities.agents.description',
      message: 'Define typed agents with instructions, models, tools, and runtime behavior in one place.',
    }),
    cta: translate({ id: 'homepage.capabilities.agents.cta', message: 'Explore agents' }),
    href: '/docs/agents/overview',
  },
  {
    icon: Workflow,
    title: translate({ id: 'homepage.capabilities.workflows.title', message: 'Workflows' }),
    description: translate({
      id: 'homepage.capabilities.workflows.description',
      message: 'Compose typed steps, branches, retries, and human approval into durable workflows.',
    }),
    cta: translate({ id: 'homepage.capabilities.workflows.cta', message: 'Explore workflows' }),
    href: '/docs/workflows/overview',
  },
  {
    icon: BrainCircuit,
    title: translate({ id: 'homepage.capabilities.memory.title', message: 'Memory' }),
    description: translate({
      id: 'homepage.capabilities.memory.description',
      message: 'Give agents durable context with conversation history, semantic recall, and observational memory.',
    }),
    cta: translate({ id: 'homepage.capabilities.memory.cta', message: 'Explore memory' }),
    href: '/docs/memory/overview',
  },
  {
    icon: Network,
    title: translate({ id: 'homepage.capabilities.mcp.title', message: 'MCP' }),
    description: translate({
      id: 'homepage.capabilities.mcp.description',
      message: 'Connect agents to external tools and publish your own Model Context Protocol servers.',
    }),
    cta: translate({ id: 'homepage.capabilities.mcp.cta', message: 'Explore MCP' }),
    href: '/docs/mcp/overview',
  },
  {
    icon: Telescope,
    title: translate({ id: 'homepage.capabilities.observability.title', message: 'Observability' }),
    description: translate({
      id: 'homepage.capabilities.observability.description',
      message: 'Inspect model calls, tool calls, costs, latency, and execution paths from one trace.',
    }),
    cta: translate({ id: 'homepage.capabilities.observability.cta', message: 'Explore observability' }),
    href: '/docs/observability/overview',
  },
  {
    icon: Cloud,
    title: translate({ id: 'homepage.capabilities.deployment.title', message: 'Deployment' }),
    description: translate({
      id: 'homepage.capabilities.deployment.description',
      message: 'Run Mastra as a standalone server or deploy it with the platform and adapters you already use.',
    }),
    cta: translate({ id: 'homepage.capabilities.deployment.cta', message: 'Explore deployment' }),
    href: '/docs/deployment/overview',
  },
]

const useCases = [
  {
    icon: Blocks,
    eyebrow: translate({ id: 'homepage.useCases.product.eyebrow', message: 'For product teams' }),
    title: translate({ id: 'homepage.useCases.product.title', message: 'Customer-facing agents' }),
    description: translate({
      id: 'homepage.useCases.product.description',
      message: 'Answer questions, complete tasks, stream structured UI, and hand users back to your product flows.',
    }),
    links: [
      {
        label: translate({ id: 'homepage.useCases.product.agentOverview', message: 'Agent overview' }),
        href: '/docs/agents/overview',
      },
      {
        label: translate({ id: 'homepage.useCases.product.streaming', message: 'Streaming' }),
        href: '/guides/concepts/streaming',
      },
    ],
  },
  {
    icon: GitBranch,
    eyebrow: translate({ id: 'homepage.useCases.operations.eyebrow', message: 'For operations teams' }),
    title: translate({ id: 'homepage.useCases.operations.title', message: 'Internal automation' }),
    description: translate({
      id: 'homepage.useCases.operations.description',
      message: 'Connect tools and business systems, then coordinate repeatable work with explicit workflow control.',
    }),
    links: [
      {
        label: translate({ id: 'homepage.useCases.operations.workflowOverview', message: 'Workflow overview' }),
        href: '/docs/workflows/overview',
      },
      {
        label: translate({ id: 'homepage.useCases.operations.toolsAndMcp', message: 'Tools and MCP' }),
        href: '/docs/mcp/overview',
      },
    ],
  },
  {
    icon: ServerCog,
    eyebrow: translate({ id: 'homepage.useCases.platform.eyebrow', message: 'For platform teams' }),
    title: translate({ id: 'homepage.useCases.platform.title', message: 'Agent infrastructure' }),
    description: translate({
      id: 'homepage.useCases.platform.description',
      message: 'Offer shared agent primitives with server APIs, model routing, storage, evals, and observability.',
    }),
    links: [
      {
        label: translate({ id: 'homepage.useCases.platform.mastraServer', message: 'Mastra server' }),
        href: '/docs/server/mastra-server',
      },
      {
        label: translate({ id: 'homepage.useCases.platform.modelProviders', message: 'Model providers' }),
        href: '/models',
      },
    ],
  },
]

const resources = [
  {
    icon: Zap,
    label: translate({ id: 'homepage.resources.quickstart.label', message: 'Quickstart' }),
    description: translate({
      id: 'homepage.resources.quickstart.description',
      message: 'Create and run your first Mastra agent.',
    }),
    href: '/guides/getting-started/quickstart',
  },
  {
    icon: Code2,
    label: translate({ id: 'homepage.resources.guides.label', message: 'Guides and examples' }),
    description: translate({
      id: 'homepage.resources.guides.description',
      message: 'Start from working agent and workflow patterns.',
    }),
    href: '/guides',
  },
  {
    icon: Sparkles,
    label: translate({ id: 'homepage.resources.learn.label', message: 'Learn Mastra' }),
    description: translate({
      id: 'homepage.resources.learn.description',
      message: 'Follow the course from fundamentals to production.',
    }),
    href: '/learn',
  },
  {
    icon: GitBranch,
    label: translate({ id: 'homepage.resources.releases.label', message: 'Latest releases' }),
    description: translate({
      id: 'homepage.resources.releases.description',
      message: 'See what changed in the current Mastra release.',
    }),
    href: 'https://github.com/mastra-ai/mastra/releases',
    external: true,
  },
]

const faqs = [
  {
    question: translate({ id: 'homepage.faq.whatIsMastra.question', message: 'What is Mastra?' }),
    answer: translate({
      id: 'homepage.faq.whatIsMastra.answer',
      message:
        'Mastra is an open-source TypeScript framework for building AI applications and agents. It includes agents, workflows, memory, model routing, evaluation, observability, and deployment tools.',
    }),
  },
  {
    question: translate({
      id: 'homepage.faq.existingApp.question',
      message: 'Can Mastra run in an existing TypeScript application?',
    }),
    answer: translate({
      id: 'homepage.faq.existingApp.answer',
      message:
        'Yes. Use Mastra inside Node.js and web framework projects, or run it as a standalone server. The same agent and workflow definitions can move from local development to production.',
    }),
  },
  {
    question: translate({ id: 'homepage.faq.models.question', message: 'Which AI models does Mastra support?' }),
    answer: translate({
      id: 'homepage.faq.models.answer',
      message:
        'Mastra provides a standard model interface across major providers and gateways. Open the model directory to browse the current provider and model documentation.',
    }),
  },
  {
    question: translate({ id: 'homepage.faq.debug.question', message: 'How do I debug an agent run?' }),
    answer: translate({
      id: 'homepage.faq.debug.answer',
      message:
        'Mastra records traces for model calls, tool calls, workflows, and handoffs. Use Studio during development and observability integrations in production.',
    }),
  },
  {
    question: translate({ id: 'homepage.faq.openSource.question', message: 'Is Mastra open source?' }),
    answer: translate({
      id: 'homepage.faq.openSource.answer',
      message:
        'Yes. The framework and this documentation are developed in the public mastra-ai/mastra GitHub repository under the Apache 2.0 license.',
    }),
  },
]

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={styles.arrowLink} to={href}>
      {children}
      <ArrowRight aria-hidden="true" size={16} />
    </Link>
  )
}

function ProductPreview() {
  return (
    <div
      className={styles.productPreview}
      aria-label={translate({
        id: 'homepage.preview.ariaLabel',
        message: 'Mastra development and observability preview',
      })}
    >
      <div className={styles.previewTopbar}>
        <div className={styles.trafficLights} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.previewTitle}>mastra-project</div>
        <div className={styles.previewStatus}>
          <span /> <Translate id="homepage.preview.running">running</Translate>
        </div>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.previewSidebar}>
          <div className={styles.previewSidebarLabel}>
            <Translate id="homepage.preview.workspace">Workspace</Translate>
          </div>
          <div className={styles.previewNavActive}>
            <Bot aria-hidden="true" size={15} /> <Translate id="homepage.preview.agents">Agents</Translate>
          </div>
          <div className={styles.previewNavItem}>
            <Terminal aria-hidden="true" size={15} /> <Translate id="homepage.preview.tools">Tools</Translate>
          </div>
          <div className={styles.previewNavItem}>
            <Workflow aria-hidden="true" size={15} /> <Translate id="homepage.preview.workflows">Workflows</Translate>
          </div>
          <div className={styles.previewNavItem}>
            <Database aria-hidden="true" size={15} /> <Translate id="homepage.preview.memory">Memory</Translate>
          </div>
          <div className={styles.previewDivider} />
          <div className={styles.previewSidebarLabel}>
            <Translate id="homepage.preview.observe">Observe</Translate>
          </div>
          <div className={styles.previewNavItem}>
            <Activity aria-hidden="true" size={15} /> <Translate id="homepage.preview.traces">Traces</Translate>
          </div>
          <div className={styles.previewNavItem}>
            <ShieldCheck aria-hidden="true" size={15} /> <Translate id="homepage.preview.evals">Evals</Translate>
          </div>
        </div>
        <div className={styles.tracePanel}>
          <div className={styles.traceHeader}>
            <div>
              <span className={styles.traceEyebrow}>
                <Translate id="homepage.preview.agentRun">Agent run</Translate>
              </span>
              <strong>research-assistant</strong>
            </div>
            <span className={styles.traceSuccess}>
              <Check aria-hidden="true" size={13} /> <Translate id="homepage.preview.completed">completed</Translate>
            </span>
          </div>
          <div className={styles.traceTimeline}>
            <div className={styles.traceRow}>
              <span className={styles.traceIconPurple}>
                <Bot aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>
                  <Translate id="homepage.preview.agentStarted">Agent started</Translate>
                </strong>
                <small>
                  <Translate id="homepage.preview.agentStartedDetail">Instructions and memory loaded</Translate>
                </small>
              </div>
              <code>18ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconOrange}>
                <Sparkles aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>
                  <Translate id="homepage.preview.modelGeneration">Model generation</Translate>
                </strong>
                <small>
                  <Translate id="homepage.preview.modelGenerationDetail">
                    Selected tools and planned the response
                  </Translate>
                </small>
              </div>
              <code>842ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconBlue}>
                <Terminal aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>searchDocs</strong>
                <small>
                  <Translate id="homepage.preview.searchDocsDetail">3 relevant documents returned</Translate>
                </small>
              </div>
              <code>126ms</code>
            </div>
            <div className={styles.traceRow}>
              <span className={styles.traceIconGreen}>
                <Check aria-hidden="true" size={15} />
              </span>
              <div>
                <strong>
                  <Translate id="homepage.preview.responseCompleted">Response completed</Translate>
                </strong>
                <small>
                  <Translate id="homepage.preview.responseCompletedDetail">Trace, tokens, and score recorded</Translate>
                </small>
              </div>
              <code>1.2s</code>
            </div>
          </div>
          <div className={styles.metricsRow}>
            <span>
              <small>
                <Translate id="homepage.preview.tokens">Tokens</Translate>
              </small>
              <strong>1,284</strong>
            </span>
            <span>
              <small>
                <Translate id="homepage.preview.toolCalls">Tool calls</Translate>
              </small>
              <strong>1</strong>
            </span>
            <span>
              <small>
                <Translate id="homepage.preview.score">Score</Translate>
              </small>
              <strong>0.94</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home(): ReactNode {
  const {
    siteConfig,
    i18n: { currentLocale },
  } = useDocusaurusContext()
  const location = useLocation()
  const title = translate({ id: 'homepage.meta.title', message: 'Build AI agents' })
  const description = translate({
    id: 'homepage.meta.description',
    message:
      'Build, observe, and improve production AI agents with Mastra, the open-source TypeScript agent framework.',
  })
  const canonicalUrl = new URL(location.pathname, siteConfig.url).toString()
  const alternateSiteName = translate({
    id: 'homepage.structuredData.siteName',
    message: 'Mastra documentation community',
  })
  const socialTitle = translate({ id: 'homepage.meta.ogTitle', message: 'Build AI agents with Mastra' })
  const socialDescription = translate({
    id: 'homepage.meta.ogDescription',
    message: 'The open-source TypeScript framework for building, observing, and improving production AI agents.',
  })
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: 'Mastra',
      alternateName: alternateSiteName,
      url: siteConfig.url,
      description,
      inLanguage: currentLocale,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: { '@id': `${siteConfig.url}/#website` },
      inLanguage: currentLocale,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: new URL('/img/og-home.png', siteConfig.url).toString(),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      isPartOf: { '@id': `${canonicalUrl}#webpage` },
      inLanguage: currentLocale,
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ]

  return (
    <Layout title={title} description={description} noFooter wrapperClassName={styles.layout}>
      <Head>
        <meta property="og:title" content={socialTitle} />
        <meta name="twitter:title" content={socialTitle} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <meta property="og:description" content={socialDescription} />
        <meta name="twitter:description" content={socialDescription} />
      </Head>

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <Link className={styles.eyebrow} to="https://github.com/mastra-ai/mastra">
                <span className={styles.eyebrowDot} />
                <Translate id="homepage.hero.eyebrow">Open-source TypeScript agent framework</Translate>
                <ArrowRight aria-hidden="true" size={14} />
              </Link>
              <h1>
                <Translate id="homepage.hero.title">Build AI agents that work in production</Translate>
              </h1>
              <p>
                <Translate id="homepage.hero.description">
                  Build, observe, and improve agents that can run for days. Mastra gives TypeScript teams one framework
                  for agents, workflows, memory, evals, and deployment.
                </Translate>
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} to="/guides/getting-started/quickstart">
                  <Translate id="homepage.hero.startBuilding">Start building</Translate>{' '}
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link className={styles.secondaryButton} to="/docs">
                  <Translate id="homepage.hero.readDocs">Read the docs</Translate>
                </Link>
              </div>
              <div className={styles.installCommand}>
                <Terminal aria-hidden="true" size={16} />
                <code>npm create mastra@latest</code>
                <span>
                  <Translate id="homepage.hero.installHint">Get a working project in minutes</Translate>
                </span>
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section
          className={styles.trustStrip}
          aria-label={translate({ id: 'homepage.trust.ariaLabel', message: 'Teams using Mastra' })}
        >
          <div className={styles.container}>
            <p>
              <Translate id="homepage.trust.title">Built for teams shipping real agent systems</Translate>
            </p>
            <div
              className={styles.logoCloud}
              aria-label={translate({ id: 'homepage.trust.customersAriaLabel', message: 'Selected Mastra customers' })}
            >
              <span>Replit</span>
              <span>Sanity</span>
              <span>WorkOS</span>
              <span>MongoDB</span>
              <span>PayPal</span>
              <span>SoftBank</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>
                <Translate id="homepage.framework.kicker">Framework</Translate>
              </span>
              <h2>
                <Translate id="homepage.framework.title">Everything an agent needs, in one TypeScript stack</Translate>
              </h2>
              <p>
                <Translate id="homepage.framework.description">
                  Start with one agent. Add control, context, tools, and production visibility without changing stacks.
                </Translate>
              </p>
            </div>
            <div className={styles.capabilityGrid}>
              {capabilities.map(({ icon: Icon, title, description, cta, href }) => (
                <Link className={styles.capabilityCard} to={href} key={title}>
                  <span className={styles.cardIcon}>
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className={styles.cardLink}>
                    {cta} <ArrowRight aria-hidden="true" size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.splitSection}>
          <div className={styles.container}>
            <div className={styles.splitGrid}>
              <div className={styles.splitCopy}>
                <span className={styles.kicker}>
                  <Translate id="homepage.code.kicker">Build with code</Translate>
                </span>
                <h2>
                  <Translate id="homepage.code.title">Typed from the first prompt to the final tool call</Translate>
                </h2>
                <p>
                  <Translate id="homepage.code.description">
                    Define an agent with the same language, package manager, schemas, and deployment workflow your team
                    already uses.
                  </Translate>
                </p>
                <ul className={styles.checkList}>
                  <li>
                    <Check aria-hidden="true" size={15} />{' '}
                    <Translate id="homepage.code.typed">Typed inputs and structured outputs</Translate>
                  </li>
                  <li>
                    <Check aria-hidden="true" size={15} />{' '}
                    <Translate id="homepage.code.routing">Provider-independent model routing</Translate>
                  </li>
                  <li>
                    <Check aria-hidden="true" size={15} />{' '}
                    <Translate id="homepage.code.builtIn">Built-in tools, memory, and workflows</Translate>
                  </li>
                </ul>
                <ArrowLink href="/docs/agents/overview">
                  <Translate id="homepage.code.cta">Explore agents</Translate>
                </ArrowLink>
              </div>
              <div className={styles.codeWindow}>
                <div className={styles.codeHeader}>
                  <span>src/mastra/agents/assistant.ts</span>
                  <span>TypeScript</span>
                </div>
                <pre
                  aria-label={translate({
                    id: 'homepage.code.exampleAriaLabel',
                    message: 'Mastra agent TypeScript example',
                  })}
                >
                  <code>
                    <span className={styles.codePink}>import</span>
                    {' { Agent } '}
                    <span className={styles.codePink}>from</span>{' '}
                    <span className={styles.codeGreen}>'@mastra/core/agent'</span>
                    {'\n\n'}
                    <span className={styles.codePink}>export const</span>
                    {' assistant = '}
                    <span className={styles.codePurple}>new</span>
                    {' Agent({\n  '}
                    <span className={styles.codeBlue}>id</span>
                    {': '}
                    <span className={styles.codeGreen}>'assistant'</span>
                    {',\n  '}
                    <span className={styles.codeBlue}>name</span>
                    {': '}
                    <span className={styles.codeGreen}>'Assistant'</span>
                    {',\n  '}
                    <span className={styles.codeBlue}>instructions</span>
                    {': '}
                    <span className={styles.codeGreen}>'Help users complete their work.'</span>
                    {',\n  '}
                    <span className={styles.codeBlue}>model</span>
                    {': process.env.MODEL,\n  '}
                    <span className={styles.codeBlue}>tools</span>
                    {': { searchDocs },\n})'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.observabilitySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>
                <Translate id="homepage.observe.kicker">Observe and improve</Translate>
              </span>
              <h2>
                <Translate id="homepage.observe.title">See what every agent is doing</Translate>
              </h2>
              <p>
                <Translate id="homepage.observe.description">
                  Trace each model call and tool decision, evaluate results, and turn production feedback into better
                  behavior.
                </Translate>
              </p>
            </div>
            <div className={styles.observabilityGrid}>
              <div className={styles.observabilityVisual} aria-hidden="true">
                <div className={styles.chartHeader}>
                  <span>
                    <Translate id="homepage.observe.agentQuality">Agent quality</Translate>
                  </span>
                  <strong>94.2%</strong>
                </div>
                <div className={styles.chart}>
                  {[38, 52, 47, 66, 62, 74, 71, 88, 84, 94].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className={styles.chartLegend}>
                  <span>
                    <Translate id="homepage.observe.sevenDaysAgo">7 days ago</Translate>
                  </span>
                  <span>
                    <Translate id="homepage.observe.today">Today</Translate>
                  </span>
                </div>
              </div>
              <div className={styles.observeCards}>
                <Link to="/docs/observability/overview">
                  <Activity aria-hidden="true" size={19} />
                  <div>
                    <strong>
                      <Translate id="homepage.observe.tracesTitle">Traces and metrics</Translate>
                    </strong>
                    <span>
                      <Translate id="homepage.observe.tracesDescription">
                        Inspect execution, latency, cost, and tool usage.
                      </Translate>
                    </span>
                  </div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link to="/docs/evals/overview">
                  <ShieldCheck aria-hidden="true" size={19} />
                  <div>
                    <strong>
                      <Translate id="homepage.observe.evalsTitle">Evals and scorers</Translate>
                    </strong>
                    <span>
                      <Translate id="homepage.observe.evalsDescription">
                        Run repeatable checks before and after deployment.
                      </Translate>
                    </span>
                  </div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link to="/docs/studio/overview">
                  <Terminal aria-hidden="true" size={19} />
                  <div>
                    <strong>
                      <Translate id="homepage.observe.studioTitle">Local Studio</Translate>
                    </strong>
                    <span>
                      <Translate id="homepage.observe.studioDescription">
                        Test agents, workflows, tools, and datasets as you build.
                      </Translate>
                    </span>
                  </div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <span className={styles.kicker}>
                <Translate id="homepage.useCases.kicker">Use cases</Translate>
              </span>
              <h2>
                <Translate id="homepage.useCases.title">One framework across the company</Translate>
              </h2>
            </div>
            <div className={styles.useCaseGrid}>
              {useCases.map(({ icon: Icon, eyebrow, title, description, links }) => (
                <article className={styles.useCaseCard} key={title}>
                  <div className={styles.useCaseHeader}>
                    <span className={styles.cardIcon}>
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span>{eyebrow}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className={styles.useCaseLinks}>
                    {links.map(link => (
                      <ArrowLink href={link.href} key={link.href}>
                        {link.label}
                      </ArrowLink>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resourceSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingInline}>
              <div>
                <span className={styles.kicker}>
                  <Translate id="homepage.resources.kicker">Resources</Translate>
                </span>
                <h2>
                  <Translate id="homepage.resources.title">Go from idea to working agent</Translate>
                </h2>
              </div>
              <ArrowLink href="/docs">
                <Translate id="homepage.resources.browseAll">Browse all documentation</Translate>
              </ArrowLink>
            </div>
            <div className={styles.resourceGrid}>
              {resources.map(({ icon: Icon, label, description, href, external }) => (
                <Link
                  className={styles.resourceCard}
                  to={href}
                  key={label}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <Icon aria-hidden="true" size={20} />
                  <strong>{label}</strong>
                  <span>{description}</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.container}>
            <div className={styles.faqGrid}>
              <div className={styles.faqIntro}>
                <span className={styles.kicker}>
                  <Translate id="homepage.faq.kicker">FAQ</Translate>
                </span>
                <h2>
                  <Translate id="homepage.faq.title">Frequently asked questions</Translate>
                </h2>
                <p>
                  <Translate id="homepage.faq.description">
                    Find implementation details in the current documentation included with this site.
                  </Translate>
                </p>
                <ArrowLink href="/docs">
                  <Translate id="homepage.faq.openDocs">Open documentation</Translate>
                </ArrowLink>
              </div>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <details key={faq.question} open={index === 0}>
                    <summary>
                      {faq.question}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalGlow} aria-hidden="true" />
          <div className={styles.container}>
            <span className={styles.kicker}>
              <Translate id="homepage.finalCta.kicker">Start building</Translate>
            </span>
            <h2>
              <Translate id="homepage.finalCta.title">Ship your first Mastra agent today</Translate>
            </h2>
            <p>
              <Translate id="homepage.finalCta.description">
                Start locally, inspect every run, and deploy with the same TypeScript project.
              </Translate>
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} to="/guides/getting-started/quickstart">
                <Translate id="homepage.finalCta.quickstart">Open the quickstart</Translate>{' '}
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <a className={styles.secondaryButton} href="https://projects.mastra.ai/get-started">
                <Translate id="homepage.finalCta.platform">Create a platform project</Translate>
              </a>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <strong>mastra</strong>
                <span>
                  <Translate id="homepage.footer.tagline">The TypeScript agent framework.</Translate>
                </span>
              </div>
              <nav
                className={styles.footerLinks}
                aria-label={translate({ id: 'homepage.footer.ariaLabel', message: 'Footer navigation' })}
              >
                <div>
                  <strong>
                    <Translate id="homepage.footer.framework">Framework</Translate>
                  </strong>
                  <Link to="/docs/agents/overview">
                    <Translate id="homepage.footer.agents">Agents</Translate>
                  </Link>
                  <Link to="/docs/workflows/overview">
                    <Translate id="homepage.footer.workflows">Workflows</Translate>
                  </Link>
                  <Link to="/docs/memory/overview">
                    <Translate id="homepage.footer.memory">Memory</Translate>
                  </Link>
                  <Link to="/docs/observability/overview">
                    <Translate id="homepage.footer.observability">Observability</Translate>
                  </Link>
                </div>
                <div>
                  <strong>
                    <Translate id="homepage.footer.developers">Developers</Translate>
                  </strong>
                  <Link to="/docs">
                    <Translate id="homepage.footer.docs">Docs</Translate>
                  </Link>
                  <Link to="/models">
                    <Translate id="homepage.footer.models">Models</Translate>
                  </Link>
                  <Link to="/reference">
                    <Translate id="homepage.footer.apiReference">API reference</Translate>
                  </Link>
                  <Link to="/learn">
                    <Translate id="homepage.footer.course">Course</Translate>
                  </Link>
                </div>
                <div>
                  <strong>
                    <Translate id="homepage.footer.community">Community</Translate>
                  </strong>
                  <a href="https://github.com/mastra-ai/mastra">GitHub</a>
                  <a href="https://discord.gg/BTYqqHKUrf">Discord</a>
                  <a href="https://www.youtube.com/@mastra-ai">YouTube</a>
                  <a href="https://x.com/zisheng_ai">X</a>
                  <a href="https://youngjunning.com/">俊宁官网 ↗</a>
                  <a href="https://design.youngjunning.com/">设计图鉴 ↗</a>
                </div>
              </nav>
            </div>
            <div className={styles.footerBottom}>
              <span>
                <Translate id="homepage.footer.synced">
                  Latest official documentation, synced from mastra-ai/mastra.
                </Translate>
              </span>
              <SiteVisitStats />
              <a href="#top">
                <Translate id="homepage.footer.backToTop">Back to top ↑</Translate>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </Layout>
  )
}
