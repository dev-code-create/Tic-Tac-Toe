import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

let socket = null;

//Initialize Socket.io connection
export const initSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  socket.on("connect", () => {
    console.log("Connected to the server");
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected", reason);
  });

  socket.on("connect_error", (error) => {
    console.log("Connection error:", error);
  });

  return socket;
};

//Get current socket instance
export const getSocket = () => socket;

//disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
