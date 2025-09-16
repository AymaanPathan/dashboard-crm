import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getTodayLeadTasks = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Today's tasks fetched successfully",
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

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Build base where clause
    const taskWhere: any = {
      dueDate: {
        gte: todayStart,
        lte: todayEnd,
      },
      lead: {
        is: {
          organizationId: organizationId,
        },
      },
      status: { not: "completed" },
    };

    // Only non-admins should be restricted to assigned leads
    if (userRole !== "admin") {
      taskWhere.lead.assignedToId = userId;
    }

    // Fetch tasks
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
    console.error("getTodayLeadTasks error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while fetching today's tasks";
    return sendResponse(res, response);
  }
};
