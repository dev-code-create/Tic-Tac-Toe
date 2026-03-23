import { useState, useEffect } from "react";
import { initSocket, getSocket } from "../utils/socket";
import Lobby from "./components/Lobby";

function App() {
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
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-deep-indigo text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-electric-pink rounded-full blur-3xl opacity-10 animate-float"></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default App;
