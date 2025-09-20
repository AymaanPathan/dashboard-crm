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
  dropdownLabel?: any;
  selectedType: any | null;
  setSelectedType: (type: any | null) => void;
  items?: any[];
}

export const DropdownMenuForArrayOfObjects: React.FC<
  DropdownMenuShortcutProps
> = ({ dropdownLabel, selectedType, setSelectedType, items }) => {
  const handleSelect = (type: any) => {
    setSelectedType(type);
  };
  return (
    <div className="flex  items-center justify-between space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {dropdownLabel} {selectedType?.name ?? "All"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem key={0} onClick={() => handleSelect(null)}>
            All
          </DropdownMenuItem>
          {items?.map((type) => (
            <DropdownMenuItem key={type.id} onClick={() => handleSelect(type)}>
              {type.name || type.username}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
