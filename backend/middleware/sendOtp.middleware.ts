import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sendOTPEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/generateOtp";
import { ResponseModel, sendResponse } from "../utils/response.utils";

const prisma = new PrismaClient();

export const sendOtpMiddleware = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "OTP sent successfully",
    data: null,
    showMessage: true,
  };
  try {
    const user = req.user;
    if (!user) {
      response.statusCode = 401;
      response.message = "User not found";
      response.showMessage = true;
      return sendResponse(res, response);
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry: expiry,
      },
    });

   const result = await sendOTPEmail(user.email, otp);

    return sendResponse(res, response);
  } catch (err) {
    console.error("Error sending OTP:", err);
    response.statusCode = 500;
    response.message = "Failed to send OTP";
    response.showMessage = true;
    return sendResponse(res, response);
  }
};
