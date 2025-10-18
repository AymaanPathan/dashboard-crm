// backend/socket.ts
import { Server } from "socket.io";
import { registerRooms } from "../config/socketRooms";

export let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:8000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);
    registerRooms(socket, io);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
