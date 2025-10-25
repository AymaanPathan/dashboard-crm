/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentTransactions } from "@/store/slices/paymentSlice";

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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className=" backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg shadow-gray-900/5 w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900/90 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-md">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {selectedPayment.order.quotation.customerName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedPayment.order.orderNumber} •{" "}
                  {selectedPayment.order.quotation.quoteNumber}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPayment(null)}
              className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <TransactionHistory
          setSelectedPayment={setSelectedPayment}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
