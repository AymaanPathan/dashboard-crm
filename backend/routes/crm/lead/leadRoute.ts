import express from "express";
import * as leadController from "../../../controller/lead/index";
import { authenticate } from "../../../middleware/authenticate";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const leadRouter = express.Router();
leadRouter.get("/:id", authenticate, leadController.getOneLeadById);

leadRouter.post("/add", authenticate, leadController.createLead);
leadRouter.post(
  "/import",
  upload.single("file"),
  authenticate,
  leadController.importLeadsFromExcel
);

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
