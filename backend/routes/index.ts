import { Router } from "express";
import crmRoutes from "./crm";
import pingRouter from "./ping/pingRoute";

const router = Router();

router.use("/ping", pingRouter);
router.use("/crm", crmRoutes);

export default router;
