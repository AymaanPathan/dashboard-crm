import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const getTestQuotationsController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Test quotations fetched successfully",
    data: null,
    showMessage: false,
  };
  try {
    const testNames = ["classic-test", "modern-test", "minimal-test"];

    const quotations = await prisma.quotation.findMany({
      where: {
        quotationName: {
          in: testNames,
        },
      },
    });

    response.data = quotations;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error fetching test quotations:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = true;
    return sendResponse(res, response);
  }
};
