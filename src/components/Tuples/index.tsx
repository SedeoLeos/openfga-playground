'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'
import TupleForm from './Form'
import TupleItem from './TupleItem'

export default function Tuples() {
  const t = useTranslations('playground.tuples')
  const tuples = useAppSelector((state) => state.tupleFga.tuples)
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden py-3">
      {/* Add button */}
      <div className="shrink-0 px-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="w-full gap-1.5"
        >
          <Plus className="size-3.5" />
          {t('add')}
        </Button>
      </div>

      {/* Form */}
      {open && (
        <div className="shrink-0">
          <TupleForm cancel={() => setOpen(false)} />
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {tuples.map((tuple, index) => (
          <TupleItem key={index} {...tuple.key} />
        ))}
      </div>
    </div>
  )
}
