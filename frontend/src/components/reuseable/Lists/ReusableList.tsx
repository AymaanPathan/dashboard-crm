import { Plus } from "lucide-react";
import React from "react";

interface Header {
  label: string;
  key: string;
  colSpan: number;
}

interface EmptyState {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
}

interface Props<T> {
  title?: string;
  data: T[];
  headers: Header[];
  renderRow: (item: T, index: number) => React.ReactNode;
  onSearchChange?: (term: string) => void;
  onSearchSubmit?: (term: string) => void;
  onAddClick?: () => void;
  addButtonLabel?: string;
  emptyState?: EmptyState;
  renderOptions?: (item: T, index: number) => React.ReactNode;
}

// Convert numeric colSpan to Tailwind grid class
const getColSpanClass = (span: number) => {
  const spanMap: Record<number, string> = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, `col-span-${i + 1}`])
  );
  return spanMap[span] || "col-span-1";
};

export function ReusableListPage<T>({
  data,
  headers,
  renderRow,
  onAddClick,
  emptyState,
  renderOptions,
}: Props<T>) {
  const hasActions = !!renderOptions;

  return (
    <div className="px-5">
      {/* Container card */}
      <div
        className={`bg-white/80 rounded-xl backdrop-blur-xl ${
          data.length > 0
            ? "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_8px_rgba(0,0,0,0.02)] border border-gray-200/60"
            : ""
        }`}
      >
        {/* Table header */}
        {data.length > 0 && (
          <div className="px-6 py-2.5 bg-gradient-to-b from-gray-50/60 to-gray-50/30 border-b border-gray-200/60 backdrop-blur-xl rounded-t-xl">
            <div className="grid grid-cols-12 gap-5 items-center">
              {headers.map((header, idx) => (
                <div
                  key={idx}
                  className={`${getColSpanClass(header.colSpan)} select-none`}
                >
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.7px] flex items-center gap-1">
                    {header.label}
                  </span>
                </div>
              ))}
              {hasActions && (
                <div className="col-span-1 flex justify-end">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.7px] select-none">
                    Actions
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-gray-100/80 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="hover:bg-gray-50/40 transition-all duration-150 group relative animate-in fade-in-0 slide-in-from-bottom-1"
              style={{
                animationDelay: `${idx * 30}ms`,
                animationDuration: "300ms",
              }}
            >
              <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-xl"></div>
              <div className="px-6 py-3">
                <div className="grid grid-cols-12 gap-5 items-center">
                  {renderRow(item, idx)}
                  {hasActions && (
                    <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {renderOptions!(item, idx)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 && emptyState && (
        <div className="text-center py-24 px-5 animate-in fade-in-0 zoom-in-95 duration-500">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gray-100/80 via-gray-50/50 to-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-200/60 backdrop-blur-sm">
            {emptyState.icon ? (
              emptyState.icon
            ) : (
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </div>

          <h3 className="text-[13px] font-semibold text-gray-900 mb-2 tracking-[-0.02em]">
            {emptyState.title}
          </h3>
          <p className="text-[11.5px] text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed tracking-[-0.01em]">
            {emptyState.description}
          </p>
          {onAddClick && emptyState.actionText && (
            <button
              onClick={onAddClick}
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-[11.5px] font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-gray-900/20 hover:shadow-md hover:shadow-gray-900/30 hover:translate-y-[-1px] active:scale-[0.98] overflow-hidden tracking-[-0.01em]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <Plus
                className="relative h-3 w-3 transition-transform duration-300 group-hover:rotate-90"
                strokeWidth={2.5}
              />
              <span className="relative">{emptyState.actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
