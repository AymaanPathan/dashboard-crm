import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const updateTaskReminderStatus = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Reminder status updated successfully",
    data: [],
  };

  try {
    const { taskId, status } = req.body;
    const userId = req?.user?.id;

    if (!taskId || !status) {
      response.statusCode = 400;
      response.message = "Missing taskId or status";
      return sendResponse(res, response);
    }

    if (!["pending", "completed", "missed", "seen"].includes(status)) {
      response.statusCode = 400;
      response.message = "Invalid status value";
      return sendResponse(res, response);
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        createdById: userId,
      },
    });

    if (!task) {
      response.statusCode = 404;
      response.message = "Task not found or access denied";
      return sendResponse(res, response);
    }

    // Base update data
    const updateData: any = {
      reminderStatus: status,
    };

    if (status === "completed") {
      updateData.status = "completed"; 
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    response.data = updatedTask;
    response.message =
      status === "completed"
        ? "Task marked as completed successfully"
        : "Reminder status updated successfully";

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("updateReminderStatus error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while updating reminder status";
    return sendResponse(res, response);
  }
};
