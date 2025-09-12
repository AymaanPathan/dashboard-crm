import { Job, Queue, QueueEvents } from "bullmq";
import { connection } from "../utils/redisBullMq.utils";
export const TaskReminderqueueName = "task-reminder";
export const taskReminderQueue = new Queue(TaskReminderqueueName, {
  connection,
});

const taskReminderQueueEvents = new QueueEvents(TaskReminderqueueName, {
  connection,
});

taskReminderQueueEvents.on("waiting", ({ jobId }) => {
  console.log(`Job ${jobId} is waiting in the queue`);
});

taskReminderQueueEvents.on("active", ({ jobId }) => {
  console.log(`Job ${jobId} is now active`);
});

taskReminderQueueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${jobId} completed successfully`);
});

taskReminderQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed:`, failedReason);
});
