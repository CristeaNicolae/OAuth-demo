import { dbConnect, findByEmail, createNewOAuthUser } from "@/mongo/utils/mongo"
import { NextResponse, NextRequest } from "next/server";
import { state_cookie, app_cookie } from "@/utils/constants"
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { getGoogleAPIToken } from "@/external/get-api";
import { SessionData, AppToken } from "@/types/auth";
import { verifyIdToken, createToken, isExpired, checkToken } from "@/utils/token";
import { redirect } from "next/dist/server/api-utils";

export async function GET(request: NextRequest) {
    try {

        const params = request.nextUrl.searchParams;
        const error = params.get("error");
        const code = params.get("code");

        if(error) {
            console.log("Error: " + error);
            throw new Error(error);
        }
        else if(!code){
            throw new Error("Authorization code not present");
        }
        else {

            const secret_key = process.env.IRON_PASSWORD;
            if(!secret_key) throw new Error("iron-session password is not set!");
            const password: string = secret_key;
        
            const session = await getIronSession<SessionData>(await cookies(), { password: password, cookieName: state_cookie });
            const state = session.state;

            if(state !== request.nextUrl.searchParams.get("state")) {
                throw new Error("Possible CSRF attack or missing state parameter!");
            }

            const apiResponse = await getGoogleAPIToken(code);
            const tokens = await apiResponse.json();

            if(tokens.error) throw new Error(JSON.stringify(tokens));

            const payload = await verifyIdToken(tokens.id_token);
            if(!payload) throw new Error("Missing payload from jwt");
            if(!payload.email) throw new Error("Missing email");

            console.log(tokens);
            console.log(payload);

            (await cookies()).delete(state_cookie);
            
            await dbConnect();
            let user = await findByEmail(payload.email); 
            let app_token: AppToken;

            // account does not exists
            if (!user) {
                if(!tokens.refresh_token) throw new Error("Missing refresh token when logging in for the first time");

                const appToken: AppToken = createToken();
                const db_user = await createNewOAuthUser(payload, tokens.refresh_token, appToken);
                if(!db_user) {
                    throw new Error("Could not create new user");
                }
                user = db_user;
                app_token = appToken;

            }
            // account exists
            else {                
                // token does not exist or is expired or is incomplete
                if(!checkToken(JSON.stringify(user.app_token))) {
                        const appToken: AppToken = createToken();
                        user.app_token = { ...appToken };
                        user.save();
                        app_token = appToken;
                }
                else {
                    app_token = user.app_token as AppToken;
                }
            }

            //save token to httpOnly cookie
            (await cookies()).set({name: app_cookie, value: JSON.stringify(app_token), httpOnly: true})
        }
        return NextResponse.redirect(new URL("/home", request.nextUrl.origin));

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500 });
    }
}