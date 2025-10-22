/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { getAllOrders } from "@/store/slices/orderSlice";
import { PaginationControls } from "@/components/pagination/PaginationControlls";
import { formatDate } from "@/utils/formatDate.utils";
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";

export default function OrdersPage() {
  const dispatch: RootDispatch = useDispatch();
  const { orders, orderPagination } = useSelector(
    (state: RootState) => state.order
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      getAllOrders({
        filter: filterStatus,
        page: currentPage,
        limit: orderPagination?.limit,
      })
    );
  }, [dispatch, filterStatus, currentPage]);

  const handleChangeStatus = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      dispatch(
        getAllOrders({
          filter: filterStatus,
          page: 1,
          limit: orderPagination?.limit,
          search: searchQuery.trim(),
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
        getAllOrders({
          filter: filterStatus,
          page: 1,
          limit: orderPagination?.limit,
        })
      );
    }
  };

  const handleViewOrder = (order: any) => {
    if (order?.invoiceUrl) {
      window.open(order.invoiceUrl, "_blank");
    }
  };

  const handleDownloadOrder = (order: any) => {
    if (order?.invoiceUrl) {
      const link = document.createElement("a");
      link.href = order.invoiceUrl;
      link.download = `Invoice_${order.orderNumber}.pdf`;
      link.click();
    }
  };

  const getStatusBadge = (order: any) => {
    switch (order.status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-amber-700 rounded-lg text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "confirmed":
      case "processing":
      case "shipped":
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 rounded-lg text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-red-700 rounded-lg text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-gray-500 rounded-lg text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const headers = [
    { label: "Order #", key: "orderNumber" },
    { label: "Customer", key: "customer" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  console.log("Orders:", orders);

  const renderRow = (order: any) => (
    <>
      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {order.orderNumber}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(order.createdAt)}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="text-sm font-semibold text-gray-900">
          {order?.lead?.name || "—"}
        </div>
        <div className="text-xs text-gray-500">{order?.lead?.phone || "—"}</div>
      </td>

      <td className="px-5 py-4">
        <div className="text-sm font-bold text-gray-900">
          ₹{order.totalAmount}
        </div>
      </td>

      <td className="px-5 py-4 text-sm text-gray-900">
        {formatDate(order.updatedAt || order.createdAt)}
      </td>

      <td className="px-5 py-4">{getStatusBadge(order)}</td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDownloadOrder(order)}
            className="p-1.5 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
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
                placeholder="Search orders by customers or order numbers"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Orders Table using ReusableListPage */}
        <ReusableListPage
          data={orders}
          headers={headers}
          renderRow={renderRow}
          emptyState={{
            icon: <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />,
            title: "No orders found",
            description:
              "You have not confirmed any orders yet. Orders will appear here once created.",
          }}
        />

        {/* Pagination */}
        {orderPagination &&
          orderPagination?.limit < orderPagination?.totalCount && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={orderPagination.totalPages!}
                setCurrentPage={setCurrentPage}
                limit={orderPagination.limit}
              />
            </div>
          )}
      </div>
    </div>
  );
}
