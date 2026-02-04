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
      } catch {}
    });
  });
};
