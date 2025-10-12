/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomButton } from "@/components/reuseable/Buttons/Button";
import { ReusableList } from "@/components/reuseable/Lists/ReusableList";

import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, ExternalLink, MoreHorizontal, Receipt } from "lucide-react";
import React from "react";

const getQuotationStatusBadge = (isOrder: boolean) => {
  return isOrder ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700";
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
          <div className="text-sm font-medium text-gray-900 mb-1">
            {quotation.quotationName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>{quotation.quoteNumber}</span>
            <span>·</span>
            <span>{quotation.customerName}</span>
          </div>
          {quotation.items && quotation.items.length > 0 && (
            <div className="space-y-1 mt-2">
              {quotation.items.slice(0, 1).map((item: any, index: number) => (
                <div key={index} className="text-xs text-gray-500 line-clamp-1">
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
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getQuotationStatusBadge(
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
      <div className="mx-auto px-5 py-6 ">
        <ReusableList
          items={quotations}
          columns={columns}
          getItemIcon={(quotation) => (
            <Receipt className="h-4 w-4 text-gray-400" />
          )}
          emptyState={{
            icon: Receipt,
            title: "No quotations yet",
            description: "Get started by creating your first quotation",
            action: {
              label: "Create Quotation",
              onClick: openQuotationModal,
            },
          }}
          actions={[
            {
              icon: ExternalLink,
              onClick: (quotation) => {
                if (quotation.pdfUrl) {
                  openQuotationInNewTab(quotation.pdfUrl);
                }
              },
              label: "Open PDF",
            },
            {
              icon: MoreHorizontal,
              onClick: (quotation) => console.log("More options", quotation),
              label: "More options",
            },
          ]}
          onItemClick={(quotation) =>
            console.log("Clicked quotation", quotation)
          }
        />
      </div>
    </div>
  );
};
