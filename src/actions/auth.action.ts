'use server'
import UserJson from "@/lib/databases/user.json";
import { actionSafe } from "@/lib/safe-action";
import { LoginSchema } from "@/lib/schemas/login.schema";
import { SignJWT } from 'jose';
import { cookies } from "next/headers";

export const LoginAction = actionSafe.schema(LoginSchema.loginSchema).action(async ({ parsedInput: { email, password } }) => {
    try {
        const user = UserJson.find((user) => user.email === email && user.password === password)
        if (!user) {
            return { error: "User not found" };
        }
        
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const token = await new SignJWT(user)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret);

        console.log("token", token)
        const cookieStore = await cookies();
        cookieStore.set('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true, secure: true, sameSite: 'strict' });
        return {
            user, token
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        console.log("error", e)
        return { error: "Something went wrong" };
    }
})