'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Tuple } from '@openfga/sdk'
import { createTupleAction } from '@/actions/open-fga.action'
import { addTuple } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export type TupleFormProps = { cancel: () => void }

export default function TupleForm({ cancel }: TupleFormProps) {
  const t = useTranslations('playground.tuples')
  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()

  const schema = z.object({
    user: z.string().min(1, { message: t('userPlaceholder') }),
    relation: z.string().min(1),
    object: z.string().min(1),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { user: '', relation: '', object: '' },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    if (!currentStore?.id) return
    startTransition(async () => {
      const res = await createTupleAction({ id: currentStore.id!, body: values })
      if (res?.serverError || res?.data?.error) {
        toast.error(t('errors.addFailed'))
        return
      }
      const tuple: Tuple = {
        key: { user: values.user, relation: values.relation, object: values.object },
        timestamp: new Date().toISOString(),
      }
      dispatch(addTuple(tuple))
      toast.success(t('added'))
      cancel()
    })
  }

  return (
    <div className="w-full rounded-lg border border-border/60 bg-surface-raised p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {(['user', 'relation', 'object'] as const).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem className="grid grid-cols-[80px_1fr] items-center gap-3">
                  <FormLabel className="text-right text-xs text-muted capitalize">{t(field)}</FormLabel>
                  <div>
                    <FormControl>
                      <Input
                        {...f}
                        placeholder={t(`${field}Placeholder` as 'userPlaceholder')}
                        disabled={isPending}
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="mt-0.5 text-xs" />
                  </div>
                </FormItem>
              )}
            />
          ))}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={cancel} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="mr-1.5 size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('adding')}
                </>
              ) : t('add')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
