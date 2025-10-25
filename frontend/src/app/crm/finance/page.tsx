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
import { getAllPayments } from "@/store/slices/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import FinanceTransactionModal from "@/components/finance/TransactionModal";

export default function PaymentManagement() {
  const dispatch: RootDispatch = useDispatch();
  const { payments, paymentPagination } = useSelector(
    (state: RootState) => state.payments
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = paymentPagination?.limit || 10;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { label: "Completed", icon: CheckCircle2 };
      case "pending":
        return { label: "Pending", icon: Clock };
      case "partial":
        return { label: "Partial", icon: AlertCircle };
      default:
        return { label: status, icon: Clock };
    }
  };

  useEffect(() => {
    dispatch(
      getAllPayments({
        filter: filterStatus,
        page: currentPage,
        limit,
        search: searchQuery,
      })
    );
  }, [dispatch, filterStatus, currentPage, searchQuery, limit]);

  return (
    <div className="min-h-screen bg-white">
      {/* Search & Filter */}
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

      {/* Payments List */}
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

                      {/* Progress Bar */}
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

      {/* Pagination */}
      {paymentPagination &&
        paymentPagination?.limit < paymentPagination?.totalCount && (
          <div className="mt-4">
            <PaginationControls
              currentPage={currentPage}
              totalPages={paymentPagination.totalPages!}
              setCurrentPage={setCurrentPage}
              limit={paymentPagination.limit}
            />
          </div>
        )}

      {/* Transaction Modal */}
      {selectedPayment && (
        <FinanceTransactionModal
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
        />
      )}
    </div>
  );
}
