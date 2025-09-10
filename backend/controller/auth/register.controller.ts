import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import validator from "validator";

import deleteUnverifiedUsersQueue, {
  queueName,
} from "../../queues/deleteUnverifiedUsersQueue";
import { generateOTP } from "../../utils/generateOtp";
import { sendOTPEmail } from "../../utils/sendEmail";
import { hashPassword } from "../../utils/hashPassword.utils";

const registerUser = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "User registered successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { username = "", email = "", password = "" } = req.body || {};
    if (!username.trim()) {
      response.statusCode = 400;
      response.message = "Username is required";
      return sendResponse(res, response);
    }

    if (!email.trim()) {
      response.statusCode = 400;
      response.message = "Email is required";
      return sendResponse(res, response);
    }

    if (!email.trim()) {
      response.statusCode = 400;
      response.message = "Email is required";
      return sendResponse(res, response);
    }

    if (!validator.isEmail(email)) {
      response.statusCode = 400;
      response.message = "Invalid email format";
      response.data = null;
      return sendResponse(res, response);
    }

    if (!password) {
      response.statusCode = 400;
      response.message = "Password is required";
      return sendResponse(res, response);
    }

    // we added @unqiue prisma file so this is okay but prisma even not allow duplicate
    // with @unique
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        isVerified: true,
      },
    });

    if (existingUser) {
      response.statusCode = 400;
      response.message = "User already exists";
      return sendResponse(res, response);
    }

    const hashedPassword = await hashPassword(password);

    // Prisma will delete the user if exist if its not verified
    await prisma.user.deleteMany({
      where: {
        email: email,
        isVerified: false,
      },
    });

    // creates new one always
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    await deleteUnverifiedUsersQueue.add(
      queueName,
      { userId: newUser.id },
      { delay: 15 * 60 * 1000 }
    );

    response.data = {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        otp,
        otpExpiry: expiry,
      },
    });
    await sendOTPEmail(newUser.email, otp);
    return sendResponse(res, response);
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      response.statusCode = 400;
      response.message = "Email already exists";
      return sendResponse(res, response);
    }

    response.statusCode = 500;
    response.message = error.message;
    return sendResponse(res, response);
  }
};

export default registerUser;
