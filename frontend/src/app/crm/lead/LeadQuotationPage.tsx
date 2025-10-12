/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, ExternalLink, MoreHorizontal, Receipt } from "lucide-react";
import React from "react";

const getQuotationStatusBadge = (isOrder: boolean) => {
  return isOrder
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-blue-50 text-blue-700 border-blue-100";
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
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quotations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all your quotations
              </p>
            </div>
            <button
              onClick={openQuotationModal}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
            >
              New Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto px-8 py-8">
        {quotations?.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No quotations yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Get started by creating your first quotation
            </p>
            <button
              onClick={openQuotationModal}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Create Quotation
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {quotations.map((quotation) => (
              <div
                key={quotation.id}
                className="group bg-white hover:bg-gray-50 border border-gray-100 rounded-lg p-5 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {quotation.quotationName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {quotation.quoteNumber} · {quotation.customerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {quotation.pdfUrl && (
                          <button
                            onClick={() =>
                              openQuotationInNewTab(quotation.pdfUrl)
                            }
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            title="Open PDF"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getQuotationStatusBadge(
                          quotation.isOrder!
                        )}`}
                      >
                        {quotation.isOrder ? "Order" : "Quote"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {quotation.validUntil
                          ? new Date(quotation.validUntil).toLocaleDateString()
                          : ""}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {quotation?.orderDetails?.items?.length || 0} items
                      </span>
                    </div>

                    <div className="flex items-baseline gap-6 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500 text-xs">Subtotal </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(quotation.subtotal!)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 text-xs">Tax </span>
                        <span className="font-medium text-gray-900">
                          {quotation.tax!}%
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 text-xs">Total </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(quotation.total!)}
                        </span>
                      </div>
                    </div>

                    {/* Items Preview */}
                    {quotation.items && quotation.items.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="space-y-2">
                          {quotation.items
                            .slice(0, 2)
                            .map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-600 truncate">
                                  {item.description}
                                </span>
                                <span className="text-gray-500 ml-2 flex-shrink-0">
                                  {item.quantity} × {formatCurrency(item.price)}
                                </span>
                              </div>
                            ))}
                          {quotation.items.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{quotation.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        Created {quotation?.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
