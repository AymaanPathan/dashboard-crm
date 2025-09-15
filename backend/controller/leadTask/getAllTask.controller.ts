import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getAllTask = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: true,
    message: "Tasks fetched successfully",
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

    const taskWhere: any = {
      lead: {
        is: {
          organizationId: organizationId,
        },
      },
    };

    if (userRole !== "admin") {
      taskWhere.createdById = userId;
    }

    const tasks = await prisma.task.findMany({
      where: taskWhere,
      orderBy: {
        dueDate: "asc",
      },
      include: {
        createdBy: { select: { id: true, username: true, email: true } },
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
    console.error("getAllTask error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while fetching tasks";
    return sendResponse(res, response);
  }
};
