/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, X } from "lucide-react";
import React, { useState } from "react";
import TransactionHistory from "./TransactionHistory";

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
}) => {
  console.log("Selected Payment in Modal:", selectedPayment);
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3 border-b border-gray-200">
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
        </div>

        <TransactionHistory
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
