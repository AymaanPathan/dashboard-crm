import { Request, Response } from "express";
import { getUserBasedOnRoles } from "../../utils/getUserBasedOnRoles.utils";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const fetchUserHierarchy = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "",
    data: null,
    showMessage: false,
  };
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      response.data = null;
      response.message = "User not authenticated";
      response.statusCode = 401;
      return sendResponse(res, response);
    }

    const data = await getUserBasedOnRoles(currentUserId, currentUserRole);

    response.data = data;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error in fetchUserHierarchy:", error);
    response.statusCode = 500;
    response.message = "Internal Server Error";
    return sendResponse(res, response);
  }
};
