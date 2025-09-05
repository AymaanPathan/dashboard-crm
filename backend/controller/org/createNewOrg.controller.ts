import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { IOrganization } from "../../models/orgModel";

const createOrganization = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Organization created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const {
      organization_name = "",
      company_website = "",
      industry = "",
      company_size = "",
      ownerId = req?.user?.id,
    }: IOrganization = req.body || {};

    if (!organization_name.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization name is required",
      });
    }

    if (!industry.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Industry is required",
      });
    }

    if (!company_size.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Company size is required",
      });
    }

    if (company_website?.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(company_website)) {
        return sendResponse(res, {
          ...response,
          statusCode: 400,
          message: "Invalid website URL format",
        });
      }
    }

    // Check if org already exists
    const existingOrg = await prisma.organization.findFirst({
      where: {
        organization_name: organization_name.trim(),
      },
    });

    if (existingOrg) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization with this name already exists",
      });
    }

    // Validate owner
    if (!ownerId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Owner user not found",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!userExists) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Owner user not found",
      });
    }

    // ✅ Create organization
    const newOrganization = await prisma.organization.create({
      data: {
        organization_name: organization_name.trim(),
        company_website: company_website?.trim() || null,
        industry: industry.trim(),
        company_size: company_size.trim(),
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        employees: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: ownerId },
      data: { currentOrganizationId: newOrganization.id },
    });

    const defaultStages = [
      { name: "New Lead", order: 0 },
      { name: "Contacted", order: 1 },
      { name: "Negotiation", order: 2 },
      { name: "Closed", order: 3 },
    ];

    await prisma.stage.createMany({
      data: defaultStages.map((s) => ({
        name: s.name,
        order: s.order,
        organizationId: newOrganization.id,
      })),
    });

    response.data = {
      organization: newOrganization,
      status: "created",
      currentOrg: newOrganization,
    };

    if (req.user) {
      req.user.organizationId = newOrganization.id;
    }

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error creating organization:", error);

    if (error.code === "P2002") {
      response.statusCode = 400;
      response.message = "Organization with this name already exists";
    } else if (error.code === "P2003") {
      response.statusCode = 400;
      response.message = "Invalid owner ID provided";
    } else {
      response.statusCode = 500;
      response.message = error.message || "Internal server error";
    }

    return sendResponse(res, response);
  }
};

export default createOrganization;
