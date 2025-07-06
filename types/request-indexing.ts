// Types for Request Indexing app
export interface SitePage {
  url: string
  lastInspected?: number
  inspectionResult?: {
    inspectionResultLink: string
    indexStatusResult: {
      verdict: 'PASS' | 'NEUTRAL' | 'FAIL'
      coverageState: string
      robotsTxtState?: string
      indexingState?: string
      pageFetchState?: string
      lastCrawlTime?: string
      googleCanonical?: string
      userCanonical?: string
      sitemap?: string[]
      referringUrls?: string[]
      crawledAs?: string
    }
  }
  urlNotificationMetadata?: {
    url: string
    latestUpdate: {
      url: string
      type: string
      notifyTime: number
    }
  }
}

export interface GoogleSearchConsoleSite {
  siteUrl: string
  permissionLevel: 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser'
}

export interface SiteAnalytics {
  analytics: {
    period: {
      totalClicks: number
      totalImpressions: number
    }
    prevPeriod: {
      totalClicks: number
      totalImpressions: number
    }
  }
  sitemaps: any[]
  indexedUrls: string[]
  period: Array<{
    url: string
    clicks: number
    prevClicks: number
    clicksPercent: number
    impressions: number
    impressionsPercent: number
    prevImpressions: number
  }>
  keywords: Array<{
    keyword: string
    position: number
    positionPercent: number
    prevPosition: number
    ctr: number
    ctrPercent: number
    prevCtr: number
    clicks: number
    impressions: number
  }>
  graph: Array<{
    clicks: number
    impressions: number
    time: string
  }>
}

export interface SiteExpanded extends SiteAnalytics, GoogleSearchConsoleSite {
  nonIndexedPercent: number
  nonIndexedUrls: SitePage[]
}

export interface User {
  email: string
  picture: string
  access: 'free' | 'pro'
  analyticsPeriod: '7d' | '28d' | '3mo' | '6mo' | '12mo' | '16mo'
  hiddenSites?: string[]
}