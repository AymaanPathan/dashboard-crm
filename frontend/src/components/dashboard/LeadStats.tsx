import { LeadStats } from "@/models/lead.model";
import React from "react";

export const LeadStatsComponent: React.FC<{ leadStats: LeadStats }> = ({
  leadStats,
}) => {
  return (
    <>
      <div className="bg-white rounded-lg p-4 border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Total Leads</span>
          {leadStats?.percentGrowth !== undefined && (
            <span
              className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                leadStats.percentGrowth > 0
                  ? "bg-emerald-50 text-emerald-600"
                  : leadStats.percentGrowth < 0
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {leadStats.percentGrowth > 0
                ? `+${leadStats.percentGrowth}%`
                : leadStats.percentGrowth < 0
                ? `${leadStats.percentGrowth}%`
                : "0%"}
            </span>
          )}
        </div>
        <div className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight leading-none">
          {leadStats?.totalLeads ?? 0}
        </div>

        <div className="text-[11px] font-normal text-gray-500">
          {leadStats?.lastMonthLeads === 0 && leadStats.currentMonthLeads! > 0
            ? `+${leadStats.currentMonthLeads} vs last month`
            : leadStats.percentGrowth! > 0
            ? `+${Math.abs(
                leadStats.currentMonthLeads! - leadStats.lastMonthLeads!
              )} vs last month`
            : leadStats.percentGrowth! < 0
            ? `-${Math.abs(
                leadStats.currentMonthLeads! - leadStats.lastMonthLeads!
              )} vs last month`
            : "0 vs last month"}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            Conversion Rate
          </span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-medium rounded">
            +{leadStats.wonPercentGrowth}%
          </span>
        </div>
        <div className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight leading-none">
          {leadStats.percentWon}%
        </div>
        <div className="text-[11px] font-normal text-gray-500">
          +{leadStats.wonLeads} vs last month
        </div>
      </div>
    </>
  );
};
