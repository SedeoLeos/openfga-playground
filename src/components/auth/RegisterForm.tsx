'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { signUp } from '@/lib/auth-client'
import { AppLogo } from '@/components/icons/AppLogo'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function RegisterForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const schema = z.object({
    name: z.string().min(2, { message: t('errors.unknown') }),
    email: z.string().email({ message: t('errors.invalidCredentials') }),
    password: z.string().min(8, { message: t('errors.weakPassword') }),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsPending(true)
    try {
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (error) {
        if (error.status === 422) {
          toast.error(t('errors.emailTaken'))
        } else {
          toast.error(t('errors.unknown'))
        }
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

  return (
    <div className="w-full max-w-sm px-4">
      <div className="rounded-xl border border-border/60 bg-surface p-8 shadow-elevated">
        <div className="mb-8 flex flex-col items-center gap-3">
          <AppLogo className="h-10 w-10" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">{t('registerTitle')}</h1>
            <p className="mt-1 text-sm text-muted">{t('registerSubtitle')}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('displayName')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('displayNamePlaceholder')}
                      autoComplete="name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="new-password"
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
                  {t('signingUp')}
                </>
              ) : (
                t('signUp')
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
