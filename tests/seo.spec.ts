import { expect, test } from '@playwright/test'

const LOCALES = ['zh-CN', 'en', 'fr', 'ja', 'ko', 'zh-TW', 'zh-HK', 'x-default']
const PAGES = [
  { path: '/', lang: 'zh-CN' },
  { path: '/docs/agents/overview', lang: 'zh-CN' },
  { path: '/en/docs/agents/overview', lang: 'en' },
  { path: '/fr/docs/agents/overview', lang: 'fr' },
  { path: '/ja/docs/agents/overview', lang: 'ja' },
  { path: '/ko/docs/agents/overview', lang: 'ko' },
  { path: '/zh-TW/docs/agents/overview', lang: 'zh-TW' },
  { path: '/zh-HK/docs/agents/overview', lang: 'zh-HK' },
]

function getAttribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null
}

function findTags(html: string, tagName: 'html' | 'link' | 'meta', attribute: string, value?: string): string[] {
  return (html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? []).filter(tag => {
    const attributeValue = getAttribute(tag, attribute)
    return value === undefined ? attributeValue !== null : attributeValue === value
  })
}

function expectSingleTag(html: string, tagName: 'link' | 'meta', attribute: string, value: string): string {
  const tags = findTags(html, tagName, attribute, value)
  expect(tags, `Expected exactly one ${tagName}[${attribute}="${value}"]`).toHaveLength(1)
  return tags[0]!
}

test.describe('SEO metadata', () => {
  for (const pageConfig of PAGES) {
    test(`${pageConfig.path} exposes complete index and social metadata`, async ({ request }) => {
      const response = await request.get(pageConfig.path)
      expect(response.status()).toBeLessThan(400)

      const html = await response.text()
      const htmlTag = findTags(html, 'html', 'lang')
      expect(htmlTag).toHaveLength(1)
      expect(getAttribute(htmlTag[0]!, 'lang')).toBe(pageConfig.lang)

      const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/i)?.[1]?.trim()
      expect(title?.length).toBeGreaterThan(0)

      const description = expectSingleTag(html, 'meta', 'name', 'description')
      expect(getAttribute(description, 'content')?.trim().length).toBeGreaterThan(0)

      const canonical = expectSingleTag(html, 'link', 'rel', 'canonical')
      expect(getAttribute(canonical, 'href')).toMatch(/^https:\/\/mastra\.zisheng\.pro\//)

      for (const locale of LOCALES) {
        const alternate = findTags(html, 'link', 'hreflang', locale)
        expect(alternate, `Missing ${locale} hreflang on ${pageConfig.path}`).toHaveLength(1)
        expect(getAttribute(alternate[0]!, 'href')).toMatch(/^https:\/\/mastra\.zisheng\.pro\//)
      }

      for (const property of [
        'og:title',
        'og:description',
        'og:image',
        'og:image:alt',
        'og:url',
        'og:type',
        'og:site_name',
      ]) {
        const meta = expectSingleTag(html, 'meta', 'property', property)
        expect(getAttribute(meta, 'content')?.trim().length).toBeGreaterThan(0)
      }

      for (const name of [
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
        'twitter:image:alt',
      ]) {
        const meta = expectSingleTag(html, 'meta', 'name', name)
        expect(getAttribute(meta, 'content')?.trim().length).toBeGreaterThan(0)
      }

      expect(findTags(html, 'meta', 'content').some(tag => getAttribute(tag, 'content')?.includes('noindex'))).toBe(
        false,
      )
    })
  }

  test('homepage structured data identifies the site and localized page', async ({ request }) => {
    const response = await request.get('/')
    expect(response.status()).toBe(200)

    const html = await response.text()
    const scripts = [
      ...html.matchAll(
        /<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi,
      ),
    ].map(match => match[1]!)
    const graph = scripts.flatMap(script => {
      const parsed = JSON.parse(script) as unknown
      return Array.isArray(parsed) ? parsed : [parsed]
    }) as Array<Record<string, unknown>>

    const website = graph.find(entry => entry['@type'] === 'WebSite')
    const webpage = graph.find(entry => entry['@type'] === 'WebPage')
    const faq = graph.find(entry => entry['@type'] === 'FAQPage')

    expect(website).toMatchObject({ name: 'Mastra', inLanguage: 'zh-CN' })
    expect(webpage).toMatchObject({ inLanguage: 'zh-CN' })
    expect(faq).toMatchObject({ inLanguage: 'zh-CN' })
  })

  test('sitemap contains unique localized canonical URLs without ignored hints', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)

    const xml = await response.text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])

    expect(urls.length).toBeGreaterThan(0)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls).toContain('https://mastra.youngjunning.com/')
    expect(urls).toContain('https://mastra.youngjunning.com/en/')
    expect(urls).toContain('https://mastra.youngjunning.com/ja/')
    expect(xml).not.toContain('<changefreq>')
    expect(xml).not.toContain('<priority>')
    expect(urls.some(url => url.includes('/404'))).toBe(false)
  })
})
