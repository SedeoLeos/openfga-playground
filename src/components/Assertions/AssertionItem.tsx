'use client'

import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Trash2, Play, HelpCircle, CheckCircle2, XCircle, Loader2, ChevronRight } from 'lucide-react'
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
  if (!result) return <HelpCircle className="size-3.5 shrink-0 text-muted/60" />
  if (result === 'pending') return <Loader2 className="size-3.5 shrink-0 animate-spin text-muted" />
  if (result === 'pass') return <CheckCircle2 className="size-3.5 shrink-0 text-success" />
  if (result === 'fail') return <XCircle className="size-3.5 shrink-0 text-destructive" />
  return <XCircle className="size-3.5 shrink-0 text-warning" />
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
        'flex flex-col gap-2 rounded-md border bg-surface px-3 py-2.5 text-xs transition-colors',
        result === 'pass' && 'border-success/40 bg-success/5',
        result === 'fail' && 'border-destructive/40 bg-destructive/5',
        result === 'error' && 'border-warning/40 bg-warning/5',
        !result && 'border-border/60 hover:border-border',
      )}
    >
      {/* Row 1: status icon + tuple flow + action buttons */}
      <div className="flex items-center gap-2">
        <ResultIcon result={result} />

        {/* Tuple flow: user → relation → object */}
        <div className="flex min-w-0 flex-1 items-center gap-1 font-mono">
          <span className="truncate text-muted" title={assertion.tuple_key.user}>
            {assertion.tuple_key.user}
          </span>
          <ChevronRight className="size-3 shrink-0 text-muted/40" />
          <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            {assertion.tuple_key.relation}
          </span>
          <ChevronRight className="size-3 shrink-0 text-muted/40" />
          <span className="truncate text-foreground/80" title={assertion.tuple_key.object}>
            {assertion.tuple_key.object}
          </span>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted hover:text-foreground"
            onClick={handleCheck}
            disabled={isPending}
            title={t('check')}
          >
            {result === 'pending' ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Play className="size-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted hover:text-destructive"
            onClick={handleDelete}
            disabled={isPending}
            title={t('delete')}
          >
            {isPending && result !== 'pending' ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Trash2 className="size-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Row 2: expected result badge */}
      <div className="flex items-center gap-2 pl-5">
        <span className="text-muted/70">Expected:</span>
        <span
          className={cn(
            'rounded px-1.5 py-0.5 font-medium',
            assertion.expectation
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive',
          )}
        >
          {assertion.expectation ? t('allowed') : t('denied')}
        </span>
      </div>
    </div>
  )
}
