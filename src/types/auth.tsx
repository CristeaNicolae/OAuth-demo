import { JwtPayload } from "jsonwebtoken";

export interface GoogleAuthToken extends JwtPayload {
    email: string;
}