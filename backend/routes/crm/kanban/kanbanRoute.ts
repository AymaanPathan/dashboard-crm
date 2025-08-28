import express from "express";
import * as kanBanController from "../../../controller/kanban/index";
import { authenticate } from "../../../middleware/authenticate";
const authRouter = express.Router();

authRouter.get(
  "/getkanban",
  authenticate,
  kanBanController.getLeadWithStageKanban
);

export default authRouter;
