import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const verifyOtp = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Email verified successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { email, otp } = req.body;
    console.log("Received OTP verification request:", { email, otp });

    if (!email || !otp) {
      response.statusCode = 400;
      response.message = "Email and OTP are required";
      return sendResponse(res, response);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      response.statusCode = 400;
      response.message = "Invalid OTP";
      return sendResponse(res, response);
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      response.statusCode = 400;
      response.message = "OTP expired";
      return sendResponse(res, response);
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    return sendResponse(res, response);
  } catch (error) {
    console.error("OTP verification error:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};
