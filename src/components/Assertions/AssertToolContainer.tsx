'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Play, Plus, SkipForward, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AssertToolList() {
  const t = useTranslations('playground.assertions')
  const [isPending, startTransition] = useTransition()

  function handleRun() {
    startTransition(async () => {
      // TODO: run all assertions
    })
  }

  return (
    <div className="flex shrink-0 items-center gap-2 py-2">
      <Button variant="ghost" size="icon" className="size-7" onClick={handleRun} disabled={isPending} title="Run all">
        {isPending ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Play className="size-3.5" />
        )}
      </Button>
      <Button variant="ghost" size="icon" className="size-7" title="Next" disabled>
        <SkipForward className="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="size-7 text-destructive" title="Fail" disabled>
        <XCircle className="size-3.5" />
      </Button>
      <div className="ml-auto">
        <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs">
          <Plus className="size-3.5" />
          {t('check')}
        </Button>
      </div>
    </div>
  )
}
