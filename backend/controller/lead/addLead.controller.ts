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
    // Get data from request body
    const {
      name = "",
      email = "",
      mobileNumber = "",
      source = "",
      address = {},
      contactPersonName = "",
      category = "",
      requirements = "",
      assignedToId = "",
      createdBy = req?.user?.id,
      organizationId = req?.user?.currentOrganizationId,
      status = "New Lead",
    }: ILead = req.body || {};

    // Validation - only name is required
    if (!name.trim()) {
      response.statusCode = 400;
      response.message = "Lead name is required";
      return sendResponse(res, response);
    }

    if (!organizationId) {
      response.statusCode = 400;
      response.message = "Organization ID is required";
      return sendResponse(res, response);
    }

    // Email validation (if provided) - removed duplicate validation
    if (email && email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        response.statusCode = 400;
        response.message = "Invalid email format";
        return sendResponse(res, response);
      }
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      response.statusCode = 400;
      response.message = "Organization not found";
      return sendResponse(res, response);
    }

    // Validate status exists in organization's statuses
    const currentStatuses = organization.statuses as any[];
    const trimmedStatus = status.trim();
    const statusExists = currentStatuses.some(
      (statusObj) => statusObj.name === trimmedStatus
    );

    if (!statusExists) {
      response.statusCode = 400;
      response.message = `Status '${trimmedStatus}' does not exist in organization. Available statuses: ${currentStatuses
        .map((s) => s.name)
        .join(", ")}`;
      return sendResponse(res, response);
    }

    // Check if assigned user exists (if provided)
    if (assignedToId && assignedToId.trim()) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!assignedUser) {
        console.log("Request Body:", req.user);
        response.statusCode = 400;
        response.message = "Assigned user not found";
        return sendResponse(res, response);
      }
    }

    // Check if lead with same email already exists in this organization (if email provided)
    if (email && email.trim()) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          organizationId: organizationId,
        },
      });

      if (existingLead) {
        response.statusCode = 400;
        response.message =
          "Lead with this email already exists in your organization";
        return sendResponse(res, response);
      }
    }

    // Get the next position for this status in the organization
    const maxPositionResult = await prisma.lead.findFirst({
      where: {
        organizationId: organizationId,
        status: trimmedStatus,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const nextPosition = maxPositionResult ? maxPositionResult.position + 1 : 0;

    // Create the lead with calculated position
    const newLead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim().toLowerCase() || "",
        phone: mobileNumber?.trim() || null,
        company: null,
        source: source?.trim() || null,
        budget: null,
        notes: requirements?.trim() || null,
        status: trimmedStatus,
        position: nextPosition, // Set the calculated position
        organizationId: organizationId,
        assignedToId: assignedToId?.trim() || null,
        contactPersonName: contactPersonName?.trim() || null,
        category: category?.trim() || null,
        address:
          address && Object.keys(address).length > 0 ? { ...address } : {},
        createdBy,
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

    // Update organization statuses to add this lead ID to the specified status
    const updatedStatuses = currentStatuses.map((statusObj) => {
      if (statusObj.name === trimmedStatus) {
        return {
          ...statusObj,
          leadIds: [...(statusObj.leadIds || []), newLead.id],
        };
      }
      return statusObj;
    });

    // Update organization with new lead ID in statuses
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        statuses: updatedStatuses,
      },
    });

    response.data = {
      lead: newLead,
      status: "created",
      assignedStatus: trimmedStatus,
      position: nextPosition,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error creating lead:", error);

    if (error.code === "P2002") {
      response.statusCode = 400;
      response.message = "Lead with this email already exists";
      return sendResponse(res, response);
    }

    if (error.code === "P2003") {
      response.statusCode = 400;
      response.message = "Invalid organization or assigned user ID";
      return sendResponse(res, response);
    }

    response.statusCode = 500;
    response.message = error.message || "Internal server error";
    return sendResponse(res, response);
  }
};

export default createLead;
