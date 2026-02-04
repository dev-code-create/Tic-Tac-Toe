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
          return; // stops so function immediately so that the third person cant join accidently
        }

        //if playerName already taken in this room
        const existingPlayer = room.players.find((p) => p.name === playerName);
        if (existingPlayer) {
          socket.emit("room_error", {
            message: "A player with this name already exists in the room",
          });
          return;
        }

        const symbol = room.players.lemgth === 0 ? "X" : "0";

        const player = {
          id: socket.id,
          name: playerName,
          symbol,
        };

        //add player to the room
        room.players.push(player);

        //join the socket.io room
        socket.join(roomId);

        socket.data.roomId = roomId;
        socket.data.playerName = playerName;
        socket.data.symbol = symbol;

        //tell the player they successgully joined
        socket.emit("room_joined", {
          roomId,
          playerSymbol: symbol,
          playerName,
          players: room.players,
        });
      } catch {}
    });
  });
};
