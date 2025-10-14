"use client";
import React, { useState } from "react";
import { Eye, Maximize2, Printer, X } from "lucide-react";

export const PreviewPanel = ({ templateHtml }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrint = () => {
    if (templateHtml) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(templateHtml);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  if (!templateHtml) {
    return (
      <div className="sticky top-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  No preview yet
                </p>
                <p className="text-xs text-gray-500 max-w-40 mx-auto">
                  Select a template and click preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Preview</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrint}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Print template"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="Expand preview"
              >
                <Maximize2 className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="relative bg-gray-50">
            <div className="p-2">
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <iframe
                  srcDoc={templateHtml}
                  className="w-full border-0 bg-white"
                  title="Template Preview"
                  style={{
                    height: "1000px",
                    transform: "scale(0.6)",
                    transformOrigin: "top left",
                    width: "166.67%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-full overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Template Preview
                </h3>
                <p className="text-xs text-gray-500">Full-screen view</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs hover:bg-gray-200 rounded transition-colors border border-gray-300 font-medium text-gray-700"
                  title="Print template"
                >
                  <div className="flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </div>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                  title="Close preview"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="h-full pb-20 overflow-auto bg-gray-50">
              <iframe
                srcDoc={templateHtml}
                className="w-full h-full border-0"
                title="Template Preview Fullscreen"
                style={{ minHeight: "800px" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
