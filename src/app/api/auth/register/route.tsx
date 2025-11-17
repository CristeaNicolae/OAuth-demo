import dbConnect from "@/lib/mongo"
import { NextResponse } from "next/server";

const UserModel = require("@/models/User")

export async function POST(request: Request) {
    try {
        await dbConnect(); 
        
        const { email, password } = await request.json();

        const user = await UserModel.findOne({ email });

        if (!user || user.password !== password) {
            return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });
        }

        // create token here

        return NextResponse.json({ message: 'login success', user: user.email }, { status: 200 });

    } catch (error) {
        console.error('Error trying to login: ', error);
        return NextResponse.json({ status: 500 });
    }
}