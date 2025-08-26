import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "OTP verified successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { email, otp } = req.body;
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

    // mark user as verified
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    const token = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    response.data = {
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        username: updatedUser.username,
      },
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("OTP verification error:", error);
    response.statusCode = 500;
    response.message = error.message;
    return sendResponse(res, response);
  }
};
