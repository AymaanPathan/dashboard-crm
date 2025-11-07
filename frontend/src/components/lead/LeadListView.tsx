/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronDown, MoreHorizontal, User, Mail, Phone } from "lucide-react";
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
import { ReusableListPage } from "../reuseable/Lists/ReusableList";

export const KanbanListView: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<RootDispatch>();
  const kanbanData = useSelector((state: RootState) => state.kanban.kanbanData);
  const teamMembers = useSelector((state: RootState) => state.user.teamMembers);
  const currentUser = getUser();

  const [openAssigneeId, setOpenAssigneeId] = useState<string | null>(null);
  const [openStageId, setOpenStageId] = useState<string | null>(null);

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

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  const handleAssigneeChange = async (leadId: string, assignee: any) => {
    dispatch(
      updateLeadAssigneeLocally({
        leadId,
        newAssigneeId: assignee.id,
      })
    );
    await dispatch(updateLeadAssignee({ leadId, newAssigneeId: assignee.id }));
    await dispatch(fetchLeadForKanban({}));
    setOpenAssigneeId(null);
  };

  const handleStageChange = async (lead: any, newStage: any) => {
    if (newStage.stageId === lead.stageData.stageId) return;
    dispatch(
      moveLeadBetweenStatuses({
        leadId: lead.id,
        oldStageId: lead.stageData.stageId,
        newStageId: newStage.stageId,
        oldPosition: 0,
        newPosition: 0,
      })
    );

    await dispatch(
      updateLeadStatus({
        leadId: lead.id,
        oldStage: lead.stageData.stageId,
        newStage: newStage.stageId,
        oldPosition: 0,
        newPosition: 0,
      })
    );
    setOpenStageId(null);
  };

  const getOneLead = async (leadId: string) => {
    await dispatch(getOneLeadbyId(leadId));
    router.push(`/crm/lead/${leadId}`);
  };

  const headers = [
    { label: "Lead Name", key: "name", colSpan: 3 },
    { label: "Email", key: "email", colSpan: 3 },
    { label: "Phone", key: "phone", colSpan: 2 },
    { label: "Stage", key: "stage", colSpan: 2 },
    { label: "Assignee", key: "assignee", colSpan: 1 },
  ];

  return (
    <ReusableListPage
      data={allLeads}
      headers={headers}
      renderRow={(lead: any) => (
        <>
          {/* Lead Name */}
          <div
            className="col-span-3 cursor-pointer"
            onClick={() => getOneLead(lead.id)}
          >
            <span className="text-sm font-medium text-gray-900 truncate">
              {lead.name}
            </span>
          </div>

          {/* Email */}
          <div className="col-span-3 flex items-center gap-2 text-sm text-gray-700">
            {lead.email ? (
              <>
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{lead.email}</span>
              </>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>

          {/* Phone */}
          <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
            {lead.phone ? (
              <>
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{lead.phone}</span>
              </>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>

          {/* Stage Dropdown */}
          <div className="col-span-2 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenStageId(openStageId === lead.id ? null : lead.id);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
            >
              <span>{lead.stageData.stageName}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {openStageId === lead.id && (
              <div className="absolute left-0 top-9 z-50 min-w-[140px] bg-white border border-gray-200 rounded shadow-lg py-1">
                {kanbanData.map((stage: any) => (
                  <button
                    key={stage.stageId}
                    className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                      stage.stageId === lead.stageData.stageId
                        ? "text-gray-900 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStageChange(lead, stage);
                    }}
                  >
                    {stage.stageName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assignee */}
          <div className="col-span-1 relative">
            {currentUser.role !== Role.sales_rep ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenAssigneeId(
                      openAssigneeId === lead.id ? null : lead.id
                    );
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                    {lead.assignedTo?.username ? (
                      getInitials(lead.assignedTo.username)
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">
                    {lead.assignedTo?.username.length > 10
                      ? `${lead.assignedTo.username.slice(0, 10)}...`
                      : lead.assignedTo?.username || "Unassigned"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {openAssigneeId === lead.id && (
                  <div className="absolute right-0 top-9 z-50 min-w-[180px] bg-white border border-gray-200 rounded shadow-lg py-1">
                    {teamMembers.salesReps.map((assignee: any) => (
                      <button
                        key={assignee.id}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssigneeChange(lead.id, assignee);
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                  {lead.assignedTo?.username ? (
                    getInitials(lead.assignedTo.username)
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-sm text-gray-700">
                  {lead.assignedTo?.username || "Unassigned"}
                </span>
              </div>
            )}
          </div>
        </>
      )}
      renderOptions={() => (
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      )}
      emptyState={{
        title: "No Leads Found",
        description:
          "You don’t have any leads yet. Add a new lead to get started.",
        actionText: "Add Lead",
      }}
    />
  );
};
