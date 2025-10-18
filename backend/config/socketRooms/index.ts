import { Socket, Server } from "socket.io";
import { dashboardRoomForAdmin } from "./dashboardRoom";
import { registerTaskReminderRoom } from "./taskReminderRoom";

export const registerRooms = (socket: Socket, io: Server) => {
  dashboardRoomForAdmin(socket, io);
  registerTaskReminderRoom(socket, io);
};
