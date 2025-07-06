import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';

// You should set these in your Vercel/Next.js environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export function getGoogleOAuthClient() {
  return new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
}

import { serialize, parse } from 'cookie';
import type { Credentials } from 'google-auth-library';

const TOKEN_COOKIE = 'google_token';

export async function requireAuth(req: NextApiRequest, res: NextApiResponse): Promise<OAuth2Client> {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[TOKEN_COOKIE];
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    throw new Error('Not authenticated');
  }
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials(JSON.parse(token));
  return oauth2Client;
}

export function setTokenCookie(res: NextApiResponse, tokens: Credentials) {
  res.setHeader('Set-Cookie', serialize(TOKEN_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    secure: process.env.NODE_ENV === 'production',
  }));
}

