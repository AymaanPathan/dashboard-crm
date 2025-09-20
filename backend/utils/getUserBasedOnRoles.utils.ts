import { UserRole } from "./enums/role.enum";
import prisma from "./prisma";

export const getUserBasedOnRoles = async (
  currentUserId: string,
  currentUserRole: string,
  userOrganizationId?: string
) => {
  try {
    if (currentUserRole === UserRole.admin) {
      const salesManagers = await prisma.user.findMany({
        where: {
          role: UserRole.sales_manager,
          currentOrganizationId: userOrganizationId,
        },
      });

      const financeUsers = await prisma.user.findMany({
        where: {
          role: UserRole.finance,
          currentOrganizationId: userOrganizationId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      const opsUsers = await prisma.user.findMany({
        where: {
          role: UserRole.ops,
          currentOrganizationId: userOrganizationId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      const salesReps = await prisma.user.findMany({
        where: {
          role: UserRole.sales_rep,
          currentOrganizationId: userOrganizationId,
        },
      });

      return {
        role: UserRole.admin,
        salesManagers,
        salesReps,
        financeUsers,
        opsUsers,
      };
    }

    if (currentUserRole === UserRole.sales_manager) {
      const salesReps = await prisma.user.findMany({
        where: {
          role: UserRole.sales_rep,
          managerId: currentUserId,
          currentOrganizationId: userOrganizationId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      return {
        role: UserRole.sales_manager,
        salesReps,
      };
    }

    if (
      currentUserRole === UserRole.sales_rep ||
      currentUserRole === UserRole.finance ||
      currentUserRole === UserRole.ops
    ) {
      const user = await prisma.user.findUnique({
        where: { id: currentUserId, currentOrganizationId: userOrganizationId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      return {
        role: currentUserRole,
        currentUserRole: user,
      };
    }

    return {
      role: currentUserRole,
      message: "No hierarchy available for this role.",
    };
  } catch (error) {
    console.error("Error in getUserBasedOnRoles:", error);
    throw error;
  }
};
