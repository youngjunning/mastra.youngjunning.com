function addKeys(items, parentKey) {
  return items.map((item, index) => {
    if (typeof item === 'string') return item
    const identity = item.id ?? item.href ?? `${item.label ?? item.type}-${index}`
    const key = item.key ?? `${parentKey}-${item.type}-${identity}`
    return item.type === 'category' && Array.isArray(item.items)
      ? { ...item, key, items: addKeys(item.items, key) }
      : { ...item, key }
  })
}

export function withStableSidebarKeys(sidebars) {
  return Object.fromEntries(Object.entries(sidebars).map(([name, items]) => [name, addKeys(items, name)]))
}
