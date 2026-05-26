import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import AppWrapper from '@/components/AppWrapper'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppWrapper>
        {children}
      </AppWrapper>
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(220 7% 11%)',
            border: '1px solid hsl(220 7% 25%)',
            color: 'hsl(220 5% 95%)',
          },
        }}
      />
    </NextIntlClientProvider>
  )
}
