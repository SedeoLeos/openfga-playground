'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import {
  CustomAccordion,
  CustomAccordionContent,
  CustomAccordionItem,
  CustomAccordionTrigger,
} from '@/components/ui/custom-accordion'
import { useAppSelector } from '@/stores/store'
import VisNetWorkGraph from './VisNetWorkGraph'
import VisTree from './VisTree'

export function RightComponent() {
  const t = useTranslations('playground.sections')
  const currentAssertion = useAppSelector((state) => state.assertionFga.currentAssertion)

  const value = useMemo(
    () => (currentAssertion ? 'item-2' : 'item-1'),
    [currentAssertion]
  )

  return (
    <CustomAccordion
      defaultValue="item-1"
      className="flex min-w-[450px] flex-1 flex-col"
      value={value}
    >
      <CustomAccordionItem value="item-1" className="flex flex-col data-[state=open]:flex-grow">
        <CustomAccordionTrigger value="item-1">
          <span className="text-sm">{t('typesPreviewer')}</span>
        </CustomAccordionTrigger>
        <CustomAccordionContent value="item-1">
          <VisNetWorkGraph />
        </CustomAccordionContent>
      </CustomAccordionItem>

      <CustomAccordionItem value="item-2" className="flex flex-col data-[state=open]:flex-grow">
        <CustomAccordionTrigger value="item-2">
          <span className="text-sm">{t('tupleQueries')}</span>
        </CustomAccordionTrigger>
        <CustomAccordionContent value="item-2">
          <VisTree />
        </CustomAccordionContent>
      </CustomAccordionItem>
    </CustomAccordion>
  )
}
