/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, ExternalLink, MoreHorizontal, Receipt } from "lucide-react";
import React from "react";

const getQuotationStatusBadge = (isOrder: boolean) => {
  return isOrder
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-blue-100 text-blue-700 border-blue-200";
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
    <div className="p-6">
      {quotations?.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quotations yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first quotation for this lead
          </p>
          <button
            onClick={openQuotationModal}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create First Quotation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {quotation.quotationName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {quotation.quoteNumber} • {quotation.customerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quotation.pdfUrl && (
                        <button
                          onClick={() =>
                            openQuotationInNewTab(quotation.pdfUrl)
                          }
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Open PDF"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getQuotationStatusBadge(
                        quotation.isOrder!
                      )}`}
                    >
                      {quotation.isOrder ? "Order" : "Quote"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      <Calendar className="h-3 w-3" />
                      Valid until{" "}
                      {quotation.validUntil
                        ? new Date(quotation.validUntil).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Subtotal: </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(quotation.subtotal!)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Tax: </span>
                        <span className="font-medium text-gray-900">
                          {quotation.tax!}%
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Total: </span>
                        <span className="font-semibold text-gray-900 text-lg">
                          {formatCurrency(quotation.total!)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {quotation?.orderDetails?.items?.length || 0} items
                      </span>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500">
                        {quotation?.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview (first 2 items) */}
                  {quotation.items && quotation.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        {quotation.items
                          .slice(0, 2)
                          .map((item: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
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
                          <div className="text-xs text-gray-500 italic">
                            +{quotation.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
