import express from "express";
import registerUser from "../../../controller/auth/register.controller";
import { loginUser } from "../../../controller/auth/loginUser.controller";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
