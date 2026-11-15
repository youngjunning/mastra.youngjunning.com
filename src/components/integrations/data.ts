import sidebar from '../../content/en/integrations/sidebars'

export interface IntegrationCustomProps {
  icon?: string
  iconDark?: string
  customCSS?: string
}

export interface IntegrationDocItem {
  type: 'doc'
  id: string
  label: string
  customProps?: IntegrationCustomProps
}

export interface IntegrationLinkItem {
  type: 'link'
  href: string
  label: string
  customProps?: IntegrationCustomProps
}

export type IntegrationItem = IntegrationDocItem | IntegrationLinkItem

export interface IntegrationCategory {
  type: 'category'
  label: string
  items: IntegrationItem[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string'
}

function hasIntegrationCustomProps(value: Record<string, unknown>): boolean {
  return (
    value.customProps === undefined ||
    (isRecord(value.customProps) &&
      isOptionalString(value.customProps.icon) &&
      isOptionalString(value.customProps.iconDark) &&
      isOptionalString(value.customProps.customCSS))
  )
}

function isIntegrationItem(value: unknown): value is IntegrationItem {
  if (!isRecord(value) || typeof value.label !== 'string' || !hasIntegrationCustomProps(value)) {
    return false
  }

  if (value.type === 'doc') {
    return typeof value.id === 'string'
  }

  return value.type === 'link' && typeof value.href === 'string'
}

function isIntegrationCategory(value: unknown): value is IntegrationCategory {
  return (
    isRecord(value) &&
    value.type === 'category' &&
    typeof value.label === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isIntegrationItem)
  )
}

const integrationsSidebar: unknown = sidebar.integrationsSidebar

export const integrationCategories = Array.isArray(integrationsSidebar)
  ? integrationsSidebar.filter(isIntegrationCategory)
  : []

const replacementIcons: Record<string, string> = {
  'aws_light.svg': 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=64',
  'aws_dark.svg': 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=64',
  'azure.svg': 'https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=64',
  'canva.svg': 'https://www.google.com/s2/favicons?domain=canva.com&sz=64',
  'drive.svg': 'googledrive',
  'google-cloud.svg': 'googlecloud',
  'google.svg': 'google',
  'microsoft-teams.svg': 'https://www.google.com/s2/favicons?domain=teams.microsoft.com&sz=64',
  'microsoft.svg': 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64',
  'openai.svg': 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
  'slack.svg': 'https://www.google.com/s2/favicons?domain=slack.com&sz=64',
  'workos.svg': 'https://thesvg.org/icons/workos/default.svg',
  'xai_light.svg': 'https://thesvg.org/icons/xai/default.svg',
  'xai_dark.svg': 'https://thesvg.org/icons/xai/default.svg',
}

export function getIntegrationIconSrc(src: string): string {
  const filename = src.startsWith('https://svgl.app/library/') ? src.split('/').pop() : undefined
  const replacement = filename && replacementIcons[filename]
  if (!replacement) return src
  return replacement.startsWith('https://')
    ? replacement
    : `https://cdn.simpleicons.org/${replacement}?viewbox=auto&size=28`
}

export function getIntegrationItemKey(item: IntegrationItem): string {
  return item.type === 'doc' ? item.id : item.href
}

export function getIntegrationItemHref(item: IntegrationItem): string {
  return item.type === 'doc' ? `/integrations/${item.id}` : item.href
}

export function getIntegrationItems(
  section: string,
  allowlist?: readonly string[],
  blocklist?: readonly string[],
  additionalItems: readonly IntegrationItem[] = [],
): IntegrationItem[] {
  const category = integrationCategories.find(candidate => candidate.label === section)
  if (!category) return []

  const blockedKeys = new Set(blocklist)
  const items = allowlist
    ? allowlist.flatMap(key => {
        const item = category.items.find(candidate => getIntegrationItemKey(candidate) === key)
        return item ? [item] : []
      })
    : category.items
  const includedItems = [...items, ...additionalItems].filter(item => !blockedKeys.has(getIntegrationItemKey(item)))

  return additionalItems.length > 0 ? [...includedItems].sort((a, b) => a.label.localeCompare(b.label)) : includedItems
}
