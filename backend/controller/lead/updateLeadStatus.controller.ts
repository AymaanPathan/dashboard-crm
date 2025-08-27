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

    console.log("Request body:", req.body);

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

    // Use transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Case 1: Moving within the same status (reordering)
      if (newStatus === oldStatus || !newStatus) {
        const status = newStatus || existingLead.status;

        if (oldPosition < newPosition) {
          // Moving down: shift items up
          await tx.lead.updateMany({
            where: {
              organizationId,
              status,
              position: {
                gt: oldPosition,
                lte: newPosition,
              },
              id: { not: leadId },
            },
            data: {
              position: { decrement: 1 },
              updatedAt: new Date(),
            },
          });
        } else if (oldPosition > newPosition) {
          // Moving up: shift items down
          await tx.lead.updateMany({
            where: {
              organizationId,
              status,
              position: {
                gte: newPosition,
                lt: oldPosition,
              },
              id: { not: leadId },
            },
            data: {
              position: { increment: 1 },
              updatedAt: new Date(),
            },
          });
        }
      }
      // Case 2: Moving to different status
      else if (newStatus !== oldStatus) {
        // Shift items up in old status (fill the gap)
        await tx.lead.updateMany({
          where: {
            organizationId,
            status: oldStatus || existingLead.status,
            position: { gt: oldPosition },
            id: { not: leadId },
          },
          data: {
            position: { decrement: 1 },
            updatedAt: new Date(),
          },
        });

        // Shift items down in new status (make space)
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

        // Update organization JSON statuses
        const organization = await tx.organization.findUnique({
          where: { id: organizationId },
        });

        if (organization) {
          const statuses = organization.statuses as any[];

          const updatedStatuses = statuses.map((status: any) => {
            if (status.name === newStatus) {
              return {
                ...status,
                leadIds: status.leadIds
                  ? [...status.leadIds, leadId]
                  : [leadId],
              };
            } else if (
              status.name === (oldStatus || existingLead.status) &&
              status.leadIds?.includes(leadId)
            ) {
              return {
                ...status,
                leadIds: status.leadIds.filter((id: string) => id !== leadId),
              };
            }
            return status;
          });

          await tx.organization.update({
            where: { id: organizationId },
            data: { statuses: updatedStatuses },
          });
        }
      }

      // Update the moved lead
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          status: newStatus || existingLead.status,
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

      // Return all leads in affected statuses for frontend update
      const affectedStatuses = [
        newStatus || existingLead.status,
        ...(newStatus && newStatus !== (oldStatus || existingLead.status)
          ? [oldStatus || existingLead.status]
          : []),
      ].filter(Boolean);

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
