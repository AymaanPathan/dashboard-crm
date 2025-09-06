import { UserRole } from "./enums/role.enum";
import prisma from "./prisma";

export const getUserManager = async (
  currentUserRole: string,
  userOrganizationId?: string
) => {
  try {
    if (
      currentUserRole === UserRole.admin ||
      currentUserRole === UserRole.finance ||
      currentUserRole === UserRole.ops
    ) {
      const getAllAdmin = await prisma.user.findMany({
        where: {
          role: UserRole.admin,
          currentOrganizationId: userOrganizationId,
        },
      });

      return {
        myRole: UserRole.admin,
        myManagers: getAllAdmin,
      };
    }

    if (currentUserRole === UserRole.sales_manager) {
      const getAdmins = await prisma.user.findMany({
        where: {
          role: UserRole.admin,
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
        myRole: UserRole.sales_manager,
        myManagers: getAdmins,
      };
    }

    if (currentUserRole === UserRole.sales_rep) {
      const allSalesReps = await prisma.user.findMany({
        where: { role: UserRole.sales_manager },
      });

      return {
        myRole: currentUserRole,
        myManagers: allSalesReps,
      };
    }

    return {
      myRole: currentUserRole,
      message: "No hierarchy available for this role.",
    };
  } catch (error) {
    console.error("Error in getUserBasedOnRoles:", error);
    throw error;
  }
};
