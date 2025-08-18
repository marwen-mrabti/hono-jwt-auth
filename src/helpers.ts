import type { CookieOptions } from "hono/utils/cookie";

import { sign } from "hono/jwt";

export async function generateToken(userId: string) {
  const jwtSecret = process.env.JWT_SECRET;
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  const payload = {
    sub: userId,
    iat: now,
    exp: now + 60 * 60, // expires in 1 hour (current time in sec + 3600 sec)
  };
  const token = await sign(payload, jwtSecret!);
  return token;
}

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  path: "/",
  maxAge: 3600, // 1 hour
} as CookieOptions;
