"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, User, Calculator, Receipt } from "lucide-react";
import { ICreateQuotationPayload } from "@/models/quotation.model";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { createQuotation } from "@/store/slices/quotationSlice";

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isQuotationCreating = useSelector(
    (state: RootState) => state.quotation.loading.creatingQuotation
  );
  const dispatch: RootDispatch = useDispatch();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.quotationName.trim()) {
      errors.quotationName = "Quotation name is required";
    }

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Customer phone number is required";
    }

    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      errors.customerEmail = "Please enter a valid email address";
    }

    if (!formData.validUntil) {
      errors.validUntil = "Valid until date is required";
    }

    const nonEmptyItems = items.filter(
      (item) => item.description.trim() !== ""
    );
    if (nonEmptyItems.length === 0) {
      errors.items = "At least one item with a description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [formData, setFormData] = useState({
    quotationName: "John Doe Quotation",
    customerName: "John Doe",
    customerCompany: "Acme Corp",
    customerEmail: "john.doe@acme.com",
    customerPhone: "9876543210",
    validUntil: "2025-12-31",
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
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    // Clear items error when user adds description
    if (field === "description" && formErrors.items) {
      setFormErrors((prev) => ({ ...prev, items: "" }));
    }
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
    if (!validateForm()) return;
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
    await dispatch(createQuotation(quotationData)).unwrap();
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
    setItems([{ id: "1", description: "", quantity: 1, price: 0 }]);
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
        className="fixed inset-0 bg-black/5 backdrop-blur-[1px] transition-opacity z-40"
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-gray-200/60 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <Receipt className="h-4 w-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Create Quotation
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Generate quotation for {leadData.name || "this lead"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50/40">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200/60 p-5 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Quotation Name
                    </label>
                    <input
                      type="text"
                      name="quotationName"
                      value={formData.quotationName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 text-sm border ${
                        formErrors.quotationName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/5"
                      } rounded-lg focus:outline-none focus:ring-4 transition-all bg-white`}
                      placeholder="Enter quotation name"
                    />
                    {formErrors.quotationName && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {formErrors.quotationName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Quote Number
                    </label>
                    <input
                      type="text"
                      name="quoteNumber"
                      value={formData.quoteNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none text-gray-500"
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Customer Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 text-sm border ${
                        formErrors.customerName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/5"
                      } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                      placeholder="Enter customer name"
                    />
                    {formErrors.customerName && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {formErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        Company
                      </label>
                      <input
                        type="text"
                        name="customerCompany"
                        value={formData.customerCompany}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                        placeholder="Company name (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2.5 text-sm border ${
                          formErrors.customerPhone
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/5"
                        } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                        placeholder="Phone number"
                      />
                      {formErrors.customerPhone && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                          {formErrors.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 text-sm border ${
                        formErrors.customerEmail
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/5"
                      } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                      placeholder="Email address (optional)"
                    />
                    {formErrors.customerEmail && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {formErrors.customerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Valid Until */}
              <div className="bg-white rounded-lg border border-gray-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Valid Until
                  </h3>
                </div>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 text-sm border ${
                    formErrors.validUntil
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/5"
                  } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                />
                {formErrors.validUntil && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {formErrors.validUntil}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg border border-gray-200/60 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Line Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200/60 rounded-lg p-4 bg-gray-50/40 hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">
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
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 bg-white transition-all"
                            placeholder="Enter item description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
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
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 bg-white transition-all"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
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
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 bg-white transition-all"
                              min="0"
                            />
                          </div>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Remove item
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {formErrors.items && (
                  <p className="mt-3 text-xs text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {formErrors.items}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="bg-white rounded-lg border border-gray-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center">
                    <Calculator className="h-3 w-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Summary
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Tax Rate</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={taxRate}
                          onChange={(e) =>
                            setTaxRate(parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <span className="text-gray-600 text-xs">%</span>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center py-2 bg-gray-50/50 px-3 rounded-lg">
                      <span className="font-semibold text-gray-900">
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
          <div className="border-t border-gray-200/60 px-6 py-4 bg-white">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  disabled={isQuotationCreating}
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  className={`px-5 cursor-pointer py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all shadow-sm hover:shadow
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
