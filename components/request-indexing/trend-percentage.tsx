"use client";

import { Tooltip } from "@heroui/tooltip";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

interface TrendPercentageProps {
  prevValue?: string | number | null;
  value: string | number;
  symbol?: string;
  negative?: boolean;
}

export function TrendPercentage({ prevValue, value, symbol = "", negative = false }: TrendPercentageProps) {
  if (!prevValue) return null;

  const prev = Number(prevValue);
  const current = Number(value);
  
  let percentage: number;
  if (prev === 0) {
    percentage = 1;
  } else {
    percentage = (current - prev) / ((prev + current) / 2);
  }

  const isPositive = percentage > 0 && !negative;
  const displayPercentage = Math.round(percentage * 100);

  return (
    <Tooltip content={`${prev.toLocaleString()}${symbol} previous period`}>
      <div className={`text-sm items-center flex gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="w-4 h-4 opacity-70" />
        ) : (
          <ArrowTrendingDownIcon className="w-4 h-4 opacity-70" />
        )}
        <div>{Math.abs(displayPercentage)}%</div>
      </div>
    </Tooltip>
  );
}