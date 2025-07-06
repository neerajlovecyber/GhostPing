import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleOAuthClient, setTokenCookie } from '../../../lib/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const oauth2Client = getGoogleOAuthClient();
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    setTokenCookie(res, tokens);
    res.redirect('/app/dashboard');
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OAuth2 error' });
  }
}
