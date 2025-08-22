import { Router } from "express";
import authRouter from "./auth/authRoutes";
import orgRouter from "./org/orgRoute";

const router = Router();
router.use("/", authRouter);
router.use("/org", orgRouter);
export default router;
