import express from "express";
import * as stageController from "../../../controller/stages/index";
import { authenticate } from "../../../middleware/authenticate";
const stageRouter = express.Router();

stageRouter.get("/all", authenticate, stageController.fetchStages);
export default stageRouter;
