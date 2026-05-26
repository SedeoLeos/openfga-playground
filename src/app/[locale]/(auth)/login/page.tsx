import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginForm from '@/components/auth/LoginForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth')
  return { title: t('loginTitle') }
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-dot-grid overflow-hidden">
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <LoginForm />
    </div>
  )
}
