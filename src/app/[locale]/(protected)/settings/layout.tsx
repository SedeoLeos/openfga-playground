import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import NavHeader from '@/components/layout/NavHeader'
import { Database, User, Building2 } from 'lucide-react'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('settings')
  const isSaaS = process.env.APP_MODE === 'saas'

  const nav = [
    { href: '/settings', label: t('profile.title'), icon: User },
    { href: '/settings/datasources', label: t('datasources.title'), icon: Database },
    ...(isSaaS ? [{ href: '/settings/organization', label: t('organization.title'), icon: Building2 }] : []),
  ]

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NavHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-border/60 bg-surface p-4 hidden md:block">
          <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('title')}
          </h2>
          <nav className="flex flex-col gap-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted hover:bg-surface-raised hover:text-foreground transition-colors"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 bg-surface px-4 py-2 md:hidden">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-raised hover:text-foreground"
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
