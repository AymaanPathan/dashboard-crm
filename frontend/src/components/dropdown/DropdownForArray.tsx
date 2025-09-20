/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DropdownMenuShortcutProps {
  dropdownLabel?: string;
  selectedType: any | null;
  setSelectedType: (type: any | null) => void;
  items?: any[];
}

export const DropdownMenuForArray: React.FC<DropdownMenuShortcutProps> = ({
  dropdownLabel,
  selectedType,
  setSelectedType,
  items,
}) => {
  const handleSelect = (type: string) => {
    setSelectedType(type as any);
  };
  return (
    <div className="flex  items-center justify-between space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {dropdownLabel} {selectedType}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {items?.map((type) => (
            <DropdownMenuItem key={type} onClick={() => handleSelect(type)}>
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
