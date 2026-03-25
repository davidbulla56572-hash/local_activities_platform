import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { StatusBanner } from './StatusBanner'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Navbar />
        <StatusBanner />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  )
}
