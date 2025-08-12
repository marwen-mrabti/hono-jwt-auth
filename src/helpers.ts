import { sign } from 'hono/jwt';
import { CookieOptions } from 'hono/utils/cookie';

export const generateToken = async (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    iat: now,
    exp: now + 60 * 60, // expires in 1 hour
  };
  const token = await sign(payload, jwtSecret!);
  return token;
};

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  path: '/',
  maxAge: 3600, // 1 hour
} as CookieOptions;
