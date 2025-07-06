"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { SiteCard } from "./site-card";
import { MetricGauge } from "./metric-gauge";
import { SiteExpanded } from "@/types/request-indexing";

const mockSiteData: SiteExpanded = {
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
};

export function HeroSection() {
  return (
    <section className="py-2 sm:py-5 ">
      <div className="xl:grid gap-8 xl:grid-cols-12 mx-auto w-full sm:px-6 lg:px-0 px-0">
        <div className="mx-auto max-w-[50rem] xl:col-span-6 xl:mr-10 xl:ml-0 mb-10 xl:mb-0 flex flex-col justify-center">
          <div className="text-gray-900 mb-3 dark:text-gray-100 text-center text-4xl font-bold sm:text-5xl lg:text-left lg:text-6xl">
            <div className="text-2xl opacity-70 font-normal mb-2">
              Crawled, but not indexed?
            </div>
            <span className="max-w-5xl">Get your pages indexed within 48 hours</span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl text-center text-xl lg:text-left mb-5">
            A free, open-source tool to request pages to be indexed using the{" "}
            <Link href="#" className="font-semibold underline">
              Web Search Indexing API
            </Link>{" "}
            and view your{" "}
            <Link 
              href="https://search.google.com/search-console/about" 
              isExternal
              className="font-semibold underline"
            >
              Google Search Console
            </Link>{" "}
            data.
          </p>
          
          <div className="mb-10 flex items-center justify-center gap-3 flex-row sm:gap-6 lg:justify-start">
            <Button 
              size="lg"
              color="success"
              variant="solid"
              endContent={<ArrowLongRightIcon className="w-5 h-5" />}
              as={Link}
              href="/dashboard"
            >
              Get Started<span className="hidden sm:inline"> For Free</span>
            </Button>
            
            <Button 
              size="lg"
              variant="light"
              color="default"
              startContent={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              }
              as={Link}
              href="https://github.com/harlan-zw/request-indexing"
              isExternal
            >
              View code
            </Button>
          </div>
          
          <div className="text-base ml-5 space-y-5">
            <p>
              ⚡ <Link href="#" className="underline">Request indexing</Link> on new sites and pages, have them appear on Google in 48 hours.
            </p>
            <p>
              📊 <Link href="#dashboard" className="underline">Dashboard</Link> to see the search performance of all your Google Search Console sites.
            </p>
            <p>
              🗓️ <Link href="#dashboard" className="underline">Keep your site data</Link>. Google Search Console data deletes site data longer than 16 months, start keeping it.
            </p>
          </div>
        </div>
        
        <div className="xl:col-span-6 relative max-w-full flex items-center justify-center">
          <Card className="shadow-lg max-w-full">
            <CardHeader>
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center justify-between gap-7 w-full">
                  <div>
                    <div className="text-xl sm:text-3xl flex items-center gap-2 dark:text-gray-300 text-gray-900">
                      <img 
                        src="https://www.google.com/s2/favicons?domain=https://nuxtseo.com" 
                        alt="favicon" 
                        className="w-4 h-4 rounded-sm"
                      />
                      nuxtseo.com
                    </div>
                    <div className="opacity-60 text-sm sm:text-lg">
                      Domain Property
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-right gap-3 text-gray-500 text-sm justify-end">
                    <span>% of your pages<br /> indexed</span>
                    <MetricGauge score={0.91}>
                      <div className="text-xl">91</div>
                    </MetricGauge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="text-sm font-medium">Non-indexed URLs</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>/blog/hello-world</span>
                    <span className="text-yellow-500">Discovered</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>/is-this-thing-on</span>
                    <span className="text-yellow-500">Discovered</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>/maybe-it-is</span>
                    <span className="text-green-500">Indexed</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}