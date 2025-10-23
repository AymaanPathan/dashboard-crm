import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { prismaPaginate } from "../../utils/paginate";

export const getAllPaymentsController = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Payments fetched successfully",
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

    // --- Base filter ---
    const whereClause: any = {
      order: { organizationId: companyId },
    };

    // --- Restrict non-admins to their assigned leads only ---
    if (role !== "admin") {
      whereClause.order = {
        ...whereClause.order,
        lead: { assignedToId: userId },
      };
    }

    // --- Apply payment status filters ---
    if (filter && filter !== "all") {
      switch (filter) {
        case "pending":
          whereClause.status = "pending";
          break;
        case "completed":
          whereClause.status = "completed";
          break;
        case "failed":
          whereClause.status = "failed";
          break;
        case "refunded":
          whereClause.status = "refunded";
          break;
        default:
          break;
      }
    }

    // --- Search across customer/order fields ---
    if (search && typeof search === "string" && search.trim().length > 0) {
      whereClause.OR = [
        {
          order: {
            orderNumber: { contains: search, mode: "insensitive" },
          },
        },
        {
          order: {
            quotation: {
              quoteNumber: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          order: {
            quotation: {
              customerName: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          order: {
            lead: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          order: {
            lead: {
              phone: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // --- Fetch paginated results ---
    const result = await prismaPaginate(prisma.payment, {
      page: Number(page),
      limit: Number(limit),
      where: whereClause,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            quotation: {
              select: {
                id: true,
                quoteNumber: true,
                customerName: true,
                customerPhone: true,
              },
            },
            lead: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            transactionId: true,
            method: true,
            paymentProofUrl: true,
            status: true,
            paidAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // --- Response ---
    response.data = {
      payments: result.items,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: Number(page),
        limit: result.limit,
      },
    };

    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in getAllPaymentsController:", error);
    response.statusCode = 500;
    response.message = "Server error while fetching payments";
    return sendResponse(res, response);
  }
};
