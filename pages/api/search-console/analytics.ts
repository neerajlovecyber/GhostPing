import type { NextApiRequest, NextApiResponse } from 'next';
import { google, searchconsole_v1 } from 'googleapis';
import { requireAuth } from '../../../lib/google';

// Helper function to format dates for the API
function formatDate(date: Date = new Date()): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Define a basic type for analytics data, simplified from the example app
interface SiteAnalytics {
  period: {
    totalClicks: number;
    totalImpressions: number;
  };
  prevPeriod: {
    totalClicks: number;
    totalImpressions: number;
  };
  graph: Array<{
    clicks: number;
    impressions: number;
    time: string;
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { siteUrl } = req.query;

    if (!siteUrl || typeof siteUrl !== 'string') {
      return res.status(400).json({ error: 'siteUrl query parameter is required.' });
    }

    const oauth2Client = await requireAuth(req, res);
    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    const periodDays = 30; // Default to 30 days
    const startPeriod = new Date();
    startPeriod.setDate(new Date().getDate() - periodDays);
    const startPrevPeriod = new Date();
    startPrevPeriod.setDate(new Date().getDate() - periodDays * 2);
    const endPrevPeriod = new Date();
    endPrevPeriod.setDate(new Date().getDate() - periodDays - 1);

    const [periodData, prevPeriodData, graphData] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startPeriod),
          endDate: formatDate(),
          type: 'web',
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startPrevPeriod),
          endDate: formatDate(endPrevPeriod),
          type: 'web',
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startPrevPeriod), // Fetch graph data for a longer period
          endDate: formatDate(),
          dimensions: ['date'],
          type: 'web',
        },
      }),
    ]);

    const periodRows = periodData.data.rows || [];
    const prevPeriodRows = prevPeriodData.data.rows || [];
    const graphRows = graphData.data.rows || [];

    const analytics: SiteAnalytics = {
      period: {
        totalClicks: periodRows.reduce((acc, row) => acc + (row.clicks || 0), 0),
        totalImpressions: periodRows.reduce((acc, row) => acc + (row.impressions || 0), 0),
      },
      prevPeriod: {
        totalClicks: prevPeriodRows.reduce((acc, row) => acc + (row.clicks || 0), 0),
        totalImpressions: prevPeriodRows.reduce((acc, row) => acc + (row.impressions || 0), 0),
      },
      graph: graphRows.map(row => ({
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        time: row.keys ? row.keys[0] : '', // 'date' dimension is the first key
      })),
    };

    res.status(200).json(analytics);
  } catch (error: any) {
    console.error('Error fetching Search Console analytics:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
  }
}