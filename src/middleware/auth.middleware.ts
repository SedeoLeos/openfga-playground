/* eslint-disable @typescript-eslint/no-unused-vars */


import { getUser } from "@/app/_action/proxy.action";
import { NextRequest, NextResponse } from "next/server";

// Middleware : Authentification
export const authMiddleware = async (request: NextRequest) => {
    try {
        const data = await getUser();
        console.log("success ",data)
        return NextResponse.next();

    } catch(e) {
        console.log("errro ",e)
    }

    return NextResponse.redirect(new URL('/', request.url)); 



};