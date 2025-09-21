import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const createTemplateController = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Template created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { companyId } = req.body;
    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID is required";
      return sendResponse(res, response);
    }

    // ✅ Check if the company exists
    const company = await prisma.organization.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      response.statusCode = 404;
      response.message = "Company not found";
      return sendResponse(res, response);
    }

    const templatesData = [
      {
        templateType: "classic",
        templateName: "Classic",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/4/44/Logo_example.png",
        headerFont: "Roboto",
        brandColor: "#1a73e8",
        signatureUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Signature_example.png",
        termsAndConditions: "Payment due within 30 days.",
        bankDetails: {
          accountName: "Company Classic",
          accountNumber: "1234567890",
          ifsc: "BANK0001234",
          bankName: "Classic Bank",
        },
        defaultNotes: "Thank you for choosing our services!",
        previewUrl:
          "https://upload.wikimedia.org/wikipedia/commons/4/44/Logo_example.png",
      },
      {
        templateType: "modern",
        templateName: "Modern",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/7/73/Modern_logo_example.png",
        headerFont: "Inter",
        brandColor: "#ff5722",
        signatureUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Signature_example.png",
        termsAndConditions: "Payment due within 15 days.",
        bankDetails: {
          accountName: "Company Modern",
          accountNumber: "9876543210",
          ifsc: "BANK0005678",
          bankName: "Modern Bank",
        },
        defaultNotes: "We appreciate your business!",
        previewUrl:
          "https://upload.wikimedia.org/wikipedia/commons/7/73/Modern_logo_example.png",
      },
      {
        templateType: "minimal",
        templateName: "Minimal",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/1/19/Minimal_logo_example.png",
        headerFont: "Lato",
        brandColor: "#4caf50",
        signatureUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Signature_example.png",
        termsAndConditions: "Payment due within 7 days.",
        bankDetails: {
          accountName: "Company Minimal",
          accountNumber: "1112223334",
          ifsc: "BANK0009999",
          bankName: "Minimal Bank",
        },
        defaultNotes: "Looking forward to serving you again!",
        previewUrl:
          "https://upload.wikimedia.org/wikipedia/commons/1/19/Minimal_logo_example.png",
      },
    ];

    const createdTemplates = [];
    for (const template of templatesData) {
      const created = await prisma.quotationTemplate.create({
        data: {
          companyId, // ✅ this now exists
          ...template,
        },
      });
      createdTemplates.push(created);
    }

    response.data = createdTemplates;
    return sendResponse(res, response);
  } catch (error) {
    console.error("Error creating templates:", error);
    response.statusCode = 500;
    response.message = "Internal server error";
    response.showMessage = false;
    return sendResponse(res, response);
  }
};
