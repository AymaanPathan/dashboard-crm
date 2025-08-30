import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { hashPassword } from "../../utils/hashPassword.utils";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const createUser = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "User created successfully",
    data: null,
    showMessage: true,
  };
  try {
    const {
      username,
      email,
      password,
      role,
      managerId,
      currentOrganizationId,
    } = req.body;

    if (!username || !email || !password || !role || !currentOrganizationId) {
      response.statusCode = 400;
      response.message = "Missing required fields";
      return sendResponse(res, response);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      response.statusCode = 409;
      response.message = "User already exists with this email";
      return sendResponse(res, response);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        managerId,
        currentOrganizationId,
      },
    });

    response.data = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error creating user:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};
