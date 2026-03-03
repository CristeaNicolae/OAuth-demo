import { OAuth2Client } from 'google-auth-library';
import { AppToken } from '@/types/auth'
import crypto from 'crypto';
import { findByToken } from '@/mongo/utils/mongo';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyIdToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload;
}

export function createToken(): AppToken {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    iat: new Date(Date.now()),
    exp: new Date(Date.now() + 3600 * 1000)
  }
}

export function isExpired(exp: Date): boolean {
  return exp < new Date();
}

export async function checkToken(tokenString: string | undefined): Promise<boolean> {
  if(!tokenString) return false;

  const token: AppToken = JSON.parse(tokenString);
  if(isExpired(token.exp)) return false;
  if(!findByToken(token.token)) return false;

  return true;
}
