// controllers/payments/addPaymentTransactionController.ts
import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const addPaymentTransactionController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Transaction recorded and pending accountant verification",
    data: null,
    showMessage: true,
  };

  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const organizationId = req.user?.currentOrganizationId;

    const {
      orderId,
      amount,
      method,
      transactionId, // optional but recommended
      paymentProofUrl, // optional but recommended (one of these required)
      paidAt,
      note,
    } = req.body;

    // Basic validations
    if (!organizationId) {
      response.statusCode = 400;
      response.message = "Organization ID missing";
      return sendResponse(res, response);
    }
    if (!orderId || !amount || !method) {
      response.statusCode = 400;
      response.message = "Missing required fields: orderId, amount, method";
      return sendResponse(res, response);
    }
    if (!transactionId && !paymentProofUrl) {
      response.statusCode = 400;
      response.message =
        "Either transactionId or paymentProofUrl must be provided";
      return sendResponse(res, response);
    }

    // Role check: allow sales_rep and admin to add transactions
    if (role !== "sales_rep" && role !== "admin" && role !== "sales_manager") {
      response.statusCode = 403;
      response.message = "You are not allowed to add payment transactions";
      return sendResponse(res, response);
    }

    // Validate order belongs to org
    const order = await prisma.order.findFirst({
      where: { id: orderId, organizationId },
      select: { id: true, totalAmount: true, leadId: true },
    });
    if (!order) {
      response.statusCode = 404;
      response.message = "Order not found for your organization";
      return sendResponse(res, response);
    }

    // Prevent duplicate transactionId
    if (transactionId) {
      const existingTxn = await prisma.paymentTransaction.findUnique({
        where: { transactionId },
      });
      if (existingTxn) {
        response.statusCode = 400;
        response.message =
          "A transaction with this transactionId already exists";
        return sendResponse(res, response);
      }
    }

    // Find existing Payment for this order OR create one (only once per order)
    let payment = await prisma.payment.findFirst({ where: { orderId } });
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId,
          totalAmount: order.totalAmount ?? Number(amount), // if order.totalAmount missing fallback
          amountPaid: 0,
          status: "pending",
          note: note ?? undefined,
        },
      });
    }

    // Create the pending transaction
    const transaction = await prisma.paymentTransaction.create({
      data: {
        paymentId: payment.id,
        amount: Number(amount),
        transactionId: transactionId ?? `MANUAL-${Date.now()}`,
        paymentProofUrl: paymentProofUrl ?? undefined,
        method,
        status: "pending", // MUST be verified by accountant
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        verifiedAt: new Date(),
        verifiedById: userId,
      },
    });

    // Optionally create a lead log for audit trail
    if (order.leadId) {
      try {
        await prisma.leadLog.create({
          data: {
            leadId: order.leadId,
            userId: userId ?? "system",
            userName: req.user?.username ?? "unknown",
            action: "Payment transaction added",
            details: `Transaction ${transaction.transactionId} of ${transaction.amount} added (pending verification).`,
            type: "payment",
          },
        });
      } catch (e) {
        console.warn("LeadLog creation failed", e);
      }
    }

    response.data = { paymentId: payment.id, transaction };
    return sendResponse(res, response);
  } catch (err) {
    console.error("❌ Error in addPaymentTransactionController:", err);
    response.statusCode = 500;
    response.message = "Server error while adding transaction";
    return sendResponse(res, response);
  }
};
