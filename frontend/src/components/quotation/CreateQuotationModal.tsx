"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  Calculator,
  Receipt,
} from "lucide-react";
import { RootDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { createQuotation } from "@/store/slices/quotationSlice";
import { getMinimalTemplate } from "@/assets/quote-templates/minimal-template";
import { getModernTemplate } from "@/assets/quote-templates/modern-template";

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
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  leadData,
}) => {
  const dispatch: RootDispatch = useDispatch();
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

  // Generate quote number on component mount
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

  // Calculate totals whenever items or tax rate changes
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

    const quotationData = {
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

    // generate HTML for PDF/print
    const html = getModernTemplate(
      {
        name: "My Company",
        address: "123 Street, City",
        phone: "9876543210",
        email: "info@company.com",
        logo: null,
        gstin: "22AAAAA0000A1Z5",
        website: "www.company.com",
      },
      quotationData.customerInfo,
      quotationData.orderDetails,
      {
        brandColor: "#222",
        termsAndConditions: "Payment due in 7 days.",
        bankDetails: {
          accountName: "My Company Pvt Ltd",
          accountNumber: "1234567890",
          ifsc: "HDFC0001234",
          bankName: "HDFC Bank",
        },
      }
    );

    // Create invisible iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    // Write HTML into iframe
    iframe.contentWindow!.document.open();
    iframe.contentWindow!.document.write(html);
    iframe.contentWindow!.document.close();

    // Wait a bit for content to load, then print
    iframe.onload = () => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
    };
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
        className="fixed inset-0 backdrop-blur-sm transition-opacity z-40"
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Receipt className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Create Quotation
                </button>

                <p className="text-sm text-gray-500">
                  Generate a new quotation for {leadData.name || "this lead"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quotation Name *
                  </label>
                  <input
                    type="text"
                    name="quotationName"
                    value={formData.quotationName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter quotation name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quote Number
                  </label>
                  <input
                    type="text"
                    name="quoteNumber"
                    value={formData.quoteNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
                    placeholder="Auto-generated"
                    readOnly
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="customerCompany"
                      value={formData.customerCompany}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Valid Until & Template */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg space-y-3"
                    >
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
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Quantity */}
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
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                            min="0"
                          />
                        </div>

                        {/* Unit Price (editable) */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Price
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
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                            min="0"
                          />
                        </div>

                        {/* Amount (calculated only) */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Calculation
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) =>
                          setTaxRate(parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-green-600">
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
