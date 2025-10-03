import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const createCompanyTemplateController = async (
  req: Request,
  res: Response
) => {
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
    const companyFound = await prisma.organization.findUnique({
      where: { id: companyId },
    });

    if (!companyFound) {
      response.statusCode = 404;
      response.message = "Company not found";
      return sendResponse(res, response);
    }

    // ✅ 2. Extract nested fields from req.body
    const {
      templateName,
      templateType,
      termsAndConditions,
      defaultNotes,
      company,
      bankDetails,
    } = req.body;

    const termsArray = Array.isArray(termsAndConditions)
      ? termsAndConditions
      : typeof termsAndConditions === "string"
      ? termsAndConditions.split("\n").filter((line) => line.trim() !== "")
      : [];

    const notesArray = Array.isArray(defaultNotes)
      ? defaultNotes
      : typeof defaultNotes === "string"
      ? defaultNotes.split("\n").filter((line) => line.trim() !== "")
      : [];

    const {
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      address: companyAddress,
      gstin,
      website,
    } = company || {};

    const { accountName, accountNumber, ifsc, bankName } = bankDetails || {};

    console.log("Parsed Request Body:", {
      templateName,
      templateType,
      companyName,
      companyEmail,
      companyAddress,
      accountName,
      accountNumber,
      ifsc,
      bankName,
    });

    // ✅ 3. Validate required fields
    if (
      !templateName ||
      !templateType ||
      !companyName ||
      !companyEmail ||
      !companyAddress ||
      !accountName ||
      !accountNumber ||
      !ifsc ||
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
        termsAndConditions: termsArray,
        defaultNotes: notesArray,
        companyName,
        companyEmail,
        companyAddress,
        gstin,
        website,
        companyPhone,
        bankDetails: {
          accountName,
          accountNumber,
          ifsc,
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
