import { LeadStats } from "@/models/lead.model";
import React from "react";

export const LeadDistributionComponent: React.FC<{
  leadStats: LeadStats;
  activeTab: "type" | "source" | "stage";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"type" | "source" | "stage">
  >;
}> = ({ leadStats, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
      <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
        Lead Distribution
      </h3>

      {/* Tabs */}
      <div className="flex gap-6 mb-5 text-[13px] border-b border-black/[0.06]">
        <button
          onClick={() => setActiveTab("type")}
          className={`pb-2 font-medium ${
            activeTab === "type"
              ? "border-b-2 border-[#37352f] text-[#37352f]"
              : "text-[#37352f]/50 hover:text-[#37352f]/80"
          }`}
        >
          By Type
        </button>
        <button
          onClick={() => setActiveTab("source")}
          className={`pb-2 font-medium ${
            activeTab === "source"
              ? "border-b-2 border-[#37352f] text-[#37352f]"
              : "text-[#37352f]/50 hover:text-[#37352f]/80"
          }`}
        >
          By Source
        </button>
        <button
          onClick={() => setActiveTab("stage")}
          className={`pb-2 font-medium ${
            activeTab === "stage"
              ? "border-b-2 border-[#37352f] text-[#37352f]"
              : "text-[#37352f]/50 hover:text-[#37352f]/80"
          }`}
        >
          By Stage
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        {activeTab === "type" &&
          leadStats?.leadDistribution?.map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.type === "Hot"
                      ? "bg-red-500"
                      : item.type === "Warm"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <span className="text-[12px] text-[#37352f]/60">
                  {item.type}
                </span>
              </div>
              <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                {item.count}
              </div>
              <div className="text-[11px] text-[#37352f]/40">
                {item.percentage}% of total
              </div>
            </div>
          ))}

        {activeTab === "source" &&
          leadStats?.sourceDistribution?.map(
            (src, i) =>
              src.count! > 0 && (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[12px] text-[#37352f]/60">
                      {src.source}
                    </span>
                  </div>
                  <div className="text-[24px] font-semibold text-[#37352f] tracking-tight">
                    {src.count}
                  </div>
                  <div className="text-[11px] text-[#37352f]/40">
                    {src.percentage}% of total
                  </div>
                </div>
              )
          )}

        {activeTab === "stage" &&
          leadStats?.stageDistribution?.map((stage, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <span className="text-[12px] text-[#37352f]/60">
                  {stage.stage}
                </span>
              </div>
              <div className="text-[24px] font-semibold text-[#37352f] tracking-tight">
                {stage.count}
              </div>
              <div className="text-[11px] text-[#37352f]/40">
                {stage.percentage}% of total
              </div>
            </div>
          ))}
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex">
        {activeTab === "type" &&
          leadStats?.leadDistribution?.map((item, i) => (
            <div
              key={i}
              className={`${
                item.type === "Hot"
                  ? "bg-red-500"
                  : item.type === "Warm"
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${item.percentage}%` }}
            ></div>
          ))}

        {activeTab === "source" &&
          leadStats?.sourceDistribution?.map((item, i) => (
            <div
              key={i}
              className="bg-emerald-500"
              style={{ width: `${item.percentage}%` }}
            ></div>
          ))}

        {activeTab === "stage" &&
          leadStats?.stageDistribution?.map((item, i) => (
            <div
              key={i}
              className="bg-indigo-500"
              style={{ width: `${item.percentage}%` }}
            ></div>
          ))}
      </div>

      <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex"></div>
    </div>
  );
};
