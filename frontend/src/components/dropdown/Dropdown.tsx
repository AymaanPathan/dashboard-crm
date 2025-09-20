import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LeadFilters } from "@/models/lead.model";

const leadTypes = ["All", "Hot", "Cold", "Warm"];

interface DropdownMenuShortcutProps {
  selectedType: LeadFilters["leadType"] | null;
  setSelectedType: (type: LeadFilters["leadType"] | null) => void;
}

export const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({
  selectedType,
  setSelectedType,
}) => {
  const handleSelect = (type: string) => {
    setSelectedType(type as LeadFilters["leadType"]);
  };
  return (
    <div className="flex  items-center justify-between space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filter: {selectedType || "All"}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {leadTypes.map((type) => (
            <DropdownMenuItem key={type} onClick={() => handleSelect(type)}>
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
