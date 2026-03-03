import mongoose from "mongoose";
import UserModel from "@/mongo/models/User"
import { TokenPayload } from "google-auth-library";
import { AppToken } from '@/types/auth'

declare global {
    var mongoose: any;
}

const MONGO_URL = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/user` || "mongodb://localhost:27017/user";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {

    if (cached.conn) {
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
      cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
        return mongoose;
      });
    }
    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  
    return cached.conn;
}

export async function findByEmail(email: string) {
  return UserModel.findOne({ email: email });
}

export async function findByToken(tokenString: string) {
  return UserModel.findOne(
    { "app_token.token": tokenString },
    { password: 0 }
  );
}

export async function createNewOAuthUser(
    payload: TokenPayload,
    google_api_refresh_token: string,
    app_token: AppToken) {

    return UserModel.create({
        email: payload.email, 
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture_link: payload.picture, 
        google_api_refresh_token: google_api_refresh_token,
        app_token: {
          token: app_token.token,
          iat: app_token.iat,
          exp: app_token.exp,
        }});
}
