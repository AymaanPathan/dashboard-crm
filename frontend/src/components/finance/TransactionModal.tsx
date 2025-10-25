/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentTransactions } from "@/store/slices/paymentSlice";
import TransactionReview from "./TransactionReviewHistory";

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

const FinanceTransactionModal: React.FC<TransactionModalProps> = ({
  selectedPayment,
  setSelectedPayment,
}) => {
  const dispatch: RootDispatch = useDispatch();
  const pagination = useSelector(
    (state: RootState) => state.payments.transactionPagination
  );
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(
      getPaymentTransactions({
        paymentId: selectedPayment.id,
        page: currentPage,
      })
    );
  }, [dispatch, selectedPayment.id, currentPage, pagination?.limit]);
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {selectedPayment.order.quotation.customerName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedPayment.order.orderNumber} ·{" "}
                  {selectedPayment.order.quotation.quoteNumber}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPayment(null)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Transaction Review with Scroll Pagination */}
        <TransactionReview
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          paymentId={selectedPayment.id}
        />
      </div>
    </div>
  );
};

export default FinanceTransactionModal;
