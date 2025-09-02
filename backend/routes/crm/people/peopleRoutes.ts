import express from "express";
import * as peopleController from "../../../controller/people/index";
import { authenticate, isAdmin } from "../../../middleware/authenticate";
const authRouter = express.Router();

authRouter.post("/add", authenticate, isAdmin, peopleController.createUser);
authRouter.get("/all", authenticate, isAdmin, peopleController.getPeople);
export default authRouter;
