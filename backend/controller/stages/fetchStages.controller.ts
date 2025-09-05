import express from "express";
import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const fetchStages = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Stages fetched successfully",
    data: null,
    showMessage: false,
  };
  try {
    const currentOrg = req?.user?.currentOrganizationId;
    if (!currentOrg) {
      response.statusCode = 400;
      response.message = "OrganizationId is required to fetch stages";
      response.showMessage = true;
      return sendResponse(res, response);
    }
    const stages = await prisma.stage.findMany({
      where: { organizationId: currentOrg },
    });

    response.data = stages;
    return sendResponse(res, response);
  } catch (error) {
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = true;
    return sendResponse(res, response);
  }
};
