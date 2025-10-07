import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { ResponseModel, sendResponse } from "../../utils/response.utils";
import { ILead } from "../../models/lead.model";

const createLead = async (req: Request, res: Response) => {
  const response: ResponseModel = {
    statusCode: 200,
    message: "Lead created successfully",
    data: null,
    showMessage: true,
  };

  try {
    const {
      name = "",
      email = "",
      mobileNumber = "",
      source = "",
      address = {},
      contactPersonName = "",
      leadType = "",
      requirements = "",
      assignedToId = "",
      stageId = "",
      createdBy = req?.user?.id,
      organizationId = req?.user?.currentOrganizationId,
    }: ILead & { stageId: string } = req.body || {};

    // ========== 🧩 BASIC VALIDATION ==========
    if (!name.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Company name is required",
      });
    }

    if (!email.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead Email is required",
      });
    }

    if (!mobileNumber.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead Mobile number is required",
      });
    }

    if (!source.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead source is required",
      });
    }

    if (!leadType.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead type is required",
      });
    }

    if (!assignedToId.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead Assigned user is required",
      });
    }

    if (!stageId.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead Stage ID is required",
      });
    }

    if (!organizationId) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Organization ID is required",
      });
    }

    // ========== 📧 EMAIL FORMAT VALIDATION ==========
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Please enter a valid email address.",
      });
    }

    // ========== 📞 PHONE NUMBER VALIDATION ==========
    const phonePattern = /^[0-9+\-\s()]{7,15}$/;
    if (!phonePattern.test(mobileNumber.trim())) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message:
          "Invalid mobile number format (only digits, spaces, +, - allowed)",
      });
    }

    // ========== 📍 ADDRESS VALIDATION ==========
    const { street = "", city = "", state = "", pincode = "" } = address || {};
    console.log("sdds", req.body);

    if (!street.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Street is required to create a lead",
      });
    }

    if (!city.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "City is required to create a lead",
      });
    }

    if (!state.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "State is required to create a lead",
      });
    }

    if (!pincode.trim()) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Pincode is required to create a lead",
      });
    }

    // ========== 📊 STAGE VALIDATION ==========
    const stage = await prisma.stage.findFirst({
      where: { id: stageId, organizationId },
    });

    if (!stage) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Stage not found or does not belong to this organization",
      });
    }

    // ========== 👤 ASSIGNED USER VALIDATION ==========
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!assignedUser) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Assigned user not found",
      });
    }

    // ========== 🚫 DUPLICATE EMAIL CHECK ==========
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        organizationId,
      },
    });

    if (existingLead) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "A lead with this email already exists in your organization",
      });
    }

    // ========== 📈 NEXT POSITION ==========
    const maxPosition = await prisma.lead.findFirst({
      where: { organizationId, stageId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = maxPosition ? maxPosition.position + 1 : 0;

    const ExistingLead = await prisma.lead.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        organizationId,
      },
    });
    if (ExistingLead) {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "A lead with this email already exists in your organization",
      });
    }

    // ========== ✅ CREATE LEAD ==========
    const newLead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: mobileNumber.trim(),
        source: source.trim(),
        contactPersonName: contactPersonName?.trim() || "",
        leadType: leadType.trim(),
        requirements: requirements?.trim() || "",
        address: { street, city, state, pincode },
        assignedToId,
        createdBy,
        organizationId,
        stageId,
        position: nextPosition,
      },
      include: {
        organization: { select: { id: true, organization_name: true } },
        assignedTo: { select: { id: true, username: true, email: true } },
      },
    });

    response.data = {
      lead: newLead,
      status: "created",
      stage: stage.name,
      position: nextPosition,
    };

    return sendResponse(res, response);
  } catch (error: any) {
    console.error("Error creating lead:", error);

    if (error.code === "P2002") {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Lead with this email already exists",
      });
    }

    if (error.code === "P2003") {
      return sendResponse(res, {
        ...response,
        statusCode: 400,
        message: "Invalid organization or assigned user ID",
      });
    }

    return sendResponse(res, {
      ...response,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};

export default createLead;
