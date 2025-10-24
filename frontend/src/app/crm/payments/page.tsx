"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import TransactionModal from "./TransactionModal";
import { getAllPayments } from "@/store/slices/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";

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
  const dispatch: RootDispatch = useDispatch();
  const payments = useSelector((state: RootState) => state.payments.payments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusConfig = (status: string) => {
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

  useEffect(() => {
    dispatch(getAllPayments({}));
  }, [dispatch]);

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
          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;
            const progress = (payment.amountPaid / payment.totalAmount) * 100;

            return (
              <div
                onClick={() => setSelectedPayment(payment)}
                key={payment.id}
                className="bg-white cursor-pointer border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group"
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {payments.length === 0 && (
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
        <TransactionModal
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
        />
      )}
    </div>
  );
}
