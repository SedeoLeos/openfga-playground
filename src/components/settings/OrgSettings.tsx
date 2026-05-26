'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Building2, Crown, Shield, User, Users, Mail, Loader2, Trash2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type Role = 'owner' | 'admin' | 'member' | 'viewer'

interface Member {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

function RoleIcon({ role }: { role: Role }) {
  if (role === 'owner') return <Crown className="size-3.5 text-warning" />
  if (role === 'admin') return <Shield className="size-3.5 text-primary" />
  return <User className="size-3.5 text-muted" />
}

function RoleBadge({ role, t }: { role: Role; t: (k: string) => string }) {
  const map: Record<Role, string> = {
    owner: 'text-warning border-warning/40',
    admin: 'text-primary border-primary/40',
    member: 'text-foreground border-border/60',
    viewer: 'text-muted border-border/40',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${map[role]}`}>
      <RoleIcon role={role} />
      {t(`roles.${role}`)}
    </span>
  )
}

export default function OrgSettings() {
  const t = useTranslations('settings.organization')
  const tc = useTranslations('common')
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  // Local-only state — in a real SaaS this would come from the DB
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'owner',
      name: session?.user?.name ?? 'You',
      email: session?.user?.email ?? '',
      role: 'owner',
    },
  ])

  function handleInvite() {
    if (!inviteEmail.includes('@')) {
      toast.error(tc('error'))
      return
    }
    startTransition(async () => {
      // TODO: real invite via DB when multi-tenant is activated
      await new Promise((r) => setTimeout(r, 400))
      setMembers((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: inviteEmail.split('@')[0],
          email: inviteEmail,
          role: 'member',
        },
      ])
      toast.success(t('inviteSent', { email: inviteEmail }))
      setInviteEmail('')
      setInviteOpen(false)
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 200))
      setMembers((prev) => prev.filter((m) => m.id !== id))
      toast.success(tc('success'))
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised">
            <Building2 className="size-5 text-muted" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t('title')}</h1>
            <p className="text-sm text-muted">{t('subtitle')}</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <Mail className="mr-1.5 size-4" />
          {t('invite')}
        </Button>
      </div>

      <Separator />

      {/* Members list */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
          <Users className="size-4" />
          {t('members')} ({members.length})
        </div>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-surface p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold uppercase text-foreground">
                  {member.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted">{member.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <RoleBadge role={member.role} t={t} />
                {member.role !== 'owner' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted hover:text-destructive"
                    onClick={() => handleRemove(member.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SaaS notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-medium text-foreground">{t('saasNote')}</p>
        <p className="mt-1">{t('saasNoteDesc')}</p>
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('invite')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              {tc('cancel')}
            </Button>
            <Button onClick={handleInvite} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {tc('loading')}
                </>
              ) : (
                t('sendInvite')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
