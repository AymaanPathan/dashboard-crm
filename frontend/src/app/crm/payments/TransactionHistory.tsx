import React from "react";
import {
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

interface Transaction {
  amount: number;
  transactionId: string;
  paymentProofUrl?: string;
  status: string;
  paidAt: string;
  verifiedBy?: {
    username: string;
  };
}

interface TransactionProps {
  selectedPayment: any;
  setSelectedPayment: (payment: null) => void;
  setShowAddForm: (show: boolean) => void;
}

export default function TransactionHistory({
  selectedPayment,
  setShowAddForm,
}: TransactionProps) {
  const transactions = selectedPayment?.transactions || [];

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

  const totalAmount = transactions.reduce(
    (sum: number, txn: Transaction) => sum + txn.amount,
    0
  );

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
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
          >
            Add Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm">
      {/* Header */}

      {/* Transactions List */}
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {transactions.map((txn: Transaction, index: number) => (
          <div
            key={index}
            className="px-6 py-4 hover:bg-gray-50/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow transition-shadow">
                {getStatusIcon(txn.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-0.5">
                      ₹{formatCurrency(txn.amount)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="font-mono">{txn.transactionId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {txn.status === "completed" && txn.verifiedBy && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded text-gray-700">
                        Verified by: {txn.verifiedBy.username}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(txn.paidAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(txn.paidAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{txn.status}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">
                      {formatRelativeTime(txn.paidAt)}
                    </span>
                    {txn.paymentProofUrl && (
                      <a
                        href={txn.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
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
          </div>
        ))}
      </div>
    </div>
  );
}
