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
    // Get data from request body
    const {
      organization_name = "",
      company_website = "",
      industry = "",
      company_size = "",
      ownerId = req?.user?.id,
    }: IOrganization = req.body || {};

    // Validation
    if (!organization_name.trim()) {
      response.statusCode = 400;
      response.message = "Organization name is required";
      return sendResponse(res, response);
    }

    if (!industry.trim()) {
      response.statusCode = 400;
      response.message = "Industry is required";
      return sendResponse(res, response);
    }

    if (!company_size.trim()) {
      response.statusCode = 400;
      response.message = "Company size is required";
      return sendResponse(res, response);
    }

    if (company_website && company_website.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(company_website)) {
        response.statusCode = 400;
        response.message = "Invalid website URL format";
        return sendResponse(res, response);
      }
    }

    // Check if organization name already exists
    const existingOrg = await prisma.organization.findFirst({
      where: {
        organization_name: organization_name?.trim(),
      },
    });

    if (existingOrg) {
      response.statusCode = 400;
      response.message = "Organization with this name already exists";
      return sendResponse(res, response);
    }

    // If ownerId is provided, verify the user exists
    if (ownerId) {
      const userExists = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!userExists) {
        response.statusCode = 400;
        response.message = "Owner user not found";
        return sendResponse(res, response);
      }
    }

    // Create the organization
    const newOrganization = await prisma.organization.create({
      data: {
        organization_name: organization_name?.trim(),
        company_website: company_website?.trim() || null,
        industry: industry?.trim(),
        company_size: company_size?.trim(),
        ownerId: ownerId || null,
      },
      include: {
        owner: ownerId
          ? {
              select: {
                id: true,
                username: true,
                email: true,
              },
            }
          : false,
        employees: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    response.data = {
      organization: newOrganization,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    if (error.code === "P2002") {
      response.statusCode = 400;
      response.message = "Organization with this name already exists";
      return sendResponse(res, response);
    }

    if (error.code === "P2003") {
      response.statusCode = 400;
      response.message = "Invalid owner ID provided";
      return sendResponse(res, response);
    }

    response.statusCode = 500;
    response.message = error.message || "Internal server error";
    return sendResponse(res, response);
  }
};

export default createOrganization;
