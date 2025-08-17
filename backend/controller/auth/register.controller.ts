import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "User registered successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { username, email, password } = req.body;
    if (!validator.isEmail(email)) {
      response.statusCode = 400;
      response.message = "Invalid email format";
      response.data = null
      return sendResponse(res, response);
    }

    if (!username) {
      response.statusCode = 400;
      response.message = "Username is required";
      return sendResponse(res, response);
    }

    if (!email) {
      response.statusCode = 400;
      response.message = "Email is required";
      return sendResponse(res, response);
    }

    if (!password) {
      response.statusCode = 400;
      response.message = "Password is required";
      return sendResponse(res, response);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      response.statusCode = 400;
      response.message = "User already exists";
      return sendResponse(res, response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    req.user = newUser;

    response.data = {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };

    return next();
  } catch (error: any) {
    response.statusCode = 500;
    response.message = "Internal server error";
    return sendResponse(res, response);
  }
};

export default registerUser;
