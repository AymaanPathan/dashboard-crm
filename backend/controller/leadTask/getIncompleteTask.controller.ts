import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getIncompleteTasks = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Incomplete tasks fetched successfully",
    data: {},
  };

  try {
    const organizationId: string = req?.user?.currentOrganizationId;
    const userId: string = req?.user?.id;
    const userRole: string = req?.user?.role;

    if (!organizationId || !userId || !userRole) {
      response.statusCode = 401;
      response.message = "Unauthorized: missing required user context";
      return sendResponse(res, response);
    }

    // Get start of today for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Base query: due before today AND still pending
    const taskWhere: any = {
      dueDate: {
        lt: today,
      },
      status: "pending",
      lead: {
        is: {
          organizationId: organizationId,
        },
      },
    };

    // For non-admins, only include their created tasks
    if (userRole !== "admin") {
      taskWhere.createdById = userId;
    }

    const tasks = await prisma.task.findMany({
      where: taskWhere,
      orderBy: {
        dueDate: "asc",
      },
      include: {
        lead: {
          select: {
            name: true,
            company: true,
            assignedToId: true,
          },
        },
      },
    });

    response.data = {
      count: tasks.length,
      tasks,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("getIncompleteTasks error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while fetching incomplete tasks";
    return sendResponse(res, response);
  }
};
