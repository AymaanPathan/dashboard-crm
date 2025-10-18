import express from "express";
import * as dashboardController from "../../../controller/dashboard/index";
import { authenticate, isAdmin } from "../../../middleware/authenticate";
const dashboardRouter = express.Router();

dashboardRouter.get(
  "/getLeadStats",
  authenticate,
  isAdmin,
  dashboardController.getLeadStats
);

export default dashboardRouter;
