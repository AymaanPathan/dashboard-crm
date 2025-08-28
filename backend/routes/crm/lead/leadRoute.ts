import express from "express";
import * as leadController from "../../../controller/lead/index";
import { authenticate } from "../../../middleware/authenticate";

const leadRouter = express.Router();

leadRouter.post("/add", authenticate, leadController.createLead);
leadRouter.patch(
  "/update/:leadId",
  authenticate,
  leadController.updateLeadDragDrop
);

leadRouter.get("/getAll", authenticate, leadController.getLeadWithStage);

export default leadRouter;
