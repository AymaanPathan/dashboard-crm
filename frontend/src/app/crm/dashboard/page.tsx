"use client";
import React from "react";
import {
  Calendar,
  Download,
  Share2,
  Upload,
  Search,
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  MoreVertical,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Mar", value: 18000 },
  { month: "Apr", value: 25000 },
  { month: "May", value: 20000 },
  { month: "Jun", value: 32000 },
  { month: "Jul", value: 28000 },
  { month: "Aug", value: 22000 },
  { month: "Sept", value: 26000 },
  { month: "Oct", value: 30000 },
  { month: "Nov", value: 35000 },
  { month: "Dec", value: 28000 },
  { month: "Jan", value: 24000 },
  { month: "Feb", value: 38000 },
  { month: "Mar", value: 42000 },
];

const retentionData = [
  { month: "Jan", staff: 85, startups: 78, enterprises: 92 },
  { month: "Feb", staff: 88, startups: 82, enterprises: 95 },
  { month: "Mar", staff: 82, startups: 75, enterprises: 90 },
  { month: "Apr", staff: 90, startups: 85, enterprises: 98 },
  { month: "May", staff: 87, startups: 80, enterprises: 93 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-black/[0.06] px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <h1 className="text-[28px] font-semibold text-[#37352f] tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-black/[0.03] rounded-md transition-all duration-200">
              <Home className="w-[18px] h-[18px] text-[#37352f]/60" />
            </button>
            <div className="relative">
              <Search className="w-[16px] h-[16px] text-[#37352f]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-black/[0.03] border-none rounded-md text-[14px] text-[#37352f] placeholder:text-[#37352f]/40 w-[240px] focus:outline-none focus:bg-white focus:shadow-sm transition-all duration-200"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/[0.03] rounded-md transition-all duration-200">
              <Share2 className="w-[16px] h-[16px] text-[#37352f]/60" />
              <span className="text-[14px] text-[#37352f]/80">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-[1600px] mx-auto">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-8">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#37352f] text-white rounded-md hover:bg-[#2f2d2a] transition-all duration-200 text-[14px] font-medium shadow-sm">
            <span>Ask AI</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-black/[0.03] rounded-md transition-all duration-200 text-[14px] text-[#37352f]/80 border border-black/[0.06]">
            <span>Customize Widget</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[13px] text-[#37352f]/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Last updated now
            </span>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-black/[0.03] rounded-md transition-all duration-200 text-[14px] text-[#37352f]/80 border border-black/[0.06]">
              <Upload className="w-[15px] h-[15px]" />
              <span>Imports</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#37352f] text-white rounded-md hover:bg-[#2f2d2a] transition-all duration-200 text-[14px] font-medium shadow-sm">
              <Download className="w-[15px] h-[15px]" />
              <span>Exports</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {/* Leads Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Leads
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[12px] font-medium rounded">
                + 8%
              </span>
            </div>
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              129
            </div>
            <div className="text-[12px] text-[#37352f]/50">
              +24 vs last week
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Conversion Rate
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[12px] font-medium rounded">
                + 2%
              </span>
            </div>
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              24%
            </div>
            <div className="text-[12px] text-[#37352f]/50">+8 vs last week</div>
          </div>

          {/* CLV Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                CLV
              </span>
              <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[12px] font-medium rounded">
                - 4%
              </span>
            </div>
            <div className="text-[32px] font-semibold text-[#37352f] mb-1 tracking-tight">
              14d
            </div>
            <div className="text-[12px] text-[#37352f]/50">
              +10 vs last week
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#37352f]/60">
                Calendar
              </span>
              <span className="text-[13px] text-[#37352f]/50">June</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-2">
              <div className="text-[#37352f]/40">Sun</div>
              <div className="text-[#37352f]/40">Mon</div>
              <div className="text-[#37352f]/40">Tue</div>
              <div className="text-[#37352f] font-medium">Wed</div>
              <div className="text-[#37352f]/40">Thu</div>
              <div className="text-[#37352f]/40">Fri</div>
              <div className="text-[#37352f]/40">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              <div className="text-[#37352f]/40">7</div>
              <div className="text-[#37352f]/40">8</div>
              <div className="text-[#37352f] font-medium bg-[#37352f] text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
                9
              </div>
              <div className="text-[#37352f]/40">10</div>
              <div className="text-[#37352f]/40">11</div>
            </div>
          </div>
        </div>

        {/* Revenue Chart & Calendar Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[13px] font-medium text-[#37352f]/60 mb-1">
                  Revenue
                </h3>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  $32,209{" "}
                  <span className="text-[14px] font-normal text-emerald-600">
                    +22% vs last month
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1D
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1W
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  1M
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  6M
                </button>
                <button className="px-2.5 py-1 text-[12px] bg-[#37352f]/90 text-white rounded transition-all duration-200">
                  1Y
                </button>
                <button className="px-2.5 py-1 text-[12px] text-[#37352f]/60 hover:bg-black/[0.03] rounded transition-all duration-200">
                  ALL
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#37352f"
                  strokeOpacity={0.06}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#37352f"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calendar Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="space-y-5">
              <div className="border-l-2 border-blue-500 pl-4 pb-4 border-b border-black/[0.06] last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    9:00 AM - 10:00 AM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f] mb-3">
                  Mesh Weekly Meeting
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white"></div>
                  </div>
                  <span className="text-[11px] text-[#37352f]/50">
                    On Google Meet →
                  </span>
                </div>
              </div>

              <div className="border-l-2 border-transparent pl-4 pb-4 border-b border-black/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    10:00 AM - 10:45 AM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f]/50">
                  Available Time
                </h4>
              </div>

              <div className="border-l-2 border-emerald-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#37352f]/50 tracking-wide">
                    10:45 AM - 11:45 AM
                  </span>
                </div>
                <h4 className="font-medium text-[14px] text-[#37352f] mb-3">
                  Patreon Gamification Demo
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 border-2 border-white"></div>
                  </div>
                  <span className="text-[11px] text-[#37352f]/50">
                    On Slack →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Leads, Retention, Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <h3 className="text-[15px] font-semibold text-[#37352f] mb-4">
              Leads Management
            </h3>
            <div className="flex gap-6 mb-5 text-[13px] border-b border-black/[0.06]">
              <button className="pb-2 border-b-2 border-[#37352f] text-[#37352f] font-medium">
                Status
              </button>
              <button className="pb-2 text-[#37352f]/50 hover:text-[#37352f]/80 transition-colors">
                Sources
              </button>
              <button className="pb-2 text-[#37352f]/50 hover:text-[#37352f]/80 transition-colors">
                Qualification
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                  <span className="text-[12px] text-[#37352f]/60">Open</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  114
                </div>
                <div className="text-[11px] text-[#37352f]/40">Leads</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <span className="text-[12px] text-[#37352f]/60">
                    In Progress
                  </span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  62
                </div>
                <div className="text-[11px] text-[#37352f]/40">Leads</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
                  <span className="text-[12px] text-[#37352f]/60">Lost</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  47
                </div>
                <div className="text-[11px] text-[#37352f]/40">Leads</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#37352f]"></div>
                  <span className="text-[12px] text-[#37352f]/60">Won</span>
                </div>
                <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                  38
                </div>
                <div className="text-[11px] text-[#37352f]/40">Leads</div>
              </div>
            </div>

            <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex">
              <div className="bg-blue-400" style={{ width: "44%" }}></div>
              <div className="bg-blue-600" style={{ width: "24%" }}></div>
              <div className="bg-blue-200" style={{ width: "18%" }}></div>
              <div className="bg-[#37352f]" style={{ width: "14%" }}></div>
            </div>
          </div>

          {/* Retention Rate */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#37352f]">
                Retention Rate
              </h3>
              <button className="p-1 hover:bg-black/[0.03] rounded transition-all duration-200">
                <MoreVertical className="w-4 h-4 text-[#37352f]/40" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-[28px] font-semibold text-[#37352f] tracking-tight">
                95%
              </div>
              <div className="text-[12px] text-emerald-600">
                +12% vs last month
              </div>
            </div>
            <div className="flex gap-4 text-[12px] mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                <span className="text-[#37352f]/60">Staffs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-[#37352f]/60">Startups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#37352f]"></div>
                <span className="text-[#37352f]/60">Enterprises</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={retentionData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#37352f", opacity: 0.5 }}
                  stroke="#37352f"
                  strokeOpacity={0.1}
                />
                <YAxis hide />
                <Bar dataKey="staff" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="startups" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="enterprises"
                  fill="#37352f"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Customer Locations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-black/[0.06] hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#37352f]">
                Top Customer Locations
              </h3>
              <button className="p-1 hover:bg-black/[0.03] rounded transition-all duration-200">
                <MoreVertical className="w-4 h-4 text-[#37352f]/40" />
              </button>
            </div>
            <div className="mb-5 relative">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <path
                  d="M 140 40 L 160 35 L 165 45 L 155 50 L 145 48 Z"
                  fill="#37352f"
                  opacity="0.8"
                />
                <path
                  d="M 145 60 L 155 58 L 160 65 L 150 68 Z"
                  fill="#37352f"
                  opacity="0.8"
                />
                <ellipse
                  cx="90"
                  cy="50"
                  rx="20"
                  ry="15"
                  fill="#37352f"
                  opacity="0.06"
                />
                <ellipse
                  cx="40"
                  cy="45"
                  rx="15"
                  ry="12"
                  fill="#37352f"
                  opacity="0.06"
                />
                <ellipse
                  cx="160"
                  cy="65"
                  rx="12"
                  ry="10"
                  fill="#37352f"
                  opacity="0.06"
                />
              </svg>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-4 rounded overflow-hidden bg-blue-900 flex items-center justify-center text-white text-[10px]">
                    🇦🇺
                  </div>
                  <span className="text-[13px] text-[#37352f]">Australia</span>
                </div>
                <span className="text-[13px] font-medium text-[#37352f]">
                  48%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-4 rounded overflow-hidden bg-red-600 flex items-center justify-center text-white text-[10px]">
                    🇮🇩
                  </div>
                  <span className="text-[13px] text-[#37352f]">Indonesia</span>
                </div>
                <span className="text-[13px] font-medium text-[#37352f]">
                  15%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-4 rounded overflow-hidden bg-red-600 flex items-center justify-center text-white text-[10px]">
                    🇸🇬
                  </div>
                  <span className="text-[13px] text-[#37352f]">Singapore</span>
                </div>
                <span className="text-[13px] font-medium text-[#37352f]">
                  7%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}