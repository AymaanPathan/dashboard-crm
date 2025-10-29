import express from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import dayjs from "dayjs";

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
    const orgId = req.user?.currentOrganizationId;
    if (!orgId) {
      response.statusCode = 400;
      response.message = "Organization ID not found";
      return sendResponse(res, response);
    }

    // --- Date Ranges ---
    const startOfThisMonth = dayjs().startOf("month").toDate();
    const endOfThisMonth = dayjs().endOf("month").toDate();
    const startOfLastMonth = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = dayjs().subtract(1, "month").endOf("month").toDate();

    // --- Total People ---
    const totalPeople = await prisma.user.count({
      where: { currentOrganizationId: orgId },
    });

    // --- This Month ---
    const addedThisMonth = await prisma.user.count({
      where: {
        currentOrganizationId: orgId,
        createdAt: {
          gte: startOfThisMonth,
          lte: endOfThisMonth,
        },
      },
    });

    // --- Last Month ---
    const addedLastMonth = await prisma.user.count({
      where: {
        currentOrganizationId: orgId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // --- Difference & Percentage ---
    const difference = addedThisMonth - addedLastMonth;
    let percentageChange = 0;
    let trend: "increased" | "decreased" | "no change" = "no change";

    if (addedLastMonth > 0) {
      percentageChange =
        ((addedThisMonth - addedLastMonth) / addedLastMonth) * 100;
    } else if (addedThisMonth > 0) {
      percentageChange = 100;
    }

    if (difference > 0) trend = "increased";
    else if (difference < 0) trend = "decreased";

    // --- People List ---
    const people = await prisma.user.findMany({
      where: { currentOrganizationId: orgId },
      orderBy: { createdAt: "desc" },
    });

    response.data = {
      people,
      analytics: {
        totalPeople,
        addedThisMonth,
        addedLastMonth,
        difference,
        percentageChange: Number(percentageChange.toFixed(2)),
        trend, // ⬅️ "increased", "decreased" or "no change"
      },
    };

    return sendResponse(res, response);
  } catch (error: any) {
    response.statusCode = 500;
    response.message = error.message || "Internal Server Error";
    return sendResponse(res, response);
  }
};
