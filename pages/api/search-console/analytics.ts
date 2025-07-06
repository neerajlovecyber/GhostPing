import type { NextApiRequest, NextApiResponse } from 'next';
import { google, searchconsole_v1 } from 'googleapis';
import { requireAuth } from '../../../lib/google';

function formatDate(date: Date = new Date()) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace('sc-domain:', 'https://').replace(/\/$/, '')
}

function percentDifference(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

async function recursiveQuery(api: searchconsole_v1.Searchconsole, query: searchconsole_v1.Params$Resource$Searchanalytics$Query, maxRows: number, page: number = 1, rows: searchconsole_v1.Schema$ApiDataRow[] = []) {
  const rowLimit = query.requestBody?.rowLimit || maxRows
  const res = await api.searchanalytics.query({
    ...query,
    requestBody: {
      ...query.requestBody,
      startRow: (page - 1) * rowLimit,
    },
  })
  // add res rows
  rows.push(...res.data.rows!)
  if (res.data.rows!.length === rowLimit && res.data.rows!.length < maxRows && page <= 4)
    await recursiveQuery(api, query, maxRows, page + 1, rows)

  return { data: { rows } }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { siteUrl } = req.query;

    if (!siteUrl || typeof siteUrl !== 'string') {
      return res.status(400).json({ error: 'siteUrl query parameter is required.' });
    }

    const oauth2Client = await requireAuth(req, res);
    const api = google.searchconsole({ version: 'v1', auth: oauth2Client });

    const periodRange = '28d'; // Match example project default
    const periodDays = Number.parseInt(periodRange.replace('d', ''))
    const startPeriod = new Date()
    startPeriod.setDate(new Date().getDate() - periodDays)
    const startPrevPeriod = new Date()
    startPrevPeriod.setDate(new Date().getDate() - periodDays * 2)
    const endPrevPeriod = new Date()
    endPrevPeriod.setDate(new Date().getDate() - periodDays - 1)

    const requestBody = {
      dimensions: ['page'],
      type: 'web',
      aggregationType: 'byPage',
    }
    const rowLimit = 25000
    const maxRows = 1000
    
    const [keywordsPeriod, keywordsPrevPeriod, period, prevPeriod, graph] = (await Promise.all([
      // do a query based on keywords instead of dates
      // period
      await recursiveQuery(api, {
        siteUrl,
        requestBody: {
          ...requestBody,
          // 1 month
          startDate: formatDate(startPeriod),
          endDate: formatDate(),
          // keywords
          dimensions: ['query'],
          rowLimit,
        },
      }, maxRows),
      // prev period
      api.searchanalytics.query({
        siteUrl,
        requestBody: {
          ...requestBody,
          // 1 month
          startDate: formatDate(startPrevPeriod),
          endDate: formatDate(endPrevPeriod),
          // keywords
          dimensions: ['query'],
          rowLimit,
        },
      }),
      await recursiveQuery(api, {
        siteUrl,
        requestBody: {
          ...requestBody,
          // 1 month
          startDate: formatDate(startPeriod),
          endDate: formatDate(),
          rowLimit,
        },
      }, maxRows),
      api.searchanalytics.query({
        siteUrl,
        requestBody: {
          ...requestBody,
          startDate: formatDate(startPrevPeriod),
          endDate: formatDate(endPrevPeriod),
          rowLimit,
        },
      }),
      // do another query but do it based on clicks / impressions for the day
      api.searchanalytics.query({
        siteUrl,
        requestBody: {
          ...requestBody,
          startDate: formatDate(startPrevPeriod),
          endDate: formatDate(),
          dimensions: ['date'],
          rowLimit,
        },
      }),
    ]))
      .map(res => res.data.rows || [])
    
    const analytics = {
      // compute analytics from calcualting each url stats togethor
      period: {
        totalClicks: period!.reduce((acc, row) => acc + row.clicks!, 0),
        totalImpressions: period!.reduce((acc, row) => acc + row.impressions!, 0),
      },
      prevPeriod: {
        totalClicks: prevPeriod!.reduce((acc, row) => acc + row.clicks!, 0),
        totalImpressions: prevPeriod!.reduce((acc, row) => acc + row.impressions!, 0),
      },
    }
    const normalizedSiteUrl = normalizeSiteUrl(siteUrl)
    const indexedUrls = period!
      .map(r => r.keys![0]) // doman property using www.
      // strip out subdomains, hash and query
      .filter(r => !r.includes('#') && !r.includes('?')
      // fix www.
      && r.startsWith(normalizedSiteUrl),
      )

    const sitemaps = await api.sitemaps.list({
      siteUrl,
    })
      .then(res => res.data.sitemap || [])
    
    const result = {
      analytics,
      sitemaps,
      indexedUrls,
      period: period.map((row) => {
        const prevPeriodRow = prevPeriod.find(r => r.keys![0] === row.keys![0])
        const url = new URL(row.keys![0])
        return {
          url: url.pathname,
          clicks: row.clicks!,
          prevClicks: prevPeriodRow ? prevPeriodRow.clicks! : 0,
          clicksPercent: percentDifference(row.clicks!, prevPeriodRow?.clicks || 0),
          impressions: row.impressions!,
          impressionsPercent: percentDifference(row.impressions!, prevPeriodRow?.impressions || 0),
          prevImpressions: prevPeriodRow ? prevPeriodRow.impressions! : 0,
        }
      }),
      keywords: keywordsPeriod.map((row) => {
        const prevPeriodRow = keywordsPrevPeriod.find(r => r.keys![0] === row.keys![0])
        return {
          keyword: row.keys![0],
          // position and ctr
          position: row.position!,
          positionPercent: percentDifference(row.position!, prevPeriodRow?.position || 0),
          prevPosition: prevPeriodRow ? prevPeriodRow.position! : 0,
          ctr: row.ctr!,
          ctrPercent: percentDifference(row.ctr!, prevPeriodRow?.ctr || 0),
          prevCtr: prevPeriodRow ? prevPeriodRow.ctr! : 0,
          clicks: row.clicks!,
          impressions: row.impressions,
        }
      }),
      graph: graph.map((row) => {
        // fix key
        return {
          clicks: row.clicks!,
          impressions: row.impressions!,
          time: row.keys![0],
          keys: undefined,
        }
      }),
    }

    console.log(`Analytics for ${siteUrl}:`, {
      totalClicks: analytics.period.totalClicks,
      totalImpressions: analytics.period.totalImpressions,
      indexedUrls: indexedUrls.length,
      sitemaps: sitemaps.length,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching Search Console analytics:', {
      siteUrl: req.query.siteUrl,
      error: error.message,
      statusCode: error.statusCode,
    });
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Internal Server Error',
    });
  }
}
