import express from "express";
import * as leadController from "../../../controller/lead/index";
import { authenticate } from "../../../middleware/authenticate";

const leadRouter = express.Router();

leadRouter.post("/add", authenticate, leadController.createLead);
leadRouter.patch(
  "/updateStatus",
  authenticate,
  leadController.updateLeadDragDropPosition
);

leadRouter.patch(
  "/updateAssignee",
  authenticate,
  leadController.updateAssignee
);

export default leadRouter;
