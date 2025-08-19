import { Worker, Job } from "bullmq";
import { queueName } from "../queues/deleteUnverifiedUsersQueue";
import prisma from "../prisma";
import { connection } from "../redisBullMq.utils";

export const worker = new Worker(
  queueName,
  async (job: Job) => {
    const { userId } = job.data;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user && !user.isVerified) {
        await prisma.user.delete({
          where: { id: userId },
        });
        console.log(`✅ Deleted unverified user: ${userId}`);
      } else {
        console.log(`❎ User is already verified or doesn't exist: ${userId}`);
      }
    } catch (error) {
      console.error("❌ Error in worker:", error);
      throw error;
    }
  },
  {
    connection, 
  }
);
