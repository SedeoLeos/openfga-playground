import { redirect } from 'next/navigation'

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const prefix = locale === 'en' ? '' : `/${locale}`
  redirect(`${prefix}/login`)
}
