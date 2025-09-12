// backend/socket.ts
import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:8000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);
    socket.on("register", ({ userId }) => {
      if (userId) {
        socket.join(userId);
        console.log(`🟢 Socket ${socket.id} joined room for user: ${userId}`);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
