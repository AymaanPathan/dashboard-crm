import express from "express";
import * as orderController from "../../../controller/order/index";
import { authenticate } from "../../../middleware/authenticate";
const orderRouter = express.Router();

orderRouter.post(
  "/confirm",
  authenticate,
  orderController.confirmQuotationAsOrder
);
export default orderRouter;
