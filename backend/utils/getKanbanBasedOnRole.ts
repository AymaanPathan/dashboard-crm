import prisma from "../utils/prisma";
import { Role } from "@prisma/client";
import { UserRole } from "./enums/role.enum";
import { LeadFilter } from "../models/lead.model";

export const getKanbanDataByRole = async (
  userId: string,
  role: Role,
  organizationId: string,
  leadFilterParams?: LeadFilter
) => {
  console.log("Lead Filter Params:", leadFilterParams);
  let leadFilter: any = {};

  if (role == UserRole.admin) {
    leadFilter = { organizationId };
  }

  if (role === UserRole.sales_rep) {
    leadFilter.assignedToId = userId;
  } else if (role === UserRole.sales_manager) {
    leadFilter.OR = [
      { assignedToId: userId },
      {
        assignedTo: {
          managerId: userId,
        },
      },
    ];
  } else if (role === UserRole.admin) {
    leadFilter = { organizationId };
  } else {
    return { stages: [], leads: [], kanbanData: [] };
  }

  if (leadFilterParams?.search) {
    const searchTerm = leadFilterParams.search.trim();
    const searchCondition = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { mobileNumber: { contains: searchTerm, mode: "insensitive" } },
      ],
    };
    if (leadFilter.OR) {
      leadFilter.AND = [searchCondition, { OR: leadFilter.OR }];
      delete leadFilter.OR;
    } else {
      leadFilter.AND = [searchCondition];
    }
  }
  if (leadFilterParams?.assignedToId) {
    leadFilter.assignedToId = leadFilterParams.assignedToId;
  }
  if (leadFilterParams?.stageId) {
    leadFilter.stageId = leadFilterParams.stageId;
  }
  if (leadFilterParams?.source) {
    leadFilter.source = leadFilterParams.source;
  }

  if (leadFilterParams?.leadType) {
    leadFilter.leadType = leadFilterParams.leadType;
  }

  console.log("Lead Filter Applied:", leadFilter);
  const stages = await prisma.stage.findMany({
    where: { organizationId },
    orderBy: { order: "asc" },
    include: {
      leads: {
        where: leadFilter,
        orderBy: { position: "asc" },
        include: {
          assignedTo: true,
        },
      },
    },
  });

  const kanbanData = stages.map((stage) => ({
    stageId: stage.id,
    stageName: stage.name,
    leads: stage.leads,
  }));

  return {
    stages: stages.map((s) => ({ id: s.id, name: s.name })),
    leads: kanbanData.flatMap((s) => s.leads),
    kanbanData,
  };
};
