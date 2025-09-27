import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

export const getQuotationsByLeadController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Quotations fetched successfully",
    data: null,
    showMessage: true,
  };

  try {
    const companyId = req?.user?.currentOrganizationId;
    const { leadId } = req.body;

    if (!companyId || !leadId) {
      response.statusCode = 400;
      response.message = "Missing company or lead ID";
      return sendResponse(res, response);
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        companyId: companyId,
        leadId: leadId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    response.data = quotations;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
