'use client'

import { useTranslations } from 'next-intl'
import { ShieldCheck } from 'lucide-react'
import { useAppSelector } from '@/stores/store'
import { assertionKey } from '@/stores/slice'
import AssertToolList from './AssertToolContainer'
import AssertionItem from './AssertionItem'

export default function AssertionContainer() {
  const t = useTranslations('playground.assertions')
  const assertions = useAppSelector((state) => state.assertionFga.assertions)

  return (
    <>
      <AssertToolList />

      {assertions.length === 0 ? (
        /* Empty state */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <div className="rounded-full bg-surface-raised p-3">
            <ShieldCheck className="size-5 text-muted" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{t('noAssertions')}</p>
            <p className="text-xs text-muted">{t('noAssertionsDesc')}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto no-scrollbar">
          {assertions.map((item) => (
            <AssertionItem assertion={item} key={assertionKey(item)} />
          ))}
        </div>
      )}
    </>
  )
}
