import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const updateLeadDragDropPosition = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead position updated successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { leadId, oldStage, newStage, oldPosition, newPosition } = req.body;

    if (
      !leadId ||
      oldStage == null ||
      newStage == null ||
      oldPosition == null ||
      newPosition == null
    ) {
      response.statusCode = 400;
      response.message = "Missing required fields";
      return sendResponse(res, response);
    }

    const currentLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!currentLead) {
      response.statusCode = 404;
      response.message = "Lead not found";
      return sendResponse(res, response);
    }

    const orgId = currentLead.organizationId;

    if (oldStage === newStage) {
      // Reorder in same column
      const leads = await prisma.lead.findMany({
        where: { organizationId: orgId, stage: oldStage },
        orderBy: { position: "asc" },
      });

      const updated = leads.filter((l) => l.id !== leadId);
      updated.splice(newPosition, 0, currentLead);

      await prisma.$transaction(
        updated.map((lead, i) =>
          prisma.lead.update({
            where: { id: lead.id },
            data: { position: i },
          })
        )
      );
    } else {
      // Move to different column
      const oldLeads = await prisma.lead.findMany({
        where: {
          organizationId: orgId,
          stage: oldStage,
          id: { not: leadId },
        },
        orderBy: { position: "asc" },
      });

      const newLeads = await prisma.lead.findMany({
        where: { organizationId: orgId, stage: newStage },
        orderBy: { position: "asc" },
      });

      const updatedNewLeads = [...newLeads];
      updatedNewLeads.splice(newPosition, 0, {
        ...currentLead,
        stageId: newStage,
      });

      await prisma.$transaction([
        ...oldLeads.map((lead, i) =>
          prisma.lead.update({
            where: { id: lead.id },
            data: { position: i },
          })
        ),
        ...updatedNewLeads.map((lead, i) =>
          prisma.lead.update({
            where: { id: lead.id },
            data: {
              position: i,
              ...(lead.id === leadId ? { stageId: newStage } : {}),
            },
          })
        ),
      ]);
    }

    return sendResponse(res, response);
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.message = "Server error";
    response.data = err;
    response.showMessage = false;
    return sendResponse(res, response);
  }
};
