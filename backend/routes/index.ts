import { Router } from "express";
import crmRoutes from "./crm";
import pingRouter from "./ping/pingRoute";
import timeRouter from "./time/timeRoute";

const router = Router();

router.use("/ping", pingRouter);
router.use("/time", timeRouter);
router.use("/crm", crmRoutes);

export default router;
