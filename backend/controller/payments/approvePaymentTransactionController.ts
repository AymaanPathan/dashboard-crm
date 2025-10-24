import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { sendResponse, ResponseModel } from "../../utils/response.utils";

export const approvePaymentTransactionController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Payment transaction approved successfully",
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

    // Only accountant/finance can approve
    if (role !== "finance" && role !== "admin") {
      response.statusCode = 403;
      response.message = "You are not authorized to approve payments";
      return sendResponse(res, response);
    }

    // --- Find the transaction ---
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
      response.message = "This transaction is already approved";
      return sendResponse(res, response);
    }

    // --- Approve the transaction ---
    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: "completed",
        paidAt: new Date(),
        verifiedById: userId,
        verifiedAt: new Date(),
      },
    });

    // --- Update payment details ---
    const updatedPayment = await prisma.payment.update({
      where: { id: transaction.paymentId },
      data: {
        amountPaid: {
          increment: transaction.amount,
        },
      },
    });

    // --- Check if payment fully completed ---
    if ((updatedPayment.amountPaid ?? 0) >= (updatedPayment.totalAmount ?? 0)) {
      await prisma.payment.update({
        where: { id: transaction.paymentId },
        data: { status: "completed" },
      });
    }

    response.data = {
      transaction: updatedTransaction,
      payment: updatedPayment,
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error approving payment:", error);
    response.statusCode = 500;
    response.message = "Server error while approving payment";
    return sendResponse(res, response);
  }
};
