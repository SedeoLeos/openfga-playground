'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Trash2, Play, HelpCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { Assertion } from '@openfga/sdk'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import {
  assertionKey,
  removeAssertionState,
  setAssertionResult,
  setCurrentAssertionState,
  type AssertionResult,
} from '@/stores/slice'
import { checkTuple, writeAssertions } from '@/actions/open-fga.action'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function ResultIcon({ result }: { result: AssertionResult | undefined }) {
  if (!result) return <HelpCircle className="size-4 shrink-0 text-muted" />
  if (result === 'pending') return <Loader2 className="size-4 shrink-0 animate-spin text-muted" />
  if (result === 'pass') return <CheckCircle2 className="size-4 shrink-0 text-success" />
  if (result === 'fail') return <XCircle className="size-4 shrink-0 text-destructive" />
  return <XCircle className="size-4 shrink-0 text-warning" />
}

interface Props {
  assertion: Assertion
}

export default function AssertionItem({ assertion }: Props) {
  const t = useTranslations('playground.assertions')
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()

  const currentStore = useAppSelector((s) => s.storeFga.currentStore)
  const authorizationModel = useAppSelector((s) => s.authorizationModel.authorizationModel)
  const result = useAppSelector((s) => s.assertionFga.results[assertionKey(assertion)])
  const allAssertions = useAppSelector((s) => s.assertionFga.assertions)

  function handleCheck() {
    if (!currentStore?.id || !authorizationModel?.id) {
      toast.error(t('errors.noStore'))
      return
    }
    dispatch(setCurrentAssertionState(assertion))
    startTransition(async () => {
      dispatch(setAssertionResult({ assertion, result: 'pending' }))
      const { allowed, error } = await checkTuple(
        currentStore.id!,
        authorizationModel.id!,
        assertion.tuple_key
      )
      if (error) {
        dispatch(setAssertionResult({ assertion, result: 'error' }))
        toast.error(t('errors.checkFailed'))
        return
      }
      const pass = allowed === assertion.expectation
      dispatch(setAssertionResult({ assertion, result: pass ? 'pass' : 'fail' }))
      if (pass) {
        toast.success(t('assertionPassed'))
      } else {
        toast.error(
          assertion.expectation
            ? t('assertionFailed.expectedAllowed')
            : t('assertionFailed.expectedDenied')
        )
      }
    })
  }

  function handleDelete() {
    if (!currentStore?.id || !authorizationModel?.id) return
    startTransition(async () => {
      const remaining = allAssertions.filter(
        (a) => assertionKey(a) !== assertionKey(assertion)
      )
      const { error } = await writeAssertions(
        currentStore.id!,
        authorizationModel.id!,
        remaining
      )
      if (error) {
        toast.error(t('errors.deleteFailed'))
        return
      }
      dispatch(removeAssertionState(assertion))
      toast.success(t('deleted'))
    })
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-md border bg-surface p-3 text-sm transition-colors',
        result === 'pass' && 'border-success/40',
        result === 'fail' && 'border-destructive/40',
        result === 'error' && 'border-warning/40',
        !result && 'border-border/60'
      )}
    >
      <ResultIcon result={result} />
      <div className="grid min-w-0 flex-1 grid-cols-[60px_1fr] gap-x-3 gap-y-1 text-xs">
        <span className="text-muted">User</span>
        <span className="truncate font-mono">{assertion.tuple_key.user}</span>
        <span className="text-muted">Relation</span>
        <span className="truncate font-mono">{assertion.tuple_key.relation}</span>
        <span className="text-muted">Object</span>
        <span className="truncate font-mono">{assertion.tuple_key.object}</span>
        <span className="text-muted">Expected</span>
        <span className={cn('font-medium', assertion.expectation ? 'text-success' : 'text-destructive')}>
          {assertion.expectation ? t('allowed') : t('denied')}
        </span>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted hover:text-foreground"
          onClick={handleCheck}
          disabled={isPending}
          title={t('check')}
        >
          {result === 'pending' ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
          title={t('delete')}
        >
          {isPending && result !== 'pending' ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}
