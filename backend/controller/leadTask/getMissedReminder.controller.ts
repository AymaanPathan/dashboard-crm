import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getMissedTaskReminders = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    showMessage: false,
    message: "Missed task reminders fetched successfully",
    data: [],
  };

  try {
    const userId = req?.user?.id;

    if (!userId) {
      response.statusCode = 401;
      response.message = "Unauthorized: User not found";
      return sendResponse(res, response);
    }

    const missedReminders = await prisma.task.findMany({
      where: {
        createdById: userId,
        reminderStatus: "pending",
        reminder: {
          lte: new Date(),
        },
      },
      orderBy: {
        reminder: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        reminder: true,
        reminderOption: true,
        reminderStatus: true,
        dueDate: true,
      },
    });

    console.log("Missed reminders:", missedReminders);
    response.data = missedReminders;
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("getMissedTaskReminders error:", error);
    response.statusCode = 500;
    response.message = "Something went wrong while fetching missed reminders";
    return sendResponse(res, response);
  }
};
