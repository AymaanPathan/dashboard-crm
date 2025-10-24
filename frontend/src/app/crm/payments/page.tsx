"use client";
import React, { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  X,
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
    <div className="min-h-screen bg-white">
      {/* Subtle Background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-8 py-12">
        {/* Clean Search and Filter Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, order, or quote number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-400 text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "completed", "pending", "partial"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Payments List */}
        <div className="space-y-3">
          {filteredPayments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;
            const progress = (payment.amountPaid / payment.totalAmount) * 100;

            return (
              <div
                key={payment.id}
                className="bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-medium text-gray-900">
                            {payment.order.quotation.customerName}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                              payment.status === "completed"
                                ? "bg-gray-100 text-gray-700"
                                : payment.status === "pending"
                                ? "bg-gray-50 text-gray-600"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            {payment.order.orderNumber}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{payment.order.quotation.quoteNumber}</span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(payment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Clean Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 font-medium min-w-[3rem] text-right">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount Section */}
                    <div className="text-right ml-8 flex flex-col items-end gap-2">
                      <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {formatINR(payment.amountPaid)}
                      </div>
                      <div className="text-xs text-gray-500">
                        of ₹{formatINR(payment.totalAmount)}
                      </div>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {payment.transactions.length} transaction
                        {payment.transactions.length !== 1 ? "s" : ""}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPayments.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-1">
                      {selectedPayment.order.quotation.customerName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedPayment.order.orderNumber} •{" "}
                      {selectedPayment.order.quotation.quoteNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Amount Paid
                  </div>
                  <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {formatINR(selectedPayment.amountPaid)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Total Amount
                  </div>
                  <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {formatINR(selectedPayment.totalAmount)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Balance
                  </div>
                  <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {formatINR(
                      selectedPayment.totalAmount - selectedPayment.amountPaid
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-280px)]">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                Transaction History
              </h3>
              {selectedPayment.transactions.length > 0 ? (
                <div className="space-y-0 border border-gray-100 rounded-lg overflow-hidden">
                  {selectedPayment.transactions.map((txn, idx) => (
                    <div
                      key={txn.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        idx !== selectedPayment.transactions.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-900 flex items-center gap-1 mb-1">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {formatINR(txn.amount)}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {txn.method}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {txn.reference}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1.5 justify-end">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(txn.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(txn.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
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
