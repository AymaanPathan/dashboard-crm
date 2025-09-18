import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const addLeadNote = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Note added successfully",
    data: null,
    showMessage: true,
  };
  try {
    const { leadId, note } = req.body;

    if (!leadId) {
      response.statusCode = 400;
      response.message = "Lead ID is required";
      response.showMessage = true;
      return sendResponse(res, response);
    }
    if (!note || !note.trim()) {
      response.statusCode = 400;
      response.message = "Note content is required";
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
    // Create the note
    const newNote = await prisma.leadNotes.create({
      data: {
        leadId,
        note,
        userId: req?.user?.id,
        userName: req?.user?.username,
      },
    });
    response.data = newNote;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error adding note to lead:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = true;
    return sendResponse(res, response);
  }
};
