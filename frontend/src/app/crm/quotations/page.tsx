"use client";
import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  MoreVertical,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data
const mockQuotations = [
  {
    id: "1",
    quotationName: "Website Development Quote",
    quoteNumber: "QT-2025-001",
    customerName: "Rajesh Kumar",
    customerCompany: "Tech Solutions Pvt Ltd",
    customerEmail: "rajesh@techsolutions.com",
    customerPhone: "+91 98765 43210",
    subtotal: 145000,
    tax: 26100,
    total: 171100,
    validUntil: "2025-11-15",
    isOrder: false,
    createdAt: "2025-10-15T10:30:00Z",
    items: [
      { name: "Website Design", quantity: 1, rate: 75000 },
      { name: "Development", quantity: 1, rate: 70000 },
    ],
  },
  {
    id: "2",
    quotationName: "Mobile App Development",
    quoteNumber: "QT-2025-002",
    customerName: "Priya Sharma",
    customerCompany: "Retail Innovations",
    customerEmail: "priya@retailinno.com",
    customerPhone: "+91 98765 43211",
    subtotal: 285000,
    tax: 51300,
    total: 336300,
    validUntil: "2025-11-20",
    isOrder: true,
    createdAt: "2025-10-16T14:20:00Z",
    items: [
      { name: "iOS App", quantity: 1, rate: 150000 },
      { name: "Android App", quantity: 1, rate: 135000 },
    ],
  },
  {
    id: "3",
    quotationName: "Digital Marketing Package",
    quoteNumber: "QT-2025-003",
    customerName: "Amit Patel",
    customerCompany: "Fashion Hub",
    customerEmail: "amit@fashionhub.com",
    customerPhone: "+91 98765 43212",
    subtotal: 95000,
    tax: 17100,
    total: 112100,
    validUntil: "2025-10-25",
    isOrder: false,
    createdAt: "2025-10-18T09:15:00Z",
    items: [
      { name: "SEO Services", quantity: 3, rate: 25000 },
      { name: "Social Media Management", quantity: 1, rate: 20000 },
    ],
  },
  {
    id: "4",
    quotationName: "Cloud Infrastructure Setup",
    quoteNumber: "QT-2025-004",
    customerName: "Sneha Reddy",
    customerCompany: "StartUp Ventures",
    customerEmail: "sneha@startupventures.com",
    customerPhone: "+91 98765 43213",
    subtotal: 225000,
    tax: 40500,
    total: 265500,
    validUntil: "2025-11-30",
    isOrder: true,
    createdAt: "2025-10-19T11:45:00Z",
    items: [
      { name: "AWS Setup", quantity: 1, rate: 125000 },
      { name: "Security Configuration", quantity: 1, rate: 100000 },
    ],
  },
  {
    id: "5",
    quotationName: "E-commerce Platform",
    quoteNumber: "QT-2025-005",
    customerName: "Vikram Singh",
    customerCompany: "Organic Foods Ltd",
    customerEmail: "vikram@organicfoods.com",
    customerPhone: "+91 98765 43214",
    subtotal: 375000,
    tax: 67500,
    total: 442500,
    validUntil: "2025-11-10",
    isOrder: false,
    createdAt: "2025-10-12T16:30:00Z",
    items: [
      { name: "E-commerce Development", quantity: 1, rate: 250000 },
      { name: "Payment Gateway Integration", quantity: 1, rate: 75000 },
      { name: "Inventory Management", quantity: 1, rate: 50000 },
    ],
  },
];

export default function QuotationsPage() {
  const [quotations] = useState(mockQuotations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter and search logic
  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch =
      quote.quotationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerCompany?.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const validUntil = new Date(quote.validUntil);
    const isExpired = validUntil < now;

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "converted") return matchesSearch && quote.isOrder;
    if (filterStatus === "pending")
      return matchesSearch && !quote.isOrder && !isExpired;
    if (filterStatus === "expired")
      return matchesSearch && isExpired && !quote.isOrder;

    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: quotations.length,
    converted: quotations.filter((q) => q.isOrder).length,
    pending: quotations.filter((q) => {
      const now = new Date();
      const validUntil = new Date(q.validUntil);
      return !q.isOrder && validUntil >= now;
    }).length,
    expired: quotations.filter((q) => {
      const now = new Date();
      const validUntil = new Date(q.validUntil);
      return !q.isOrder && validUntil < now;
    }).length,
    totalValue: quotations.reduce((sum, q) => sum + q.total, 0),
    convertedValue: quotations
      .filter((q) => q.isOrder)
      .reduce((sum, q) => sum + q.total, 0),
  };

  // Prepare chart data
  const statusData = [
    { name: "Converted", value: stats.converted, fill: "#10b981" },
    { name: "Pending", value: stats.pending, fill: "#f59e0b" },
    { name: "Expired", value: stats.expired, fill: "#ef4444" },
  ];

  const revenueData = [
    { name: "Converted", value: Math.round(stats.convertedValue / 1000) },
    {
      name: "Pending & Expired",
      value: Math.round((stats.totalValue - stats.convertedValue) / 1000),
    },
  ];

  const getStatusBadge = (quote) => {
    const now = new Date();
    const validUntil = new Date(quote.validUntil);
    const isExpired = validUntil < now;

    if (quote.isOrder) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1  text-emerald-700 rounded-lg text-xs font-medium ">
          <CheckCircle2 className="w-3 h-3" />
          Converted
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-red-700 rounded-lg text-xs font-medium border ">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1  text-amber-700 rounded-lg text-xs font-medium ">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="px-6 py-6 max-w-[1600px] mx-auto">
        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4  mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations, customers, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50">
              {["all", "pending", "converted", "expired"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all capitalize ${
                    filterStatus === status
                      ? "bg-gray-900/90 text-white shadow-md"
                      : "text-gray-600 hover:bg-white/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg shadow-gray-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Quote #
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Quotation Name
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Valid Until
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quote, index) => (
                  <tr
                    key={quote.id}
                    className={`border-b border-gray-200/30 hover:bg-white/40 transition-all ${
                      index === filteredQuotations.length - 1
                        ? "border-b-0"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {quote.quoteNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(quote.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {quote.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quote.customerCompany || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-900">
                        {quote.quotationName || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{(quote.total / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-gray-500">
                        +₹{(quote.tax / 1000).toFixed(1)}K tax
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(quote.validUntil)}
                      </div>
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(quote)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No quotations found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
