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
    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID missing";
      return sendResponse(res, response);
    }

    const role = req?.user?.role;
    const userId = req?.user?.id;

    const { range = "1Y" } = req.query;

    // Base filter for completed payments
    const baseFilter: any = {
      status: "completed",
      payment: { order: { organizationId: companyId } },
    };

    if (role !== "admin") {
      baseFilter.payment.order.lead = { assignedToId: userId };
    }

    // Get all completed payments
    const payments = await prisma.paymentTransaction.findMany({
      where: baseFilter,
      select: { amount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
    });

    let chartData: { label: string; value: number }[] = [];

    const now = dayjs();

    if (range === "1M") {
      const startOfMonth = now.startOf("month");
      const endOfMonth = now.endOf("month");

      const monthPayments = payments.filter((p) => {
        const date = dayjs(p.paidAt);
        return (
          date.isAfter(startOfMonth.subtract(1, "day")) &&
          date.isBefore(endOfMonth.add(1, "day"))
        );
      });

      const dayMap = new Map<number, number>();
      monthPayments.forEach((p) => {
        const day = dayjs(p.paidAt).date();
        dayMap.set(day, (dayMap.get(day) || 0) + (p.amount || 0));
      });

      chartData = Array.from({ length: endOfMonth.date() }, (_, i) => ({
        label: `${i + 1}`,
        value: dayMap.get(i + 1) || 0,
      }));
    } else if (range === "6M") {
      const sixMonthsAgo = now.subtract(6, "month");

      const monthMap = new Map<string, number>();
      payments.forEach((p) => {
        const date = dayjs(p.paidAt);
        if (date.isAfter(sixMonthsAgo)) {
          const key = date.format("MMM");
          monthMap.set(key, (monthMap.get(key) || 0) + (p.amount || 0));
        }
      });

      chartData = Array.from({ length: 6 }, (_, i) => {
        const month = now.subtract(5 - i, "month");
        const key = month.format("MMM");
        return { label: key, value: monthMap.get(key) || 0 };
      });
    } else if (range === "1Y") {
      const yearStart = now.startOf("year");
      const yearEnd = now.endOf("year");

      const monthMap = new Map<number, number>();
      payments.forEach((p) => {
        const date = dayjs(p.paidAt);
        if (
          date.isAfter(yearStart.subtract(1, "day")) &&
          date.isBefore(yearEnd.add(1, "day"))
        ) {
          const month = date.month(); // 0-11
          monthMap.set(month, (monthMap.get(month) || 0) + (p.amount || 0));
        }
      });

      chartData = Array.from({ length: 12 }, (_, i) => ({
        label: dayjs().month(i).format("MMM"),
        value: monthMap.get(i) || 0,
      }));
    } else {
      response.statusCode = 400;
      response.message = "Invalid range. Use 1M, 6M, or 1Y.";
      return sendResponse(res, response);
    }

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    response.data = { chartData, totalRevenue, range };
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error in getRevenueController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching revenue";
    return sendResponse(res, response);
  }
};
