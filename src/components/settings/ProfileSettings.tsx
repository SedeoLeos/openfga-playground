'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function ProfileSettings() {
  const t = useTranslations('settings.profile')
  const tc = useTranslations('common')
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = useState(false)

  const schema = z.object({
    name: z.string().min(1),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: session?.user?.name ?? '' },
  })

  async function onSubmit(_values: z.infer<typeof schema>) {
    setIsSaving(true)
    try {
      // TODO: update profile via better-auth
      await new Promise((r) => setTimeout(r, 500))
      toast.success(t('saved'))
    } catch {
      toast.error(tc('error'))
    } finally {
      setIsSaving(false)
    }
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('displayName')}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('saving')}
                </>
              ) : tc('save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
