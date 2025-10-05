import { Request, Response } from "express";
import * as XLSX from "xlsx";

import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";

const importLeadsFromExcel = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Leads imported successfully",
    data: null,
    showMessage: true,
  };

  if (!req.file) {
    response.statusCode = 400;
    response.message = "No file uploaded";
    return sendResponse(res, response);
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const leads: any[] = XLSX.utils.sheet_to_json(sheet);

    const assigneeId = req.body.assigneeId;
    const organizationId = req.user?.currentOrganizationId;
    const createdBy = req.user?.id;

    if (!organizationId) {
      response.statusCode = 400;
      response.message = "Organization ID is required";
      return sendResponse(res, response);
    }

    let createdCount = 0;
    for (const lead of leads) {
      const name = lead["Name"]?.trim();
      if (!name) continue;

      const email = lead["Email"]?.trim()?.toLowerCase() || null;
      const phone = lead["Phone"]?.trim() || null;

      const stage = await prisma.stage.findFirst({
        where: {
          name: lead["Stage"]?.trim(),
          organizationId,
        },
      });

      if (!stage) continue;

      // Skip if lead already exists
      const exists = await prisma.lead.findFirst({
        where: { email, organizationId },
      });
      if (exists) continue;

      const maxPosition = await prisma.lead.findFirst({
        where: { organizationId, stageId: stage.id },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      const nextPosition = maxPosition ? maxPosition.position + 1 : 0;

      await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          source: lead["Source"]?.trim() || null,
          company: lead["Company"]?.trim() || null,
          contactPersonName: lead["Contact Person"]?.trim() || null,
          notes: lead["Notes"]?.trim() || null,
          address: lead["Address"] ? JSON.parse(lead["Address"]) : {},
          assignedToId: assigneeId ,
          createdBy,
          organizationId,
          stageId: stage.id,
          position: nextPosition,
        },
      });

      createdCount++;
    }

    response.data = leads;
    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Import error:", error);
    response.statusCode = 500;
    response.message = error.message || "Internal Server Error";
    return sendResponse(res, response);
  }
};

export default importLeadsFromExcel;
