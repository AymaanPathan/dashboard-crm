import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LeadFilters } from "@/models/lead.model";

interface DropdownMenuForArrayProps {
  dropdownLabel?: string;
  selectedType: string | null;
  setSelectedType: (type: LeadFilters["leadType"] | null) => void;
  items?: string[];
}

export const DropdownMenuForArray: React.FC<DropdownMenuForArrayProps> = ({
  dropdownLabel,
  selectedType,
  setSelectedType,
  items = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: string) => {
    setSelectedType(type === "All" ? null : (type as LeadFilters["leadType"]));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 cursor-pointer px-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
      >
        <span className="text-xs text-gray-500 font-medium">
          {dropdownLabel}:
        </span>
        <span className="font-medium">{selectedType || "All"}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
            {items.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
