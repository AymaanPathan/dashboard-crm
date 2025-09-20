import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { getKanbanDataByRole } from "../../utils/getKanbanBasedOnRole";

export const getLeadWithStageKanban = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Leads fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const userId = req?.user?.id;
    const role = req?.user?.role;
    const organizationId = req?.user?.currentOrganizationId;

    if (!userId || !role || !organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "User context missing",
      });
    }

    const filters = {
      assignedToId: req.query.assignedToId as string,
      source: req.query.source as string,
      leadType: req.query.leadType as string,
    };

    const data = await getKanbanDataByRole(
      userId,
      role,
      organizationId,
      filters
    );

    response.data = data;
    return sendResponse(res, response);
  } catch (err) {
    console.error("Error in getLeadWithStageKanban:", err);
    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: "Internal server error",
      data: err,
      showMessage: false,
    });
  }
};
