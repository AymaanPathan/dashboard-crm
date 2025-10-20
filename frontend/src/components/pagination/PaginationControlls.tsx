import React from "react";

interface PaginationControlsProps {
  currentPage?: number;
  totalPages?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="px-5 py-4 border-t border-gray-200/50 bg-gray-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing</span>

          <span className="text-sm text-gray-600">per page</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage?.((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:bg-white/60 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage?.(i + 1)}
              className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                currentPage === i + 1
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/60"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage?.((prev) => Math.min(prev + 1, totalPages!))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 hover:bg-white/60 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
