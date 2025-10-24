/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Building2,
  Calendar,
  Clock,
  CreditCard,
  IndianRupee,
  X,
  Plus,
} from "lucide-react";
import React, { useState } from "react";

interface TransactionModalProps {
  selectedPayment: any;
  setSelectedPayment: (payment: null) => void;
  onAddTransaction?: (transaction: {
    orderId: string;
    amount: number;
    note: string;
    transactionId: string;
    method: string;
    paymentProofUrl?: string;
  }) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  selectedPayment,
  setSelectedPayment,
  onAddTransaction,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    note: "",
    transactionId: "",
    method: "UPI",
    paymentProofUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTransaction) {
      onAddTransaction({
        orderId: selectedPayment.order.id,
        amount: parseFloat(formData.amount),
        note: formData.note,
        transactionId: formData.transactionId,
        method: formData.method,
        paymentProofUrl: formData.paymentProofUrl || undefined,
      });
    }
    setFormData({
      amount: "",
      note: "",
      transactionId: "",
      method: "UPI",
      paymentProofUrl: "",
    });
    setShowAddForm(false);
  };

  return (
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
                {selectedPayment.amountPaid}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Total Amount
              </div>
              <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {selectedPayment.totalAmount}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Remaining 
              </div>
              <div className="text-xl font-medium text-gray-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {selectedPayment.totalAmount - selectedPayment.amountPaid}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-280px)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              Transaction History
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>

          {/* Add Transaction Form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({ ...formData, method: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.transactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="TXN123456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Proof URL
                  </label>
                  <input
                    type="url"
                    value={formData.paymentProofUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentProofUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Note *
                </label>
                <textarea
                  required
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Add a note about this transaction"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      amount: "",
                      note: "",
                      transactionId: "",
                      method: "UPI",
                      paymentProofUrl: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {selectedPayment.transactions.length > 0 ? (
            <div className="space-y-0 border border-gray-100 rounded-lg overflow-hidden">
              {selectedPayment.transactions.map((txn: any, idx: number) => (
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
                          {txn.amount}
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
  );
};

export default TransactionModal;
