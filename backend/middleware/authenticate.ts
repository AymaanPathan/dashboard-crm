import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { Request, Response, NextFunction } from "express";
import { ResponseModel } from "../utils/response.utils";
import { sendResponse } from "../utils/response.utils";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ResponseModel = {
    statusCode: 200,
    data: null,
    showMessage: false,
    message: "User successfully",
  };
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    response.statusCode = 400;
    response.message = "Token not provided";
    response.showMessage = true;
    return sendResponse(res, response);
  }

  try {
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    const userId = decodedToken.userId;
    if (!userId) {
      response.statusCode = 400;
      response.message = "Invalid token payload";
      return sendResponse(res, response);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      response.statusCode = 400;
      response.message = "User not found While Authenticating";
      return sendResponse(res, response);
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    response.statusCode = 400;
    response.message = "Invalid token";
    return sendResponse(res, response);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") {
    return next();
  }

  const response: ResponseModel = {
    statusCode: 403,
    message: "Forbidden: You do not have permission to access this resource",
    data: null,
    showMessage: true,
  };
  return sendResponse(res, response);
};
