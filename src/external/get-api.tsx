import { error } from "console";

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = "http://localhost:3000/api/auth/callback/google";
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;


const GOOGLE_OAUTH_SCOPES = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile"
];

const makeRandomState = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for(let i: number = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

export const getGoogleAuthorization = () => {
    const state = makeRandomState(8);
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

    return {
        state: state,
        scopes: scopes,
        url: GOOGLE_OAUTH_CONSENT_SCREEN_URL,
    }
}

export async function getGoogleAPIToken(auth_code: string) {
    if(!GOOGLE_ACCESS_TOKEN_URL) throw new Error("Google token fetch api url not found.");
    if(!GOOGLE_CLIENT_ID) throw new Error("Google client id not set.");
    if(!GOOGLE_CLIENT_SECRET) throw new Error("Google client secret not set.");

    const body = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code: auth_code,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
    });

    return await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
}