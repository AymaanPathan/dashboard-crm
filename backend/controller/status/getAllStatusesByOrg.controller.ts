import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const getAllStatuses = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Statuses fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      response.statusCode = 400;
      response.message = "organizationId is required";
      return sendResponse(res, response);
    }

    // Get all statuses for the org, including leadIds
    const statuses = await prisma.status.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    response.data = statuses;
    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = error.message || "Internal server error";
    return sendResponse(res, response);
  }
};
