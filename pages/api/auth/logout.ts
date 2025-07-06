import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the authentication cookie
  res.setHeader('Set-Cookie', serialize('google_token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    secure: process.env.NODE_ENV === 'production',
  }));

  res.status(200).json({ message: 'Logged out successfully' });
}