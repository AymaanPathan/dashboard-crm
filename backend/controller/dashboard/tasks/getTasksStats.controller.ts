import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../../utils/response.utils";
import prisma from "../../../utils/prisma";

export const getTaskStats = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Task statistics fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const organizationId = req?.user?.currentOrganizationId;

    if (!organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization ID is required",
      });
    }

    const now = new Date();

    // Define today's start and end
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // ---------------- All Tasks ----------------
    const totalTasks = await prisma.task.count({
      where: { lead: { organizationId } },
    });

    // ---------------- Pending Tasks ----------------
    const totalPendingTasks = await prisma.task.count({
      where: {
        status: "pending",
        lead: { organizationId },
      },
    });

    // ---------------- Today's Pending Tasks ----------------
    const todaysPendingTasks = await prisma.task.count({
      where: {
        status: "pending",
        lead: { organizationId },
        dueDate: { gte: todayStart, lte: todayEnd },
      },
    });

    // ---------------- Completed Tasks ----------------
    const totalCompletedTasks = await prisma.task.count({
      where: {
        status: "completed",
        lead: { organizationId },
      },
    });

    // ---------------- Today's Completed Tasks ----------------
    const todaysCompletedTasks = await prisma.task.count({
      where: {
        status: "completed",
        lead: { organizationId },
        completedAt: { gte: todayStart, lte: todayEnd },
      },
    });

    // ---------------- Overdue Tasks ----------------
    const overdueTasks = await prisma.task.count({
      where: {
        status: "pending",
        lead: { organizationId },
        dueDate: { lt: now },
      },
    });

    // ---------------- Today's Schedule ----------------
    const todaysSchedule = await prisma.task.findMany({
      where: {
        status: "pending",
        lead: { organizationId },
        dueDate: { gte: todayStart, lte: todayEnd },
      },
      include: {
        lead: {
          select: {
            name: true,
            id: true,
          },
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    response.data = {
      totalTasks,
      totalPendingTasks,
      todaysPendingTasks,
      totalCompletedTasks,
      todaysCompletedTasks,
      overdueTasks,
      todaysSchedule,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error fetching task stats:", error);
    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};
