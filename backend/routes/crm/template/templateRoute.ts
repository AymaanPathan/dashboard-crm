import express from "express";
import * as templateController from "../../../controller/template/index";
const templateRouter = express.Router();

templateRouter.get("/create", templateController.createTemplateController);

export default templateRouter;
