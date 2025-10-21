import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { prismaPaginate } from "../../utils/paginate";

export const getAllQuotationsController = async (
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
    const userId = req?.user?.id;
    const role = req?.user?.role;

    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID missing";
      return sendResponse(res, response);
    }

    const { page = 1, limit = 10, search = "", filter = "all" } = req.query;

    // --- Filter setup ---
    const whereClause: any = { companyId };

    if (role !== "admin") {
      whereClause.lead = { assigneeId: userId };
    }

    if (filter === "pending") whereClause.isOrder = false;
    else if (filter === "converted") whereClause.isOrder = true;

    if (search && typeof search === "string" && search.trim().length > 0) {
      whereClause.OR = [
        { quotationName: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { quoteNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // --- Use reusable pagination helper ---
    const result = await prismaPaginate(prisma.quotation, {
      page: Number(page),
      limit: Number(limit),
      where: whereClause,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            assignedToId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // --- Keep requested page as currentPage ---
    response.data = {
      quotations: result.items,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: Number(page), // <-- changed here
        limit: result.limit,
      },
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in getAllQuotationsController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching quotations";
    return sendResponse(res, response);
  }
};
