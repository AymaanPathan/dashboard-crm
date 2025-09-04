/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDrag, useDrop } from "react-dnd";
import { ChevronDown, MoreHorizontal, User } from "lucide-react";
import { DragCollectedProps, DragItem, ITEM_TYPE } from "@/models/kanban.model";
import { useState } from "react";
import { ILead } from "@/models/lead.model";

const mockAssignees = [
  { id: "1", username: "john.doe", name: "John Doe" },
  { id: "2", username: "jane.smith", name: "Jane Smith" },
  { id: "3", username: "mike.johnson", name: "Mike Johnson" },
  { id: "4", username: "sarah.wilson", name: "Sarah Wilson" },
];

export const LeadCard: React.FC<{
  leadData: any;
  stageData: any;
  index: number;
  onHover: (index: number) => void;
}> = ({ leadData, stageData, index, onHover }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(leadData.assignedTo);

  const [{ isDragging }, drag] = useDrag<DragItem, void, DragCollectedProps>({
    type: ITEM_TYPE,
    item: () => ({
      id: leadData.id,
      stageName: stageData.stageName,
      stageId: stageData.stageId,
      index,
      type: ITEM_TYPE,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop logic to detect hover
  const [, drop] = useDrop<DragItem>({
    accept: ITEM_TYPE,
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.id === leadData.id) return;

      onHover(index);
    },
  });

  // Combine drag and drop refs
  const ref = (node: any) => {
    drag(node);
    drop(node);
  };

  const handleAssigneeSelect = (assignee: {
    id: string;
    username: string;
    name: string;
  }) => {
    setSelectedAssignee(assignee);
    setIsDropdownOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      ref={ref}
      className={`
        bg-white border border-gray-200 rounded-lg p-4 
        hover:shadow-sm hover:border-gray-300 
        transition-all duration-150 cursor-grab 
        ${isDragging ? "opacity-50 shadow-lg scale-105" : ""}
      `}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Header with assignee dropdown */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {leadData.name}
          </h3>
          {leadData.company && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {leadData.company}
            </p>
          )}
        </div>

        {/* Assignee Dropdown */}
        <div className="relative ml-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center gap-1 p-1.5 hover:bg-gray-50 rounded-md transition-colors group"
          >
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
              {selectedAssignee?.name ? (
                getInitials(selectedAssignee.name)
              ) : (
                <User className="w-3 h-3" />
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-8 z-50 min-w-[140px] bg-white border border-gray-200 rounded-md shadow-lg py-1">
              {mockAssignees.map((assignee) => (
                <button
                  key={assignee.id}
                  onClick={() => handleAssigneeSelect(assignee)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {getInitials(assignee.name)}
                  </div>
                  <span className="truncate">{assignee.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {leadData.email && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-xs font-medium text-gray-900">
              {leadData.email}
            </span>
          </div>
        )}

        {leadData.phone && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Phone</span>
            <span className="text-xs font-medium text-gray-900">
              {leadData.phone}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <button className="p-1 hover:bg-gray-50 rounded transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
        </button>

        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-500">
            {selectedAssignee?.username || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
};
