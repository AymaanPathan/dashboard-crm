import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { ILead } from "../../models/lead.model";

const createLead = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const {
      name = "",
      email = "",
      mobileNumber = "",
      source = "",
      address = {},
      contactPersonName = "",
      requirements = "",
      assignedToId = "",
      stageId = "",
      createdBy = req?.user?.id,
      organizationId = req?.user?.currentOrganizationId,
    }: ILead & { stageId: string } = req.body || {};

    if (!name.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead name is required",
      });
    }

    if (!organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization ID is required",
      });
    }

    // Optional email format validation
    if (email?.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return sendResponse(res, {
          ...response,
          statusCode: 400,
          message: "Invalid email format",
        });
      }
    }

    // 🧠 Validate stage
    const stage = await prisma.stage.findFirst({
      where: {
        id: stageId,
        organizationId: organizationId,
      },
    });

    if (!stage) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Stage not found or does not belong to this organization",
      });
    }

    if (assignedToId?.trim()) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        return sendResponse(res, {
          ...response,
          statusCode: 400,
          message: "Assigned user not found",
        });
      }
    }

    // Check duplicate lead by email
    if (email?.trim()) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          organizationId: organizationId,
        },
      });

      if (existingLead) {
        return sendResponse(res, {
          ...response,
          statusCode: 400,
          message: "Lead with this email already exists in your organization",
        });
      }
    }

    const maxPosition = await prisma.lead.findFirst({
      where: { organizationId, stageId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = maxPosition ? maxPosition.position + 1 : 0;

    const newLead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim().toLowerCase() || "",
        phone: mobileNumber?.trim() || null,
        source: source?.trim() || null,
        notes: requirements?.trim() || null,
        contactPersonName: contactPersonName?.trim() || null,
        address:
          address && Object.keys(address).length > 0 ? { ...address } : {},
        assignedToId: assignedToId?.trim() || null,
        createdBy,
        organizationId,
        stageId,
        position: nextPosition,
      },
      include: {
        organization: {
          select: {
            id: true,
            organization_name: true,
          },
        },
        assignedTo: assignedToId
          ? {
              select: {
                id: true,
                username: true,
                email: true,
              },
            }
          : false,
      },
    });

    response.data = {
      lead: newLead,
      status: "created",
      stage: stage.name,
      position: nextPosition,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error creating lead:", error);

    if (error.code === "P2002") {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead with this email already exists",
      });
    }

    if (error.code === "P2003") {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Invalid organization or assigned user ID",
      });
    }

    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};

export default createLead;
