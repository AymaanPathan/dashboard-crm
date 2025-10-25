/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "@/store";
import {
  approvePaymentTransaction,
  getAllPayments,
  getPaymentTransactions,
  rejectPaymentTransaction,
} from "@/store/slices/paymentSlice";

interface TransactionProps {
  paymentId: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
}

export default function TransactionReview({
  paymentId,
  setCurrentPage,
  currentPage = 1,
}: TransactionProps) {
  const dispatch = useDispatch<RootDispatch>();

  const [processingTxn, setProcessingTxn] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  const transactionPagination = useSelector(
    (state: RootState) => state.payments.transactionPagination
  );
  const transactions = useSelector(
    (state: RootState) => state.payments.selectedPaymentTransactions
  );
  const loading = useSelector(
    (state: RootState) => state.payments.loading.approvingTransaction
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-black" />;
      case "failed":
        return <AlertCircle className="h-3.5 w-3.5 text-red-600" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-gray-600" />;
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

  // ✅ Approve handler (with Redux dispatch)
  const handleApprove = async (transactionId: string) => {
    setProcessingTxn(transactionId);
    setActionType("approve");

    try {
      await dispatch(approvePaymentTransaction(transactionId)).unwrap();
      await dispatch(getPaymentTransactions({ paymentId, page: currentPage }));
      await dispatch(getAllPayments({ page: 1 }));
    } catch (err) {
      console.error("Error approving transaction:", err);
    } finally {
      setProcessingTxn(null);
      setActionType(null);
    }
  };

  const handleReject = async (transactionId: string) => {
    setProcessingTxn(transactionId);
    setActionType("reject");
    try {
      await dispatch(rejectPaymentTransaction(transactionId)).unwrap();
      await dispatch(getPaymentTransactions({ paymentId, page: currentPage }));
      await dispatch(getAllPayments({ page: 1 }));
    } catch (err) {
      console.error("Error approving transaction:", err);
    } finally {
      setProcessingTxn(null);
      setActionType(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm">
        <div className="p-16 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gray-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            No transactions to review
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            All transactions have been processed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 space-y-8">
          {transactions.map((txn, index) => {
            const isProcessing =
              processingTxn === txn?.transactionId || loading;
            const isPending = txn?.status?.toLowerCase() === "pending";

            return (
              <div key={index} className="relative">
                {/* Timeline connector */}
                {index !== transactions.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-100" />
                )}

                <div className="flex gap-5">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      {getStatusIcon(txn?.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 tracking-tight mb-1">
                          ₹{formatCurrency(txn?.amount)}
                        </div>
                        <div className="text-xs text-gray-400 font-mono tracking-wide">
                          {txn?.transactionId}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatRelativeTime(txn?.paidAt)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-16">Date</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(txn?.paidAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-16">Time</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(txn?.paidAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-16">Status</span>
                        <span className="text-gray-900 font-medium capitalize">
                          {txn?.status}
                        </span>
                      </div>
                      {txn?.verifiedBy && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 w-16">Verified</span>
                          <span className="text-gray-900 font-medium">
                            {txn?.verifiedBy?.username}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {txn?.paymentProofUrl ? (
                        <a
                          href={txn?.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                          <span className="font-medium">View proof</span>
                          <ExternalLink
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth={2}
                          />
                        </a>
                      ) : (
                        <div />
                      )}

                      {isPending && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReject(txn?.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isProcessing && actionType === "reject" ? (
                              <Loader2
                                className="w-3.5 h-3.5 animate-spin"
                                strokeWidth={2}
                              />
                            ) : (
                              <X className="w-3.5 h-3.5" strokeWidth={2} />
                            )}
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleApprove(txn?.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-gray-900 border border-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isProcessing && actionType === "approve" ? (
                              <Loader2
                                className="w-3.5 h-3.5 animate-spin"
                                strokeWidth={2}
                              />
                            ) : (
                              <Check className="w-3.5 h-3.5" strokeWidth={2} />
                            )}
                            <span>Approve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {transactionPagination &&
        transactionPagination.limit < transactionPagination.totalCount && (
          <div className="border-t border-gray-100 px-8 py-4 flex justify-center bg-white">
            <PaginationControls
              currentPage={currentPage || 1}
              limit={transactionPagination.limit}
              setCurrentPage={setCurrentPage}
              totalPages={transactionPagination.totalPages}
            />
          </div>
        )}
    </div>
  );
}
