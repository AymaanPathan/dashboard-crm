"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Receipt,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";

// Mock data matching your API structure
const mockPayments = [
  {
    id: "e646a408-88b7-40f4-9a25-e62515332a41",
    orderId: "bd9aaea1-ddb1-4d3f-95d6-e0049bd8d9ec",
    totalAmount: 14.16,
    amountPaid: 0,
    status: "pending",
    note: null,
    paidAt: null,
    createdAt: "2025-10-23T07:15:47.950Z",
    order: {
      orderNumber: "ORD-1761203747936",
      quotation: {
        quoteNumber: "QTN-1001",
        customerName: "John Doe",
        customerPhone: "9876543210",
      },
      lead: {
        name: "meta",
        phone: "9638527412",
        email: "meta@gmail.com",
      },
    },
    transactions: [],
  },
  {
    id: "e646a408-88b7-40f4-9a25-e62515332a42",
    orderId: "bd9aaea1-ddb1-4d3f-95d6-e0049bd8d9ec",
    totalAmount: 25.5,
    amountPaid: 25.5,
    status: "completed",
    note: "Full payment received",
    paidAt: "2025-10-20T10:30:00.000Z",
    createdAt: "2025-10-20T07:15:47.950Z",
    order: {
      orderNumber: "ORD-1761203747937",
      quotation: {
        quoteNumber: "QTN-1002",
        customerName: "Jane Smith",
        customerPhone: "9876543211",
      },
      lead: {
        name: "google",
        phone: "9638527413",
        email: "jane@gmail.com",
      },
    },
    transactions: [
      {
        id: "txn-001",
        amount: 25.5,
        transactionId: "TXN-2025-001234",
        proofUrl: "https://example.com/proof.jpg",
        createdAt: "2025-10-20T10:30:00.000Z",
      },
    ],
  },
];

export default function PaymentManagement() {
  const [payments, setPayments] = useState<typeof mockPayments[number][]>(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[number] | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTransaction, setNewTransaction] = useState<{
    amount: string;
    transactionId: string;
    proofUrl: string;
  }>({
    amount: "",
    transactionId: "",
    proofUrl: "",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-emerald-700 bg-emerald-50";
      case "pending":
        return "text-amber-700 bg-amber-50";
      case "partial":
        return "text-blue-700 bg-blue-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "partial":
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const handleAddTransaction = (paymentId) => {
    const payment = payments.find((p) => p.id === paymentId);
    const newTxn = {
      id: `txn-${Date.now()}`,
      amount: parseFloat(newTransaction.amount),
      transactionId: newTransaction.transactionId,
      proofUrl: newTransaction.proofUrl,
      createdAt: new Date().toISOString(),
    };

    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        const newAmountPaid = p.amountPaid + newTxn.amount;
        return {
          ...p,
          amountPaid: newAmountPaid,
          status: newAmountPaid >= p.totalAmount ? "completed" : "partial",
          transactions: [...p.transactions, newTxn],
          paidAt:
            newAmountPaid >= p.totalAmount
              ? new Date().toISOString()
              : p.paidAt,
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    setSelectedPayment(updatedPayments.find((p) => p.id === paymentId));
    setNewTransaction({ amount: "", transactionId: "", proofUrl: "" });
    setShowAddPayment(false);
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.order.quotation.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.order.quotation.quoteNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Payments
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track all payment transactions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, order number, or quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-1">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              onClick={() => setSelectedPayment(payment)}
              className="group cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {payment.order.quotation.customerName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{payment.order.orderNumber}</span>
                        <span>•</span>
                        <span>{payment.order.quotation.quoteNumber}</span>
                        <span>•</span>
                        <span>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      ${payment.amountPaid.toFixed(2)} / $
                      {payment.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.transactions.length} transaction
                      {payment.transactions.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Detail Sidebar */}
        {selectedPayment && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  selectedPayment.status
                )}`}
              >
                {getStatusIcon(selectedPayment.status)}
                {selectedPayment.status}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Customer
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-900 font-medium">
                      {selectedPayment.order.quotation.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900">
                      {selectedPayment.order.quotation.customerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900">
                      {selectedPayment.order.lead.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Order
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number</span>
                    <span className="text-gray-900 font-medium">
                      {selectedPayment.order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote Number</span>
                    <span className="text-gray-900">
                      {selectedPayment.order.quotation.quoteNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="text-gray-900 font-medium">
                      ${selectedPayment.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="text-emerald-700 font-medium">
                      ${selectedPayment.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-medium">Remaining</span>
                    <span className="text-gray-900 font-semibold">
                      $
                      {(
                        selectedPayment.totalAmount - selectedPayment.amountPaid
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Payment Button */}
              {selectedPayment.status !== "completed" && !showAddPayment && (
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </button>
              )}

              {/* Add Payment Form */}
              {showAddPayment && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    New Transaction
                  </h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={newTransaction.transactionId}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          transactionId: e.target.value,
                        })
                      }
                      placeholder="TXN-XXX-XXXXX"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Proof URL
                    </label>
                    <input
                      type="text"
                      value={newTransaction.proofUrl}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          proofUrl: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAddTransaction(selectedPayment.id)}
                      className="flex-1 py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddPayment(false)}
                      className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction History */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Transaction History ({selectedPayment.transactions.length})
                </h3>
                <div className="space-y-2">
                  {selectedPayment.transactions.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No transactions yet
                    </p>
                  ) : (
                    selectedPayment.transactions.map((txn) => (
                      <div key={txn.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                ${txn.amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(txn.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs ml-10">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">ID:</span>
                            <span className="text-gray-900 font-mono">
                              {txn.transactionId}
                            </span>
                          </div>
                          {txn.proofUrl && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-gray-400" />
                              <a
                                href={txn.proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Proof
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
