import express from "express";
import * as quotationController from "../../../controller/quotation/index";
const quotationRouter = express.Router();

quotationRouter.post(
  "/createQuotation",
  quotationController.createQuotationController
);

export default quotationRouter;
