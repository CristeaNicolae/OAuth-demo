import { findByToken } from "@/mongo/utils/mongo";
import { AppToken, UserLocalSessionData } from "@/types/auth";
import { app_cookie } from "@/utils/constants";
import { checkToken } from "@/utils/token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const cookieStore = cookies();
    const tokenString = (await cookieStore).get(app_cookie)?.value;

    if(!tokenString) return NextResponse.json(
        { message: "Missing token" },
        { status: 401 }
    );
    
    const token: AppToken = JSON.parse(tokenString);
    const user = await findByToken(token.token);

    if(!user) return NextResponse.json(
        { message : "Could not find user based on token"},
        { status: 404}
    )

    const local_user_data: UserLocalSessionData = {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        picture_link: user.picture_link ?? "",
    }

    return NextResponse.json(
        { user: local_user_data },
        { status: 200 },
    );

}