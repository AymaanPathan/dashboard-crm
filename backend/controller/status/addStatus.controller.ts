import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const addStatus = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Status added successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { organizationId, name } = req.body;

    // Validation
    if (!organizationId || !name || !name.trim()) {
      response.statusCode = 400;
      response.message = "organizationId and status name are required";
      return sendResponse(res, response);
    }

    // Check if org exists
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      response.statusCode = 404;
      response.message = "Organization not found";
      return sendResponse(res, response);
    }

    // Create new status
    const newStatus = await prisma.status.create({
      data: {
        name: name.trim(),
        leadIds: [],
        organizationId,
      },
    });

    response.data = newStatus;
    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = error.message || "Internal server error";
    return sendResponse(res, response);
  }
};
