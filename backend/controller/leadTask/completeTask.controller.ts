import { Request, Response } from "express";
import { ResponseModel } from "../../utils/response.utils";
import { sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";
import { io } from "../../utils/socket";

export const completeTask = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Task completed successfully",
    data: null,
    showMessage: false,
  };
  try {
    const { taskId, status } = req.body;
    const organizationId = req?.user?.currentOrganizationId;

    if (!taskId) {
      response.statusCode = 400;
      response.message = "Task ID is required";
      return sendResponse(res, response);
    }
    if (!status) {
      response.statusCode = 400;
      response.message = "Status is required";
      return sendResponse(res, response);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    response.data = updatedTask;

    io.to(`org_${organizationId}_admins`).emit("task:updated", {
      taskId: updatedTask.id,
    });
    return sendResponse(res, response);
  } catch (error) {
    response.statusCode = 500;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};
