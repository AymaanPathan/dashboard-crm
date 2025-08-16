import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    message: "Login successful",
    statusCode: 200,
    data: null,
    showMessage: true
  };
  try {
    const { email, password } = req.body;
    if (!email) {
      response.data = null;
      response.statusCode = 400;
      response.message = "Email is required";
      return sendResponse(res, response);
    }

    if (!password) {
      response.data = null;
      response.statusCode = 400;
      response.message = "Password is required";
      return sendResponse(res, response);
    }
    // Check if user with the same email already exists
    const userFindbyEmailID = await prisma.user.findUnique({
      where: { email },
    });

    // If Registered User Not Found
    if (!userFindbyEmailID) {
      response.data = null;
      response.message = "User not found";
      response.statusCode = 404;
      response.message = "User with the provided email does not exist";
      return sendResponse(res, response);
    }
    // Compare Password
    const isPassMatched = await bcrypt.compare(
      password,
      userFindbyEmailID.password
    );
    // Check Password
    if (!isPassMatched) {
      response.statusCode = 401;
      response.message = "Invalid credentials";
      response.data = null;
      return sendResponse(res, response);
    }

    const token = jwt.sign(
      {
        userId: userFindbyEmailID.id,
        email: userFindbyEmailID.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    response.data = {
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        user: {
          id: userFindbyEmailID.id,
          email: userFindbyEmailID.email,
          username: userFindbyEmailID.username,
        },
      },
    };
    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = "An unexpected error occurred";
    response.data = null;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};
