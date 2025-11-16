import { CookieOptions } from 'express';

export const cookieConfig: CookieOptions = {
  // domain: process.env.APP_PAGE_DOMAIN ?? 'localhost',
  sameSite: 'none',
  httpOnly: true,
  secure: true,
};
