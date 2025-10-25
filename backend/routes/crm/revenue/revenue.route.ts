import express from "express";
import * as revenueController from "../../../controller/revenue/index";
import { authenticate, isAdmin } from "../../../middleware/authenticate";
const revenueRouter = express.Router();

revenueRouter.get(
  "/get",
  authenticate,
  isAdmin,
  revenueController.getRevenueController
);

export default revenueRouter;
