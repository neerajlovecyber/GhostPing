import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { requireAuth } from '../../../lib/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const oauth2Client = await requireAuth(req, res);
    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    const response = await searchconsole.sites.list();
    res.status(200).json(response.data.siteEntry || []);
  } catch (error: any) {
    console.error('Error fetching Search Console sites:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
  }
}