import mongoose from "mongoose";
import UserModel from "@/mongo/models/User"

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
    return UserModel.findOne({email: email});
}

export async function createNewUser(email: string, password?: string, tokens?: string) {

}
