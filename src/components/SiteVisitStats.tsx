import { useLocation } from '@docusaurus/router'
import { useEffect, useState } from 'react'

type Counts = { sitePv: number; siteUv: number }

function VisitCounts() {
  const [counts, setCounts] = useState<Counts | null | 'disabled'>()

  useEffect(() => {
    let cancelled = false
    let controller: AbortController | undefined
    let timeout: number | undefined
    const timer = window.setTimeout(() => {
      if (window.location.hostname !== 'mastra.youngjunning.com') {
        setCounts('disabled')
        return
      }

      controller = new AbortController()
      timeout = window.setTimeout(() => controller?.abort(), 10000)
      const isNewUv = !document.cookie.split(';').some(cookie => cookie.trim() === 'mastra_visit_counted=1')
      document.cookie = `mastra_visit_counted=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure`

      void fetch('https://events.vercount.one/api/v2/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `${window.location.origin}/`, isNewUv }),
        referrerPolicy: 'no-referrer',
        credentials: 'omit',
        signal: controller.signal,
      }).then(async response => {
        if (!response.ok) throw new Error('Visit counter unavailable')
        const payload = await response.json()
        const data = payload?.status === 'success' ? payload.data : null
        const valid = data && ['site_pv', 'site_uv'].every(key => Number.isSafeInteger(data[key]) && data[key] >= 0)
        if (!cancelled) setCounts(valid ? { sitePv: data.site_pv, siteUv: data.site_uv } : null)
      }).catch(() => {
        if (!cancelled) setCounts(null)
      }).finally(() => {
        if (timeout !== undefined) window.clearTimeout(timeout)
      })
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (timeout !== undefined) window.clearTimeout(timeout)
      controller?.abort()
    }
  }, [])

  if (counts === 'disabled') return null
  return (
    <span role="status" title="Vercount 汇总统计；仅发送站点域名，不发送页面路径或查询参数。">
      总访客 {counts ? counts.siteUv.toLocaleString('zh-CN') : '—'} · 总访问{' '}
      {counts ? counts.sitePv.toLocaleString('zh-CN') : '—'}
    </span>
  )
}

export default function SiteVisitStats() {
  const { pathname } = useLocation()
  return <VisitCounts key={pathname} />
}
