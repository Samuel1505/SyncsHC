"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TVL_HISTORY } from "@/lib/mockData";
import { TVLDataPoint } from "@/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-navy-600 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-bold text-accent">
        ${(val / 1_000_000).toFixed(2)}M
      </p>
    </div>
  );
}

// Show every 5th label on X axis
const tickFormatter = (_: string, index: number) => {
  const item = TVL_HISTORY[index] as TVLDataPoint | undefined;
  if (!item) return "";
  return index % 5 === 0 ? item.date : "";
};

export default function TVLChart() {
  return (
    <div className="h-56 sm:h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={TVL_HISTORY}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F7931A" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            stroke="transparent"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(247,147,26,0.3)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="tvl"
            stroke="#F7931A"
            strokeWidth={2}
            fill="url(#tvlGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#F7931A", stroke: "#0b0f1a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
