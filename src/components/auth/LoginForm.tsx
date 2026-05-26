'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { signIn } from '@/lib/auth-client'
import { AppLogo } from '@/components/icons/AppLogo'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GitHubIcon, GoogleIcon } from '@/components/icons/OAuthIcons'

const hasGoogle = !!(process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true')
const hasGitHub = !!(process.env.NEXT_PUBLIC_GITHUB_ENABLED === 'true')

export default function LoginForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [oauthPending, setOauthPending] = useState<'google' | 'github' | null>(null)

  const schema = z.object({
    email: z.string().email({ message: t('errors.invalidCredentials') }),
    password: z.string().min(1, { message: t('errors.invalidCredentials') }),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsPending(true)
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      })
      if (error) {
        toast.error(t('errors.invalidCredentials'))
      } else {
        router.push('/playground')
        router.refresh()
      }
    } catch {
      toast.error(t('errors.networkError'))
    } finally {
      setIsPending(false)
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthPending(provider)
    try {
      await signIn.social({ provider, callbackURL: '/playground' })
    } catch {
      toast.error(t('errors.oauthError'))
      setOauthPending(null)
    }
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="rounded-xl border border-border/60 bg-surface p-8 shadow-elevated">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <AppLogo className="h-10 w-10" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">{t('loginTitle')}</h1>
            <p className="mt-1 text-sm text-muted">{t('loginSubtitle')}</p>
          </div>
        </div>

        {/* OAuth Buttons */}
        {(hasGoogle || hasGitHub) && (
          <>
            <div className="flex flex-col gap-2">
              {hasGoogle && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuth('google')}
                  disabled={oauthPending !== null || isPending}
                >
                  {oauthPending === 'google' ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <GoogleIcon className="size-4" />
                  )}
                  {t('continueWithGoogle')}
                </Button>
              )}
              {hasGitHub && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuth('github')}
                  disabled={oauthPending !== null || isPending}
                >
                  {oauthPending === 'github' ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <GitHubIcon className="size-4" />
                  )}
                  {t('continueWithGitHub')}
                </Button>
              )}
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-muted">
                {t('orContinueWith')}
              </span>
            </div>
          </>
        )}

        {/* Email form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      autoComplete="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('password')}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted hover:text-foreground transition-colors"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="current-password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('signingIn')}
                </>
              ) : (
                t('signIn')
              )}
            </Button>
          </form>
        </Form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-muted">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
