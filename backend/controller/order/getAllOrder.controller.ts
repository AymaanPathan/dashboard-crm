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

    // If not admin, filter orders belonging to user’s leads
    if (role !== "admin") {
      whereClause.lead = { assignedToId: userId };
    }

    // --- Apply status-based filters ---
    if (filter && filter !== "all") {
      switch (filter) {
        case "pending":
          whereClause.status = "pending";
          break;
        case "confirmed":
          whereClause.status = "confirmed";
          break;
        case "delivered":
          whereClause.status = "delivered";
          break;
        case "cancelled":
          whereClause.status = "cancelled";
          break;
        default:
          break;
      }
    }

    // --- Search ---
    if (search && typeof search === "string" && search.trim().length > 0) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        {
          quotation: { quoteNumber: { contains: search, mode: "insensitive" } },
        },
        {
          quotation: {
            customerName: { contains: search, mode: "insensitive" },
          },
        },
        { lead: { name: { contains: search, mode: "insensitive" } } },
        { lead: { email: { contains: search, mode: "insensitive" } } },
        { lead: { phone: { contains: search, mode: "insensitive" } } },
      ];
    }

    // --- Pagination and data fetch ---
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
            phone: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // --- Response formatting ---
    response.data = {
      orders: result.items,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: Number(page),
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
