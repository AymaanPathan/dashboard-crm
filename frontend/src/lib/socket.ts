// src/lib/socket.ts
import { getUser } from "@/utils/auth.utils";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

const user = getUser();
console.log("User in socket.ts:", user);

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL); 

    socket.on("connect", () => {
      const userId = user?.id;
      socket?.emit("register", { userId });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connect_error:", err);
    });
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
