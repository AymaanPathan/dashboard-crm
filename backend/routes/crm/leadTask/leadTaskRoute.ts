import express from "express";
import * as leadTaskController from "../../../controller/leadTask/index";
import { authenticate } from "../../../middleware/authenticate";

const leadTaskRouter = express.Router();

leadTaskRouter.post("/addTask", authenticate, leadTaskController.addLeadTask);
leadTaskRouter.post(
  "/getTasks",
  authenticate,
  leadTaskController.getLeadTasksByLeadId
);
leadTaskRouter.get(
  "/todayTasks",
  authenticate,
  leadTaskController.getTodayLeadTasks
);
export default leadTaskRouter;
