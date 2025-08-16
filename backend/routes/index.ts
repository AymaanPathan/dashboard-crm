import { Router } from "express";
import crmRoutes from "./crm";

const router = Router();

router.use("/crm", crmRoutes);

export default router;
