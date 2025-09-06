import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { getUserManager } from "../../utils/getUserManager.utils";

export const getAllUserManagers = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "",
    data: null,
    showMessage: false,
  };
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.body.role;

    if (!currentUserId || !currentUserRole) {
      response.data = null;
      response.message = "User not authenticated";
      response.statusCode = 401;
      return sendResponse(res, response);
    }

    const data = await getUserManager(
      currentUserRole,
      req.user?.currentOrganizationId
    );

    response.data = data;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error in getAllUserManagers:", error);
    response.statusCode = 500;
    response.message = "Internal Server Error";
    return sendResponse(res, response);
  }
};
