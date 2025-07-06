
import { HeroSection } from "@/components/request-indexing/hero-section";
import { SiteCard } from "@/components/request-indexing/site-card";
import { SiteExpanded } from "@/types/request-indexing";

const mockSiteCards: SiteExpanded[] = [
  {
    siteUrl: "https://neerajlovecyber.com",
    permissionLevel: "siteOwner",
    analytics: {
      period: { totalClicks: 3471, totalImpressions: 64141 },
      prevPeriod: { totalClicks: 902, totalImpressions: 14100 },
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
      period: { totalClicks: 1250, totalImpressions: 28500 },
      prevPeriod: { totalClicks: 890, totalImpressions: 19200 },
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
];

export default function Home() {
  return (
    <div className="relative">
      
      
      <div className="container mx-auto px-4 relative z-10">
        <HeroSection />
        
        
        
        
             </div>
    </div>
  );
}