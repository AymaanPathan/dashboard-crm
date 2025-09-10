import { Worker, Job } from "bullmq";
import { TaskReminderqueueName } from "../queues/taskReminderQueue";
import { connection } from "../utils/redisBullMq.utils";
export const setLeadTaskReminderWorker = new Worker(
  TaskReminderqueueName,
  async (job: Job) => {
    const { taskId, userId, title, description } = job.data;

    console.log(
      "🔔 Reminder: Task",
      taskId,
      "for User",
      userId,
      "->",
      title,
      ":",
      description
    );
  },
  {
    connection: connection,
  }
);
