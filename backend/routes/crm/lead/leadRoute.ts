import express from "express";
import * as leadController from "../../../controller/lead/index";
import { authenticate } from "../../../middleware/authenticate";

const leadRouter = express.Router();

leadRouter.post("/add", authenticate, leadController.createLead);


export default leadRouter;
