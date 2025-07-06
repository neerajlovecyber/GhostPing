import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { requireAuth } from '../../../lib/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { siteUrl } = req.query;

    if (!siteUrl || typeof siteUrl !== 'string') {
      return res.status(400).json({ error: 'siteUrl query parameter is required.' });
    }

    const oauth2Client = await requireAuth(req, res);
    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    // Helper function to normalize site URL (from example project)
    function normalizeSiteUrl(siteUrl: string): string {
      return siteUrl.replace('sc-domain:', 'https://').replace(/\/$/, '');
    }

    // Get sitemaps and search analytics data to estimate indexing (following example project approach)
    const [sitemapsResponse, searchAnalyticsResponse] = await Promise.all([
      searchconsole.sitemaps.list({ siteUrl }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: '2024-01-01', // Get data from beginning of year
          endDate: new Date().toISOString().split('T')[0],
          type: 'web',
          dimensions: ['page'],
          aggregationType: 'byPage',
          rowLimit: 25000, // Maximum allowed
        },
      })
    ]);

    const sitemaps = sitemapsResponse.data.sitemap || [];
    const searchAnalyticsRows = searchAnalyticsResponse.data.rows || [];
    
    // Filter indexed URLs like the example project does
    const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
    const indexedUrls = searchAnalyticsRows
      .map(r => r.keys![0]) // Get the page URL
      .filter(url => 
        !url.includes('#') && 
        !url.includes('?') && 
        url.startsWith(normalizedSiteUrl)
      );
    
    // Get total submitted URLs from sitemaps
    let totalSubmittedUrls = 0;
    for (const sitemap of sitemaps) {
      // This is a rough estimate - in reality you'd need to fetch and parse each sitemap
      totalSubmittedUrls += sitemap.contents?.length || 0;
    }

    // If we don't have sitemap data, use the indexed URLs as a base estimate
    if (totalSubmittedUrls === 0) {
      totalSubmittedUrls = Math.max(indexedUrls.length * 1.5, 10); // Conservative estimate
    }

    const indexedPercent = totalSubmittedUrls > 0 ? Math.round((indexedUrls.length / totalSubmittedUrls) * 100) : 0;

    const indexingStatus = {
      totalUrls: totalSubmittedUrls,
      indexedUrls: indexedUrls.length,
      nonIndexedUrls: Math.max(totalSubmittedUrls - indexedUrls.length, 0),
      indexedPercent: Math.min(indexedPercent, 100), // Cap at 100%
      sitemaps: sitemaps.length,
      estimatedData: true, // Flag to indicate this is estimated
      normalizedSiteUrl,
      sampleIndexedUrls: indexedUrls.slice(0, 5), // Show first 5 for debugging
    };

    console.log(`Indexing status for ${siteUrl}:`, indexingStatus);

    res.status(200).json(indexingStatus);
  } catch (error: any) {
    console.error('Error fetching indexing status:', {
      siteUrl: req.query.siteUrl,
      error: error.message,
      statusCode: error.statusCode,
    });
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
