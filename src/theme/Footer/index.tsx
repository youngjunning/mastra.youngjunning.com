import React, { type ReactNode } from 'react'
import OriginalFooter from '@theme-original/Footer'
import SiteVisitStats from '@site/src/components/SiteVisitStats'

export default function Footer(): ReactNode {
  return <>
    <OriginalFooter />
    <footer className="border-t border-slate-200 px-6 py-5 text-center text-sm">
      <nav aria-label="关联站点" className="flex flex-wrap justify-center gap-5">
        <a href="https://youngjunning.com/">俊宁官网 ↗</a>
        <a href="https://design.youngjunning.com/">设计图鉴 ↗</a>
      </nav>
      <div className="mt-3 text-slate-500"><SiteVisitStats /></div>
    </footer>
  </>
}

// The documentation layout may render the footer inside the content column.
export function FooterContent(_props: { inColumn?: boolean } = {}): ReactNode {
  return <Footer />
}
