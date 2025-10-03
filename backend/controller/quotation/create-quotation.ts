import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { getModernTemplate } from "../../assets/quote-templates/modern-template";
import { getMinimalTemplate } from "../../assets/quote-templates/minimal-template";
import { getClassicTemplate } from "../../assets/quote-templates/classic-template";
import { uploadQuotationPDF } from "../../utils/aws/uploadQuotationPDF";
import {
  CompanyInfo,
  Config,
  ICustomerInfo,
  IOrderDetails,
} from "../../models/quotation.model";

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
    const { lead, customerInfo, orderDetails, quotationName } = req.body;

    if (!companyId) {
      response.statusCode = 400;
      response.message = "Company ID missing";
      return sendResponse(res, response);
    }

    if (!lead || typeof lead !== "string") {
      response.statusCode = 400;
      response.message = "Invalid or missing lead ID";
      return sendResponse(res, response);
    }

    if (!quotationName || typeof quotationName !== "string") {
      response.statusCode = 400;
      response.message = "Invalid or missing quotation name";
      return sendResponse(res, response);
    }

    if (
      !customerInfo ||
      typeof customerInfo.name !== "string" ||
      typeof customerInfo.email !== "string" ||
      typeof customerInfo.phone !== "string"
    ) {
      response.statusCode = 400;
      response.message = "Invalid customer info";
      return sendResponse(res, response);
    }

    const { billingAddress } = customerInfo;

    if (
      !billingAddress ||
      typeof billingAddress.line !== "string" ||
      typeof billingAddress.city !== "string" ||
      typeof billingAddress.state !== "string" ||
      typeof billingAddress.pincode !== "string"
    ) {
      response.statusCode = 400;
      response.message = "Invalid or missing billing address";
      return sendResponse(res, response);
    }

    if (
      !orderDetails ||
      !Array.isArray(orderDetails.items) ||
      orderDetails.items.length === 0
    ) {
      response.statusCode = 400;
      response.message = "Invalid or empty order items";
      return sendResponse(res, response);
    }

    // ✅ Validate each item has HSN
    for (const item of orderDetails.items) {
      if (!item.hsnCode || typeof item.hsnCode !== "string") {
        response.statusCode = 400;
        response.message = `HSN code missing for item ${item.name || ""}`;
        return sendResponse(res, response);
      }
      if (
        !item.price ||
        typeof item.price !== "number" ||
        !item.quantity ||
        typeof item.quantity !== "number"
      ) {
        response.statusCode = 400;
        response.message = `Invalid price or quantity for item ${
          item.name || ""
        }`;
        return sendResponse(res, response);
      }
    }

    if (
      !orderDetails.validUntil ||
      isNaN(new Date(orderDetails.validUntil).getTime())
    ) {
      response.statusCode = 400;
      response.message = "Invalid or missing validUntil date";
      return sendResponse(res, response);
    }

    if (
      !orderDetails.quoteNumber ||
      typeof orderDetails.quoteNumber !== "string"
    ) {
      response.statusCode = 400;
      response.message = "Missing or invalid quoteNumber";
      return sendResponse(res, response);
    }

    const findLead = await prisma.lead.findFirst({ where: { id: lead } });

    if (!findLead) {
      response.statusCode = 404;
      response.message = "Lead not found";
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

    const items = orderDetails.items;

    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * (orderDetails.taxRate || 0.18);
    const total = subtotal + tax;

    const quotation = await prisma.quotation.create({
      data: {
        leadId: lead,
        companyId: companyId,
        quotationName,
        customerName: customerInfo.name,
        customerCompany: customerInfo.company,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        billingAddress: customerInfo.billingAddress,
        items: orderDetails.items,
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

    const customerInfoForQuotation: ICustomerInfo = {
      name: findLead.name!,
      company: findLead.name!,
      email: findLead.email!,
      phone: findLead.phone!,
    };

    const orderDetailsForQuotation: IOrderDetails = {
      items,
      taxRate: orderDetails.taxRate || 0.18,
      validUntil: orderDetails.validUntil,
      quoteNumber: orderDetails.quoteNumber,
    };

    const bankDetails = template.bankDetails as {
      ifsc?: string;
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
    };

    const config: Config = {
      termsAndConditions: template.termsAndConditions || [],
      bankDetails: {
        ifsc: bankDetails?.ifsc || "",
        bankName: bankDetails?.bankName || "",
        accountName: bankDetails?.accountName || "",
        accountNumber: bankDetails?.accountNumber || "",
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
    } else if (template.templateType === "modern") {
      htmlContent = getModernTemplate(
        companyInfoForQuotation,
        customerInfoForQuotation,
        orderDetailsForQuotation,
        config
      );
    } else if (template.templateType === "minimal") {
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

    const updatedQuotation = await prisma.quotation.findUnique({
      where: { id: quotation.id },
    });

    response.data = { quotation: updatedQuotation };
    return sendResponse(res, response);
  } catch (error) {
    console.error("❌ Error in createQuotationController:", error);
    response.statusCode = 500;
    response.message = "Server error";
    return sendResponse(res, response);
  }
};
