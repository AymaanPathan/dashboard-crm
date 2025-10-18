import { Request, Response } from "express";
import { ResponseModel, sendResponse } from "../../../utils/response.utils";
import prisma from "../../../utils/prisma";

export const getLeadStats = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead statistics fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const organizationId = req?.user?.currentOrganizationId;

    if (!organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization ID is required",
      });
    }

    // ===================== 📅 Date Ranges =====================
    const now = new Date();

    // Current month range
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Last month range
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // ===================== 📊 Count Leads =====================
    const totalLeads = await prisma.lead.count({
      where: { organizationId },
    });

    const currentMonthLeads = await prisma.lead.count({
      where: {
        organizationId,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    const lastMonthLeads = await prisma.lead.count({
      where: {
        organizationId,
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // ===================== 📈 Calculate Growth =====================
    let percentGrowth = 0;

    if (lastMonthLeads === 0 && currentMonthLeads > 0) {
      percentGrowth = 100;
    } else if (lastMonthLeads > 0) {
      percentGrowth =
        ((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100;
    }

    response.data = {
      totalLeads,
      currentMonthLeads,
      lastMonthLeads,
      percentGrowth: Number(percentGrowth.toFixed(2)),
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error fetching lead stats:", error);

    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};
