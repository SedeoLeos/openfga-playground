'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { Play, Plus, SkipForward, XCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import {
  clearResults,
  setAssertionResult,
  setAssertionState,
} from '@/stores/slice'
import { checkTuple, writeAssertions } from '@/actions/open-fga.action'

const schema = z.object({
  user: z.string().min(1),
  relation: z.string().min(1),
  object: z.string().min(1),
  expectation: z.enum(['true', 'false']),
})
type FormValues = z.infer<typeof schema>

export default function AssertToolList() {
  const t = useTranslations('playground.assertions')
  const tc = useTranslations('common')
  const tt = useTranslations('playground.tuples')
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)

  const assertions = useAppSelector((s) => s.assertionFga.assertions)
  const currentStore = useAppSelector((s) => s.storeFga.currentStore)
  const authorizationModel = useAppSelector((s) => s.authorizationModel.authorizationModel)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { user: 'user:', relation: '', object: '', expectation: 'true' },
  })

  function handleRunAll() {
    if (!currentStore?.id || !authorizationModel?.id) {
      toast.error(t('errors.noStore'))
      return
    }
    if (assertions.length === 0) return
    dispatch(clearResults())
    startTransition(async () => {
      let passed = 0
      let failed = 0
      await Promise.all(
        assertions.map(async (assertion) => {
          dispatch(setAssertionResult({ assertion, result: 'pending' }))
          const { allowed, error } = await checkTuple(
            currentStore.id!,
            authorizationModel.id!,
            assertion.tuple_key
          )
          if (error) {
            dispatch(setAssertionResult({ assertion, result: 'error' }))
            failed++
            return
          }
          const pass = allowed === assertion.expectation
          dispatch(setAssertionResult({ assertion, result: pass ? 'pass' : 'fail' }))
          if (pass) passed++
          else failed++
        })
      )
      if (failed === 0) {
        toast.success(t('allPassed', { count: passed }))
      } else {
        toast.error(t('someFailed', { passed, failed }))
      }
    })
  }

  function onSubmit(values: FormValues) {
    if (!currentStore?.id || !authorizationModel?.id) {
      toast.error(t('errors.noStore'))
      return
    }
    startTransition(async () => {
      const newAssertion = {
        tuple_key: { user: values.user, relation: values.relation, object: values.object },
        expectation: values.expectation === 'true',
      }
      const updated = [...assertions, newAssertion]
      const { error } = await writeAssertions(
        currentStore.id!,
        authorizationModel.id!,
        updated
      )
      if (error) {
        toast.error(t('errors.addFailed'))
        return
      }
      dispatch(setAssertionState(updated))
      toast.success(tc('success'))
      setDialogOpen(false)
      form.reset({ user: 'user:', relation: '', object: '', expectation: 'true' })
    })
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleRunAll}
          disabled={isPending || assertions.length === 0}
          title={t('runAll')}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="size-7" title="Next" disabled>
          <SkipForward className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive"
          title={t('clearResults')}
          onClick={() => dispatch(clearResults())}
          disabled={isPending}
        >
          <XCircle className="size-3.5" />
        </Button>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-3.5" />
            {t('add')}
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('addAssertion')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tt('user')}</FormLabel>
                    <FormControl>
                      <Input placeholder={tt('userPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tt('relation')}</FormLabel>
                    <FormControl>
                      <Input placeholder={tt('relationPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="object"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tt('object')}</FormLabel>
                    <FormControl>
                      <Input placeholder={tt('objectPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('expectedResult')}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === 'true' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => field.onChange('true')}
                          className="flex-1"
                        >
                          {t('allowed')}
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'false' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => field.onChange('false')}
                          className="flex-1"
                        >
                          {t('denied')}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {tc('cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {tc('loading')}
                    </>
                  ) : (
                    tc('add')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
