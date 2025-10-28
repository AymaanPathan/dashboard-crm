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
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import {
  fetchLeadForKanban,
  updateLeadAssignee,
  updateLeadAssigneeLocally,
  moveLeadBetweenStatuses,
  updateLeadStatus,
} from "@/store/slices/kanbanSlice";
import { getUser } from "@/utils/auth.utils";
import { Role } from "@/enums/role.enum";
import { getOneLeadbyId } from "@/store/slices/leadSlice";
import { useRouter } from "next/navigation";

interface LeadRowProps {
  leadData: any;
  stageData: any;
  index: number;
  onHover: (leadId: string, index: number) => void;
  allStages: any[];
}

const LeadRow: React.FC<LeadRowProps> = ({
  leadData,
  stageData,
  index,
  onHover,
  allStages,
}) => {
  const router = useRouter();
  const currentUser = getUser();
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
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
      onHover(leadData.id, index);
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

    setIsAssigneeDropdownOpen(false);
  };

  const handleStageChange = async (newStage: any) => {
    if (newStage.stageId === stageData.stageId) {
      setIsStageDropdownOpen(false);
      return;
    }

    dispatch(
      moveLeadBetweenStatuses({
        leadId: leadData.id,
        oldStageId: stageData.stageId,
        newStageId: newStage.stageId,
        oldPosition: index,
        newPosition: 0,
      })
    );

    await dispatch(
      updateLeadStatus({
        leadId: leadData.id,
        oldStage: stageData.stageId,
        newStage: newStage.stageId,
        oldPosition: index,
        newPosition: 0,
      })
    );

    setIsStageDropdownOpen(false);
  };

  const getOneLead = async (leadId: string) => {
    await dispatch(getOneLeadbyId(leadId));
    router.push(`/crm/lead/${leadId}`);
  };

  return (
    <tr
      ref={ref}
      onClick={() => getOneLead(leadData.id)}
      className={`
        group cursor-pointer hover:bg-gray-50/50 border-b border-gray-100
        transition-colors duration-150
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      {/* Drag Handle */}
      <td className="px-4 py-3 w-8">
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </td>

      {/* Lead Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">
            {leadData.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3">
        {leadData.email ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{leadData.email}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Phone */}
      <td className="px-4 py-3">
        {leadData.phone ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{leadData.phone}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Stage */}
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStageDropdownOpen(!isStageDropdownOpen);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
          >
            <span>{stageData.stageName}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {isStageDropdownOpen && (
            <div className="absolute left-0 top-10 z-50 min-w-[140px] bg-white border border-gray-200 rounded shadow-lg py-1">
              {allStages.map((stage) => (
                <button
                  key={stage.stageId}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                    stage.stageId === stageData.stageId
                      ? "text-gray-900 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStageChange(stage);
                  }}
                >
                  {stage.stageName}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Assignee */}
      <td className="px-4 py-3">
        {currentUser.role !== Role.sales_rep ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                {leadData.assignedTo?.username ? (
                  getInitials(leadData.assignedTo.username)
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-sm text-gray-700">
                {leadData.assignedTo?.username || "Unassigned"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isAssigneeDropdownOpen && (
              <div className="absolute right-0 top-10 z-50 min-w-[180px] bg-white border border-gray-200 rounded shadow-lg py-1">
                {teamMembers.salesReps.map((assignee) => (
                  <button
                    key={assignee.id}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssigneeChange(assignee);
                    }}
                  >
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                      {getInitials(assignee.username)}
                    </div>
                    <span className="truncate">{assignee.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
              {leadData.assignedTo?.username ? (
                getInitials(leadData.assignedTo.username)
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-sm text-gray-700">
              {leadData.assignedTo?.username || "Unassigned"}
            </span>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 w-12">
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </td>
    </tr>
  );
};

export const KanbanListView: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const kanbanData = useSelector((state: RootState) => state.kanban.kanbanData);
  const leads = useSelector((state: RootState) => state.kanban.leads);
  const [hoveredLead, setHoveredLead] = useState<{
    leadId: string;
    index: number;
  } | null>(null);

  // Flatten all leads from all stages
  const allLeads =
    kanbanData?.flatMap(
      (stage: any) =>
        stage.leads?.map((lead: any) => ({
          ...lead,
          stageData: {
            stageName: stage.stageName,
            stageId: stage.stageId,
            leads: stage.leads,
          },
        })) || []
    ) || [];

  const handleHover = useCallback((leadId: string, index: number) => {
    setHoveredLead({ leadId, index });
  }, []);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (!hoveredLead) return;

      const draggedLead = allLeads.find((l: any) => l.id === item.id);
      const targetLead = allLeads.find((l: any) => l.id === hoveredLead.leadId);

      if (!draggedLead || !targetLead) return;

      dispatch(
        moveLeadBetweenStatuses({
          leadId: item.id,
          oldStageId: item.stageId,
          newStageId: targetLead.stageData.stageId,
          oldPosition: item.index,
          newPosition: hoveredLead.index,
        })
      );

      dispatch(
        updateLeadStatus({
          leadId: item.id,
          oldStage: item.stageId,
          newStage: targetLead.stageData.stageId,
          oldPosition: item.index,
          newPosition: hoveredLead.index,
        })
      );

      setHoveredLead(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  if (!kanbanData || kanbanData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No leads available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table ref={drop as any} className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {allLeads.map((lead: any, index: number) => (
              <LeadRow
                key={lead.id}
                leadData={lead}
                stageData={lead.stageData}
                index={index}
                onHover={handleHover}
                allStages={kanbanData}
              />
            ))}
          </tbody>
        </table>
      </div>

      {allLeads.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-400">
          No leads found
        </div>
      )}
    </div>
  );
};
