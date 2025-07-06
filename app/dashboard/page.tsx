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


export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sites, setSites] = useState<SiteExpanded[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allSitesTotal, setAllSitesTotal] = useState<{
    period: { totalClicks: number; totalImpressions: number };
    prevPeriod: { totalClicks: number; totalImpressions: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSitesAndAnalytics = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const sitesResponse = await fetch('/api/search-console/sites');
      if (!sitesResponse.ok) {
        throw new Error(`Failed to fetch sites: ${sitesResponse.statusText}`);
      }
      const fetchedSites: GoogleSearchConsoleSite[] = await sitesResponse.json();

      const sitesWithAnalytics: SiteExpanded[] = await Promise.all(
        fetchedSites.map(async (site) => {
          const analyticsResponse = await fetch(`/api/search-console/analytics?siteUrl=${encodeURIComponent(site.siteUrl)}`);
          if (!analyticsResponse.ok) {
            console.warn(`Failed to fetch analytics for ${site.siteUrl}: ${analyticsResponse.statusText}`);
            // Return site with default/empty analytics if fetching fails
            return {
              ...site,
              analytics: { period: { totalClicks: 0, totalImpressions: 0 }, prevPeriod: { totalClicks: 0, totalImpressions: 0 } },
              graph: [],
              nonIndexedPercent: 0, // Default value
              indexedUrls: [], // Default value
              nonIndexedUrls: [], // Default value
            };
          }
          const analyticsData = await analyticsResponse.json();
          return {
            ...site,
            analytics: analyticsData.analytics || { period: { totalClicks: 0, totalImpressions: 0 }, prevPeriod: { totalClicks: 0, totalImpressions: 0 } },
            graph: analyticsData.graph || [],
            nonIndexedPercent: null, // Placeholder removed, needs actual calculation
            indexedUrls: [], // Placeholder removed
            nonIndexedUrls: [], // Placeholder removed
          };
        })
      );
      setSites(sitesWithAnalytics);
      console.log('Fetched sites with analytics:', sitesWithAnalytics);

      // Calculate totals from fetched data
      let clicks = 0;
      let impressions = 0;
      let prevClicks = 0;
      let prevImpressions = 0;

      sitesWithAnalytics.forEach(site => {
        clicks += site.analytics.period.totalClicks;
        impressions += site.analytics.period.totalImpressions;
        prevClicks += site.analytics.prevPeriod.totalClicks;
        prevImpressions += site.analytics.prevPeriod.totalImpressions;
      });

      setAllSitesTotal({
        period: { totalClicks: clicks, totalImpressions: impressions },
        prevPeriod: { totalClicks: prevClicks, totalImpressions: prevImpressions },
      });

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setSites([]); // Clear sites on error
      setAllSitesTotal(null); // Clear totals on error
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSitesAndAnalytics();
    }
  }, [isAuthenticated]);

  const handleRefresh = () => {
    fetchSitesAndAnalytics();
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
            className="max-w-full" 
          />
        ))}
        
        <Card className="min-h-[275px]">
          <CardBody className="flex items-center justify-center h-full text-center">
            <Button
              as={Link}
              href="/api/auth/google"
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