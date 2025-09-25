import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import puppeteer from "puppeteer";
import { uploadToS3 } from "../../utils/aws/s3.utils";
import {
  CompanyInfo,
  Config,
  CustomerInfo,
  getClassicTemplate,
  OrderDetails,
} from "../../assets/quote-templates/classic-template";
import { getModernTemplate } from "../../assets/quote-templates/modern-template";
import { getMinimalTemplate } from "../../assets/quote-templates/minimal-template";
import { uploadQuotationPDF } from "../../utils/aws/uploadQuotationPDF";

export const createQuotationController = async (
  req: Request,
  res: Response
) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Quotation created successfully",
    data: null,
    showMessage: true,
  };
  try {
    const companyId = req?.user?.currentOrganizationId;
    const { lead } = req?.body;

    const findLead = await prisma.lead.findUnique({
      where: { id: lead },
    });

    console.log("findLead", findLead);
    const {
      customerInfo,
      orderDetails,

      quotationName,
    } = req.body;

    console.log("Request Body:", req.body);
    console.log("Company ID:", companyId);

    if (!customerInfo || !orderDetails || !companyId) {
      response.statusCode = 400;
      response.message = "Missing required fields";
      return sendResponse(res, response);
    }

    const template = await prisma.quotationTemplate.findFirst({
      where: { companyId },
      include: { company: true },
    });

    if (!template) {
      response.statusCode = 404;
      response.message = "Quotation template not found";
      return sendResponse(res, response);
    }

    const items = orderDetails.items || [];
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * (orderDetails.taxRate || 0.18);
    const total = subtotal + tax;

    const quotation = await prisma.quotation.create({
      data: {
        companyId,
        quotationName,
        templateId: template.id,
        customerName: customerInfo.name,
        customerCompany: customerInfo.company,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items,
        subtotal,
        tax,
        total,
        validUntil: new Date(orderDetails.validUntil),
        quoteNumber: orderDetails.quoteNumber,
        isOrder: false,
      },
    });

    const companyInfoForQuotation: CompanyInfo = {
      website: template.website!,
      gstin: template.gstin!,
      email: template.companyEmail!,
      name: template.companyName!,
      address: template.companyAddress!,
      phone: template.companyPhone!,
    };

    const customerInfoForQuotation: CustomerInfo = {
      address: findLead?.address!,
      name: findLead?.name!,
      company: findLead?.name!,
      email: findLead?.email!,
      phone: findLead?.phone!,
    };

    const orderDetailsForQuotation: OrderDetails = {
      paymentTerms: template.termsAndConditions!,
      validUntil: orderDetails.validUntil,
      quoteNumber: orderDetails.quoteNumber,
      date: new Date().toISOString().split("T")[0],
      items: orderDetails.items,
      taxRate: orderDetails.taxRate || 0.18,
    };

    const bankDetails = template.bankDetails as {
      ifsc?: string;
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
    };

    const config: Config = {
      termsAndConditions: template.termsAndConditions!,
      bankDetails: {
        ifsc: bankDetails.ifsc || "",
        bankName: bankDetails.bankName || "",
        accountName: bankDetails.accountName || "",
        accountNumber: bankDetails.accountNumber || "",
      },
    };

    let htmlContent = "";

    if (template.templateType === "classic") {
      htmlContent = getClassicTemplate(
        companyInfoForQuotation,
        customerInfoForQuotation,
        orderDetailsForQuotation,
        config
      );
    }
    if (template.templateType === "modern") {
      htmlContent = getModernTemplate(
        companyInfoForQuotation,
        customerInfoForQuotation,
        orderDetailsForQuotation,
        config
      );
    }

    if (template.templateType === "minimal") {
      htmlContent = getMinimalTemplate(
        companyInfoForQuotation,
        customerInfoForQuotation,
        orderDetailsForQuotation,
        config
      );
    }
    const pdfUrl = await uploadQuotationPDF(quotation.id, htmlContent);

    await prisma.quotation.update({
      where: { id: quotation.id },
      data: { pdfUrl },
    });

    response.data = { quotation: quotation, pdfUrl: pdfUrl };
    return sendResponse(res, response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
