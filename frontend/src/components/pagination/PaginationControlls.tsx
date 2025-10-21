import React from "react";

interface PaginationControlsProps {
  currentPage?: number;
  totalPages?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage = 1,
  totalPages = 1,
  setCurrentPage,
}) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 3; // Maximum number of page buttons to show

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
            className="p-2 text-gray-600 cursor-pointer hover:bg-white/60 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="min-w-[2.5rem] p-2 text-center text-gray-400 text-sm"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage?.(page as number)}
                className={`min-w-[2.5rem] cursor-pointer p-2 shadow-sm text-xs font-medium rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-gray-200 border border-gray-100 text-black shadow-md"
                    : "text-gray-600 hover:bg-white/60"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage?.((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 cursor-pointer hover:bg-white/60 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
