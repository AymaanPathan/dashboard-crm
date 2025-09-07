import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const addLeadTask = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Task Added Successfully",
    data: [],
  };

  try {
    const taskData = req.body.taskData;
    const leadId: string = req.body.leadId;
    const userId: string = req?.user?.id;
    const organizationId: string = req?.user?.currentOrganizationId;

    if (!leadId || !taskData?.title || !taskData?.dueDate) {
      response.statusCode = 400;
      response.message = "Missing required fields: leadId, title or dueDate";
      return sendResponse(res, response);
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId: organizationId,
      },
    });

    if (!lead) {
      response.statusCode = 404;
      response.message =
        "Lead not found or doesn't belong to this organization";
      return sendResponse(res, response);
    }

    const createdTask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate),
        reminder: taskData.reminder ? new Date(taskData.reminder) : undefined,
        status: taskData.status || "pending",
        repeatInterval: taskData.repeatInterval || "none",
        leadId: leadId,
        createdById: userId,
      },
    });

    response.data = [createdTask];
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("addLeadTask error:", error);
    response.message = "Something went wrong while adding the task";
    response.statusCode = 500;
    return sendResponse(res, response);
  }
};
