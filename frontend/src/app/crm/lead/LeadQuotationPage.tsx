/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomButton } from "@/components/reuseable/Buttons/Button";
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";

import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, ExternalLink, MoreHorizontal, Receipt } from "lucide-react";
import React from "react";

const getQuotationStatusBadge = (isOrder: boolean) => {
  return isOrder ? "bg-gray-100 text-gray-900" : "bg-gray-50 text-gray-600";
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
  const columns = [
    {
      key: "info",
      render: (quotation: any) => (
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-0.5">
            {quotation.quotationName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <span>{quotation.quoteNumber}</span>
            <span>·</span>
            <span>{quotation.customerName}</span>
          </div>
          {quotation.items && quotation.items.length > 0 && (
            <div className="space-y-0.5 mt-1.5">
              {quotation.items.slice(0, 1).map((item: any, index: number) => (
                <div key={index} className="text-xs text-gray-400 line-clamp-1">
                  {item.description}
                </div>
              ))}
              {quotation.items.length > 1 && (
                <div className="text-xs text-gray-400">
                  +{quotation.items.length - 1} more items
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      width: "w-24",
      render: (quotation: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${getQuotationStatusBadge(
            quotation.isOrder!
          )}`}
        >
          {quotation.isOrder ? "Order" : "Quote"}
        </span>
      ),
    },
    {
      key: "details",
      width: "w-48",
      render: (quotation: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {quotation.validUntil
              ? new Date(quotation.validUntil).toLocaleDateString()
              : "No date"}
          </div>
          <div className="text-xs text-gray-500">
            {quotation?.orderDetails?.items?.length || 0} items
          </div>
        </div>
      ),
    },
    {
      key: "amounts",
      width: "w-40",
      className: "text-right",
      render: (quotation: any) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            Subtotal: {formatCurrency(quotation.subtotal!)}
          </div>
          <div className="text-xs text-gray-500">Tax: {quotation.tax!}%</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(quotation.total!)}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Content Section */}
      <div className="mx-auto px-6 py-8">
        {quotations.length > 0 && (
          <div className="mb-6">
            <CustomButton
              onClick={openQuotationModal}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Quotation
            </CustomButton>
          </div>
        )}
        <ReusableListPage
          title="Quotations"
          data={quotations}
          headers={columns.map((col: any) => ({
            label: col.label,
            key: col.key,
            colSpan: col.colSpan || 3, // adjust per your design
          }))}
          renderRow={(quotation: any, index: number) => (
            <>
              {/* Icon */}
              <div className="col-span-1 flex items-center">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Quotation Info */}
              <div className="col-span-4">
                <p className="text-sm text-gray-900 font-medium">
                  {quotation.title}
                </p>
                <p className="text-xs text-gray-500">
                  {quotation.customerName}
                </p>
              </div>

              {/* Date */}
              <div className="col-span-3 text-sm text-gray-600">
                {new Date(quotation.createdAt).toLocaleDateString()}
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    quotation.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : quotation.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {quotation.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2">
                {/* Open PDF */}
                <button
                  onClick={() =>
                    quotation.pdfUrl && openQuotationInNewTab(quotation.pdfUrl)
                  }
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Open PDF"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </button>

                {/* More options */}
                <button
                  onClick={() => console.log("More options", quotation)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </>
          )}
          onAddClick={openQuotationModal}
          emptyState={{
            title: "No quotations yet",
            description: "Get started by creating your first quotation",
            actionText: "Create Quotation",
          }}
        />
        ;
      </div>
    </div>
  );
};
