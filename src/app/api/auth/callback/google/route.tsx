import dbConnect from "@/lib/mongo"
import { NextResponse, NextRequest } from "next/server";
import { state_cookie } from "@/utils/constants"
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { getGoogleAPIToken } from "@/external/get-api";

// const UserModel = require("@/models/User")

export async function GET(request: NextRequest) {
    try {

        const params = request.nextUrl.searchParams;
        const error = params.get("error");
        const code = params.get("code");

        if(error || !code) {
            console.log("Error: " + error);
        }
        else {

            const secret_key = process.env.IRON_PASSWORD;
            if(!secret_key) throw new Error("iron-session password is not set!");
            const password: string = secret_key;
        
            type SessionData = {
                state: string;
            }
        
            const session = await getIronSession<SessionData>(await cookies(), { password: password, cookieName: state_cookie });
            const state = session.state;

            if(state !== request.nextUrl.searchParams.get("state")) {
                throw new Error("Possible CSRF attack or missing state parameter!");
            }

            const apiResponse = await getGoogleAPIToken(code);
            const tokens = await apiResponse.json();

            console.log("SUCCESS");
            console.log(tokens);

            (await cookies()).delete(state_cookie);

            //await dbConnect(); 

        }
        
        

        // const user = await UserModel.findOne({ email });

        // if (!user || user.password !== password) {
        //     return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });
        // }

        // create token here

        // return NextResponse.json({ message: 'login success', user: user.email }, { status: 200 });
        return NextResponse.redirect("http://localhost:3000/home");


    } catch (error) {
        console.error('Error trying to login: ', error);
        return NextResponse.json({ status: 500 });
    }
}