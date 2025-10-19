import { LeadStats } from "@/models/lead.model";
import React from "react";

export const LeadStatsComponent: React.FC<{ leadStats: LeadStats }> = ({
  leadStats,
}) => {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[#37352f]/60">
            Total Leads
          </span>
          {leadStats?.percentGrowth !== undefined && (
            <span
              className={`px-2 py-0.5 text-[12px] font-medium rounded ${
                leadStats.percentGrowth > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : leadStats.percentGrowth < 0
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {leadStats.percentGrowth > 0
                ? `+${leadStats.percentGrowth}% vs last month.`
                : leadStats.percentGrowth < 0
                ? `${leadStats.percentGrowth}% decrease`
                : "No change"}
            </span>
          )}
        </div>
        {/* Total Leads */}
        <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
          {leadStats?.totalLeads ?? 0}
        </div>

        <div
          className={`text-[12px] ${
            leadStats.percentGrowth! > 0
              ? "text-emerald-600"
              : leadStats.percentGrowth! < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {leadStats?.lastMonthLeads === 0 && leadStats.currentMonthLeads! > 0
            ? `${leadStats.currentMonthLeads} new leads this month`
            : leadStats.percentGrowth! > 0
            ? `More leads than last month`
            : leadStats.percentGrowth! < 0
            ? `Fewer leads than last month`
            : "Same as last month"}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[#37352f]/60">
            Conversion Rate
          </span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[12px] font-medium rounded">
            + {leadStats.wonPercentGrowth}% vs last month.
          </span>
        </div>
        <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
          {leadStats.percentWon}%
        </div>
        <div className="text-[12px] text-[#37352f]/50">
          {leadStats.wonLeads} leads converted
        </div>
      </div>
    </>
  );
};
