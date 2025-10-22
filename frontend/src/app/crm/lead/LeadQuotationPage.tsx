/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomButton } from "@/components/reuseable/Buttons/Button";
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";
import { RootDispatch, RootState } from "@/store";
import { confirmOrder } from "@/store/slices/orderSlice";
import { getAllQuotations } from "@/store/slices/quotationSlice";

import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, ExternalLink, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const getQuotationStatusBadge = (isOrder: boolean) => {
  return isOrder
    ? "bg-blue-50 text-blue-700 border border-blue-100"
    : "bg-gray-50 text-gray-600 border border-gray-200";
};

interface LeadQuotationProps {
  quotations: any[];
  openQuotationModal: () => void;
  openQuotationInNewTab: (url: string) => void;
}

export const LeadQuotationPage: React.FC<LeadQuotationProps> = ({
  quotations,
  openQuotationModal,
  openQuotationInNewTab,
}) => {
  const [currentQuotationId, setCurrentQuotationId] = useState<string | null>(
    null
  );
  const confirmingOrder = useSelector(
    (state: RootState) => state.order.loading.confirmingOrder
  );
  const paginationData = useSelector(
    (state: RootState) => state.quotation.quotationPagination
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch: RootDispatch = useDispatch();

  const handleConfirmOrder = async (quotationId: string) => {
    try {
      setCurrentQuotationId(quotationId);
      await dispatch(confirmOrder(quotationId)).unwrap();

      await dispatch(
        getAllQuotations({
          filter: filterStatus,
          page: currentPage,
          limit: paginationData?.limit,
        })
      );
    } catch (error) {
      console.error("Failed to confirm order:", error);
    } finally {
      setCurrentQuotationId(null);
    }
  };
  const headers = [
    { label: "Quotation Details", key: "info" },
    { label: "Status", key: "status" },
    { label: "Valid Until", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Actions", key: "actions" },
  ];

  const renderRow = (quotation: any) => (
    <>
      {/* Quotation Info */}
      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-gray-900 mb-0.5">
          {quotation.quotationName}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span>{quotation.quoteNumber}</span>
          <span>·</span>
          <span>{quotation.customerName}</span>
        </div>
        {quotation.items && quotation.items.length > 0 && (
          <div className="mt-1.5">
            <div className="text-xs text-gray-400 line-clamp-1">
              {quotation.items[0].description}
            </div>
            {quotation.items.length > 1 && (
              <div className="text-xs text-gray-400 mt-0.5">
                +{quotation.items.length - 1} more items
              </div>
            )}
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getQuotationStatusBadge(
            quotation.isOrder
          )}`}
        >
          {quotation.isOrder ? "Order" : "Quote"}
        </span>
      </td>

      {/* Date */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-900">
          <Calendar className="h-4 w-4 text-gray-400" />
          {quotation.validUntil
            ? new Date(quotation.validUntil).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No date"}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {quotation?.items?.length || 0} items
        </div>
      </td>

      {/* Amount */}
      <td className="px-5 py-4">
        <div className="text-sm font-bold text-gray-900">
          {formatCurrency(quotation.total)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Subtotal: {formatCurrency(quotation.subtotal)}
        </div>
        <div className="text-xs text-gray-500">Tax: {quotation.tax}%</div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {/* Confirm Quotation */}
          {!quotation.isOrder && (
            <button
              onClick={() => handleConfirmOrder(quotation.id)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-150 shadow-sm"
              title="Confirm Quotation"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {confirmingOrder && currentQuotationId === quotation.id
                ? "Confirming..."
                : "Confirm Order"}
            </button>
          )}

          {/* Open PDF */}
          <button
            onClick={() =>
              quotation.pdfUrl && openQuotationInNewTab(quotation.pdfUrl)
            }
            className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95"
            title="Open PDF"
          >
            <ExternalLink className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Content Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {quotations.length > 0 && (
          <div className="mb-6">
            <CustomButton
              onClick={openQuotationModal}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-150 shadow-sm"
            >
              Add Quotation
            </CustomButton>
          </div>
        )}

        <ReusableListPage
          data={quotations}
          headers={headers}
          renderRow={renderRow}
          onAddClick={openQuotationModal}
          emptyState={{
            title: "No quotations found",
            description: "Get started by creating your first quotation",
            actionText: "Create Quotation",
          }}
        />
      </div>
    </div>
  );
};
