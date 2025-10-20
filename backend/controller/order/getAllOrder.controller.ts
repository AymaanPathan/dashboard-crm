import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { prismaPaginate } from "../../utils/paginate";

export const getAllOrdersController = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Orders fetched successfully",
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
    const whereClause: any = { organizationId: companyId };

    if (role !== "admin") {
      whereClause.leadId = { not: null }; // Optionally filter by user-specific leads if needed
    }

    if (filter && filter !== "all") {
      whereClause.status = filter;
    }

    if (search && typeof search === "string" && search.trim().length > 0) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        {
          quotation: { quoteNumber: { contains: search, mode: "insensitive" } },
        },
        { lead: { name: { contains: search, mode: "insensitive" } } },
        { lead: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // --- Use reusable pagination helper ---
    const result = await prismaPaginate(prisma.order, {
      page: Number(page),
      limit: Number(limit),
      where: whereClause,
      include: {
        quotation: {
          select: {
            id: true,
            quoteNumber: true,
            quotationName: true,
            customerName: true,
          },
        },
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    response.data = {
      orders: result.items,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.page,
        limit: result.limit,
      },
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in getAllOrdersController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching orders";
    return sendResponse(res, response);
  }
};
