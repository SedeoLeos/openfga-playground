import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import DatasourcesSettings from '@/components/settings/DatasourcesSettings'
import { getDatasources } from '@/actions/datasource.action'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('settings')
  return { title: t('datasources.title') }
}

export default async function DatasourcesPage() {
  const { datasources } = await getDatasources()
  return <DatasourcesSettings initialDatasources={datasources} />
}
