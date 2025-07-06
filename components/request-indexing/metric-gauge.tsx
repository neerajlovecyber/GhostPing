"use client";

import { ReactNode } from "react";

interface MetricGaugeProps {
  score?: number;
  children: ReactNode;
}

export function MetricGauge({ score = 0, children }: MetricGaugeProps) {
  const getGaugeClass = () => {
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGaugeArcStyle = () => {
    const r = 56;
    const n = 2 * Math.PI * r;
    const rotationOffset = 0.25 * 8 / n;

    let o = score * n - r / 2;
    if (score === 1) o = n;

    return {
      opacity: score === 0 ? 0 : 1,
      transform: `rotate(${360 * rotationOffset - 90}deg)`,
      strokeDasharray: `${Math.max(o, 0)}, ${n}`,
    };
  };

  return (
    <div className={`relative ${getGaugeClass()}`}>
      <div className="relative w-[50px] h-[50px]">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="opacity-10 fill-none stroke-current"
            r="56"
            cx="60"
            cy="60"
            strokeWidth="8"
          />
          {score !== null && (
            <circle
              className="fill-none stroke-current"
              r="56"
              cx="60"
              cy="60"
              strokeWidth="8"
              style={getGaugeArcStyle()}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono">
          {children}
        </div>
      </div>
    </div>
  );
}