"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, User, Calculator, Receipt } from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { createQuotation } from "@/store/slices/quotationSlice";

import { ICreateQuotationPayload } from "@/models/quotation.model";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: {
    id?: string;
    name?: string;
    email?: string;
    mobileNumber?: string;
    organizationId?: string;
  };
  setActiveTab?: (tab: string) => void;
  activeTab?: string;
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  leadData,
  setActiveTab,
}) => {
  const dispatch: RootDispatch = useDispatch();
  const isQuotationCreating = useSelector(
    (state: RootState) => state.quotation.loading.creatingQuotation
  );
  const [formData, setFormData] = useState({
    quotationName: "John Doe Quotation",
    customerName: "John Doe",
    customerCompany: "Acme Corp",
    customerEmail: "john.doe@acme.com",
    customerPhone: "9876543210",
    validUntil: "2025-12-31T23:59:59.000Z",
    quoteNumber: "QTN-1001",
  });

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: "1",
      description: "Website Design",
      quantity: 1,
      price: 0,
    },
  ]);

  const [taxRate, setTaxRate] = useState(18);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const generateQuoteNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `QUO-${year}${month}-${random}`;
    };

    if (isOpen && !formData.quoteNumber) {
      setFormData((prev) => ({
        ...prev,
        quoteNumber: generateQuoteNumber(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }));
    }
  }, [isOpen, formData.quoteNumber]);

  useEffect(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const newTax = (newSubtotal * taxRate) / 100;
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [items, taxRate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newId = (items.length + 1).toString();
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("leadData:", leadData);

    const quotationData: ICreateQuotationPayload = {
      lead: leadData.id!,
      quotationName: formData.quotationName,
      customerInfo: {
        name: formData.customerName,
        company: formData.customerCompany || null,
        email: formData.customerEmail || null,
        phone: formData.customerPhone || null,
      },
      orderDetails: {
        items: items.filter((item) => item.description.trim() !== ""),
        taxRate: taxRate / 100,
        validUntil: formData.validUntil,
        quoteNumber: formData.quoteNumber,
      },
      isOrder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await dispatch(createQuotation(quotationData)).unwrap();
    console.log("Quotation created:", response);
    handleClose();
    setActiveTab?.("quotations");
  };

  const resetForm = () => {
    setFormData({
      quotationName: "",
      customerName: leadData.name || "",
      customerCompany: leadData.organizationId || "",
      customerEmail: leadData.email || "",
      customerPhone: leadData.mobileNumber || "",
      validUntil: "",
      quoteNumber: "",
    });
    setItems([
      {
        id: "1",
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
    setTaxRate(18);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity z-40"
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                <Receipt className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900">
                  Create Quotation
                </h2>
                <p className="text-sm text-gray-500">
                  Generate quotation for {leadData.name || "this lead"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quotation Name
                    </label>
                    <input
                      type="text"
                      name="quotationName"
                      value={formData.quotationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      placeholder="Enter quotation name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quote Number
                    </label>
                    <input
                      type="text"
                      name="quoteNumber"
                      value={formData.quoteNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Customer Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        name="customerCompany"
                        value={formData.customerCompany}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Valid Until */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">
                    Valid Until
                  </label>
                </div>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Line Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-md p-3 bg-gray-50"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-colors"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-colors"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Unit Price (₹)
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-colors"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Tax</span>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) =>
                          setTaxRate(parseFloat(e.target.value) || 0)
                        }
                        className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  disabled={isQuotationCreating}
                  type="submit"
                  onClick={handleSubmit}
                  className={`px-5 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors
                    ${
                      isQuotationCreating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isQuotationCreating ? "Creating..." : "Create Quotation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
