import { Plus } from "lucide-react";

interface Header {
  label: string;
  key: string;
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
  renderOptions?: () => React.ReactNode;
}

export function ReusableListPage<T>({
  data,
  headers,
  renderRow,
  onAddClick,
  emptyState,
}: Props<T>) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg shadow-gray-900/5">
      <div className="overflow-x-auto h-96">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50 bg-gray-50/50">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="text-left px-5 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200/30 hover:bg-white/40 transition-all ${
                  index === data.length - 1 ? "border-b-0" : ""
                }`}
              >
                {renderRow(item, index)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {data.length === 0 && emptyState && (
          <div className="text-center py-16">
            {emptyState.icon || (
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            <p className="text-sm text-gray-500">{emptyState.title}</p>
            {emptyState.description && (
              <p className="text-xs text-gray-400 mt-1">
                {emptyState.description}
              </p>
            )}
            {emptyState.actionText && onAddClick && (
              <button
                onClick={onAddClick}
                className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-4"
              >
                <Plus className="h-4 w-4" />
                {emptyState.actionText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
