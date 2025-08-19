import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis("redis://localhost:6379");

const queueName = "delete-unverified-users";

const queue = new Queue(queueName, {
  connection,
});

export default queue