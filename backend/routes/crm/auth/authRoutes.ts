import express from "express";
import registerUser from "../../../controller/auth/register.controller";
import { loginUser } from "../../../controller/auth/loginUser.controller";
import { verifyOtp } from "../../../controller/auth/verifyOtp.controller";
import { sendOtpMiddleware } from "../../../middleware/sendOtp.middleware";

const authRouter = express.Router();

authRouter.post("/register", registerUser, sendOtpMiddleware);
authRouter.post("/login", loginUser);
authRouter.post("/verifyotp", verifyOtp);

export default authRouter;
