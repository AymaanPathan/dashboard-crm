/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { getAllQuotations } from "@/store/slices/quotationSlice";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import { formatDate } from "@/utils/formatDate.utils";

export default function QuotationsPage() {
  const dispatch: RootDispatch = useDispatch();
  const { quotations } = useSelector((state: RootState) => state.quotation);
  const paginationData = useSelector(
    (state: RootState) => state.quotation.quotationPagination
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  console.log("paginationData:", paginationData);

  useEffect(() => {
    dispatch(
      getAllQuotations({
        filter: filterStatus,
        page: currentPage,
        limit: paginationData?.limit,
      })
    );
  }, [dispatch, filterStatus, currentPage]);

  const getStatusBadge = (quote: any) => {
    const now = new Date();
    const validUntil = new Date(quote.validUntil);
    const isExpired = validUntil < now;

    if (quote.isOrder) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1  text-emerald-700 rounded-lg text-xs font-medium ">
          <CheckCircle2 className="w-3 h-3" />
          Converted
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-red-700 rounded-lg text-xs font-medium border ">
          <XCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1  text-amber-700 rounded-lg text-xs font-medium ">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };


  return (
    <div className="min-h-screen">
      <div className="px-6 py-6 max-w-[1600px] mx-auto">
        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl p-4  mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations, customers, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50">
              {["all", "pending", "converted", "expired"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all capitalize ${
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

        {/* Quotations Table */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg shadow-gray-900/5 ">
          <div className="overflow-x-auto h-96">
            <table className="w-full ">
              <thead>
                <tr className="border-b border-gray-200/50 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Quote #
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Customer
                  </th>

                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Valid Until
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(
                  (quote: ICreateQuotationPayload, index: number) => (
                    <tr
                      key={quote?.id}
                      className={`border-b border-gray-200/30 hover:bg-white/40 transition-all ${
                        index === quotations?.length - 1 ? "border-b-0" : ""
                      }`}
                    >
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
                        <div className="text-sm font-bold text-gray-900">
                          ₹{quote?.total}
                        </div>
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
                          <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {quotations.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No quotations found</p>
              </div>
            )}
          </div>

          {paginationData &&
            paginationData?.limit < paginationData?.totalCount && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={paginationData && paginationData.totalPages!}
                setCurrentPage={setCurrentPage}
              />
            )}
        </div>
      </div>
    </div>
  );
}
