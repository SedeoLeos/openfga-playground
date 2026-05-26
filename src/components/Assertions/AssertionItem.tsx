'use client'

import { useTranslations } from 'next-intl'
import { Trash2, Play, HelpCircle } from 'lucide-react'
import type { Assertion } from '@openfga/sdk'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/stores/store'
import { setCurrentAssertionState } from '@/stores/slice'
import { cn } from '@/lib/utils'

const DEFAULT_ASSERTION: Assertion = {
  tuple_key: {
    user: 'user:alice',
    relation: 'viewer',
    object: 'document:readme',
  },
  expectation: true,
}

export default function AssertionItem({ assertion = DEFAULT_ASSERTION }: { assertion?: Assertion }) {
  const t = useTranslations('playground.assertions')
  const dispatch = useAppDispatch()

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-surface p-3 text-sm">
      <HelpCircle className="size-4 shrink-0 text-muted" />
      <div className="grid min-w-0 flex-1 grid-cols-[60px_1fr] gap-x-3 gap-y-1 text-xs">
        <span className="text-muted">User</span>
        <span className="truncate font-mono">{assertion.tuple_key.user}</span>
        <span className="text-muted">Relation</span>
        <span className="truncate font-mono">{assertion.tuple_key.relation}</span>
        <span className="text-muted">Object</span>
        <span className="truncate font-mono">{assertion.tuple_key.object}</span>
        <span className="text-muted">Expected</span>
        <span className={cn('font-medium', assertion.expectation ? 'text-success' : 'text-destructive')}>
          {assertion.expectation ? t('allowed') : t('denied')}
        </span>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted hover:text-foreground"
          onClick={() => dispatch(setCurrentAssertionState(assertion))}
          title={t('check')}
        >
          <Play className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7 text-muted hover:text-destructive" title="Remove">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
