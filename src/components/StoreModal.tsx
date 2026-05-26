'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { List } from 'lucide-react'
import { useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { StoreDataTable } from '@/components/tables/stores/data-table'
import { StoreColumns } from '@/components/tables/stores/column'

export default function StoreViewModal() {
  const t = useTranslations('playground')
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
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('storeDetails')}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <StoreDataTable data={stores} columns={StoreColumns} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
