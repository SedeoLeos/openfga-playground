'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { datasources } from '@/db/schema/datasources'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { z } from 'zod'

const datasourceSchema = z.object({
  name: z.string().min(1).max(100),
  apiUrl: z.string().url(),
  apiToken: z.string().optional(),
  defaultStoreId: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
})

async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function getDatasources() {
  try {
    const userId = await getCurrentUserId()
    const rows = await db
      .select()
      .from(datasources)
      .where(eq(datasources.userId, userId))
    return { datasources: rows, error: null }
  } catch (e) {
    console.error('[getDatasources]', e)
    return { datasources: [], error: 'Failed to load datasources' }
  }
}

export async function createDatasource(input: z.infer<typeof datasourceSchema>) {
  try {
    const userId = await getCurrentUserId()
    const data = datasourceSchema.parse(input)

    if (data.isDefault) {
      await db
        .update(datasources)
        .set({ isDefault: false })
        .where(eq(datasources.userId, userId))
    }

    const [row] = await db
      .insert(datasources)
      .values({ ...data, userId })
      .returning()

    return { datasource: row, error: null }
  } catch (e) {
    console.error('[createDatasource]', e)
    return { datasource: null, error: 'Failed to create datasource' }
  }
}

export async function updateDatasource(
  id: string,
  input: Partial<z.infer<typeof datasourceSchema>>
) {
  try {
    const userId = await getCurrentUserId()

    if (input.isDefault) {
      await db
        .update(datasources)
        .set({ isDefault: false })
        .where(eq(datasources.userId, userId))
    }

    const [row] = await db
      .update(datasources)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(datasources.id, id), eq(datasources.userId, userId)))
      .returning()

    return { datasource: row, error: null }
  } catch (e) {
    console.error('[updateDatasource]', e)
    return { datasource: null, error: 'Failed to update datasource' }
  }
}

export async function deleteDatasource(id: string) {
  try {
    const userId = await getCurrentUserId()
    await db
      .delete(datasources)
      .where(and(eq(datasources.id, id), eq(datasources.userId, userId)))
    return { error: null }
  } catch (e) {
    console.error('[deleteDatasource]', e)
    return { error: 'Failed to delete datasource' }
  }
}
