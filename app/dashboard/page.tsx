"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SiteCard } from "@/components/request-indexing/site-card";
import { TrendPercentage } from "@/components/request-indexing/trend-percentage";
import { SiteExpanded, GoogleSearchConsoleSite } from "@/types/request-indexing";

// Mock data
const mockSites: GoogleSearchConsoleSite[] = [
  {
    siteUrl: "https://nuxtseo.com",
    permissionLevel: "siteOwner"
  },
  {
    siteUrl: "sc-domain:example.com", 
    permissionLevel: "siteOwner"
  },
  {
    siteUrl: "https://mysite.com",
    permissionLevel: "siteRestrictedUser"
  }
];

const mockSiteData: SiteExpanded[] = [
  {
    siteUrl: "https://nuxtseo.com",
    permissionLevel: "siteOwner",
    analytics: {
      period: {
        totalClicks: 3471,
        totalImpressions: 64141,
      },
      prevPeriod: {
        totalClicks: 902,
        totalImpressions: 14100,
      },
    },
    nonIndexedPercent: 0.91,
    indexedUrls: Array.from({ length: 109 }),
    nonIndexedUrls: [],
    graph: [
      { clicks: 3, impressions: 59, time: '2023-08-14' },
      { clicks: 7, impressions: 62, time: '2023-08-15' },
      { clicks: 2, impressions: 60, time: '2023-08-16' },
      { clicks: 1, impressions: 45, time: '2023-08-17' },
      { clicks: 5, impressions: 70, time: '2023-08-18' },
      { clicks: 8, impressions: 85, time: '2023-08-19' },
      { clicks: 12, impressions: 95, time: '2023-08-20' },
    ],
  },
  {
    siteUrl: "sc-domain:example.com",
    permissionLevel: "siteOwner", 
    analytics: {
      period: {
        totalClicks: 1250,
        totalImpressions: 28500,
      },
      prevPeriod: {
        totalClicks: 890,
        totalImpressions: 19200,
      },
    },
    nonIndexedPercent: 0.76,
    indexedUrls: Array.from({ length: 45 }),
    nonIndexedUrls: [],
    graph: [
      { clicks: 2, impressions: 35, time: '2023-08-14' },
      { clicks: 4, impressions: 42, time: '2023-08-15' },
      { clicks: 3, impressions: 38, time: '2023-08-16' },
      { clicks: 6, impressions: 55, time: '2023-08-17' },
      { clicks: 5, impressions: 48, time: '2023-08-18' },
      { clicks: 7, impressions: 62, time: '2023-08-19' },
      { clicks: 9, impressions: 71, time: '2023-08-20' },
    ],
  },
  {
    siteUrl: "https://mysite.com",
    permissionLevel: "siteRestrictedUser",
    analytics: {
      period: {
        totalClicks: 567,
        totalImpressions: 12300,
      },
      prevPeriod: {
        totalClicks: 423,
        totalImpressions: 9800,
      },
    },
    nonIndexedPercent: 0.82,
    indexedUrls: Array.from({ length: 23 }),
    nonIndexedUrls: [],
    graph: [
      { clicks: 1, impressions: 18, time: '2023-08-14' },
      { clicks: 2, impressions: 22, time: '2023-08-15' },
      { clicks: 1, impressions: 19, time: '2023-08-16' },
      { clicks: 3, impressions: 28, time: '2023-08-17' },
      { clicks: 2, impressions: 24, time: '2023-08-18' },
      { clicks: 4, impressions: 31, time: '2023-08-19' },
      { clicks: 5, impressions: 35, time: '2023-08-20' },
    ],
  }
];

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sites, setSites] = useState<GoogleSearchConsoleSite[]>(mockSites);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allSitesTotal, setAllSitesTotal] = useState<{
    period: { totalClicks: number; totalImpressions: number };
    prevPeriod: { totalClicks: number; totalImpressions: number };
  } | null>(null);

  useEffect(() => {
    // Calculate totals from mock data
    let clicks = 0;
    let impressions = 0;
    let prevClicks = 0;
    let prevImpressions = 0;

    mockSiteData.forEach(site => {
      clicks += site.analytics.period.totalClicks;
      impressions += site.analytics.period.totalImpressions;
      prevClicks += site.analytics.prevPeriod.totalClicks;
      prevImpressions += site.analytics.prevPeriod.totalImpressions;
    });

    setAllSitesTotal({
      period: { totalClicks: clicks, totalImpressions: impressions },
      prevPeriod: { totalClicks: prevClicks, totalImpressions: prevImpressions },
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
          <div className="mb-3 md:mb-0">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <span>Your Sites</span>
              <Chip color="default" variant="flat" size="sm">
                {sites.length}
              </Chip>
            </h2>
            <p className="text-gray-400 text-sm">
              Data from{" "}
              <Link 
                href="https://search.google.com/search-console" 
                isExternal
                className="underline"
              >
                Google Search Console
              </Link>
            </p>
          </div>
          
          {allSitesTotal && (
            <div className="mb-3 md:mb-0 flex items-center md:justify-center gap-2 md:gap-5">
              <div className="flex flex-col justify-center">
                <span className="text-sm opacity-70">Clicks</span>
                <div className="text-xl flex items-end gap-2">
                  <span>{allSitesTotal.period.totalClicks.toLocaleString()}</span>
                  <div className="w-5 h-5 opacity-80">👆</div>
                </div>
                <TrendPercentage 
                  value={allSitesTotal.period.totalClicks} 
                  prevValue={allSitesTotal.prevPeriod.totalClicks} 
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm opacity-70">Impressions</span>
                <div className="text-xl flex items-end gap-2">
                  <span>{allSitesTotal.period.totalImpressions.toLocaleString()}</span>
                  <div className="w-5 h-5 opacity-80">👁</div>
                </div>
                <TrendPercentage 
                  value={allSitesTotal.period.totalImpressions} 
                  prevValue={allSitesTotal.prevPeriod.totalImpressions} 
                />
              </div>
            </div>
          )}
        </div>
        
        <Button 
          className="hidden md:flex" 
          variant="ghost" 
          color="default"
          startContent={<ArrowPathIcon className="w-4 h-4" />}
          isLoading={isRefreshing}
          onPress={handleRefresh}
        >
          Refresh
        </Button>
      </div>

      <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 gap-5">
        {sites.map((site, index) => (
          <SiteCard 
            key={site.siteUrl} 
            site={site} 
            mockData={mockSiteData[index]}
            className="max-w-full" 
          />
        ))}
        
        <Card className="min-h-[275px]">
          <CardBody className="flex items-center justify-center h-full text-center">
            <Button
              as={Link}
              href="https://search.google.com/search-console"
              isExternal
              variant="light"
              size="lg"
              startContent={<PlusIcon className="w-5 h-5" />}
              color="default"
              className="mb-2"
            >
              Add New Site
            </Button>
            <p className="text-gray-500 text-xs max-w-xs">
              You will need to create a new Property in Google Search Console and then refresh.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}