'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link2, Plus } from 'lucide-react'
import { useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'
import TupleForm from './Form'
import TupleItem from './TupleItem'

export default function Tuples() {
  const t = useTranslations('playground.tuples')
  const tuples = useAppSelector((state) => state.tupleFga.tuples)
  const [open, setOpen] = useState(false)

  const isEmpty = tuples.length === 0

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden py-3">
      {/* Inline add form */}
      {open && (
        <div className="shrink-0">
          <TupleForm cancel={() => setOpen(false)} />
        </div>
      )}

      {isEmpty ? (
        /* Empty state */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <div className="rounded-full bg-surface-raised p-3">
            <Link2 className="size-5 text-muted" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{t('empty')}</p>
            <p className="text-xs text-muted">{t('emptyDesc')}</p>
          </div>
          {!open && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" />
              {t('add')}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Header row: count + add button */}
          {!open && (
            <div className="flex shrink-0 items-center justify-between px-1">
              <span className="text-xs text-muted">
                {tuples.length} {tuples.length === 1 ? 'tuple' : 'tuples'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-3.5" />
                {t('add')}
              </Button>
            </div>
          )}

          {/* Tuple list */}
          <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
            {tuples.map((tuple) => (
              <TupleItem
                key={`${tuple.key.user}|${tuple.key.relation}|${tuple.key.object}`}
                {...tuple.key}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
