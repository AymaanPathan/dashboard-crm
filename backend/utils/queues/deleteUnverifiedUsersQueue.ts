// ### JOB ###
// Step 1 whenever users registered add a users data on queue
// Step 2 create a worker to process the queue
// Step 3 process the job and delete the user from the database if its not verified

import { Queue } from "bullmq";
import { connection } from "../redisBullMq.utils";

export const queueName = "delete-unverified-users";

const deleteUnverifiedUsersQueue = new Queue(queueName, {
  connection,
});

export default deleteUnverifiedUsersQueue;
