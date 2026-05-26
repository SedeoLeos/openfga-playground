/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __db: any | undefined
}

function createDb(): any {
  const url = process.env.DATABASE_URL

  if (process.env.APP_MODE === 'saas') {
    if (!url) throw new Error('DATABASE_URL is required in saas mode')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg')
    const pool = new Pool({ connectionString: url })
    return drizzlePg(pool, { schema })
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@libsql/client')
  const client = createClient({ url: url ?? 'file:./local.db' })
  return drizzleSqlite(client, { schema })
}

export const db: ReturnType<typeof drizzleSqlite> = globalThis.__db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__db = db
}

export type DB = typeof db
