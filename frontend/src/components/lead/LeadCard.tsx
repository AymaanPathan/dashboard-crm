/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDrag, useDrop } from "react-dnd";
import { ChevronDown, GripVertical, MoreHorizontal, User } from "lucide-react";
import { DragCollectedProps, DragItem, ITEM_TYPE } from "@/models/kanban.model";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import {
  fetchLeadForKanban,
  updateLeadAssignee,
  updateLeadAssigneeLocally,
} from "@/store/slices/kanbanSlice";
import { getUser } from "@/utils/auth.utils";
import { Role } from "@/enums/role.enum";
import { getOneLeadbyId } from "@/store/slices/leadSlice";
import { useRouter } from "next/navigation";

export const LeadCard: React.FC<{
  leadData: any;
  stageData: any;
  index: number;
  onHover: (index: number) => void;
}> = ({ leadData, stageData, index, onHover }) => {
  const router = useRouter();
  const currentUser = getUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const teamMembers = useSelector((state: RootState) => state.user.teamMembers);
  const dispatch: RootDispatch = useDispatch();

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

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAssigneeChange = async (assignee: any) => {
    const res = dispatch(
      updateLeadAssigneeLocally({
        leadId: leadData.id,
        newAssigneeId: assignee.id,
      })
    );

    await dispatch(
      updateLeadAssignee({ leadId: leadData.id, newAssigneeId: assignee.id })
    );
    await dispatch(fetchLeadForKanban());

    setIsDropdownOpen(false);
  };

  const getOneLead = async (leadId: string) => {
    await dispatch(getOneLeadbyId(leadId));
    router.push(`/leads/${leadId}`);
  };

  return (
    <div
      onClick={() => getOneLead(leadData.id)}
      ref={ref}
      className={`
      bg-white border border-gray-200 rounded-lg p-3
      hover:shadow-sm hover:border-gray-300 
      transition-all duration-150
      ${isDragging ? "opacity-50 shadow-lg scale-105" : ""}
    `}
    >
      {/* Header with assignee dropdown and drag handle */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {leadData.name}
          </h3>
          {leadData.company && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {leadData.company}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          {/* Assignee Dropdown */}
          {currentUser.role !== Role.sales_rep && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-1 p-1 hover:bg-gray-50 rounded-md transition-colors group"
              >
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {leadData.assignedTo?.username ? (
                    getInitials(leadData.assignedTo.username)
                  ) : (
                    <User className="w-2.5 h-2.5" />
                  )}
                </div>
                <ChevronDown className="w-2.5 h-2.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-7 z-50 min-w-[140px] bg-white border border-gray-200 rounded-md shadow-lg py-1">
                  {teamMembers.salesReps.map((assignee) => (
                    <button
                      key={assignee.id}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleAssigneeChange(assignee)}
                    >
                      <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {getInitials(assignee.username)}
                      </div>
                      <span className="truncate">{assignee.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Drag Handle */}
          <div
            className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-50 rounded transition-colors"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <GripVertical className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Content - More compact */}
      <div className="space-y-1.5">
        {leadData.email && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-xs font-medium text-gray-900 truncate ml-2 max-w-[120px]">
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

      {/* Footer - More compact */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <button className="p-0.5 hover:bg-gray-50 rounded transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
        </button>

        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-500">
            {leadData.assignedTo?.username || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
};
