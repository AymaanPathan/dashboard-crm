import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TransactionProps {
  setSelectedPayment: (payment: null) => void;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
}

export default function TransactionHistory({
  setCurrentPage,
  currentPage,
}: TransactionProps) {
  const transactionPagination = useSelector(
    (state: RootState) => state.payments.transactionPagination
  );
  const transactions = useSelector(
    (state: RootState) => state.payments.selectedPaymentTransactions
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "failed":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const txnTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - txnTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return txnTime.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm">
        <div className="p-16 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gray-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            No transactions yet
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            Start tracking by adding your first transaction
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-2.5">
          {transactions.map((txn, index) => {
            console.log(txn, "txn");
            return (
              <div
                key={index}
                className="group p-3.5   bg-white/80 rounded-lg border border-gray-200/50 transition-all shadow-sm cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg  backdrop-blur-sm border border-gray-200/50 flex items-center justify-center shadow-sm">
                    {getStatusIcon(txn.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{formatCurrency(txn.amount)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          {txn.transactionId}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-400">
                        {formatRelativeTime(txn.paidAt)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(txn.paidAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span>•</span>
                        <span>
                          {new Date(txn.paidAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium">
                          {txn.status}
                        </span>
                        {txn.verifiedBy && (
                          <>
                            <span>•</span>
                            <span>by {txn.verifiedBy.username}</span>
                          </>
                        )}
                      </div>
                      {txn.paymentProofUrl && (
                        <a
                          href={txn.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="w-3 h-3" />
                          <span>View proof</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-gray-200/50 px-5 py-4 flex justify-center bg-white/30 backdrop-blur-sm">
        {transactionPagination &&
          transactionPagination?.limit < transactionPagination?.totalCount && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={transactionPagination.totalPages!}
                setCurrentPage={setCurrentPage}
                limit={transactionPagination.limit}
              />
            </div>
          )}
      </div>
    </>
  );
}
