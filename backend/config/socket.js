import express from "express";
import http from "http";
import { Server } from "socket.io";
import { sql } from "./DB.js";
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
  socket.on("typing", ({ receiverId }) => {

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
            userId: socket.user.id,
        });
    }

});
socket.on("stopTyping", ({ receiverId }) => {

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {

        io.to(receiverSocketId).emit("userStoppedTyping", {
            userId: socket.user.id,
        });

    }

});
  socket.on("messageRead", async ({ messageId }) => {
    try {
        const result = await sql`
            UPDATE messages
            SET is_read = true
            WHERE id = ${messageId}
              AND is_read = false
            RETURNING sender_id, receiver_id;
        `;

        if (result.length === 0) return;

        const senderSocketId = getReceiverSocketId(result[0].sender_id);

        if (senderSocketId) {
            io.to(senderSocketId).emit("allMessageRead", {
                readerId: result[0].receiver_id,
            });
        }

    } catch (err) {
        console.error("messageRead error:", err);
    }
});
});
export { io, app,userSocketMap, server };
