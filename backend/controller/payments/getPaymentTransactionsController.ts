import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { prismaPaginate } from "../../utils/paginate";

export const getPaymentTransactionsController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Transactions fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { paymentId } = req.params;
    const { page = 1, limit = 4 } = req.query;

    if (!paymentId) {
      response.statusCode = 400;
      response.message = "Payment ID is required";
      return sendResponse(res, response);
    }

    // --- Ensure the payment exists ---
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        orderId: true,
        order: {
          select: {
            orderNumber: true,
            quotation: {
              select: { customerName: true, customerPhone: true },
            },
          },
        },
      },
    });

    if (!payment) {
      response.statusCode = 404;
      response.message = "Payment not found";
      return sendResponse(res, response);
    }

    // --- Fetch paginated transactions ---
    const result = await prismaPaginate(prisma.paymentTransaction, {
      page: Number(page),
      limit: Number(limit),
      where: { paymentId },
      include: {
        verifiedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    });

    // --- Response ---
    response.data = {
      paymentInfo: {
        id: payment.id,
        orderNumber: payment.order.orderNumber,
        customerName: payment.order.quotation.customerName,
        customerPhone: payment.order.quotation.customerPhone,
      },
      transactions: result.items,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: Number(page),
        limit: result.limit,
      },
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in getPaymentTransactionsController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching transactions";
    return sendResponse(res, response);
  }
};
