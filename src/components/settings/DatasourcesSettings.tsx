'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Star, StarOff, ExternalLink } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Datasource } from '@/db/schema/datasources'
import { createDatasource, updateDatasource, deleteDatasource } from '@/actions/datasource.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface Props {
  initialDatasources: Datasource[]
}

const schema = z.object({
  name: z.string().min(1).max(100),
  apiUrl: z.string().url(),
  apiToken: z.string().optional(),
  defaultStoreId: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
})
type FormValues = z.infer<typeof schema>

export default function DatasourcesSettings({ initialDatasources }: Props) {
  const t = useTranslations('settings.datasources')
  const tc = useTranslations('common')
  const [sources, setSources] = useState<Datasource[]>(initialDatasources)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Datasource | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', apiUrl: '', apiToken: '', defaultStoreId: '', isDefault: false },
  })

  function openCreate() {
    setEditing(null)
    form.reset({ name: '', apiUrl: '', apiToken: '', defaultStoreId: '', isDefault: false })
    setDialogOpen(true)
  }

  function openEdit(src: Datasource) {
    setEditing(src)
    form.reset({
      name: src.name,
      apiUrl: src.apiUrl,
      apiToken: src.apiToken ?? '',
      defaultStoreId: src.defaultStoreId ?? '',
      isDefault: src.isDefault,
    })
    setDialogOpen(true)
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      if (editing) {
        const { datasource, error } = await updateDatasource(editing.id, values)
        if (error || !datasource) { toast.error(t('errors.saveFailed')); return }
        setSources((prev) => prev.map((s) => (s.id === datasource.id ? datasource : s)))
        toast.success(tc('success'))
      } else {
        const { datasource, error } = await createDatasource(values)
        if (error || !datasource) { toast.error(t('errors.saveFailed')); return }
        setSources((prev) => [...prev, datasource])
        toast.success(tc('success'))
      }
      setDialogOpen(false)
    })
  }

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      const { error } = await deleteDatasource(id)
      if (error) {
        toast.error(t('errors.deleteFailed'))
      } else {
        setSources((prev) => prev.filter((s) => s.id !== id))
        toast.success(tc('success'))
      }
      setDeletingId(null)
    })
  }

  function handleSetDefault(src: Datasource) {
    startTransition(async () => {
      const { error } = await updateDatasource(src.id, { isDefault: true })
      if (error) { toast.error(t('errors.saveFailed')); return }
      setSources((prev) => prev.map((s) => ({ ...s, isDefault: s.id === src.id })))
      toast.success(tc('success'))
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
        </div>
        <Button onClick={openCreate} size="sm" className="shrink-0">
          <Plus className="mr-1.5 size-4" />
          {t('add')}
        </Button>
      </div>

      <Separator />

      {sources.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border/60 py-12 text-center">
          <p className="text-sm text-muted">{t('noSources')}</p>
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 size-4" />
            {t('add')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((src) => (
            <div
              key={src.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{src.name}</span>
                  {src.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      {t('default')}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <ExternalLink className="size-3 shrink-0" />
                  <span className="truncate">{src.apiUrl}</span>
                </div>
                {src.defaultStoreId && (
                  <p className="mt-0.5 truncate text-xs text-muted">
                    Store: {src.defaultStoreId}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!src.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleSetDefault(src)}
                    disabled={isPending}
                    title={t('setDefault')}
                  >
                    <StarOff className="size-4" />
                  </Button>
                )}
                {src.isDefault && (
                  <Button variant="ghost" size="icon" className="size-8 text-warning" disabled>
                    <Star className="size-4 fill-current" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => openEdit(src)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(src.id)}
                  disabled={deletingId === src.id}
                >
                  {deletingId === src.id ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t('edit') : t('add')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.apiUrl')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.apiUrlPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('form.apiToken')}{' '}
                      <span className="text-muted">({tc('optional')})</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.apiTokenPlaceholder')}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultStoreId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('form.defaultStoreId')}{' '}
                      <span className="text-muted">({tc('optional')})</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.defaultStoreIdPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  {tc('cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {tc('loading')}
                    </>
                  ) : tc('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
