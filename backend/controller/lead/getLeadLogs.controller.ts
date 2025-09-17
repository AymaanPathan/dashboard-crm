import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const getLeadLogsByLeadId = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead logs fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { leadId } = req.body;

    if (!leadId?.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead ID is required",
      });
    }

    const logs = await prisma.leadLog.findMany({
      where: { leadId },
      orderBy: { timestamp: "desc" },
    });

    response.data = logs;
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error fetching lead logs:", error);
    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};
