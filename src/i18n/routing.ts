import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // /playground = English, /fr/playground = French
})

export type Locale = (typeof routing.locales)[number]
