import { z } from "zod"

export class StoreSchema {
    static readonly createStoreSchema = z.object({
        name: z.string().min(4, {
            message: "Store name must be at least 4 characters.",
        }).max(50, {
            message: "Store name must not be longer than 50 characters.",
        }),
    })

    static readonly listStoresSchema = z.object({
        name: z.string().optional(),
    })

    static readonly deleteStoreSchema = z.object({
        id: z.string(),
    })

    

    static readonly createModelSchema = z.object({
        id: z.string(),
        body: z.string()
    })
    static readonly createTupleSchema = z.object({
        id: z.string(),
        body: z.object({
            user: z.string(),
            relation: z.string(),
            object: z.string(),
        })
    })


}
