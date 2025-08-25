import express from "express";
import * as orgController from "../../../controller/org/index";
import { authenticate } from "../../../middleware/authenticate";
const orgRouter = express.Router();

orgRouter.post("/create", authenticate, orgController.createOrganization);
orgRouter.get("/info", authenticate, orgController.getOrgInfo);
export default orgRouter;
