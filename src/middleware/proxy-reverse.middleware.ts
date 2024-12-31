/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
const NESTJS_BASE_URL = 'http://localhost:3333';
// Middleware : Authentification
export const proxyReverseMiddleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Vérifiez si la requête doit être proxifiée (par exemple, commence par /api)
    if (pathname.startsWith('/api')) {
        const backendUrl = `${NESTJS_BASE_URL}${pathname.replace('/api', '/api')}`;
        const headers = new Headers(request.headers);
        const cookieStore = await cookies();
        // Proxy la requête au serveur NestJS
        const fetchOptions = {
            method: request.method,
            headers,
            body: request.method !== 'GET' ? request.body : null,
            credentials: 'include',

        };

        const response = await fetch(backendUrl, fetchOptions);

        // Transférer les cookies de NestJS à Next.js
        const res = NextResponse.next();
        const cookiesHeader = response.headers.get('set-cookie');
        if (cookiesHeader) {
            const cookiePattern = /([^,]+?Expires=[^;]+;[^,]+|[^,]+)/g;

            // Extraire les cookies
            const cookiesParse = cookiesHeader.match(cookiePattern);
            if (!cookiesParse) return NextResponse.next();
            const tokenAccess = cookiesParse[0].split(";")[0].split("=")[1];
            const tokenAccessKey = cookiesParse[0].split(";")[0].split("=")[0];

            const tokenRefresh = cookiesParse[1].split(";")[0].split("=")[1];
            const tokenRefreshKey = cookiesParse[1].split(";")[0].split("=")[0];
            const expiresInMilliseconds = 60 * 60 * 24 * 30 * 1000; // Exemple : 7 jours
            const expiresDate = new Date(Date.now() + expiresInMilliseconds);
            if (tokenAccess && tokenAccessKey) {
                res.cookies.set(tokenAccessKey, tokenAccess, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure:false,
                    expires: expiresDate,
                    path: '/'
                })
            }
            if (tokenRefresh && tokenRefreshKey) {
                res.cookies.set(tokenRefreshKey, tokenRefresh, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure:false,
                    expires: expiresDate,
                    path: '/'
                })
            }
            console.log("cookie add")

        }
        console.log('Cookies ajoutés au client :', res.cookies.getAll());

        // Retourner la réponse au client
        const proxyResponse = await response.json();
        console.log('Cookies ajoutés au client :', res.cookies.getAll());
        return NextResponse.json(proxyResponse, { status: response.status });
    }

    return NextResponse.next();



};