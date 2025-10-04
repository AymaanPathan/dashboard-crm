/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DropdownMenuForArrayOfObjectsProps {
  dropdownLabel?: string;
  selectedType: any | null;
  setSelectedType: (type: any | null) => void;
  items?: any[];
}

export const DropdownMenuForArrayOfObjects: React.FC<
  DropdownMenuForArrayOfObjectsProps
> = ({ dropdownLabel, selectedType, setSelectedType, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: any) => {
    console.log("Selected Type in handleSelect:", type);
    setSelectedType(type);
    setIsOpen(false);
  };

  console.log("Selected Type in Dropdown:", selectedType);

  const getDisplayValue = () => {
    if (!selectedType || selectedType === "All") return "All";
    return selectedType?.name || selectedType?.username || selectedType;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
      >
        <span className="text-xs text-gray-500 font-medium">
          {dropdownLabel}:
        </span>
        <span className="font-medium">{getDisplayValue()}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              All
            </button>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                {item.name || item.username}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
