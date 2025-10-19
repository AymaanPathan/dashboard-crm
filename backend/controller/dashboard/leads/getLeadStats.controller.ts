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

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // ---------------- Total Leads ----------------
    const totalLeads = await prisma.lead.count({ where: { organizationId } });

    const currentMonthLeads = await prisma.lead.count({
      where: {
        organizationId,
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    });

    const lastMonthLeads = await prisma.lead.count({
      where: {
        organizationId,
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    // ---------------- Won Leads ----------------
    const totalWonLeads = await prisma.lead.count({
      where: { organizationId, stage: { name: "Closed" } },
    });

    const currentMonthWonLeads = await prisma.lead.count({
      where: {
        organizationId,
        stage: { name: "Closed" },
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    });

    const lastMonthWonLeads = await prisma.lead.count({
      where: {
        organizationId,
        stage: { name: "Closed" },
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    // ---------------- Lead Growth ----------------
    let percentGrowth = 0;
    if (lastMonthLeads === 0 && currentMonthLeads > 0) percentGrowth = 100;
    else if (lastMonthLeads > 0)
      percentGrowth =
        ((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100;

    // ---------------- Won Percentage ----------------
    const percentWon = totalLeads > 0 ? (totalWonLeads / totalLeads) * 100 : 0;

    // ---------------- Won Month-over-Month Growth ----------------
    let wonPercentGrowth = 0;
    if (lastMonthWonLeads === 0 && currentMonthWonLeads > 0)
      wonPercentGrowth = 100;
    else if (lastMonthWonLeads > 0)
      wonPercentGrowth =
        ((currentMonthWonLeads - lastMonthWonLeads) / lastMonthWonLeads) * 100;

    // ---------------- Lead Distribution by Type ----------------
    const leadTypes = ["Hot", "Warm", "Cold"];
    const typeCounts = await Promise.all(
      leadTypes.map((type) =>
        prisma.lead.count({ where: { organizationId, leadType: type } })
      )
    );
    const leadDistribution = leadTypes.map((type, index) => ({
      type,
      count: typeCounts[index],
      percentage:
        totalLeads > 0
          ? Number(((typeCounts[index] / totalLeads) * 100).toFixed(2))
          : 0,
    }));

    // ---------------- Lead Distribution by Source ----------------
    const leadSources = [
      "Website",
      "Social Media",
      "Referral",
      "Cold Call",
      "Email Campaign",
      "Trade Show",
      "Advertisement",
      "Other",
    ];
    const sourceCounts = await Promise.all(
      leadSources.map((source) =>
        prisma.lead.count({ where: { organizationId, source } })
      )
    );
    const sourceDistribution = leadSources.map((source, index) => ({
      source,
      count: sourceCounts[index],
      percentage:
        totalLeads > 0
          ? Number(((sourceCounts[index] / totalLeads) * 100).toFixed(2))
          : 0,
    }));

    // ---------------- Lead Distribution by Stage ----------------
    const leadStages = ["New Lead", "Contacted", "Negotiation", "Closed"];
    const stageCounts = await Promise.all(
      leadStages.map((stage) =>
        prisma.lead.count({
          where: { organizationId, stage: { name: stage } },
        })
      )
    );
    const stageDistribution = leadStages.map((stage, index) => ({
      stage,
      count: stageCounts[index],
      percentage:
        totalLeads > 0
          ? Number(((stageCounts[index] / totalLeads) * 100).toFixed(2))
          : 0,
    }));

    // ---------------- Final Response ----------------
    response.data = {
      totalLeads,
      currentMonthLeads,
      lastMonthLeads,
      percentGrowth: Number(percentGrowth.toFixed(2)),
      totalWonLeads,
      currentMonthWonLeads,
      lastMonthWonLeads,
      percentWon: Number(percentWon.toFixed(2)),
      wonPercentGrowth: Number(wonPercentGrowth.toFixed(2)),
      leadDistribution,
      sourceDistribution,
      stageDistribution,
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
