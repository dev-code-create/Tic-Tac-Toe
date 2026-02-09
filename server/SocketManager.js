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

        //if players are 2 start the game
        if (room.players.length === 2) {
          room.started = true;

          io.to(roomId).emit("game_start", {
            players: room.players,
            gameState: room.gameState,
          });

          console.log(`🎯 Game started in room: ${roomId}`);
        } else {
          socket.emit("waiting_for_opponent", {
            // Only 1 player so far - tell them to wait
            message: "Waiting for opponent to join...",
          });
        }
      } catch (error) {
        console.log("Error joining the room");
        socket.emit("room_error", {
          message: "Error occured while joining the room please try again",
        });
      }
    });

    //Event 2 players makes a move
    (socket.on("make_move"),
      async ({ roomId, index }) => {
        try {
          const room = gameRooms.get(roomId);

          //validate checks
          if (!room) {
            socket.emit("move_error", { message: "Room not found" });
            return;
          }

          if (!room.started) {
            socket.emit("move_error", {
              message: "Game has not started yet",
            });
          }

          if (room.gameState.gameOver) {
            socket.emit("move_error", {
              message: "Game is already over",
            });
          }

          const player = room.players.find((p) => p.id === socket.id);

          if (!player) {
            socket.emit("move_error", {
              message: "Player not found in room",
            });
          }

          const validation = validateMove(
            room.gameState.board,
            index,
            room.gameState.currentTurn,
            player.symbol,
          );

          if (!validation.valid) {
            socket.emit("move_error", {
              message: validation.error,
            });
            return;
          }

          const newGameState = processMove(
            room.gameState,
            index,
            player.symbol,
          );

          room.gameState = newGameState;

          (io.to(roomId).emit("game_update"),
            {
              gameState: newGameState,
              lastMove: {
                index,
                symbol: player.symbol,
                playerName: player.name,
              },
            });

          if (newGameState.gameOver) {
            console.log(
              `🏆 Game over in room ${roomId}. Winner: ${newGameState.winner}`,
            );

            try {
              const matchData = {
                roomId,
                winner: newGameState.winner,
                players: room.players.map((p) => ({
                  name: p.name,
                  symbol: p.symbol,
                })),
                moves: newGameState.moves,
              };

              const match = new Match(matchData);
              await match.save();

              console.log(`💾 Match saved to database`);
            } catch (dbError) {
              console.error("Error saving match to database:", dbError);
            }
          }
        } catch (error) {
          console.error("Error processing move:", error);
          socket.emit("move_error", {
            message: "An error occurred while processing your move.",
          });
        }
      });

    //Reset game
    socket.on("reset_game", ({ roomId }) => {
      try {
        const room = gameRooms.get(roomId);
        if (!room) {
          socket.emit("room_error", { message: "Room not Found" });
          return;
        }

        room.gameState = createGameState();

        (io.to(roomId),
          emit("game_reset", {
            gameState: room.gameState,
          }));

        console.log(`🔄 Game reset in room: ${roomId}`);
      } catch (error) {
        console.error("Error resetting game:", error);
      }
    });

    //event 4 player disconnect

    socket.on("disconnect", () => {
      console.log(`👋 Player disconnected: ${socket.id}`);

      const roomId = socket.data.roomId;

      if (roomId) {
        const room = gameRooms.get(roomId);

        if (room) {
          room.players = room.players.filter((p) => p.id !== socket.id);

          socket.to(roomId).emit("player_disconnected", {
            message: "Your opponent has disconnected.",
          });

          if (room.players.length === 0) {
            gameRooms.delete(roomId);
            console.log(`🗑️  Room ${roomId} deleted (empty)`);
          } else {
            // Reset game for remaining player
            room.started = false;
            room.gameState = createGameState();
          }
        }
      }
    });

    //Event 5: get room history
    socket.on("get_room_history", async ({ roomId }) => {
      try {
        const matches = await Match.find({ roomId })
          .sort({ playedAt: -1 })
          .limit(10)
          .lean();

        socket.emit("room_history", { matches });
      } catch (error) {
        console.error("Error fetching room history", error);
        socket.emit("room_error", {
          message: "Could not fetch room history",
        });
      }
    });
  });

  console.log("🎮 Socket.io manager initialized");
};
