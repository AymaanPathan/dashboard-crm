import prisma from "../../utils/prisma";
import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const getNotesByLeadId = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Notes fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { leadId } = req.body;

    if (!leadId) {
      response.statusCode = 400;
      response.message = "Lead ID is required";
      response.showMessage = true;
      return sendResponse(res, response);
    }

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      response.statusCode = 404;
      response.message = "Lead not found";
      response.showMessage = true;
      return sendResponse(res, response);
    }

    // Fetch notes for the lead
    const notes = await prisma.leadNotes.findMany({
      where: { leadId },
    });

    response.data = notes;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error fetching notes for lead:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = true;
    return sendResponse(res, response);
  }
};
