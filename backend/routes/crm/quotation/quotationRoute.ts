import express from "express";
import * as quotationController from "../../../controller/quotation/index";
import { authenticate } from "../../../middleware/authenticate";
const quotationRouter = express.Router();

quotationRouter.post(
  "/createQuotation",
  authenticate,
  quotationController.createQuotationController
);

quotationRouter.post(
  "/getQuotationsByLead",
  authenticate,
  quotationController.getQuotationsByLeadController
);
export default quotationRouter;
