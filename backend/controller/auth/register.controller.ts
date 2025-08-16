import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import {
  ErrorDetail,
  ResponseModel,
  sendResponse,
} from "../../utils/response.utils";
import bcrypt from "bcryptjs";

const registerUser = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "User registered successfully",
    data: null,
    error: {},
  };
  try {
    const { username, email, password } = req.body;

    if (!username) {
      response.statusCode = 400;
      response.message = "Username is required";
      response.error = {
        code: "MISSING_FIELD",
        field: "username",
        details: "Username is required",
      };
      return sendResponse(res, response);
    }

    if (!email) {
      response.statusCode = 400;
      response.message = "Email is required";
      response.error = {
        code: "MISSING_FIELD",
        field: "email",
        details: "Email is required",
      };
      return sendResponse(res, response);
    }

    if (!password) {
      response.statusCode = 400;
      response.message = "Password is required";
      response.error = {
        code: "MISSING_FIELD",
        field: "password",
        details: "Password is required",
      };
      return sendResponse(res, response);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // Check if user with the same email or username already exists
    if (existingUser) {
      response.statusCode = 400;
      response.message = "User already exists";
      response.error = {
        code: "USER_EXISTS",
        field: "email",
        details: "User with this email already exists",
      };
      return sendResponse(res, response);
    }
    //   Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    response.data = newUser;
    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = "Internal server error";
    response.error = {
      code: "INTERNAL_SERVER_ERROR",
      details: error.message,
    };
    return sendResponse(res, response);
  }
};

export default registerUser;
