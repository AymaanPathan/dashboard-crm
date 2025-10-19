import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { taskReminderQueue } from "../../queues/taskReminderQueue";
import { io } from "../../utils/socket";

dayjs.extend(utc);
dayjs.extend(timezone);

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

    if (!leadId || !taskData?.title) {
      response.statusCode = 400;
      response.message = "Missing required fields: leadId, title";
      return sendResponse(res, response);
    }

    if (!taskData.dueDate || !taskData.timezone) {
      response.statusCode = 400;
      response.message = "Missing required fields: dueDate or user timezone";
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

    // Parse dueDate in user's timezone
    const dueDate = dayjs.tz(taskData.dueDate, taskData.timezone);

    // Calculate reminder based on option
    const reminder = taskData.reminder;
    // switch (taskData.reminderOption) {
    //   case "1_minute":
    //     reminder = dueDate.subtract(1, "minute");
    //     break;
    //   case "5_minutes":
    //     reminder = dueDate.subtract(5, "minute");
    //     break;
    //   case "15_minutes":
    //     reminder = dueDate.subtract(15, "minute");
    //     break;
    //   case "1_hour":
    //     reminder = dueDate.subtract(1, "hour");
    //     break;
    //   case "custom":
    //     if (taskData.reminderDate) {
    //       reminder = dayjs.tz(taskData.reminderDate, taskData.timezone);
    //     }
    //     break;
    //   case "no_reminder":
    //   default:
    //     reminder = undefined;
    //     break;
    // }

    const createdTask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate),
        reminder: taskData.reminder ? new Date(taskData.reminder) : null,
        reminderOption: taskData.reminderOption || "no_reminder",
        status: taskData.status || "pending",
        repeatInterval: taskData.repeatInterval || "none",
        leadId: leadId,
        createdById: userId,
      },
    });

    if (reminder) {
      const delay = reminder
        ? dayjs(reminder).utc().valueOf() - dayjs.utc().valueOf()
        : 0;
      if (delay > 0) {
        await taskReminderQueue.add(
          "sendTaskReminder",
          {
            taskId: createdTask.id,
            userId,
            title: createdTask.title,
            description: createdTask.description,
          },
          { delay, attempts: 3, removeOnComplete: true }
        );
      }
    }

    if (reminder) {
      const delay = dayjs(reminder).utc().valueOf() - dayjs.utc().valueOf();
      console.log("Scheduling reminder with delay (ms):", delay);

      await taskReminderQueue.add(
        "sendTaskReminder",
        {
          taskId: createdTask.id,
          userId: userId,
          title: createdTask.title,
          description: createdTask.description,
        },
        {
          delay: delay,
          attempts: 3,
          removeOnComplete: true,
        }
      );
    }

    response.data = [createdTask];

    io.to(`org_${organizationId}_admins`).emit("task:updated", {
      taskId: createdTask.id,
    });
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("addLeadTask error:", error);
    response.message = "Something went wrong while adding the task";
    response.statusCode = 500;
    return sendResponse(res, response);
  }
};
