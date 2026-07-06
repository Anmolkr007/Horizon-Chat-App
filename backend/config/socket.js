import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketMiddleware from "../middlewares/socketMiddleware.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketMiddleware); // Use the socket middleware for authentication


const userSocketMap = {};//{userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}


io.on("connection", (socket) => {
  console.log("A user connected: ", socket.user.name);
  userSocketMap[socket.user.id] = socket.id;
  console.log(userSocketMap);
  //to send the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.user.name);
    delete userSocketMap[socket.user.id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export { io, app,userSocketMap, server };
