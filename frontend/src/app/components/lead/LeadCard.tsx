/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDrag } from "react-dnd";

import { MoreHorizontal } from "lucide-react";
import { DragCollectedProps, DragItem, ITEM_TYPE } from "@/models/kanban.model";

export const LeadCard: React.FC<{ leadId: string; statusName: string }> = ({
  leadId,
  statusName,
}) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, DragCollectedProps>({
    type: ITEM_TYPE,
    item: { id: leadId, statusName, type: ITEM_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
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
