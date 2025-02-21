import { Server } from "socket.io";
import { User } from "./models/user.model.js";
import { Captain } from "./models/captain.model.js";

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (
        !location ||
        typeof location.lng !== "number" ||
        typeof location.lat !== "number"
      ) {
        console.error("Invalid location data received:", location);
        return socket.emit("error", {
          message: "Invalid location data. Expected numeric ltd and lng.",
        });
      }

      await Captain.findByIdAndUpdate(userId, {
        location: {
         type:'Point',
         coordinates:[location.lng,location.lat],
        },
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io) {
    throw new Error("Socket.io not initialized.");
  }
  io.to(socketId).emit(messageObject.event, messageObject.data);
};

export { initializeSocket, sendMessageToSocketId };
