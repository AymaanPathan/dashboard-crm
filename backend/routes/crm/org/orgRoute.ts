import express from "express";
import * as orgController from "../../../controller/org/index";
import { authenticate } from "../../../middleware/authenticate";
const orgRouter = express.Router();

orgRouter.post("/create", authenticate, orgController.createOrganization);

export default orgRouter;
