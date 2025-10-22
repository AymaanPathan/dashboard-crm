import { Plus } from "lucide-react";

interface Header {
  label: string;
  key: string;
  colSpan: number;
}

interface EmptyState {
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
  console.log("data", data);
  return (
    <div className="">
      {/* Table */}
      <div className="bg-white ">
        {/* Header */}
        {data && data.length > 0 && (
          <div className="border-b border-gray-100 px-8 py-2">
            <div className="grid grid-cols-12 gap-4 items-center">
              {headers.map((header, idx) => (
                <div key={idx} className={`col-span-${header.colSpan}`}>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {header.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {data &&
            data.map((item, idx) => (
              <div
                key={idx}
                className="group hover:bg-gray-50 transition-all duration-150"
              >
                <div className="px-8 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {renderRow(item, idx)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Empty State */}
      {data && data.length === 0 && emptyState && (
        <div className="text-center py-16 px-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {emptyState.description}
          </p>
          <button
            onClick={onAddClick}
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            {emptyState.actionText}
          </button>
        </div>
      )}
    </div>
  );
}
