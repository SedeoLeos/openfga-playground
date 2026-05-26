'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { getAssertions, getTuples } from '@/actions/open-fga.action'
import { setAssertionState, setTupleState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import AssertionContainer from '@/components/Assertions'
import MonacoEditor from '@/components/MonacoEditor'
import Tuples from '@/components/Tuples'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LeftComponent() {
  const t = useTranslations('playground')
  const tuples = useAppSelector((state) => state.tupleFga.tuples)
  const assertions = useAppSelector((state) => state.assertionFga.assertions)
  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const authorizationModel = useAppSelector((state) => state.authorizationModel.authorizationModel)
  const dispatch = useAppDispatch()

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
    refreshAssertions()
    refreshTuples()
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
              {t('tabs.tuples')} ({tuples.length})
            </TabsTrigger>
            <TabsTrigger
              value="assertions"
              className="h-full rounded-none border-b-2 border-transparent bg-transparent px-4 text-sm text-muted shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              {t('tabs.assertions')} ({assertions.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tuples" className="flex flex-1 overflow-hidden mt-0">
            <Tuples />
          </TabsContent>
          <TabsContent value="assertions" className="flex flex-1 flex-col gap-3 overflow-hidden mt-0">
            <AssertionContainer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
