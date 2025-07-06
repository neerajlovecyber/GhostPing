import type { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleOAuthClient } from '../../../lib/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const oauth2Client = getGoogleOAuthClient();
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/indexing',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  res.redirect(url);
}
