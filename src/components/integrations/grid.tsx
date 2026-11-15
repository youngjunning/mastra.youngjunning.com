import { useState } from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import type { IntegrationItem } from './data'
import { getIntegrationIconSrc, getIntegrationItemHref, getIntegrationItemKey, getIntegrationItems } from './data'
import styles from './integrations.module.css'

interface IntegrationGridProps {
  section: string
  allowlist?: readonly string[]
  blocklist?: readonly string[]
  additionalItems?: readonly IntegrationItem[]
  columns?: 3 | 4
}

interface IntegrationItemsGridProps {
  items: IntegrationItem[]
  columns?: 3 | 4
}

function IntegrationIconImage({ src, item, className }: { src: string; item: IntegrationItem; className: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    const initials = item.label
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
    return (
      <span
        className={cn(className, 'flex shrink-0 items-center justify-center text-xs font-semibold')}
        aria-hidden="true"
      >
        {initials}
      </span>
    )
  }

  return (
    <img src={getIntegrationIconSrc(src)} alt="" loading="lazy" className={className} onError={() => setFailed(true)} />
  )
}

function IntegrationIcon({ item }: { item: IntegrationItem }) {
  const icon = item.customProps?.icon
  if (!icon) return null

  const className = cn('size-7 rounded-none! object-contain', item.customProps?.customCSS)
  const iconDark = item.customProps?.iconDark

  if (!iconDark) {
    return <IntegrationIconImage src={icon} item={item} className={className} />
  }

  return (
    <>
      <IntegrationIconImage src={icon} item={item} className={cn(className, 'dark:hidden')} />
      <IntegrationIconImage src={iconDark} item={item} className={cn(className, 'hidden dark:block')} />
    </>
  )
}

export function IntegrationItemsGrid({ items, columns = 3 }: IntegrationItemsGridProps) {
  if (items.length === 0) return null

  return (
    <ul
      data-slot="card-grid"
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
        columns === 4 && 'xl:grid-cols-4',
        styles.list,
      )}
    >
      {items.map(item => (
        <li key={getIntegrationItemKey(item)} className="mt-0!">
          <Link className="block h-full w-full no-underline!" to={getIntegrationItemHref(item)}>
            <div
              data-slot="card"
              className="text-card-foreground flex h-full w-full cursor-pointer items-center gap-4 rounded-xl border border-(--border) bg-(--mastra-surface-1)/20 px-4 py-4 shadow-none transition-colors hover:bg-(--mastra-surface-1)/70 dark:border-(--border) dark:hover:bg-(--mastra-surface-2)"
            >
              <IntegrationIcon item={item} />
              <span data-slot="card-title" className="truncate">
                {item.label}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function IntegrationGrid({ section, allowlist, blocklist, additionalItems, columns = 3 }: IntegrationGridProps) {
  return (
    <IntegrationItemsGrid
      items={getIntegrationItems(section, allowlist, blocklist, additionalItems)}
      columns={columns}
    />
  )
}
