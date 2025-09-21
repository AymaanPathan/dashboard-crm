import { Router } from "express";
import authRouter from "./auth/authRoutes";
import orgRouter from "./org/orgRoute";
import leadRouter from "./lead/leadRoute";
import kanbanRouter from "./kanban/kanbanRoute";
import PeopleRouter from "./people/peopleRoutes";
import stageRouter from "./stages/stageRoutes";
import leadTaskRouter from "./leadTask/leadTaskRoute";
import templateRouter from "./template/templateRoute";
import quotationRouter from "./quotation/quotationRoute";

const router = Router();
router.use("/", authRouter);
router.use("/org", orgRouter);
router.use("/lead", leadRouter);
router.use("/kanban", kanbanRouter);
router.use("/people", PeopleRouter);
router.use("/stages", stageRouter);
router.use("/leadTask", leadTaskRouter);
router.use("/template", templateRouter);
router.use("/quotation", quotationRouter);

export default router;
