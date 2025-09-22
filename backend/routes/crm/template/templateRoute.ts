import express from "express";
import * as templateController from "../../../controller/template/index";
const templateRouter = express.Router();

templateRouter.get("/create", templateController.createTemplateController);
templateRouter.post(
  "/create-company-template",
  templateController.createCompanyTemplateController
);
export default templateRouter;
