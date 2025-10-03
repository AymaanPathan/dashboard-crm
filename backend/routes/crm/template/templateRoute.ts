import express from "express";
import * as templateController from "../../../controller/template/index";
import { authenticate } from "../../../middleware/authenticate";
const templateRouter = express.Router();

templateRouter.post(
  "/createCompanyTemplate",
  authenticate,
  templateController.createCompanyTemplateController
);
export default templateRouter;
