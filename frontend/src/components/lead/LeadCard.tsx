/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDrag, useDrop } from "react-dnd";
import {
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  User,
  Mail,
  Phone,
} from "lucide-react";
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
      className={`group relative bg-white border border-black/10 rounded-md p-2.5 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-black/20 hover:-translate-y-0.5 ${
        isDragging ? "opacity-40 shadow-2xl scale-105 border-black/30" : ""
      }`}
    >
      {/* Drag Handle - Top Right */}
      <div
        className="absolute -top-1 -right-1 p-1.5 bg-white border border-gray-200 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="text-[12.5px] font-semibold text-black leading-snug flex-1">
          {leadData.name}
        </h3>

        {/* Assignee Dropdown */}
        {currentUser.role !== Role.sales_rep && (
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-black/5 rounded-md transition-all duration-150 group/btn"
            >
              <div className="w-4 h-4 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                {leadData.assignedTo?.username ? (
                  getInitials(leadData.assignedTo.username)
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-black/40 group-hover/btn:text-black/70 transition-colors" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-9 z-50 min-w-[180px] bg-white border border-black/10 rounded-lg shadow-2xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-[11px] font-bold text-black/50 uppercase tracking-wider">
                  Assign to
                </div>
                {teamMembers.salesReps.map((assignee) => (
                  <button
                    key={assignee.id}
                    className="w-full px-3 py-2 text-left text-[13px] text-black hover:bg-black/5 flex items-center gap-2.5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssigneeChange(assignee);
                    }}
                  >
                    <div className="w-6 h-6 bg-black/90 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {getInitials(assignee.username)}
                    </div>
                    <span className="truncate font-medium">
                      {assignee.username}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content - Compact Info */}
      <div className="space-y-1.5 mb-2">
        {leadData.email && (
          <div className="flex items-center gap-2 text-[12px]">
            <Mail className="w-3.5 h-3.5 text-black/30 flex-shrink-0" />
            <span className="text-black/60 truncate">{leadData.email}</span>
          </div>
        )}

        {leadData.phone && (
          <div className="flex items-center gap-2 text-[12px]">
            <Phone className="w-3.5 h-3.5 text-black/30 flex-shrink-0" />
            <span className="text-black/60">{leadData.phone}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-black/5">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              leadData.assignedTo?.username ? "bg-black/90" : "bg-black/20"
            }`}
          />
          <span className="text-[11px] text-black/50 font-medium">
            {leadData.assignedTo?.username || "Unassigned"}
          </span>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 hover:bg-black/5 rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-black/30" />
        </button>
      </div>
    </div>
  );
};
