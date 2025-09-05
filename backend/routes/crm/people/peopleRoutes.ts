import express from "express";
import * as peopleController from "../../../controller/people/index";
import { authenticate, isAdmin } from "../../../middleware/authenticate";
const peopleRouter = express.Router();

peopleRouter.post("/add", authenticate, isAdmin, peopleController.createUser);
peopleRouter.get("/all", authenticate, isAdmin, peopleController.getPeople);
peopleRouter.get(
  "/getUserByRole",
  authenticate,
  peopleController.fetchUserHierarchy
);
export default peopleRouter;
