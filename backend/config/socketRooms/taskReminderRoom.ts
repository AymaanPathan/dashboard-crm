import { Socket, Server } from "socket.io";

export const registerTaskReminderRoom = (socket: Socket, io: Server) => {
  socket.on("registerTaskReminderRoom", ({ userId }) => {
    if (userId) {
      socket.join(userId);
      console.log(`🟢 Socket ${socket.id} joined room for user: ${userId}`);
    }
  });
};
