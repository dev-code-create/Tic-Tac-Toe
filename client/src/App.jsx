import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initSocket, getSocket } from "../utils/socket";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";
import GameBoard from "./components/GameBoard";
import Toast from "./components/Toast";

function App() {
  // Game phase: 'lobby' -> 'waiting' -> 'playing'
  const [gamePhase, setGamePhase] = useState("lobby");
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState({
    board: Array(9).fill(""),
    currentTurn: "X",
    gameOver: false,
    winner: null,
    winningLine: null,
    moves: 0,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    // Initialize socket connection when app loads
    const socket = initSocket();

    // ============================================
    // SOCKET EVENT LISTENERS
    // ============================================

    // Successfully joined a room
    socket.on(
      "room_joined",
      ({ roomId, playerSymbol, playerName, players }) => {
        console.log("Room joined successfully");
        setRoomId(roomId);
        setPlayerSymbol(playerSymbol);
        setPlayerName(playerName);
        setPlayers(players);

        // If only 1 player, show waiting screen
        if (players.length === 1) {
          setGamePhase("waiting");
          showToast(`Welcome ${playerName}! Room created.`, "success");
        } else {
          showToast(`Successfully joined room ${roomId}!`, "success");
        }
      },
    );

    // Game is starting (2 players connected)
    socket.on("game_start", ({ players, gameState }) => {
      console.log("Game starting!");
      setPlayers(players);
      setGameState(gameState);
      setGamePhase("playing");
      showToast("Game started! Good luck.", "info");
    });

    // Game state updated (move was made)
    socket.on("game_update", ({ gameState, lastMove }) => {
      console.log("Game updated:", lastMove);
      setGameState(gameState);
    });

    // Game was reset
    socket.on("game_reset", ({ gameState }) => {
      console.log("Game reset");
      setGameState(gameState);
      showToast("Game has been reset.", "info");
    });

    // Waiting for opponent to join
    socket.on("waiting_for_opponent", ({ message }) => {
      console.log(message);
      setGamePhase("waiting");
    });

    // Error joining room
    socket.on("room_error", ({ message }) => {
      console.error("Room error:", message);
      showToast(message, "error");
      setGamePhase("lobby");
    });

    // Error making a move
    socket.on("move_error", ({ message }) => {
      console.error("Move error:", message);
      showToast(message, "error");
    });

    // Opponent disconnected
    socket.on("player_disconnected", ({ message }) => {
      console.log("Player disconnected");
      showToast(message, "error");
      setGamePhase("waiting");
    });

    // Cleanup: Remove all listeners when component unmounts
    return () => {
      socket.off("room_joined");
      socket.off("game_start");
      socket.off("game_update");
      socket.off("game_reset");
      socket.off("waiting_for_opponent");
      socket.off("room_error");
      socket.off("move_error");
      socket.off("player_disconnected");
    };
  }, []); // Empty dependency array = run once on mount

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================

  const handleJoinRoom = (roomId, playerName) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("join_room", { roomId, playerName });
    }
  };

  const handleMakeMove = (index) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("make_move", { roomId, index });
    }
  };

  const handleResetGame = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("reset_game", { roomId });
    }
  };

  return (
    <div className="min-h-screen bg-deep-indigo text-white">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-electric-pink rounded-full blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-64 h-64 bg-neon-cyan rounded-full blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple rounded-full blur-3xl opacity-5 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {gamePhase === "lobby" && <Lobby onJoinRoom={handleJoinRoom} />}

        {gamePhase === "waiting" && (
          <WaitingRoom roomId={roomId} playerName={playerName} />
        )}

        {gamePhase === "playing" && (
          <GameBoard
            gameState={gameState}
            onCellClick={handleMakeMove}
            playerSymbol={playerSymbol}
            players={players}
            onReset={handleResetGame}
            roomId={roomId}
          />
        )}
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-electric-pink shadow-neon-pink animate-pulse" />
        <span className="font-display text-[10px] tracking-[0.2em] text-white/40 uppercase">
          Created by{" "}
          <span className="text-white/70 hover:text-electric-pink transition-colors cursor-default">
            Ayush
          </span>
        </span>
      </motion.div>
    </div>
  );
}

export default App;
