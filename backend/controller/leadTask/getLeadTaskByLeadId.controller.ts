import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getLeadTasksByLeadId = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Lead tasks fetched successfully",
    data: [],
  };

  try {
    const leadId: string = req.body.leadId;
    const organizationId: string = req?.user?.currentOrganizationId;

    if (!leadId) {
      response.statusCode = 400;
      response.message = "Missing required parameter: leadId";
      return sendResponse(res, response);
    }

    // Ensure lead belongs to current organization
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId,
      },
    });

    if (!lead) {
      response.statusCode = 404;
      response.message =
        "Lead not found or doesn't belong to this organization";
      return sendResponse(res, response);
    }

    // Fetch tasks for the lead
    const tasks = await prisma.task.findMany({
      where: { leadId },
      orderBy: { dueDate: "asc" },
    });

    response.data = tasks;
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("getLeadTasksByLeadId error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while fetching lead tasks";
    return sendResponse(res, response);
  }
};
