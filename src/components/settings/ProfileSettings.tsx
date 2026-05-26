'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function ProfileSettings() {
  const t = useTranslations('settings.profile')
  const tc = useTranslations('common')
  const { data: session, refetch } = useSession()
  const [isSaving, startTransition] = useTransition()

  const schema = z.object({
    name: z.string().min(2, tc('required')),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: { name: session?.user?.name ?? '' },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    startTransition(async () => {
      try {
        const { error } = await authClient.updateUser({ name: values.name })
        if (error) {
          toast.error(tc('error'))
          return
        }
        await refetch()
        toast.success(t('saved'))
      } catch {
        toast.error(tc('error'))
      }
    })
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted">{session?.user?.email}</p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <FormLabel className="text-sm">{t('email')}</FormLabel>
            <Input
              value={session?.user?.email ?? ''}
              disabled
              className="cursor-not-allowed opacity-60"
            />
          </div>

          {/* Display name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('displayName')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                tc('save')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
