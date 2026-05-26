'use server'

import { actionSafe } from '@/lib/safe-action'
import { StoreSchema } from '@/lib/schemas/store.schema'
import { defaultFgaClient, createFgaClient } from '@/lib/fga-client'
import { graphBuilder } from '@openfga/frontend-utils'
import {
  CreateStoreRequest,
  TupleKey,
  WriteAuthorizationModelRequest,
  WriteRequest,
} from '@openfga/sdk'
import { transformer as syntaxTransformer } from '@openfga/syntax-transformer'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tr = syntaxTransformer as any
const dslToJson = tr.transformDSLToJSON ?? tr.friendlySyntaxToApiSyntax

function fgaClient(datasource?: { apiUrl: string; apiToken: string | null } | null) {
  return datasource ? createFgaClient(datasource) : defaultFgaClient
}

export async function getStore(datasource?: { apiUrl: string; apiToken: string | null } | null) {
  try {
    const client = fgaClient(datasource)
    const response = await client.listStores()
    if (response.$response.status !== 200) return { stores: [], error: null }
    return { stores: response.stores ?? [], error: null }
  } catch (e) {
    console.error('[getStore]', e)
    return { stores: [], error: 'Failed to load stores' }
  }
}

export async function getTuples(
  storeId: string,
  datasource?: { apiUrl: string; apiToken: string | null } | null
) {
  try {
    const client = fgaClient(datasource)
    const response = await client.read(storeId, {})
    if (response.$response.status !== 200) return { tuples: [], error: null }
    return { tuples: response.tuples ?? [], error: null }
  } catch (e) {
    console.error('[getTuples]', e)
    return { tuples: [], error: 'Failed to load tuples' }
  }
}

export async function getAssertions(
  storeId: string,
  authorizationModelId: string,
  datasource?: { apiUrl: string; apiToken: string | null } | null
) {
  try {
    const client = fgaClient(datasource)
    const response = await client.readAssertions(storeId, authorizationModelId)
    if (response.$response.status !== 200) return { assertions: [], error: null }
    return { assertions: response.assertions ?? [], error: null }
  } catch (e) {
    console.error('[getAssertions]', e)
    return { assertions: [], error: 'Failed to load assertions' }
  }
}

export async function getAuthorizationModel(
  storeId: string,
  datasource?: { apiUrl: string; apiToken: string | null } | null
) {
  try {
    const client = fgaClient(datasource)
    const response = await client.readAuthorizationModels(storeId)
    if (response.$response.status !== 200) return { model: null, error: null }
    return { model: response.authorization_models?.[0] ?? null, error: null }
  } catch (e) {
    console.error('[getAuthorizationModel]', e)
    return { model: null, error: 'Failed to load authorization model' }
  }
}

export async function generateGraph(
  object: string,
  user: string,
  storeId: string,
  datasource?: { apiUrl: string; apiToken: string | null } | null
) {
  try {
    const client = fgaClient(datasource)
    const capturedTuple: Required<Omit<TupleKey, 'user'>> = {
      relation: 'owner',
      object,
      condition: { name: '', context: [] },
    }
    const treeBuilder = new graphBuilder.TreeBuilder(client, capturedTuple, storeId)
    await treeBuilder.buildTree()
    return { graph: treeBuilder.buildGraph(user), error: null }
  } catch (e) {
    console.error('[generateGraph]', e)
    return { graph: null, error: 'Failed to generate graph' }
  }
}

export const createStoreAction = actionSafe
  .schema(StoreSchema.createStoreSchema)
  .action(async ({ parsedInput: { name } }) => {
    try {
      const body: CreateStoreRequest = { name }
      const response = await defaultFgaClient.createStore(body)
      if (response.$response.status !== 201) return { error: 'Failed to create store' }
      return {
        store: {
          id: response.id,
          name: response.name,
          created_at: response.created_at,
          updated_at: response.updated_at,
        },
      }
    } catch (e) {
      console.error('[createStore]', e)
      return { error: 'Failed to create store' }
    }
  })

export const deleteStoreAction = actionSafe
  .schema(StoreSchema.deleteStoreSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await defaultFgaClient.deleteStore(id)
      if (response.$response.status !== 204) return { error: 'Failed to delete store' }
      return { store: { id } }
    } catch (e) {
      console.error('[deleteStore]', e)
      return { error: 'Failed to delete store' }
    }
  })

export const createModelAction = actionSafe
  .schema(StoreSchema.createModelSchema)
  .action(async ({ parsedInput: { id, body } }) => {
    try {
      const json = dslToJson(
        body
      ) as unknown as WriteAuthorizationModelRequest
      const response = await defaultFgaClient.writeAuthorizationModel(id, json)
      if (response.$response.status !== 201) return { error: 'Failed to save model' }
      if (!response.authorization_model_id) return { error: 'Failed to save model' }
      return { authorization_model_id: response.authorization_model_id }
    } catch (e) {
      console.error('[createModel]', e)
      const msg = e instanceof Error ? e.message : 'Failed to save model'
      return { error: msg }
    }
  })

export const createTupleAction = actionSafe
  .schema(StoreSchema.createTupleSchema)
  .action(async ({ parsedInput: { id, body } }) => {
    try {
      const bodyWrite: WriteRequest = {
        writes: { tuple_keys: [{ user: body.user, relation: body.relation, object: body.object }] },
      }
      const response = await defaultFgaClient.write(id, bodyWrite)
      return { status: response.$response.status }
    } catch (e) {
      console.error('[createTuple]', e)
      return { error: 'Failed to add tuple' }
    }
  })

export const deleteTupleAction = actionSafe
  .schema(StoreSchema.createTupleSchema)
  .action(async ({ parsedInput: { id, body } }) => {
    try {
      const bodyWrite: WriteRequest = {
        deletes: { tuple_keys: [{ user: body.user, relation: body.relation, object: body.object }] },
      }
      const response = await defaultFgaClient.write(id, bodyWrite)
      return { status: response.$response.status }
    } catch (e) {
      console.error('[deleteTuple]', e)
      return { error: 'Failed to remove tuple' }
    }
  })
