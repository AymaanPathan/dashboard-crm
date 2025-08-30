/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDrag, useDrop } from "react-dnd";
import { MoreHorizontal } from "lucide-react";
import { DragCollectedProps, DragItem, ITEM_TYPE } from "@/models/kanban.model";

export const LeadCard: React.FC<{
  leadData: any;
  stageData: any;
  index: number;
  onHover: (index: number) => void;
}> = ({ leadData, stageData, index, onHover }) => {
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

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200/60 rounded-lg p-4 hover:shadow-md hover:border-gray-300/80 transition-all duration-200 cursor-grab group ${
        isDragging ? "opacity-60 shadow-lg rotate-2" : ""
      }`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-gray-900 mb-1 text-sm">
          {leadData.name}
        </h4>
      </div>
    </div>
  );
};
