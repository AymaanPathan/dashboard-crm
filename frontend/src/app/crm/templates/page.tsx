"use client";
import React, { useState } from "react";
import {
  Eye,
  Check,
  Save,
  Upload,
  Palette,
  FileText,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";

import { PreviewPanel } from "./PreviewPanel";
import { RootDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { createTemplate } from "@/store/slices/templateSlice";
import { getClassicTemplate } from "@/assets/quote-templates/classic-template";
import { getMinimalTemplate } from "@/assets/quote-templates/minimal-template";
import { getModernTemplate } from "@/assets/quote-templates/modern-template";

const NotionTemplateForm = () => {
  const dispatch: RootDispatch = useDispatch();
  const [previewHtml, setPreviewHtml] = useState<string>("");

  const [formData, setFormData] = useState({
    templateType: "modern",
    templateName: "Modern Default Template",
    company: {
      name: "SolarTech Pvt Ltd",
      email: "contact@solartech.in",
      phone: "9876543210",
      address: "123 Solar Park Road, Ahmedabad, Gujarat",
      gstin: "24ABCDE1234F1Z5",
      website: "https://solartech.in",
    },
    bankDetails: {
      accountName: "SolarTech Pvt Ltd",
      accountNumber: "123456789012",
      ifsc: "SBIN0000456",
      bankName: "State Bank of India",
    },
    termsAndConditions:
      "1. Payment due within 7 days\n2. 18% GST applicable\n3. Warranty as per manufacturer",
    defaultNotes:
      "Thank you for choosing our services. Please contact us for any assistance.",
  });

  const [errors, setErrors] = useState({});

  const templateTypes = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean and professional",
      previewPdf: "modern-preview.pdf",
    },
    {
      value: "classic",
      label: "Classic",
      description: "Traditional business style",
      previewPdf: "classic-preview.pdf",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Simple and elegant",
      previewPdf: "minimal-preview.pdf",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(createTemplate(formData));
  };

  const renderSelectedTemplateHtml = () => {
    const commonProps = {
      companyInfo: {
        ...formData.company,
        logo: formData.logoUrl,
      },
      customerInfo: {
        name: "John Doe",
        company: "Customer Inc.",
        address: "456 Customer Ave.",
        phone: "+91 9123456789",
        email: "john@example.com",
      },
      orderDetails: {
        quoteNumber: "QT-001",
        date: new Date().toLocaleDateString(),
        validUntil: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        deliveryTime: "7 days",
        paymentTerms: "Advance 50%",
        discount: 0,
        taxRate: 0.18,
        items: [
          {
            hsn: "1234",
            description: "Solar Panel 320W",
            details: "Mono Perc, High efficiency",
            quantity: 2,
            price: 8000,
          },
        ],
      },
      config: {
        brandColor: formData.brandColor,
        headerFont: formData.headerFont,
        signature: "", // optional base64 signature
        termsAndConditions: formData.termsAndConditions,
        bankDetails: formData.bankDetails,
      },
    };

    switch (formData.templateType) {
      case "classic":
        return getClassicTemplate(
          commonProps.companyInfo,
          commonProps.customerInfo,
          commonProps.orderDetails,
          commonProps.config
        );
      case "minimal":
        return getMinimalTemplate(
          commonProps.companyInfo,
          commonProps.customerInfo,
          commonProps.orderDetails,
          commonProps.config
        );
      case "modern":
      default:
        return getModernTemplate(
          commonProps.companyInfo,
          commonProps.customerInfo,
          commonProps.orderDetails,
          commonProps.config
        );
    }
  };

  const openPreview = (templateType: string) => {
    setPreviewHtml(renderSelectedTemplateHtml());
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Choose Template Style
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select a design that matches your brand
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templateTypes.map((template) => (
                  <div key={template.value} className="relative group">
                    <input
                      type="radio"
                      id={template.value}
                      name="templateType"
                      value={template.value}
                      checked={formData.templateType === template.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={template.value}
                      className={`block cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                        formData.templateType === template.value
                          ? "border-black shadow-lg bg-gray-50"
                          : "border-gray-200 hover:border-gray-400 hover:shadow-md bg-white"
                      }`}
                    >
                      <div className="p-5">
                        <div className="mb-4">
                          <h3 className="font-semibold text-black mb-1">
                            {template.label}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {template.description}
                          </p>
                        </div>

                        <div
                          className={`h-20 rounded-lg mb-4 ${
                            template.value === "modern"
                              ? "bg-gradient-to-br from-gray-100 to-gray-200"
                              : template.value === "classic"
                              ? "bg-gradient-to-br from-gray-50 to-gray-100"
                              : "bg-gradient-to-br from-gray-200 to-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-1 rounded-full bg-black" />
                          </div>
                        </div>

                        {formData.templateType === template.value && (
                          <button
                            type="button"
                            onClick={() => openPreview(formData.templateType)}
                            className="w-full px-3 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Preview Template
                          </button>
                        )}
                      </div>

                      {formData.templateType === template.value && (
                        <div className="absolute top-3 right-3 bg-black text-white rounded-full p-1.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Company Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add your company details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Email
                  </label>
                  <input
                    type="email"
                    name="company.email"
                    value={formData.company.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="info@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Phone
                  </label>
                  <input
                    type="text"
                    name="company.phone"
                    value={formData.company.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="company.address"
                    value={formData.company.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="123 Business Street, City, State"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    name="company.gstin"
                    value={formData.company.gstin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="XXYYYYYYYYZ1Z1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="text"
                    name="company.website"
                    value={formData.company.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Payment Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add your bank details for payment processing
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountName"
                    value={formData.bankDetails.accountName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifsc"
                    value={formData.bankDetails.ifsc}
                    onChange={handleInputChange}
                    placeholder="BANK0001234"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleInputChange}
                    placeholder="State Bank of India"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Content Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Content & Terms
                  </h2>
                  <p className="text-sm text-gray-600">
                    Customize your quotation content and conditions
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Terms & Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="1. Payment due within 30 days of invoice date&#10;2. Late payments may incur additional charges&#10;3. All prices are exclusive of taxes unless stated otherwise"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Notes
                  </label>
                  <textarea
                    name="defaultNotes"
                    value={formData.defaultNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Thank you for choosing our services. We look forward to working with you and delivering exceptional results for your project."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black hover:border-gray-400 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200 font-semibold text-sm shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
              >
                <Save className="w-5 h-5" />
                Create Template
              </button>
            </div>
          </div>

          {/* Right Column - Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PreviewPanel templateHtml={previewHtml} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionTemplateForm;
