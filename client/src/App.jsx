import { useState, useEffect } from "react";
import { initSocket, getSocket } from "../utils/socket";
import Lobby from "./components/Lobby";
import WaitingRoom from "./components/WaitingRoom";

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
        <div
          className="absolute bottom-10 right-10 w-64 h-64 bg-neon-cyan rounded-full blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -transform-x-1/2 translate-y-1/2 w-96 h-96 bg-neon-purple rounded-full blur-3xl opacity-5 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* <div className="relative z-10">{gamePhase === "lobby" && <Lobby />}</div> */}

      <WaitingRoom roomId={roomId} playerName={playerName} />
    </div>
  );
}

export default App;
