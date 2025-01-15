'use server'
import { actionSafe } from '@/lib/safe-action'
import { StoreSchema } from '@/lib/schemas/store.schema'
import { graphBuilder } from '@openfga/frontend-utils'
import { CreateStoreRequest, OpenFgaApi, TupleKey, WriteAuthorizationModelRequest, WriteRequest } from "@openfga/sdk"
import { transformer } from '@openfga/syntax-transformer'

const FgaClient = new OpenFgaApi({
    apiUrl: process.env.OPENFGA_API_URL,
    // apiHost: process.env.OPENFGA_API_HOST
})
export const getStore = async () => {
    try {
        const response = await FgaClient.listStores()
        if (response.$response.status != 200) return []
        return response.stores;
    } catch {
        return []
    }
}

export const getTuples = async (storeId: string) => {
    try {
        const body = {}
        const tupleChangeResponse = await FgaClient.read(storeId, body)
        if (tupleChangeResponse.$response.status != 200) return []
        return tupleChangeResponse.tuples

    } catch {
        return []
    }

}

export const getAssertions = async (storeId: string, authorizationModelId: string) => {
    try {
        const tupleChangeResponse = await FgaClient.readAssertions(storeId, authorizationModelId)
        if (tupleChangeResponse.$response.status != 200) return []
        return tupleChangeResponse.assertions

    } catch {
        return []
    }

}
export const getAuthorizationModel = async (storeId: string) => {
    try {
        const response = await FgaClient.readAuthorizationModels(storeId)
        if (response.$response.status != 200) return;
        return response.authorization_models[0];
    } catch {
        return;
    }
}

export const generateGraph = async (object = "org:a2ed4857-e8d4-41af-8cf7-e41edb32ce78", user = "user:e41acffd-6d30-4467-bca6-883d678b5934") => {
    try {

        const capturedTuple: Required<Omit<TupleKey, "user">> = {
            relation: "owner",
            object,
            condition: {
                name: '',
                context: []
            }
        };
        const treeBuilder = new graphBuilder.TreeBuilder(FgaClient, capturedTuple, "01JFSEX3J8S7M9JNM87C7ATVF8");
        await treeBuilder.buildTree();
        const graphBuild = treeBuilder.buildGraph(user);
        return graphBuild
    } catch (error) {
        console.log(error);
        return null
    }
};
export const createStoreAction = actionSafe.schema(StoreSchema.createStoreSchema).action(async ({ parsedInput: { name } }) => {
    try {
        const body: CreateStoreRequest = { name: name };
        const response = await FgaClient.createStore(body);

        if (response.$response.status !== 201) {
            return { error: "Error creating store" };
        }

        return {
            store: {
                id: response.id,
                name: response.name,
                created_at: response.created_at,
                updated_at: response.updated_at,
            },
        };
    } catch (e) {
        console.log(e)
        return { error: "Error creating store" };
    }
});

export const deleteStoreAction = actionSafe.schema(StoreSchema.deleteStoreSchema).action(async ({ parsedInput: { id } }) => {
    try {
        const response = await FgaClient.deleteStore(id);
        if (response.$response.status !== 204) {
            return { error: "Error deleting store" };
        }
        return {
            store: {
                id: id,
            },
        };
    } catch (e) {
        console.log(e)
        return { error: "Error deleting store" };
    }
});


export const createModelAction = actionSafe.schema(StoreSchema.createModelSchema).action(async ({ parsedInput: { id, body } }) => {
    try {
        const json = transformer.transformDSLToJSON(body) as unknown as WriteAuthorizationModelRequest;
        const response = await FgaClient.writeAuthorizationModel(id, json);
        if (response.$response.status !== 201) {
            return { error: "Error creating model" };
        }
        if (!response.authorization_model_id) return { error: "Error creating model" };
        return {
            authorization_model_id: response.authorization_model_id
        };
    } catch (e) {
        console.log(e)
        return { error: "Error creating model" };
    }
});
export const createTuple = actionSafe.schema(StoreSchema.createTupleSchema).action(async ({ parsedInput: { id, body } }) => {
    try {
        const bodyWrite: WriteRequest = {
            writes: {
                tuple_keys: [
                    {
                        user: body.user,
                        relation: body.relation,
                        object: body.object,

                    }
                ]
            }
        }
        const tupleChangeResponse = await FgaClient.write(id, bodyWrite)
        return {
            data: {
                status: tupleChangeResponse.$response.status
            }
        }

    } catch(e) {
        console.log("error",e)
        return {
            data: {
                status: 500
            }
        }
    }

})
export const deleteTuple = actionSafe.schema(StoreSchema.createTupleSchema).action(async ({ parsedInput: { id, body } }) => {
    try {
        const bodyWrite: WriteRequest = {
            deletes: {
                tuple_keys: [
                    {
                        user: body.user,
                        relation: body.relation,
                        object: body.object,

                    }
                ]
            }
        }
        const tupleChangeResponse = await FgaClient.write(id, bodyWrite)
        return {
            data: {
                status: tupleChangeResponse.$response.status
            }
        }

    } catch(e) {
        console.log("error",e)
        return {
            data: {
                status: 500
            }
        }
    }

})