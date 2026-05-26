'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAssertions, getTuples } from '@/actions/open-fga.action'
import { setAssertionState, setTupleState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import AssertionContainer from '@/components/Assertions'
import MonacoEditor from '@/components/MonacoEditor'
import Tuples from '@/components/Tuples'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function SkeletonItem() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-surface px-3 py-2">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-raised" />
      <div className="h-3 w-3 animate-pulse rounded bg-surface-raised" />
      <div className="h-4 w-14 animate-pulse rounded bg-surface-raised" />
      <div className="h-3 w-3 animate-pulse rounded bg-surface-raised" />
      <div className="h-3 w-24 animate-pulse rounded bg-surface-raised" />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-1 py-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  )
}

export default function LeftComponent() {
  const t = useTranslations('playground')
  const tuples = useAppSelector((state) => state.tupleFga.tuples)
  const assertions = useAppSelector((state) => state.assertionFga.assertions)
  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const authorizationModel = useAppSelector((state) => state.authorizationModel.authorizationModel)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const refreshAssertions = useCallback(async () => {
    if (!currentStore?.id || !authorizationModel?.id) return
    const { assertions: data, error } = await getAssertions(currentStore.id, authorizationModel.id)
    if (error) toast.error(t('assertions.errors.loadFailed'))
    else dispatch(setAssertionState(data))
  }, [currentStore, authorizationModel, dispatch, t])

  const refreshTuples = useCallback(async () => {
    if (!currentStore?.id) return
    const { tuples: data, error } = await getTuples(currentStore.id)
    if (error) toast.error(t('tuples.errors.loadFailed'))
    else dispatch(setTupleState(data))
  }, [currentStore, dispatch, t])

  useEffect(() => {
    if (!currentStore?.id) return
    setIsLoading(true)
    Promise.all([refreshAssertions(), refreshTuples()]).finally(() => setIsLoading(false))
  }, [currentStore, refreshAssertions, refreshTuples])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MonacoEditor />
      <div className="flex flex-1 overflow-hidden px-3">
        <Tabs defaultValue="tuples" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="h-9 shrink-0 rounded-none border-b border-border/60 bg-transparent p-0">
            <TabsTrigger
              value="tuples"
              className="h-full rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm text-muted shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              {t('tabs.tuples')}
              {!isLoading && tuples.length > 0 && (
                <span className="ml-1.5 rounded-full bg-surface-raised px-1.5 py-0.5 text-xs text-muted">
                  {tuples.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="assertions"
              className="h-full rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm text-muted shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              {t('tabs.assertions')}
              {!isLoading && assertions.length > 0 && (
                <span className="ml-1.5 rounded-full bg-surface-raised px-1.5 py-0.5 text-xs text-muted">
                  {assertions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tuples" className="mt-0 flex flex-1 overflow-hidden">
            {isLoading ? <LoadingSkeleton /> : <Tuples />}
          </TabsContent>

          <TabsContent value="assertions" className="mt-0 flex flex-1 flex-col gap-3 overflow-hidden">
            {isLoading ? <LoadingSkeleton /> : <AssertionContainer />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
