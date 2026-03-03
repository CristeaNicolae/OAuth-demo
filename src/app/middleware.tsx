import { NextRequest } from "next/server";
import { NextResponse } from 'next/server'
import { app_cookie } from "@/utils/constants"
import { checkToken, isExpired } from "@/utils/token";

export async function middleware(request: NextRequest) {

    const raw_token = request.cookies.get(app_cookie)?.value;

    if (!raw_token) {
        throw new Error("Could not find token");
    }

    try {
        if(!checkToken(raw_token)) throw new Error("Invalid Token");
        return NextResponse.next();
        
    } catch(err) {
        console.error("Error: " + err)
        return NextResponse.redirect(new URL("/", request.url));
    }
    
}