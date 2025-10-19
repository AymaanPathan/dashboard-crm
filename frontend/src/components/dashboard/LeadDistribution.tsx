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
    <div className="bg-white/60 backdrop-blur-xl rounded-xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all shadow-lg shadow-gray-900/5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Lead Distribution
      </h3>

      {/* Tabs */}
      <div className="flex gap-6 mb-5 text-sm border-b border-gray-200/50">
        <button
          onClick={() => setActiveTab("type")}
          className={`pb-2 cursor-pointer font-medium transition-colors ${
            activeTab === "type"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          By Type
        </button>
        <button
          onClick={() => setActiveTab("source")}
          className={`pb-2  cursor-pointer font-medium transition-colors ${
            activeTab === "source"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          By Source
        </button>
        <button
          onClick={() => setActiveTab("stage")}
          className={`pb-2 cursor-pointer font-medium transition-colors ${
            activeTab === "stage"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          By Stage
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        {activeTab === "type" &&
          leadStats?.leadDistribution?.map((item, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === "Hot"
                      ? "bg-red-500"
                      : item.type === "Warm"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <span className="text-xs text-gray-600 font-medium">
                  {item.type}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                {item.count}
              </div>
              <div className="text-xs text-gray-500">
                {item.percentage}% of total
              </div>
            </div>
          ))}

        {activeTab === "source" &&
          leadStats?.sourceDistribution?.map((src, i) => {
            const colors = [
              "bg-emerald-500",
              "bg-blue-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-pink-500",
              "bg-cyan-500",
            ];
            return (
              src.count! > 0 && (
                <div
                  key={i}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        colors[i % colors.length]
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600 font-medium">
                      {src.source}
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {src.count}
                  </div>
                  <div className="text-xs text-gray-500">
                    {src.percentage}% of total
                  </div>
                </div>
              )
            );
          })}

        {activeTab === "stage" &&
          leadStats?.stageDistribution?.map((stage, i) => {
            const colors = [
              "bg-indigo-500",
              "bg-violet-500",
              "bg-fuchsia-500",
              "bg-rose-500",
              "bg-teal-500",
              "bg-lime-500",
            ];
            return (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      colors[i % colors.length]
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600 font-medium">
                    {stage.stage}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {stage.count}
                </div>
                <div className="text-xs text-gray-500">
                  {stage.percentage}% of total
                </div>
              </div>
            );
          })}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden flex border border-gray-200/50">
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
          leadStats?.sourceDistribution?.map((item, i) => {
            const colors = [
              "bg-emerald-500",
              "bg-blue-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-pink-500",
              "bg-cyan-500",
            ];
            return (
              <div
                key={i}
                className={colors[i % colors.length]}
                style={{ width: `${item.percentage}%` }}
              ></div>
            );
          })}

        {activeTab === "stage" &&
          leadStats?.stageDistribution?.map((item, i) => {
            const colors = [
              "bg-indigo-500",
              "bg-violet-500",
              "bg-fuchsia-500",
              "bg-rose-500",
              "bg-teal-500",
              "bg-lime-500",
            ];
            return (
              <div
                key={i}
                className={colors[i % colors.length]}
                style={{ width: `${item.percentage}%` }}
              ></div>
            );
          })}
      </div>
    </div>
  );
};
