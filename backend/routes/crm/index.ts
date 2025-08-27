import { Router } from "express";
import authRouter from "./auth/authRoutes";
import orgRouter from "./org/orgRoute";
import leadRouter from "./lead/leadRoute";

const router = Router();
router.use("/", authRouter);
router.use("/org", orgRouter);
router.use("/lead", leadRouter);

export default router;
