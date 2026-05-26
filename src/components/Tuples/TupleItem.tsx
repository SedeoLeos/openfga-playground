'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Tuple } from '@openfga/sdk'
import { deleteTupleAction } from '@/actions/open-fga.action'
import { removeTuple } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-surface p-3 text-sm">
      <div className="grid min-w-0 grid-cols-[60px_1fr] gap-x-3 gap-y-1 text-xs">
        <span className="text-muted">User</span>
        <span className="truncate font-mono">{user}</span>
        <span className="text-muted">Relation</span>
        <span className="truncate font-mono">{relation}</span>
        <span className="text-muted">Object</span>
        <span className="truncate font-mono">{object}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-muted hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
        title={t('delete')}
      >
        {isPending ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </Button>
    </div>
  )
}
