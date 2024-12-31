'use server'
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import cookie from 'cookie';
const API_URL = (endpoint: string) => `http://localhost:3000/api/v1.0/${endpoint}`
// Rafraîchir l'access token à partir du backend NestJS
export async function refreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_cookie');
    if (!refreshToken) {
        return { error: "Impossible de rafraîchir le token" }
    }
    const res = await fetch(API_URL('auth/refresh'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${refreshToken.name}=${refreshToken.value}`
        },
        credentials: 'include',  // Inclure les cookies lors de la requête
    });


    if (!res.ok) {
        return { error: "Impossible de rafraîchir le token" }
    }

    return { data: await res.json() }; // Retourne la réponse entière pour traiter les cookies dans le proxy
}


export async function loginVerifyOtp(email: string, code: string) {
    const res = await fetch(API_URL('auth/login/verify/otp'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
        credentials: 'include',  // Inclure les cookies lors de la requête
    });

    if (!res.ok) {
        console.log("erreur")
        return { error: "Otp " }
    }

    // Récupérer les cookies de la réponse NestJS
    const cookiesToSet = res.headers.get('set-cookie');
    console.log('**********', cookiesToSet)
    if (cookiesToSet) {
        // Crée une réponse Next.js et ajoute les cookies


        // Remplacer ici 'cookie-name' par le nom réel du cookie que vous souhaitez
        console.log(res.headers.get('set-cookie'));
        const parsedCookies = cookie.parse(cookiesToSet);
        const accessToken = parsedCookies['access_cookie'];  // Exemple avec le cookie 'access_cookie'

        // Ajouter les cookies à la réponse de Next.js
        const cookieList = await cookies()
        console.log('***********')
        if (accessToken) cookieList.set({
            name: "access_cookie",
            value: accessToken,
            httpOnly: true,
            sameSite: 'lax',
            expires: 800000,
            path: '/'

        })
        console.log(parsedCookies['refresh_cookie'])
        if (parsedCookies['refresh_cookie']) cookieList.set({
            name: "refresh_cookie",
            value: parsedCookies['refresh_cookie'],
            httpOnly: true,
            sameSite: 'lax',
            expires: 800000,
            path: '/'


        })

    }
    console.log('********* res.json *********')
    return await res.json();
}

export async function loginVerifyCredential(email: string) {
    const res = await fetch(API_URL('auth/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        return { error: 'Impossible de rafraîchir le token' };
    }

    return { data: await res.json() };
}
export async function getOrganization() {
    const orgResponse = await fetch(API_URL('organizations/me'), {
        credentials: 'include',
    });

    // Vérifiez si la réponse est correcte
    if (!orgResponse.ok) {
        console.log("erreur")
        return { error: "Erreur lors de la récupération de l\'organisation" }
    }

    const data = await orgResponse.json();
    console.log("colo")
    return { data }; // Retourne la réponse entière pour traiter les cookies dans le proxy
}
export async function getUser() {
    const orgResponse = await fetch(API_URL('users/me'));

    // Vérifiez si la réponse est correcte
    if (!orgResponse.ok) {

        return { error: 'Erreur lors de la récupération de l\'users' };
    }

    const data = await orgResponse.json();
    return { data }; // Retourne la réponse entière pour traiter les cookies dans le proxy
}

export async function proxyRequest(endpoint: string, method: string = 'GET', body: unknown = null) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_cookie');  // Récupérer le token actuel à partir des cookies

    // Si le access token est absent ou invalide, essayer de le rafraîchir
    if (!accessToken) {
        console.log("pass accessToken")
        try {
            const refreshRes = await refreshAccessToken();  // Rafraîchir le token si nécessaire

            // Extraire les cookies de la réponse du serveur NestJS
            const cookiesToSet = refreshRes.headers.get('set-cookie');
            if (cookiesToSet) {
                const parsedCookies = cookie.parse(cookiesToSet);
                const newAccessToken = parsedCookies['access_cookie'];
                const newRefreshToken = parsedCookies['refresh_cookie'];

                // Si de nouveaux tokens sont présents, les ajouter aux cookies de la réponse Next.js
                const response = NextResponse.json(await refreshRes.json());
                if (newAccessToken) response.cookies.set('access_cookie', newAccessToken);
                if (newRefreshToken) response.cookies.set('refresh_cookie', newRefreshToken);
                return response;
            } else {
                throw new Error('Les cookies de rafraîchissement sont manquants');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return NextResponse.json({ message: 'Non autorisé. Veuillez vous reconnecter.' }, { status: 401 });
        }
    }
    console.log("access", accessToken)

    // Si un access token est présent dans les cookies, faire la requête vers le backend NestJS
    const res = await fetch(API_URL(endpoint), {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${accessToken.name}=${accessToken.value}`
        },
        body: method !== 'GET' ? JSON.stringify(body) : null,

        credentials: 'include',  // Inclure les cookies dans la requête
    });

    const cookiesToSet = res.headers.get('set-cookie');
    if (cookiesToSet) {
        // Si de nouveaux cookies sont renvoyés, les récupérer et les ajouter à la réponse Next.js
        const parsedCookies = cookie.parse(cookiesToSet);
        const newAccessToken = parsedCookies['access_cookie'];
        const newRefreshToken = parsedCookies['refresh_cookie'];

        // Ajouter les cookies à la réponse Next.js
        const response = NextResponse.json(await res.json());
        if (newAccessToken) response.cookies.set('access_cookie', newAccessToken);
        if (newRefreshToken) response.cookies.set('refresh_cookie', newRefreshToken);
        return response;
    }

    return res;  // Retourner la réponse originale si tout est ok
}
