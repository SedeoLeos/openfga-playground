'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { createStoreAction } from '@/actions/open-fga.action'
import { appendStoreState } from '@/stores/slice'
import { useAppDispatch } from '@/stores/store'
import { StoreSchema } from '@/lib/schemas/store.schema'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function StoreForm() {
  const t = useTranslations('playground.store')
  const tc = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const dispatch = useAppDispatch()

  const form = useForm<z.infer<typeof StoreSchema.createStoreSchema>>({
    resolver: zodResolver(StoreSchema.createStoreSchema),
    defaultValues: { name: '' },
  })

  function onSubmit(data: z.infer<typeof StoreSchema.createStoreSchema>) {
    startTransition(async () => {
      const res = await createStoreAction(data)
      if (res?.validationErrors || res?.data?.error) {
        toast.error(t('errors.createFailed'))
        return
      }
      if (res?.data?.store) {
        dispatch(appendStoreState(res.data.store))
        toast.success(t('created'))
        form.reset()
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">{t('nameLabel').split(' ')[0]}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{tc('add')} store</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nameLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('namePlaceholder')}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => { form.reset(); setOpen(false) }}
                disabled={isPending}
              >
                {tc('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t('creating')}
                  </>
                ) : tc('add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
