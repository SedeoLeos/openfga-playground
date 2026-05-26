import { defineConfig } from 'drizzle-kit'

const isSaaS = process.env.APP_MODE === 'saas'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: isSaaS ? 'postgresql' : 'sqlite',
  dbCredentials: isSaaS
    ? { url: process.env.DATABASE_URL! }
    : { url: process.env.DATABASE_URL ?? 'file:./local.db' },
})
