"use client";
import React, { useState } from "react";
import { Eye, Check, Save } from "lucide-react";

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
    termsAndConditions: [
      "Payment due within 7 days",
      "18% GST applicable",
      "Warranty as per manufacturer",
    ],
    defaultNotes: [
      "Thank you for choosing our services. Please contact us for any assistance.",
    ],
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

  const addLine = (field: "termsAndConditions" | "defaultNotes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeLine = (
    field: "termsAndConditions" | "defaultNotes",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "termsAndConditions" | "defaultNotes",
    index: number
  ) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
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
        signature: "",
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
      <div className="mx-auto px-10 py-12 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-3">
            {/* Template Selection */}
            <div className="bg-white rounded-lg p-8 hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Choose Template Style
                </h2>
                <p className="text-sm text-gray-500">
                  Select a design that matches your brand
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      className={`block cursor-pointer rounded-lg overflow-hidden transition-all ${
                        formData.templateType === template.value
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-medium text-gray-900 text-sm mb-0.5">
                            {template.label}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {template.description}
                          </p>
                        </div>

                        <div
                          className={`h-16 rounded border mb-3 ${
                            template.value === "modern"
                              ? "bg-gray-50 border-gray-200"
                              : template.value === "classic"
                              ? "bg-white border-gray-200"
                              : "bg-gray-100 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-center h-full">
                            <div className="w-6 h-0.5 rounded-full bg-gray-400" />
                          </div>
                        </div>

                        {formData.templateType === template.value && (
                          <button
                            type="button"
                            onClick={() => openPreview(formData.templateType)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </button>
                        )}
                      </div>

                      {formData.templateType === template.value && (
                        <div className="absolute top-2 right-2 bg-gray-900 text-white rounded p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Company Information
                </h2>
                <p className="text-sm text-gray-500">
                  Add your company details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Email
                  </label>
                  <input
                    type="email"
                    name="company.email"
                    value={formData.company.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="info@company.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Phone
                  </label>
                  <input
                    type="text"
                    name="company.phone"
                    value={formData.company.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="company.address"
                    value={formData.company.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="123 Business Street, City, State"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    name="company.gstin"
                    value={formData.company.gstin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="XXYYYYYYYYZ1Z1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="text"
                    name="company.website"
                    value={formData.company.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Payment Information
                </h2>
                <p className="text-sm text-gray-500">
                  Add your bank details for payment processing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountName"
                    value={formData.bankDetails.accountName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifsc"
                    value={formData.bankDetails.ifsc}
                    onChange={handleInputChange}
                    placeholder="BANK0001234"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleInputChange}
                    placeholder="State Bank of India"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Content Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  Content & Terms
                </h2>
                <p className="text-sm text-gray-500">
                  Customize your quotation content and conditions
                </p>
              </div>

              <div className="space-y-6">
                {/* Terms & Conditions */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Terms & Conditions
                  </label>
                  {formData.termsAndConditions.map((line, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <textarea
                        value={line}
                        onChange={(e) =>
                          handleArrayChange(e, "termsAndConditions", index)
                        }
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded resize-none hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeLine("termsAndConditions", index)}
                        className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-sm transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLine("termsAndConditions")}
                    className="mt-2 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Add More
                  </button>
                </div>

                {/* Default Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Notes
                  </label>
                  {formData.defaultNotes.map((line, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <textarea
                        value={line}
                        onChange={(e) =>
                          handleArrayChange(e, "defaultNotes", index)
                        }
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded resize-none hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeLine("defaultNotes", index)}
                        className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-sm transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLine("defaultNotes")}
                    className="mt-2 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Add More
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
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
