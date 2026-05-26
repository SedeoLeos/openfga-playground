'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Trash2, ChevronRight, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { Tuple } from '@openfga/sdk'
import { deleteTupleAction } from '@/actions/open-fga.action'
import { removeTuple } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/utils'

export default function TupleItem({
  user = '',
  relation = '',
  object = '',
}: {
  user?: string
  relation?: string
  object?: string
}) {
  const t = useTranslations('playground.tuples')
  const tc = useTranslations('common')
  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!currentStore?.id) return
    startTransition(async () => {
      const res = await deleteTupleAction({ id: currentStore.id!, body: { user, relation, object } })
      if (res?.serverError || res?.data?.error) {
        toast.error(t('errors.deleteFailed'))
        return
      }
      const tuple: Tuple = {
        key: { user, relation, object },
        timestamp: new Date().toISOString(),
      }
      dispatch(removeTuple(tuple))
      toast.success(t('deleted'))
    })
  }

  function handleCopy() {
    copyToClipboard(`${user} ${relation} ${object}`)
    toast.success(tc('copied'))
  }

  return (
    <div className="group flex items-center gap-2 rounded-md border border-border/60 bg-surface px-3 py-2 text-xs transition-colors hover:border-border">
      {/* Tuple flow: user → relation → object */}
      <div className="flex min-w-0 flex-1 items-center gap-1 font-mono">
        <span className="truncate text-muted" title={user}>{user}</span>
        <ChevronRight className="size-3 shrink-0 text-muted/40" />
        <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
          {relation}
        </span>
        <ChevronRight className="size-3 shrink-0 text-muted/40" />
        <span className="truncate text-foreground/80" title={object}>{object}</span>
      </div>

      {/* Actions — visible on hover */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted hover:text-foreground"
          onClick={handleCopy}
          title={tc('copy')}
        >
          <Copy className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
          title={t('delete')}
        >
          {isPending ? (
            <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 className="size-3" />
          )}
        </Button>
      </div>
    </div>
  )
}
