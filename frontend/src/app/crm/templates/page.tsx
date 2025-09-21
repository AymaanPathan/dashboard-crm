"use client";

import React, { useState } from "react";
import { Eye, Check } from "lucide-react";
import Image from "next/image";

const QuotationTemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const quotationThumbnails = [
    {
      name: "classic-test",
      label: "Classic Template",
      thumbnail:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=750&q=80",

      description:
        "Traditional and professional design with clean lines and structured layout",
    },
    {
      name: "modern-test",
      label: "Modern Template",
      thumbnail:
        "https://via.placeholder.com/400x300/f8fafc/3b82f6?text=Modern+Template",
      description:
        "Contemporary design with bold typography and vibrant accents",
    },
    {
      name: "minimal-test",
      label: "Minimal Template",
      thumbnail:
        "https://via.placeholder.com/400x300/f8fafc/10b981?text=Minimal+Template",
      description: "Clean and simple design focused on clarity and readability",
    },
  ];

  const handleViewTemplate = (templateName) => {
    console.log(`Viewing template: ${templateName}`);
    // Add your view template logic here
  };

  const handleSelectTemplate = (templateName) => {
    setSelectedTemplate(templateName);
    console.log(`Selected template: ${templateName}`);
    // Add your select template logic here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Choose Quotation Template
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Select a template that best fits your business style and
                  branding
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {selectedTemplate
                      ? `${selectedTemplate} selected`
                      : "No template selected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotationThumbnails.map((template) => (
            <div
              key={template.name}
              className={`group relative bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                selectedTemplate === template.name
                  ? "border-black ring-2 ring-black ring-opacity-20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Selected Badge */}
              {selectedTemplate === template.name && (
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="bg-black text-white rounded-full p-2 shadow-lg">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Thumbnail */}
                <Image
                  src={template.thumbnail}
                  alt={template.label}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover transition-transform duration-300 "
                  style={{ objectFit: "cover" }}
                  unoptimized={template.thumbnail.startsWith("https://images.unsplash.com") ? false : true}
                />
                <div className="absolute inset-0 bg-opacity-0 transition-all duration-200" />
              

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {template.label}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleViewTemplate(template.name)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template.name)}
                    className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedTemplate === template.name
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {selectedTemplate === template.name ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="mt-12 flex justify-center">
            <button className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200">
              Continue with{" "}
              {selectedTemplate.replace("-test", "").charAt(0).toUpperCase() +
                selectedTemplate.replace("-test", "").slice(1)}{" "}
              Template
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              You can customize colors, fonts, and branding after selecting a
              template
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationTemplateSelector;
