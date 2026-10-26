import { Router } from "express";
import crmRoutes from "./crm";
import pingRouter from "./ping/pingRoute";
import timeRouter from "./time/timeRoute";
import checkRouter from "./check/checkRoute";

const router = Router();

router.use("/ping", pingRouter);
router.use("/time", timeRouter);
router.use("/check", checkRouter);
router.use("/crm", crmRoutes);

export default router;
