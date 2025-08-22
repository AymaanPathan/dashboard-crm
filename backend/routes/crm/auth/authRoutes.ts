import express from "express";
import registerUser from "../../../controller/auth/register.controller";
import { loginUser } from "../../../controller/auth/loginUser.controller";
import { verifyOtp } from "../../../controller/auth/verifyOtp.controller";
import { resendOtp } from "../../../controller/auth/resendOtp.controller";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verifyotp", verifyOtp);
authRouter.post("/resendotp", resendOtp);

export default authRouter;
