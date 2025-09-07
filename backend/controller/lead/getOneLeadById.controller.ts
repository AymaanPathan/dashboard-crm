import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

const getOneLeadById = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { id } = req.params; // Lead ID from URL

    if (!id?.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead ID is required",
      });
    }

    // Fetch lead with relations
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        organization: {
          select: { id: true, organization_name: true },
        },
        assignedTo: {
          select: { id: true, username: true, email: true },
        },
        stage: {
          select: { id: true, name: true },
        },
      },
    });

    if (!lead) {
      return sendResponse(res, {
        ...response,
        statusCode: 404,
        message: "Lead not found",
      });
    }

    response.data = lead;
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error fetching lead:", error);
    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};

export default getOneLeadById;
        