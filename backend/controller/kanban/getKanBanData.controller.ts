import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getLeadWithStageKanban = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Leads fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const organizationId = req?.user?.currentOrganizationId;

    if (!organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization ID not found in user context",
      });
    }

    // Fetch all stages and their leads for this organization
    const stages = await prisma.stage.findMany({
      where: { organizationId },
      orderBy: { order: "asc" },
      include: {
        leads: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            name: true,
            position: true,
            stageId: true,
          },
        },
      },
    });

    const stageWithLeads = stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      leads: stage.leads,
    }));

    response.data = stageWithLeads;
    return sendResponse(res, response);
  } catch (err) {
    console.error("Error in getLeadWithStageKanban:", err);

    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: "Internal server error",
      data: err,
      showMessage: false,
    });
  }
};
