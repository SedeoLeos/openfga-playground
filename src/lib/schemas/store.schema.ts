import { z } from "zod"

export class StoreSchema {
    static readonly createStoreSchema =z.object({
        name: z.string().min(4, {
            message: "Store name must be at least 4 characters.",
        }).max(50, {
            message: "Store name must not be longer than 50 characters.",
        }),
    })
    static readonly deleteStoreSchema =z.object({
        id: z.string(),
    })
}