import { Router } from "express";
import authRouter from "./auth/authRoutes";
import orgRouter from "./org/orgRoute";
import leadRouter from "./lead/leadRoute";
import kanbanRouter from "./kanban/kanbanRoute";
import PeopleRouter from './people/peopleRoutes'

const router = Router();
router.use("/", authRouter);
router.use("/org", orgRouter);
router.use("/lead", leadRouter);
router.use("/kanban", kanbanRouter);
router.use("/people", PeopleRouter);

export default router;
