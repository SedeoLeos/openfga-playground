'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { List, Trash2, Copy, Loader2, AlertCircle, Database } from 'lucide-react'
import type { Store } from '@openfga/sdk'
import { deleteStoreAction } from '@/actions/open-fga.action'
import { setStoreState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { copyToClipboard } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ─── Single store row with inline 2-step delete ───────────────────────────────
function StoreRow({ store }: { store: Store }) {
  const t = useTranslations('playground.store')
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  const allStores = useAppSelector((s) => s.storeFga.store)
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    startTransition(async () => {
      const res = await deleteStoreAction({ id: store.id })
      if (res?.serverError || res?.data?.error) {
        toast.error(t('errors.deleteFailed'))
        setConfirming(false)
        return
      }
      dispatch(setStoreState(allStores.filter((s) => s.id !== store.id)))
      toast.success(t('deleted'))
    })
  }

  const createdAt = store.created_at
    ? new Date(store.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface p-3 transition-colors hover:border-border">
      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{store.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className="truncate font-mono text-xs text-muted">{store.id}</p>
          <Button
            variant="ghost"
            size="icon"
            className="size-4 shrink-0 text-muted/50 hover:text-muted"
            onClick={() => {
              copyToClipboard(store.id ?? '')
              toast.success(tc('copied'))
            }}
            title={tc('copy')}
          >
            <Copy className="size-2.5" />
          </Button>
        </div>
        {createdAt && (
          <p className="mt-0.5 text-xs text-muted/50">{createdAt}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {confirming ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <AlertCircle className="size-3" />
              )}
              {tc('confirm')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setConfirming(false)}
              disabled={isPending}
            >
              {tc('cancel')}
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted hover:text-destructive"
            onClick={handleDelete}
            title={t('deleteStore') ?? tc('delete')}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function StoreViewModal() {
  const t = useTranslations('playground')
  const tc = useTranslations('common')
  const stores = useAppSelector((state) => state.storeFga.store)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <List className="size-3.5" />
          <span className="hidden sm:inline">{t('storeDetails')}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('storeDetails')}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {stores.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="rounded-full bg-surface-raised p-3">
                <Database className="size-5 text-muted" />
              </div>
              <p className="text-sm text-muted">{tc('noResults')}</p>
            </div>
          ) : (
            <div className="space-y-2 py-1">
              {stores.map((store) => (
                <StoreRow key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
