import { getClassicTemplate } from "../../assets/quote-templates/classic-template";
import { getMinimalTemplate } from "../../assets/quote-templates/minimal-template";
import { getModernTemplate } from "../../assets/quote-templates/modern-template";
import { IOrderDetails } from "../../models/quotation.model";
import {
  CompanyInfo,
  Config,
  ICustomerInfo,
} from "../../models/template.model";
import { uploadOrderPDF } from "../../utils/aws/uploadOrderPDF";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { Request, Response } from "express";

export const confirmQuotationAsOrder = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Order created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const { quotationId } = req.body;
    const organizationId = req.user?.currentOrganizationId;

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      select: {
        templateId: true,
        template: true,
        isOrder: true,
        leadId: true,
        lead: true,
        total: true,
        items: true,
        tax: true,
        validUntil: true,
        id: true,
        quoteNumber: true,
      },
    });

    if (!quotation) {
      response.statusCode = 404;
      response.message = "Quotation not found";
      return sendResponse(res, response);
    }

    if (quotation.isOrder) {
      response.statusCode = 400;
      response.message = "Quotation already confirmed as order";
      return sendResponse(res, response);
    }

    const orderNumber = `ORD-${Date.now()}`;


    const order = await prisma.order.create({
      data: {
        quotationId: quotationId!,
        organizationId,
        leadId: quotation.leadId,
        orderNumber,
        status: "confirmed",
        totalAmount: quotation.total,
        confirmedAt: new Date(),
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        totalAmount: order.totalAmount,
        status: "pending",
      },
    });

    await prisma.quotation.update({
      where: { id: quotationId },
      data: { isOrder: true },
    });

    if (quotation.leadId && organizationId) {
      const closedStage = await prisma.stage.findFirst({
        where: {
          organizationId,
          name: {
            equals: "Closed",
            mode: "insensitive",
          },
        },
      });

      if (closedStage) {
        await prisma.lead.update({
          where: { id: quotation.leadId },
          data: { stageId: closedStage.id },
        });

        await prisma.leadLog.create({
          data: {
            leadId: quotation.leadId,
            userId: req.user?.id!,
            userName: req.user?.username!,
            action: "Lead moved to Closed",
            type: "status_change",
            details: `Lead automatically moved to Closed after order confirmation.`,
          },
        });
      }
    }

    const companyInfoForOrder: CompanyInfo = {
      website: quotation?.template?.website!,
      gstin: quotation?.template?.gstin!,
      email: quotation?.template?.companyEmail!,
      name: quotation?.template?.companyName!,
      address: quotation?.template?.companyAddress!,
      phone: quotation?.template?.companyPhone!,
    };

    const customerInfoForOrder: ICustomerInfo = {
      name: quotation?.lead?.name!,
      company: quotation?.lead?.name!,
      email: quotation?.lead?.email!,
      phone: quotation?.lead?.phone!,
      gstin: quotation?.template?.gstin!,
      address: quotation?.lead?.address!,
    };

    const orderDetailsForOrder: IOrderDetails = {
      items: quotation?.items!,
      taxRate: quotation?.tax,
      validUntil: quotation?.validUntil!,
      quoteNumber: quotation.quoteNumber!,
    };

    const bankDetails = quotation?.template?.bankDetails as {
      ifsc?: string;
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
    };

    const config: Config = {
      termsAndConditions: quotation?.template?.termsAndConditions || [],
      bankDetails: {
        ifsc: bankDetails?.ifsc || "",
        bankName: bankDetails?.bankName || "",
        accountName: bankDetails?.accountName || "",
        accountNumber: bankDetails?.accountNumber || "",
      },
    };

    let htmlContent = "";
    if (quotation?.template?.templateType === "classic") {
      htmlContent = getClassicTemplate(
        companyInfoForOrder,
        customerInfoForOrder,
        orderDetailsForOrder,
        config,
        true
      );
    } else if (quotation?.template?.templateType === "modern") {
      htmlContent = getModernTemplate(
        companyInfoForOrder,
        customerInfoForOrder,
        orderDetailsForOrder,
        config,
        true
      );
    } else if (quotation?.template?.templateType === "minimal") {
      htmlContent = getMinimalTemplate(
        companyInfoForOrder,
        customerInfoForOrder,
        orderDetailsForOrder,
        config,
        true
      );
    }

    const orderPdfUrl = await uploadOrderPDF(order.id, htmlContent);
    await prisma.order.update({
      where: { id: order.id },
      data: { pdfUrl: orderPdfUrl },
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    response.data = { quotation: updatedOrder };

    response.data = order;
    return sendResponse(res, response);
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.message = "Server error";
    return sendResponse(res, response);
  }
};
