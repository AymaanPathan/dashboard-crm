import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const confirmQuotationAsOrder = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Order created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { quotationId } = req.body;
    const organizationId = req.user?.currentOrganizationId;

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      response.statusCode = 404;
      response.message = "Quotation not found";
      return sendResponse(res, response);
    }

    if (quotation.isOrder) {
      response.statusCode = 400;
      response.message = "Quotation already confirmed as order";
      return sendResponse(res, response);
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        quotationId,
        organizationId,
        leadId: quotation.leadId,
        orderNumber,
        status: "confirmed",
        totalAmount: quotation.total,
        confirmedAt: new Date(),
      },
    });

    await prisma.quotation.update({
      where: { id: quotationId },
      data: { isOrder: true },
    });

    response.data = order;
    return sendResponse(res, response);
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.message = "Server error";
    return sendResponse(res, response);
  }
};
