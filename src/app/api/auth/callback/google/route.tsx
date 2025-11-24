import { dbConnect, findByEmail } from "@/mongo/utils/mongo"
import { NextResponse, NextRequest } from "next/server";
import { state_cookie } from "@/utils/constants"
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { getGoogleAPIToken } from "@/external/get-api";
import { SessionData } from "@/types/auth";
import { verifyIdToken } from "@/utils/token"

// const UserModel = require("@/models/User")

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
            const user = await findByEmail(payload.email); 
            
            if (!user) {

            }

        }
        

        // const user = await UserModel.findOne({ email });



        // create token here

        // return NextResponse.json({ message: 'login success', user: user.email }, { status: 200 });
        return NextResponse.redirect(new URL("/home", request.nextUrl.origin));


    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500 });
    }
}