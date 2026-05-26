import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OrgSettings from '@/components/settings/OrgSettings'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('settings')
  return { title: t('organization.title') }
}

export default function OrganizationPage() {
  return <OrgSettings />
}
