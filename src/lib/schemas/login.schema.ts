import { z } from "zod"

export class LoginSchema {
    static readonly loginSchema = z.object({
        email: z.string().min(4, {
            message: "Email must be at least 4 characters.",
        }).email(),
        password: z.string().min(7, {
            message: "Password must be at least 7 characters.",
        }),
    })



   

}
