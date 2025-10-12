/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ListItemAction {
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: any) => void;
  label?: string;
}

interface ListColumn {
  key: string;
  label?: string;
  render?: (item: any) => React.ReactNode;
  width?: string;
  className?: string;
}

interface ReusableListProps {
  items: any[];
  columns: ListColumn[];
  emptyState?: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onItemClick?: (item: any) => void;
  actions?: ListItemAction[];
  getItemIcon?: (item: any) => React.ReactNode;
  className?: string;
}

export const ReusableList: React.FC<ReusableListProps> = ({
  items,
  columns,
  emptyState,
  onItemClick,
  actions,
  getItemIcon,
  className = "",
}) => {
  if (items?.length === 0 && emptyState) {
    const EmptyIcon = emptyState.icon;
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4">
            <EmptyIcon className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1.5">
            {emptyState.title}
          </h3>
          <p className="text-sm text-gray-500 mb-5">{emptyState.description}</p>
          {emptyState.action && (
            <button
              onClick={emptyState.action.onClick}
              className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              {emptyState.action.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-0">
        {items.map((item, index) => (
          <div
            key={item?.id || index}
            onClick={() => onItemClick?.(item)}
            className="group flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            {getItemIcon && (
              <div className="flex-shrink-0 flex items-center">
                {getItemIcon(item)}
              </div>
            )}

            <div className="flex-1 flex items-start gap-4 min-w-0">
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className={`${column.width || "flex-1"} ${
                    column.className || ""
                  } min-w-0 py-0.5`}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </div>
              ))}
            </div>

            {actions && actions.length > 0 && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {actions.map((action, actionIndex) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={actionIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(item);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title={action.label}
                    >
                      <ActionIcon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
