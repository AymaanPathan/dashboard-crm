import { Queue } from "bullmq";
import { connection } from "../utils/redisBullMq.utils";
export const TaskReminderqueueName = "task-reminder";
export const taskReminderQueue = new Queue(TaskReminderqueueName, { connection });
