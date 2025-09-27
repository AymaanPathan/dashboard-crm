import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

import { getModernTemplate } from "../../assets/quote-templates/modern-template";
import { getMinimalTemplate } from "../../assets/quote-templates/minimal-template";
import { uploadQuotationPDF } from "../../utils/aws/uploadQuotationPDF";
import {
  CompanyInfo,
  Config,
  ICustomerInfo,
  IOrderDetails,
} from "../../models/quotation.model";
import { getClassicTemplate } from "../../assets/quote-templates/classic-template";

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
    const { lead } = req.body;

    const findLead = await prisma.lead.findFirst({
      where: { id: lead },
    });

    const { customerInfo, orderDetails, quotationName } = req.body;

    console.log("Request Body:", req.body);
    console.log("Company ID:", companyId);
    console.log("Lead:", lead);  

    if (!customerInfo || !orderDetails || !companyId || !lead) {
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
        leadId: lead, 
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

    const customerInfoForQuotation: ICustomerInfo = {
      name: findLead?.name!,
      company: findLead?.name!,
      email: findLead?.email!,
      phone: findLead?.phone!,
    };

    const orderDetailsForQuotation: IOrderDetails = {
      items: orderDetails.items,
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
      termsAndConditions: template.termsAndConditions!,
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

    response.data = { quotation, pdfUrl };
    return sendResponse(res, response);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.message = "Server error";
    return sendResponse(res, response);
  }
};
