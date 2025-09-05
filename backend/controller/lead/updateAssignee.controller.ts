import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const updateAssignee = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "",
    data: null,
    showMessage: false,
  };
  try {
    const { leadId, newAssigneeId } = req.body;

    if (!leadId || !newAssigneeId) {
      response.statusCode = 400;
      response.message = "leadId and newAssigneeId are required";
      return sendResponse(res, response);
    }
    const findLeadAndUpdate = await prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId: newAssigneeId },
    });
    response.data = findLeadAndUpdate;

    return sendResponse(res, response);
  } catch (error) {
    response.statusCode = 500;
    response.message = "Internal Server Error";
    return sendResponse(res, response);
  }
};
