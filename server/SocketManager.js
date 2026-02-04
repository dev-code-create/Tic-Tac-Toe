import {
  validateMove,
  processMove,
  createGameState,
} from "./Controller/gameController.js";
import Match from "./Models/Match.js";

const gameRooms = new Map();

//Initialize all Socket.io event handlers

export const initializeSocketManager = (io) => {
  io.on("connection", (socket) => {
    console.log(`✨ New connection: ${socket.id}`);

    socket.on("join_room", async ({ roomId, playerName }) => {
      try {
        console.log(`🎮${playerName} joining room: ${roomId}`);

        let room = gameRooms.get(roomId);
        // Room doesn't exist - create it
        if (!room) {
          room = {
            id: roomId,
            players: [],
            gameState: createGameState(),
            started: false,
          };

          gameRooms.set(roomId, room);
          console.log(`🆕 created new room: ${roomId}`);
        }
        //Check if room is full(max 2 players)
        if (room.players.length() >= 2) {
          (socket.emit("room_error"),
            {
              message: "Room is full. Please Join a different room",
            });
        }
      } catch {}
    });
  });
};
