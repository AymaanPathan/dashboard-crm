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

  const [, drop] = useDrop<DragItem>({
    accept: ITEM_TYPE,
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.id === leadData.id) return;

      onHover(index);
    },
  });

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
    dispatch(
      updateLeadAssigneeLocally({
        leadId: leadData.id,
        newAssigneeId: assignee.id,
      })
    );

    await dispatch(
      updateLeadAssignee({ leadId: leadData.id, newAssigneeId: assignee.id })
    );
    await dispatch(fetchLeadForKanban({}));

    setIsDropdownOpen(false);
  };

  const getOneLead = async (leadId: string) => {
    await dispatch(getOneLeadbyId(leadId));
    router.push(`/crm/lead/${leadId}`);
  };

  return (
    <div
      onClick={() => getOneLead(leadData.id)}
      ref={ref}
      className={`
        group cursor-pointer
        bg-white border border-gray-200 rounded-lg p-2
        hover:shadow-md hover:border-gray-300 
        transition-all duration-200
        ${isDragging ? "opacity-40 scale-95" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-xs truncate">
            {leadData.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {/* Assignee Dropdown */}
          {currentUser.role !== Role.sales_rep && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-0.5 px-1 py-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[9px] font-medium text-gray-600">
                  {leadData.assignedTo?.username ? (
                    getInitials(leadData.assignedTo.username)
                  ) : (
                    <User className="w-2.5 h-2.5" />
                  )}
                </div>
                <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-7 z-50 min-w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  {teamMembers.salesReps.map((assignee) => (
                    <button
                      key={assignee.id}
                      className="w-full px-2.5 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssigneeChange(assignee);
                      }}
                    >
                      <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[9px] font-medium text-gray-600">
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
            className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        {leadData.email && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 w-10">Email</span>
            <span className="text-[10px] text-gray-700 truncate flex-1">
              {leadData.email}
            </span>
          </div>
        )}

        {leadData.phone && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 w-10">Phone</span>
            <span className="text-[10px] text-gray-700">{leadData.phone}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
        </button>

        <div className="flex items-center gap-1">
          <div
            className={`w-1 h-1 rounded-full ${
              leadData.assignedTo?.username ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <span className="text-[10px] text-gray-500">
            {leadData.assignedTo?.username || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
};
