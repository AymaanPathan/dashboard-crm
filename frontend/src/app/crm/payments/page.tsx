"use client";
import React, { useState } from "react";
import {
  Search,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  X,
  ArrowUpRight,
  Building2,
  FileText,
  IndianRupee,
} from "lucide-react";

// Mock data for demonstration
const mockPayments = [
  {
    id: "1",
    order: {
      orderNumber: "ORD-2024-1001",
      quotation: {
        customerName: "Acme Corporation",
        quoteNumber: "QT-2024-501",
      },
    },
    status: "completed",
    amountPaid: 1500000,
    totalAmount: 1500000,
    createdAt: "2024-10-15T10:30:00Z",
    transactions: [
      {
        id: "t1",
        amount: 1500000,
        method: "Wire Transfer",
        date: "2024-10-15T10:30:00Z",
        reference: "TXN-WR-001234",
      },
    ],
  },
  {
    id: "2",
    order: {
      orderNumber: "ORD-2024-1002",
      quotation: {
        customerName: "TechStart Industries",
        quoteNumber: "QT-2024-502",
      },
    },
    status: "pending",
    amountPaid: 0,
    totalAmount: 850000,
    createdAt: "2024-10-20T14:20:00Z",
    transactions: [],
  },
  {
    id: "3",
    order: {
      orderNumber: "ORD-2024-1003",
      quotation: {
        customerName: "Global Solutions Ltd",
        quoteNumber: "QT-2024-503",
      },
    },
    status: "partial",
    amountPaid: 500000,
    totalAmount: 1200000,
    createdAt: "2024-10-18T09:15:00Z",
    transactions: [
      {
        id: "t2",
        amount: 300000,
        method: "Credit Card",
        date: "2024-10-18T09:15:00Z",
        reference: "TXN-CC-002341",
      },
      {
        id: "t3",
        amount: 200000,
        method: "Bank Transfer",
        date: "2024-10-22T11:45:00Z",
        reference: "TXN-BT-002456",
      },
    ],
  },
  {
    id: "4",
    order: {
      orderNumber: "ORD-2024-1004",
      quotation: {
        customerName: "Innovate Systems",
        quoteNumber: "QT-2024-504",
      },
    },
    status: "completed",
    amountPaid: 2250000,
    totalAmount: 2250000,
    createdAt: "2024-10-12T16:00:00Z",
    transactions: [
      {
        id: "t4",
        amount: 2250000,
        method: "Wire Transfer",
        date: "2024-10-12T16:00:00Z",
        reference: "TXN-WR-001890",
      },
    ],
  },
  {
    id: "5",
    order: {
      orderNumber: "ORD-2024-1005",
      quotation: {
        customerName: "Digital Ventures",
        quoteNumber: "QT-2024-505",
      },
    },
    status: "partial",
    amountPaid: 1000000,
    totalAmount: 1800000,
    createdAt: "2024-10-21T13:30:00Z",
    transactions: [
      {
        id: "t5",
        amount: 1000000,
        method: "Credit Card",
        date: "2024-10-21T13:30:00Z",
        reference: "TXN-CC-003122",
      },
    ],
  },
];

export default function PaymentManagement() {
  const [payments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.order.quotation.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.order.orderNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.order.quotation.quoteNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.totalAmount, 0),
    paid: payments.reduce((sum, p) => sum + p.amountPaid, 0),
    pending: payments.reduce(
      (sum, p) => sum + (p.totalAmount - p.amountPaid),
      0
    ),
    transactions: payments.reduce((sum, p) => sum + p.transactions.length, 0),
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
        };
      case "partial":
        return {
          label: "Partial",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          icon: Clock,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-6">
        {/* Compact Header */}
        <div className="mb-5">
          <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-xl p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  <Wallet className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-900 tracking-tight">
                    Payment Management
                  </h1>
                  <p className="text-xs text-gray-500 font-light">
                    Track and monitor transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "Total Revenue",
                  value: `₹${formatINR(stats.total)}`,
                  icon: TrendingUp,
                },
                {
                  label: "Amount Paid",
                  value: `₹${formatINR(stats.paid)}`,
                  icon: CheckCircle2,
                },
                {
                  label: "Outstanding",
                  value: `₹${formatINR(stats.pending)}`,
                  icon: Clock,
                },
                {
                  label: "Transactions",
                  value: stats.transactions,
                  icon: CreditCard,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/50 border border-white/70 rounded-xl p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <stat.icon className="w-3.5 h-3.5 text-gray-400 mb-2" />
                  <div className="text-lg font-light text-gray-900 mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-500 font-light uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Search and Filter Bar */}
        <div className="mb-4 backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, orders, quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/60 border border-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all backdrop-blur-sm placeholder-gray-400 text-gray-900"
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "completed", "pending", "partial"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all duration-300 backdrop-blur-xl ${
                    filterStatus === status
                      ? "bg-gray-900 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                      : "bg-white/60 text-gray-600 border border-white/80 hover:bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Payments List */}
        <div className="space-y-2">
          {filteredPayments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;
            const progress = (payment.amountPaid / payment.totalAmount) * 100;

            return (
              <div
                key={payment.id}
                className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Compact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {payment.order.quotation.customerName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-light mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {payment.order.orderNumber}
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                          <span>{payment.order.quotation.quoteNumber}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(payment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        {/* Compact Progress Bar */}
                        <div className="h-1 bg-white/60 rounded-full overflow-hidden backdrop-blur-sm">
                          <div
                            className="h-full bg-gradient-to-r from-gray-900 to-gray-700 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Compact Amount */}
                    <div className="text-right ml-4">
                      <div className="text-base font-medium text-gray-900 mb-0.5 flex items-center justify-end gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {formatINR(payment.amountPaid)}
                      </div>
                      <div className="text-[11px] text-gray-500 font-light mb-1.5">
                        of ₹{formatINR(payment.totalAmount)}
                      </div>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-1 text-[10px] text-gray-900 backdrop-blur-xl bg-white/60 px-2 py-1 rounded-md border border-white/80 hover:bg-white/80 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                      >
                        <CreditCard className="w-3 h-3" />
                        {payment.transactions.length} txn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPayments.length === 0 && (
          <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-xl p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-light text-gray-900 mb-1">
              No payments found
            </h3>
            <p className="text-xs text-gray-500 font-light">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="backdrop-blur-2xl bg-white/50 border border-white/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-light text-gray-900">
                      {selectedPayment.order.quotation.customerName}
                    </h2>
                    <p className="text-sm text-gray-600 font-light">
                      {selectedPayment.order.orderNumber} •{" "}
                      {selectedPayment.order.quotation.quoteNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-8 h-8 rounded-lg backdrop-blur-xl bg-white/60 border border-white/80 flex items-center justify-center hover:bg-white/80 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-xl p-3">
                  <div className="text-xs text-gray-500 font-light mb-1">
                    Amount Paid
                  </div>
                  <div className="text-xl font-light text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {formatINR(selectedPayment.amountPaid)}
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-xl p-3">
                  <div className="text-xs text-gray-500 font-light mb-1">
                    Total Amount
                  </div>
                  <div className="text-xl font-light text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {formatINR(selectedPayment.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-280px)]">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Transaction History
              </h3>
              {selectedPayment.transactions.length > 0 ? (
                <div className="space-y-3">
                  {selectedPayment.transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-900 flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {formatINR(txn.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {txn.method}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1 justify-end">
                            <Calendar className="w-3 h-3" />
                            {new Date(txn.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono backdrop-blur-sm bg-white/50 px-2 py-0.5 rounded">
                            {txn.reference}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-light">
                    No transactions recorded yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
