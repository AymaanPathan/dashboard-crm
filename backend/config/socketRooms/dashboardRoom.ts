import { Socket, Server } from "socket.io";

export const dashboardRoomForAdmin = (socket: Socket, io: Server) => {
  const { role, organizationId } = socket.handshake.auth;

  if (role === "admin" && organizationId) {
    socket.join(`org_${organizationId}_admins`);
    console.log(
      `🟢 Admin socket ${socket.id} joined org_${organizationId}_admins`
    );
  } 
};
