import prisma from "../utils/prisma";
import { Role } from "@prisma/client";
import { UserRole } from "./enums/role.enum";

export const getKanbanDataByRole = async (
  userId: string,
  role: Role,
  organizationId: string
) => {
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
