import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";
import { sendOTPEmail } from "../../utils/sendEmail";
import { generateOTP } from "../../utils/generateOtp";
import redis from "../../redis/redis.config";

export const resendOtp = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "OTP sent successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { email } = req.body;
    const key = `resend_otp:${email}`;
    const exists = await redis.get(key);

    if (exists) {
      response.statusCode = 429;
      response.message = "Please wait before resending OTP.";
      return sendResponse(res, response);
    }

    if (!email) {
      response.statusCode = 400;
      response.message = "Email is required";
      return sendResponse(res, response);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      response.statusCode = 404;
      response.message = "User not found";
      return sendResponse(res, response);
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry: expiry },
    });

    
    await sendOTPEmail(email, otp);
    await redis.set(key, "1", "EX", 60);

    return sendResponse(res, response);
  } catch (error) {
    console.error("Resend OTP error:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};
