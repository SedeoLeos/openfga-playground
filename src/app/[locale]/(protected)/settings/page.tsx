import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ProfileSettings from '@/components/settings/ProfileSettings'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('settings')
  return { title: t('profile.title') }
}

export default function SettingsPage() {
  return <ProfileSettings />
}
