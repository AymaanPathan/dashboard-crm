/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { FileText, Search, Eye, CheckCircle2, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { getAllQuotations } from "@/store/slices/quotationSlice";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import { formatDate } from "@/utils/formatDate.utils";
import { confirmOrder } from "@/store/slices/orderSlice";
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";

export default function QuotationsPage() {
  const dispatch: RootDispatch = useDispatch();
  const { quotations } = useSelector((state: RootState) => state.quotation);
  const [currentQuotationId, setCurrentQuotationId] = useState<string | null>(
    null
  );
  const confirmingOrder = useSelector(
    (state: RootState) => state.order.loading.confirmingOrder
  );

  const paginationData = useSelector(
    (state: RootState) => state.quotation.quotationPagination
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  console.log("quotation:", quotations);

  useEffect(() => {
    dispatch(
      getAllQuotations({
        filter: filterStatus,
        page: currentPage,
        limit: paginationData?.limit,
      })
    );
  }, [dispatch, filterStatus, currentPage]);

  const handleViewQuotation = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

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

  const handleChangeStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      dispatch(
        getAllQuotations({
          filter: filterStatus,
          page: 1,
          limit: paginationData?.limit,
          search: searchQuery.trim()!,
        })
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setCurrentPage(1);
      dispatch(
        getAllQuotations({
          filter: filterStatus,
          page: 1,
          limit: paginationData?.limit,
        })
      );
    }
  };

  console.log("confirmingOrder:", currentQuotationId);

  const getStatusBadge = (quote: any) => {
    if (quote.isOrder) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 rounded-lg text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Converted
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-amber-700 rounded-lg text-xs font-medium">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const headers = [
    { label: "Quote #", key: "quoteNumber" },
    { label: "Customer", key: "customerName" },
    { label: "Amount", key: "total" },
    { label: "Valid Until", key: "validUntil" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  const renderRow = (quote: ICreateQuotationPayload, index: number) => (
    <>
      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {quote?.quoteNumber}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(quote.createdAt!)}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {quote?.customerName}
        </div>
        <div className="text-xs text-gray-500">
          {quote?.customerName || "—"}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="text-sm font-bold text-gray-900">₹{quote?.total}</div>
        <div className="text-xs text-gray-500">
          {quote?.customerName || "—"}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="text-sm text-gray-900">
          {formatDate(quote.validUntil!)}
        </div>
      </td>
      <td className="px-5 py-4">{getStatusBadge(quote)}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewQuotation(quote.pdfUrl!)}
            className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95 active:shadow-sm"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          {!quote.isOrder && (
            <button
              onClick={() => handleConfirmOrder(quote.id!)}
              disabled={confirmingOrder && currentQuotationId === quote.id}
              className={`p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg text-xs transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95 active:shadow-sm ${
                confirmingOrder && currentQuotationId === quote.id
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {confirmingOrder && currentQuotationId === quote.id
                ? "Confirming..."
                : "Confirm Order"}
            </button>
          )}
        </div>
      </td>
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="px-6 py-6 max-w-[1600px] mx-auto">
        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
              <input
                type="text"
                placeholder="Search quotations by customers"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50">
              {["all", "pending", "converted"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleChangeStatus(status)}
                  className={`px-3 cursor-pointer py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
                    filterStatus === status
                      ? "bg-gray-900/90 text-white shadow-md"
                      : "text-gray-600 hover:bg-white/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quotations Table using ReusableListPage */}
        <ReusableListPage
          data={quotations}
          headers={headers}
          renderRow={renderRow}
          emptyState={{
            icon: <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />,
            title: "No quotations found",
            description:
              "You have not created any quotations yet. Start by creating a new quotation.",
          }}
        />

        {/* Pagination */}
        {paginationData &&
          paginationData?.limit < paginationData?.totalCount && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginationData && paginationData.totalPages!}
                setCurrentPage={setCurrentPage}
                limit={paginationData.limit}
              />
            </div>
          )}
      </div>
    </div>
  );
}
