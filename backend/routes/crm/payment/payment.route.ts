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
paymentRouter.post(
  "/add",
  authenticate,
  paymentController.addPaymentTransactionController
);
paymentRouter.post(
  "/approve",
  authenticate,
  paymentController.approvePaymentTransactionController
);
paymentRouter.post(
  "/reject",
  authenticate,
  paymentController.rejectPaymentTransactionController
);

paymentRouter.get(
  "/:paymentId/transactions",
  authenticate,
  paymentController.getPaymentTransactionsController
);

export default paymentRouter;
