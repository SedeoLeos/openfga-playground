'use server'

import { actionSafe } from "@/lib/safe-action";
import { LoginSchema } from "@/lib/schemas/login.schema";
import fs from 'fs';
import { SignJWT } from 'jose';
import { cookies } from "next/headers";
import path from 'path';
const getUserJson = () => {
    const jsonPath = process.env.USER_JSON_PATH || '';
    const absolutePath = path.resolve(process.cwd(), jsonPath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`User JSON file not found at path: ${absolutePath}`);
    }

    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};
type User = {
    email: string;
    password: string;
};
export const LoginAction = actionSafe.schema(LoginSchema.loginSchema).action(async ({ parsedInput: { email, password } }) => {
    try {
        const UserJson = getUserJson();
        const user = UserJson.find((user: User) => user.email === email && user.password === password)
        if (!user) {
            return { error: "User not found" };
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        const token = await new SignJWT(user)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret);
        const cookieStore = await cookies();
        cookieStore.set('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true, secure: true, sameSite: 'strict' });
        return {
            user, token
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return { error: "Something went wrong" };
    }
})