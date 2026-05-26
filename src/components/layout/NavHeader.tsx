'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Settings, LogOut, User, Copy, ChevronDown, Menu, X } from 'lucide-react'
import { AppLogo } from '@/components/icons/AppLogo'
import { Combobox } from '@/components/ui/combobox'
import StoreForm from '@/components/from/StoreForm'
import StoreViewModal from '@/components/StoreModal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getStore } from '@/actions/open-fga.action'
import { copyToClipboard } from '@/lib/utils'
import { setCurrentStoreState, setStoreState } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { signOut, useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher'

export default function NavHeader() {
  const t = useTranslations('playground')
  const tn = useTranslations('nav')
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const storeState = useAppSelector((state) => state.storeFga.store)
  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const authorizationModelState = useAppSelector((state) => state.authorizationModel.authorizationModel)
  const currentDsl = useAppSelector((state) => state.authorizationModel.currentDsl)
  const dispatch = useAppDispatch()

  const refreshStores = useCallback(async () => {
    const { stores, error } = await getStore()
    if (error) toast.error(t('store.errors.loadFailed'))
    else dispatch(setStoreState(stores))
  }, [dispatch, t])

  useEffect(() => {
    refreshStores()
  }, [refreshStores])

  const handleSelect = (value: string) => {
    const store = storeState.find((s) => s.id === value)
    if (store) dispatch(setCurrentStoreState(store))
  }

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text)
    toast.success(label)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/60 bg-surface px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <AppLogo className="h-7 w-7 shrink-0" />

        {/* Store selector — hidden on xs */}
        <div className="hidden sm:block">
          <Combobox
            defaultValue={currentStore?.id ?? storeState[0]?.id}
            data={storeState.map((s) => ({ label: s.name, value: s.id ?? '' }))}
            onSelect={handleSelect}
            placeholder={t('selectStore')}
          />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="https://openfga.dev/docs"
            target="_blank"
            className="rounded px-2 py-1 text-sm text-muted hover:bg-surface-raised hover:text-foreground transition-colors"
          >
            {tn('docs')}
          </Link>
          <Link
            href="https://discord.gg/8naAwJfWN6"
            target="_blank"
            className="rounded px-2 py-1 text-sm text-muted hover:bg-surface-raised hover:text-foreground transition-colors"
          >
            {tn('community')}
          </Link>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Copy actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden gap-1 sm:flex">
              <Copy className="size-3.5" />
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={() => handleCopy(currentStore?.id ?? '', t('copyStoreId'))}
              disabled={!currentStore?.id}
            >
              {t('copyStoreId')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCopy(authorizationModelState?.id ?? '', t('copyModelId'))}
              disabled={!authorizationModelState?.id}
            >
              {t('copyModelId')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCopy(currentDsl, t('copyStoreData'))}
              disabled={!currentDsl}
            >
              {t('copyStoreData')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <StoreForm />
        <StoreViewModal />

        <LocaleSwitcher />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="size-4" />
              <span className="hidden max-w-[100px] truncate text-sm lg:block">
                {session?.user?.name ?? session?.user?.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 size-4" />
                {tn('settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              {tn('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-border/60 bg-surface px-4 py-4 md:hidden">
          <div className="mb-4">
            <Combobox
              defaultValue={currentStore?.id ?? storeState[0]?.id}
              data={storeState.map((s) => ({ label: s.name, value: s.id ?? '' }))}
              onSelect={(v) => { handleSelect(v); setMobileMenuOpen(false) }}
              placeholder={t('selectStore')}
            />
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="https://openfga.dev/docs" target="_blank" className="rounded px-2 py-2 text-sm text-muted hover:bg-surface-raised">
              {tn('docs')}
            </Link>
            <Link href="https://discord.gg/8naAwJfWN6" target="_blank" className="rounded px-2 py-2 text-sm text-muted hover:bg-surface-raised">
              {tn('community')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
