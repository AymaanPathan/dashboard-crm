import prisma from "../../utils/prisma";
import { Request, Response } from "express";
export const updateLeadDragDrop = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    const {
      newStatus,
      newPosition,
      oldStatus,
      oldPosition,
      organizationId = req?.user?.currentOrganizationId,
    } = req.body;

    if (!leadId || newPosition === undefined || !organizationId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID, position, and organization ID are required",
      });
    }

    // Check if lead exists and user has permission
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId: organizationId,
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or access denied",
      });
    }
    const result = await prisma.$transaction(async (tx) => {
      const currentStatus = oldStatus || existingLead.status;

      // ✅ 1. If reordering within same column
      if (newStatus === currentStatus) {
        if (newPosition === oldPosition) {
          // Nothing to do
        } else if (newPosition > oldPosition) {
          // Dragging downward in the same column
          await tx.lead.updateMany({
            where: {
              organizationId,
              status: currentStatus,
              position: { gt: oldPosition, lte: newPosition },
              id: { not: leadId },
            },
            data: {
              position: { decrement: 1 },
              updatedAt: new Date(),
            },
          });
        } else {
          // Dragging upward in the same column
          await tx.lead.updateMany({
            where: {
              organizationId,
              status: currentStatus,
              position: { gte: newPosition, lt: oldPosition },
              id: { not: leadId },
            },
            data: {
              position: { increment: 1 },
              updatedAt: new Date(),
            },
          });
        }
      }

      // ✅ 2. If moving between columns
      else {
        // Shift old column leads up
        await tx.lead.updateMany({
          where: {
            organizationId,
            status: currentStatus,
            position: { gt: oldPosition },
            id: { not: leadId },
          },
          data: {
            position: { decrement: 1 },
            updatedAt: new Date(),
          },
        });

        // Shift new column leads down
        await tx.lead.updateMany({
          where: {
            organizationId,
            status: newStatus,
            position: { gte: newPosition },
          },
          data: {
            position: { increment: 1 },
            updatedAt: new Date(),
          },
        });

        // ✅ Update organization.statuses leadIds (safely remove and insert)
        const organization = await tx.organization.findUnique({
          where: { id: organizationId },
        });

        if (organization) {
          const statuses = organization.stages as any[];

          const updatedStatuses = statuses.map((status: any) => {
            if (status.name === currentStatus) {
              return {
                ...status,
                leadIds: (status.leadIds || []).filter(
                  (id: string) => id !== leadId
                ),
              };
            }

            if (status.name === newStatus) {
              const ids = status.leadIds || [];
              // Avoid duplicate before inserting
              const withoutLead = ids.filter((id: string) => id !== leadId);
              withoutLead.splice(newPosition, 0, leadId); // insert at correct position
              return {
                ...status,
                leadIds: withoutLead,
              };
            }

            return status;
          });

          await tx.organization.update({
            where: { id: organizationId },
            data: { stages: updatedStatuses },
          });
        }
      }

      // ✅ Update the dragged lead
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          status: newStatus,
          position: newPosition,
          updatedAt: new Date(),
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // ✅ Fetch updated leads in affected statuses
      const affectedStatuses = Array.from(
        new Set([currentStatus, newStatus])
      ).filter(Boolean);

      const affectedLeads = await tx.lead.findMany({
        where: {
          organizationId,
          status: { in: affectedStatuses },
        },
        include: {
          assignedTo: {
            select: { id: true, username: true, email: true },
          },
        },
        orderBy: [{ status: "asc" }, { position: "asc" }],
      });

      return {
        updatedLead,
        affectedLeads,
      };
    });

    res.status(200).json({
      success: true,
      message: "Lead position updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating lead position:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : {},
    });
  }
};
