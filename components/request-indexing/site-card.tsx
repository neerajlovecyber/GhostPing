"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";
import { useState } from "react";
import { SiteExpanded, GoogleSearchConsoleSite } from "@/types/request-indexing";
import { TrendPercentage } from "./trend-percentage";
import { MetricGauge } from "./metric-gauge";
import { GraphClicks } from "./graph-clicks";
import { ChevronDownIcon, EyeIcon, ArrowPathIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface SiteCardProps {
  site: GoogleSearchConsoleSite;
  mockData?: SiteExpanded;
  className?: string;
}

export function SiteCard({ site, mockData, className }: SiteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SiteExpanded | null>(mockData || null);
  
  const siteUrlFriendly = site.siteUrl.replace('sc-domain:', '').replace('https://', '').replace('http://', '');
  const link = `/dashboard/site/${encodeURIComponent(site.siteUrl)}`;

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleHide = () => {
    // Handle hiding site
    console.log('Hide site:', site.siteUrl);
  };

  const dropdownItems = [
    {
      key: "view",
      label: "View",
      startContent: <EyeIcon className="w-4 h-4" />,
    },
    {
      key: "reload", 
      label: "Reload",
      startContent: <ArrowPathIcon className="w-4 h-4" />,
    },
    {
      key: "hide",
      label: "Hide", 
      startContent: <TrashIcon className="w-4 h-4" />,
      className: "text-danger",
    },
  ];

  return (
    <Card className={`min-h-[270px] flex flex-col ${className}`}>
      <CardHeader className="flex justify-between">
        <Link href={link} className="flex items-center gap-2">
          <img 
            src={`https://www.google.com/s2/favicons?domain=${site.siteUrl.replace('sc-domain:', 'https://')}`} 
            alt="favicon" 
            className="w-4 h-4"
          />
          <h3 className="font-bold">{siteUrlFriendly}</h3>
        </Link>
        
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="light" 
              size="sm"
              endContent={<ChevronDownIcon className="w-4 h-4" />}
            />
          </DropdownTrigger>
          <DropdownMenu 
            items={dropdownItems}
            onAction={(key) => {
              if (key === "view") window.location.href = link;
              if (key === "reload") handleRefresh();
              if (key === "hide") handleHide();
            }}
          >
            {(item) => (
              <DropdownItem key={item.key} className={item.className}>
                <div className="flex items-center gap-2">
                  {item.startContent}
                  {item.label}
                </div>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </CardHeader>

      <CardBody className="flex-grow">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : data ? (
          <div className="relative w-full h-full">
            <div className="flex px-2 pt-2 items-start justify-start gap-4">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center flex-col justify-center">
                  <div className="text-2xl font-semibold">
                    {data.nonIndexedPercent && data.nonIndexedPercent !== -1 
                      ? `${Math.round(data.nonIndexedPercent * 100)}%`
                      : '?'
                    }
                  </div>
                  <div className="opacity-80 text-sm">Indexed</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center justify-center gap-2">
                  <TrendPercentage 
                    value={data.analytics.period.totalClicks} 
                    prevValue={data.analytics.prevPeriod.totalClicks} 
                  />
                  <Tooltip content="Clicks last 28d">
                    <span className="flex items-end gap-2">
                      <span>{data.analytics.period.totalClicks.toLocaleString()}</span>
                      <div className="w-5 h-5 text-blue-300">👆</div>
                    </span>
                  </Tooltip>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <TrendPercentage 
                    value={data.analytics.period.totalImpressions} 
                    prevValue={data.analytics.prevPeriod.totalImpressions} 
                  />
                  <Tooltip content="Impressions last 28d">
                    <span className="flex items-end gap-2">
                      <span>{data.analytics.period.totalImpressions.toLocaleString()}</span>
                      <div className="w-5 h-5 text-purple-300">👁</div>
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            <div className="h-[100px] max-w-full overflow-hidden mt-4">
              <GraphClicks data={data.graph} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 text-warning" />
              <div className="text-lg font-semibold mb-2">Failed to load</div>
              <Button size="sm" color="default" onClick={handleRefresh}>
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          color="default" 
          size="sm"
          as={Link}
          href={link}
          disabled={isLoading}
        >
          View
        </Button>

        <div className="flex items-center gap-2">
          <div className="opacity-60 text-xs">
            {site.siteUrl.includes('sc-domain:') ? 'Domain Property' : 'Site Property'}
          </div>
          
          <Tooltip 
            content={
              site.permissionLevel !== 'siteOwner' 
                ? `'${site.permissionLevel}' is unable to submit URLs for indexing`
                : "You can submit URLs for indexing for this site."
            }
          >
            {site.permissionLevel !== 'siteOwner' ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}