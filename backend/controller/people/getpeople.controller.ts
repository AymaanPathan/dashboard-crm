import express from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const getPeople = async (
  req: express.Request,
  res: express.Response
) => {
  const response: ResponseModel = {
    showMessage: false,
    statusCode: 200,
    data: null,
    message: "People fetched successfully",
  };
  try {
    const people = await prisma.user.findMany();
    if (!people || people.length === 0) {
      response.message = "No people found";
      response.data = [];
      return sendResponse(res, response);
    }
    response.data = people;
    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = error.message || "Internal Server Error";
    return sendResponse(res, response);
  }
};
