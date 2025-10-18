/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUser } from "@/utils/auth.utils";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

// Connect (singleton)
export const connectSocket = (): Socket => {
  if (!socket) {
    const user = getUser();
    console.log("Connecting socket for user:", user);
    if (!user) {
      console.warn("User not found. Socket connection aborted.");
      return null as any;
    }

    socket = io(SOCKET_URL, {
      auth: {
        role: user.role,
        organizationId: user.currentOrganizationId,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      socket?.emit("registerTaskReminderRoom", { userId: user.id });
      socket?.emit(`org_${user.currentOrganizationId}_admins`);
    });

    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("connect_error", (err) =>
      console.error("⚠️ Socket connect_error:", err)
    );
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
