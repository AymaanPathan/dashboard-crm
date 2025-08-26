import express from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import prisma from "../../utils/prisma";

export const getOrgInfo = async (
  req: express.Request,
  res: express.Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Organization information fetched successfully",
    data: null,
    showMessage: true,
  };
  try {
    const currentUserOrgId = req.user?.currentOrganizationId;
    if (!currentUserOrgId) {
      response.statusCode = 400;
      response.message = "User does not belong to any organization";
      return sendResponse(res, response);
    }
    const orgData = await prisma.organization.findUnique({
      where: { id: currentUserOrgId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        employees: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    response.data = orgData;
    return sendResponse(res, response);
  } catch (err: any) {
    response.statusCode = 500;
    response.message = err.message;
    response.data = null;
    response.showMessage = true;
  }
};
