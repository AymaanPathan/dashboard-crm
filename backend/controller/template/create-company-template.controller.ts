import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const createCompanyTemplateController = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Template created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const companyId = req?.user?.currentOrganizationId;
    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID is required";
      return sendResponse(res, response);
    }

    // ✅ 1. Check if company exists
    const company = await prisma.organization.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      response.statusCode = 404;
      response.message = "Company not found";
      return sendResponse(res, response);
    }

    // ✅ 2. Extract fields from req.body
    const {
      templateName,
      templateType,
      logoUrl,
      headerFont,
      brandColor,
      signatureUrl,
      termsAndConditions,
      defaultNotes,
      companyName,
      companyEmail,
      companyAddress,
      gstin,
      website,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
    } = req.body;

    // ✅ 3. Validate required fields
    if (
      !templateName ||
      !templateType ||
      !companyName ||
      !companyEmail ||
      !companyAddress ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !bankName
    ) {
      response.statusCode = 400;
      response.message = "Missing required fields";
      return sendResponse(res, response);
    }

    // ✅ 4. Create template
    const createdTemplate = await prisma.quotationTemplate.create({
      data: {
        companyId,
        templateName,
        templateType,
        logoUrl,
        headerFont,
        brandColor,
        signatureUrl,
        termsAndConditions,
        defaultNotes,
        companyName,
        companyEmail,
        companyAddress,
        gstin,
        website,
        bankDetails: {
          accountName: accountHolderName,
          accountNumber,
          ifsc: ifscCode,
          bankName,
        },
      },
    });

    response.data = createdTemplate;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error creating template:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = false;
    return sendResponse(res, response);
  }
};
