/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDrag, useDrop } from "react-dnd";
import { MoreHorizontal } from "lucide-react";
import { DragCollectedProps, DragItem, ITEM_TYPE } from "@/models/kanban.model";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const LeadCard: React.FC<{
  leadId: string;
  statusName: string;
  index: number;
  onHover: (index: number) => void;
}> = ({ leadId, statusName, index, onHover }) => {

  const [{ isDragging }, drag] = useDrag<DragItem, void, DragCollectedProps>({
    type: ITEM_TYPE,
    item: () => ({
      id: leadId,
      statusName,
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
      if (draggedItem.id === leadId) return;

      onHover(index);
    },
  });

  // Combine drag and drop refs
  const ref = (node: any) => {
    drag(node);
    drop(node);
  };

  return (
    <div
      ref={ref}
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-gray-900 mb-1">Lead ID: {leadId}</h4>
        <div className="text-xs text-gray-500">Status: {statusName}</div>
      </div>
    </div>
  );
};
