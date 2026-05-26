'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    // If current path starts with a locale prefix, replace it
    const localeSegment = segments[1]
    const isLocalePrefix = ['en', 'fr', 'es'].includes(localeSegment)

    let newPath: string
    if (next === 'en') {
      // English uses no prefix
      newPath = isLocalePrefix ? '/' + segments.slice(2).join('/') : pathname
    } else {
      newPath = isLocalePrefix
        ? '/' + next + '/' + segments.slice(2).join('/')
        : '/' + next + pathname
    }

    router.push(newPath || '/')
    router.refresh()
  }

  const current = locales.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Globe className="size-4" />
          <span className="hidden text-xs sm:block">{current?.flag} {current?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => switchLocale(l.code)}
            className={locale === l.code ? 'text-primary' : ''}
          >
            <span className="mr-2">{l.flag}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
