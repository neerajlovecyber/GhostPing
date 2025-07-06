import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { google } from 'googleapis';
import { getGoogleOAuthClient } from '../../../lib/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies['google_token'];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const oauth2Client = getGoogleOAuthClient();
    oauth2Client.setCredentials(JSON.parse(token));

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const user = {
      email: data.email,
      name: data.name,
      picture: data.picture,
    };

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
}