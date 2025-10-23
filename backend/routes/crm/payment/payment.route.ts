import express from "express";
import * as paymentController from "../../../controller/payments/index";
import { authenticate, isAdmin } from "../../../middleware/authenticate";
const paymentRouter = express.Router();

paymentRouter.get(
  "/all",
  authenticate,
  isAdmin,
  paymentController.getAllPaymentsController
);

export default paymentRouter;
