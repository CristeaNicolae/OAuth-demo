import { getGoogleAuthorization } from "@/external/get-api";
import { getIronSession } from 'iron-session';
import { NextResponse } from "next/server";
import { state_cookie } from "@/utils/constants"
import { cookies } from 'next/headers';

export async function GET() {
    const auth = getGoogleAuthorization();

    const secret_key = process.env.IRON_PASSWORD;
    if(!secret_key) throw new Error("iron-session password is not set!");
    const password: string = secret_key;

    type SessionData = {
        state: string;
    }

    const session = await getIronSession<SessionData>(await cookies(), { password: password, cookieName: state_cookie });
    session.state = auth.state;
    await session.save();

    return NextResponse.redirect(auth.url, 302);
}