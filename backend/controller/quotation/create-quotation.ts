import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import pdf from "html-pdf";
import {
  CompanyInfo,
  Config,
  getClassicTemplate,
} from "../../quote-templates/classic-template";
import { getMinimalTemplate } from "../../quote-templates/minimal-template";
import { getModernTemplate } from "../../quote-templates/modern-template";

export const createQuotationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerInfo, orderDetails, templateType, companyId } = req.body;

    if (!customerInfo || !orderDetails || !templateType || !companyId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const template = await prisma.quotationTemplate.findFirst({
      where: { templateType, companyId },
      include: { company: true },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // 2️⃣ Prepare totals
    const items = orderDetails.items || [];
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; price: number }) => 0
    );
    const tax = subtotal * (orderDetails.taxRate || 0.18);
    const total = subtotal + tax;

    // 3️⃣ Save quotation in DB
    const quotation = await prisma.quotation.create({
      data: {
        companyId,
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

    // 4️⃣ Prepare company info
    const companyInfo: CompanyInfo = {
      name: template.company.organization_name,
      logo: template.logoUrl,
      address: "123, Example Street, City",
      phone: "9876543210",
      email: "info@example.com",
      website: template.company.company_website || "www.example.com",
      gstin: "22AAAAA0000A1Z5", // optional
    };

    // 5️⃣ Config
    const config: Config = {
      signature: template.signatureUrl,
      termsAndConditions: template.termsAndConditions!,
      bankDetails: template.bankDetails!,
      brandColor: template.brandColor!,
      headerFont: template.headerFont!,
    };

    // 6️⃣ Generate HTML
    let html = "";
    switch (template.templateType) {
      case "minimal":
        html = getMinimalTemplate(
          companyInfo,
          customerInfo,
          orderDetails,
          config
        );
        break;
      case "classic":
        html = getClassicTemplate(
          companyInfo,
          customerInfo,
          orderDetails,
          config
        );
        break;
      case "modern":
        html = getModernTemplate(
          companyInfo,
          customerInfo,
          orderDetails,
          config
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid templateType" });
    }

    // 7️⃣ Convert HTML → PDF
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) return res.status(500).send("PDF generation failed");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=${quotation.quoteNumber}.pdf`
      );
      res.send(buffer);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
