"use client";
import React, { useState } from "react";
import { Eye, Sparkles, X, Maximize2, Printer } from "lucide-react";

export const PreviewPanel = ({ templateHtml }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrint = () => {
    if (templateHtml) {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(templateHtml);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  if (!templateHtml) {
    return (
      <div className="sticky top-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg shadow-black/5 overflow-hidden">
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  Ready to preview
                </p>
                <p className="text-xs text-gray-500 max-w-40 mx-auto leading-relaxed">
                  Select a template and click preview to see your design
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
      <div className="sticky top-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg shadow-black/5 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50/80 to-white/40 px-4 py-3 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="group relative p-2 hover:bg-white/60 rounded-lg transition-all duration-200"
                title="Print template"
              >
                <Printer className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="group relative p-2 hover:bg-white/60 rounded-lg transition-all duration-200"
                title="Expand preview"
              >
                <Maximize2 className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
          </div>
          <div className="relative bg-gray-50">
            {/* Smaller preview iframe */}
            <div className="p-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe
                  srcDoc={templateHtml}
                  className="w-full border-0 bg-white"
                  title="Template Preview"
                  style={{
                    height: "1000px",
                    transform: "scale(0.6)",
                    transformOrigin: "top left",
                    width: "166.67%", // Compensate for scale
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-full overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-gray-50/80 to-white/40 px-6 py-4 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Template Preview
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Full-screen template view
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="group relative px-4 py-2 hover:bg-green-50 rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300"
                  title="Print template"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Print
                    </span>
                  </div>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="group relative p-2.5 hover:bg-red-50 rounded-xl transition-all duration-200"
                  title="Close preview"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
            <div className="h-full pb-20 overflow-auto">
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
