import { NextRequest } from "next/server";
import { NextResponse } from 'next/server'
import { GoogleAuthToken } from "../types/auth"
import * as jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {

    // const tokenString = request.cookies.get("token")?.value;

    // if (!tokenString) {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // try{
    //     const token = jwt.verify(tokenString, process.env.JWT_SECRET) as unknown as GoogleAuthToken;

    //     console.log("email: " + token.email);

    //     return NextResponse.next();
        
    // } catch(err) {
    //     console.log("Invalid token" + err)
    //     return NextResponse.redirect(new URL("/", request.url));
    // }
    
}