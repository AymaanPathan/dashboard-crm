import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import bcrypt from "bcryptjs";

export const loginUser = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Login successful",
    data: null,
    error: {},
  };
  try {
    const { email, password } = req.body;
    if (!email) {
      response.data = {
        statusCode: 400,
        message: "Email is required",
        error: {
          code: "MISSING_FIELD",
          field: "email",
          details: "Email is required",
        },
      };
      return sendResponse(res, response);
    }

    if (!password) {
      response.data = {
        statusCode: 400,
        message: "Password is required",
        error: {
          code: "MISSING_FIELD",
          field: "password",
          details: "Password is required",
        },
      };
      return sendResponse(res, response);
    }
    // Check if user with the same email already exists
    const userFindbyEmailID = await prisma.user.findUnique({
      where: { email },
    });

    // If Registered User Not Found
    if (!userFindbyEmailID) {
      response.data = {
        statusCode: 404,
        message: "User not found",
        error: {
          code: "USER_NOT_FOUND",
          details: "User with the provided email does not exist",
        },
      };
      return sendResponse(res, response);
    }
    // Compare Password
    const isPassMatched = await bcrypt.compare(
      password,
      userFindbyEmailID.password
    );
    // Check Password
    if (!isPassMatched) {
      response.data = {
        statusCode: 401,
        message: "Invalid credentials",
        error: {
          code: "INVALID_CREDENTIALS",
          details: "Email or password is incorrect",
        },
      };
      return sendResponse(res, response);
    }
    response.data = {
      statusCode: 200,
      message: "Login successful",
      data: {
        user: {
          id: userFindbyEmailID.id,
          email: userFindbyEmailID.email,
          username: userFindbyEmailID.username,
        },
      },
    };
    return sendResponse(res, response);
  } catch (error: any) {
    response.data = {
      statusCode: 500,
      message: "Internal server error",
      error: {
        code: 500,
        details: error.message,
      },
    };
    return sendResponse(res, response);
  }
};
