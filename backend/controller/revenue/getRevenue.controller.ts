import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";
import dayjs from "dayjs";

export const getRevenueController = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Revenue data fetched successfully",
    data: null,
    showMessage: false,
  };

  try {
    const companyId = req?.user?.currentOrganizationId;
    const role = req?.user?.role;
    const userId = req?.user?.id;
    const { range = "1Y" } = req.query;

    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID missing";
      return sendResponse(res, response);
    }

    // --- Date range calculation ---
    let startDate: Date;
    const endDate = new Date();

    switch (range) {
      case "1D":
        startDate = dayjs().subtract(1, "day").toDate();
        break;
      case "1W":
        startDate = dayjs().subtract(1, "week").toDate();
        break;
      case "1M":
        startDate = dayjs().subtract(1, "month").toDate();
        break;
      case "6M":
        startDate = dayjs().subtract(6, "month").toDate();
        break;
      case "1Y":
        startDate = dayjs().subtract(1, "year").toDate();
        break;
      case "ALL":
      default:
        startDate = dayjs("2000-01-01").toDate(); // practically everything
    }

    // --- Base where clause ---
    const whereClause: any = {
      status: "completed",
      paidAt: { gte: startDate, lte: endDate },
      payment: {
        order: { organizationId: companyId },
      },
    };

    // --- Restrict non-admins if needed ---
    if (role !== "admin") {
      whereClause.payment.order.lead = {
        assignedToId: userId,
      };
    }

    // --- Group revenue by month ---
    const monthlyRevenue = await prisma.paymentTransaction.groupBy({
      by: ["paidAt"],
      where: whereClause,
      _sum: { amount: true },
      orderBy: { paidAt: "asc" },
    });

    // --- Aggregate into month-year format ---
    const chartDataMap = new Map<string, number>();
    for (const record of monthlyRevenue) {
      const monthKey = dayjs(record.paidAt).format("MMM");
      const prevValue = chartDataMap.get(monthKey) || 0;
      chartDataMap.set(monthKey, prevValue + (record._sum.amount || 0));
    }

    const chartData = Array.from(chartDataMap.entries()).map(
      ([month, value]) => ({ month, value })
    );

    // --- Compute total & previous period comparison ---
    const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);

    // Previous period (for growth %)
    const previousStart = dayjs(startDate)
      .subtract(dayjs(endDate).diff(startDate, "day"), "day")
      .toDate();

    const previousRevenueAgg = await prisma.paymentTransaction.aggregate({
      where: {
        status: "completed",
        paidAt: { gte: previousStart, lt: startDate },
        payment: { order: { organizationId: companyId } },
      },
      _sum: { amount: true },
    });

    const previousRevenue = previousRevenueAgg._sum.amount || 0;
    const growthPercent =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 100;

    response.data = {
      chartData,
      totalRevenue,
      previousRevenue,
      growthPercent: Number(growthPercent.toFixed(2)),
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in getRevenueController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching revenue";
    return sendResponse(res, response);
  }
};
