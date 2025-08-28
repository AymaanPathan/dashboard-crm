import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getLeadWithStage = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Leads fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const organizationId = req?.user?.currentOrganizationId;

    if (!organizationId) {
      response.statusCode = 400;
      response.message = "Organization ID not found ";
      return sendResponse(res, response);
    }

    // Get organization with stages
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        stages: true,
      },
    });

    if (!org) {
      response.statusCode = 404;
      response.message = "Organization not found";
      return sendResponse(res, response);
    }

    const parsedStages = Array.isArray(org.stages)
      ? org.stages
      : typeof org.stages === "string"
      ? JSON.parse(org.stages)
      : [];

    // Get all leads for this org
    const leads = await prisma.lead.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    // Group leads by status
    const stageWithLeads = parsedStages.map((stage: any) => {
      return {
        name: stage.name,
        leadIds: leads.filter((lead) => lead.status === stage.name),
      };
    });

    response.data = stageWithLeads;
    return sendResponse(res, response);
  } catch (err) {
    response.statusCode = 500;
    response.message = "Internal server error";
    response.data = err;
    response.showMessage = false;
    return sendResponse(res, response);
  }
};
