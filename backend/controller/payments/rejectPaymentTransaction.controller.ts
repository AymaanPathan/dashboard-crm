import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const rejectPaymentTransactionController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Payment transaction rejected successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { transactionId } = req.body;
    const userId = req?.user?.id;
    const role = req?.user?.role;

    if (!transactionId) {
      response.statusCode = 400;
      response.message = "Transaction ID is required";
      return sendResponse(res, response);
    }

    if (role !== "finance" && role !== "admin") {
      response.statusCode = 403;
      response.message = "You are not authorized to reject payments";
      return sendResponse(res, response);
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { payment: true },
    });

    if (!transaction) {
      response.statusCode = 404;
      response.message = "Transaction not found";
      return sendResponse(res, response);
    }

    if (transaction.status === "completed") {
      response.statusCode = 400;
      response.message =
        "This transaction is already approved and cannot be rejected";
      return sendResponse(res, response);
    }

    if (transaction.status === "rejected") {
      response.statusCode = 400;
      response.message = "This transaction is already rejected";
      return sendResponse(res, response);
    }

    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: "rejected",
        verifiedById: userId,
        verifiedAt: new Date(),
      },
    });

    response.data = { transaction: updatedTransaction };
    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error rejecting payment:", error);
    response.statusCode = 500;
    response.message = "Server error while rejecting payment";
    return sendResponse(res, response);
  }
};
