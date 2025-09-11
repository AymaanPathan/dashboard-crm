// backend/workers/setLeadTaskReminderWorker.ts
import { Worker, Job } from "bullmq";
import { TaskReminderqueueName } from "../queues/taskReminderQueue";
import { connection } from "../utils/redisBullMq.utils";
import { getIO } from "../utils/socket";

export const setLeadTaskReminderWorker = new Worker(
  TaskReminderqueueName,
  async (job: Job) => {
    const { taskId, userId, title, description } = job.data;

    try {
      const io = getIO();
      const socket = io.emit("taskReminder", {
        taskId,
        title,
        description,
        message: `🔔 Reminder for task: ${title}`,
      });
      console.log(`✅ Reminder sent for task ${taskId} to user ${userId}`);
      console.log('Emitted socket event:', socket);
    } catch (err: any) {
      console.error("❌ Socket.io not initialized:", err.message);
    }
  },
  {
    connection,
  }
);
