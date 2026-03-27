import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Toast from "./Toast";
import Logo from "./Logo";

const GameBoard = ({
  gameState,
  onCellClick,
  playerSymbol,
  players,
  onReset,
  roomId,
}) => {
  const { board, currentTurn, gameOver, winner, winningLine } = gameState;

  const isMyTurn = currentTurn === playerSymbol && !gameOver;

  const getCurrentPlayer = () => {
    return players.find((p) => p.symbol === currentTurn);
  };

  const getWinnerPlayer = () => {
    if (winner === "Draw") return null;
    return players.find((p) => p.symbol === winner);
  };

  const handleCellClick = (index) => {
    if (!isMyTurn || board[index] !== "") return;
    onCellClick(index);
  };

  const isWinningCell = (index) => {
    return winningLine && winningLine.includes(index);
  };

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setToast({
      show: true,
      message: "Room ID copied!",
      type: "success",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-dark-purple/30 backdrop-blur-[2px]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Game Info & Players */}
        <div className="lg:col-span-5 flex flex-col gap-10 order-2 lg:order-1">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Logo className="w-16 h-16 md:w-20 md:h-20" animated={false} />
                <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-electric-pink via-neon-purple to-neon-cyan leading-tight">
                  NEO-TIC <br />
                  TAC TOE
                </h1>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
                <button
                  onClick={copyRoomId}
                  className="font-display text-xs tracking-widest text-neon-yellow uppercase hover:text-white transition-colors cursor-pointer"
                  title="Click to copy Room ID"
                >
                  Room: {roomId}
                </button>
              </div>
            </div>

            {/* Players Area */}
            <div className="grid grid-cols-1 gap-4">
              {players.map((player) => {
                const isActive = player.symbol === currentTurn && !gameOver;
                const isClient = player.symbol === playerSymbol;

                return (
                  <motion.div
                    key={player.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`relative overflow-hidden p-5 rounded-[22px] border-2 transition-all duration-500 backdrop-blur-xl ${
                      isActive
                        ? player.symbol === "X"
                          ? "border-electric-pink shadow-neon-pink bg-electric-pink/10"
                          : "border-neon-cyan shadow-neon-cyan bg-neon-cyan/10"
                        : "border-white/5 bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-glow"
                        className={`absolute inset-0 opacity-20 bg-linear-to-br ${
                          player.symbol === "X"
                            ? "from-electric-pink/40 to-transparent"
                            : "from-neon-cyan/40 to-transparent"
                        }`}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl font-black ${
                            player.symbol === "X"
                              ? "bg-electric-pink text-white"
                              : "bg-neon-cyan text-dark-purple"
                          }`}
                        >
                          {player.symbol}
                        </div>
                        <div>
                          <p className="font-display text-lg font-bold text-white tracking-wide">
                            {player.name}
                          </p>
                          <p
                            className={`font-body text-xs font-medium uppercase tracking-widest ${isClient ? "text-neon-yellow" : "text-white/40"}`}
                          >
                            {isClient ? "You" : "Opponent"}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-display text-[10px] font-bold text-white uppercase tracking-tighter"
                        >
                          Thinking...
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Status / Message Box */}
            <motion.div
              className="p-6 rounded-[22px] bg-white/5 border border-white/10 backdrop-blur-md"
              layout
            >
              <AnimatePresence mode="wait">
                {gameOver ? (
                  <motion.div
                    key="gameover"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div
                      className={`font-display text-2xl font-black italic tracking-tighter ${
                        winner === "Draw"
                          ? "text-neon-yellow"
                          : winner === playerSymbol
                            ? "text-neon-cyan"
                            : "text-electric-pink"
                      }`}
                    >
                      {winner === "Draw"
                        ? ">>> STALEMATE <<<"
                        : winner === playerSymbol
                          ? ">>> VICTORY IS YOURS <<<"
                          : ">>> DEFEAT <<<"}
                    </div>
                    <p className="font-body text-white/60 text-sm leading-relaxed">
                      {winner === "Draw"
                        ? "Both powers are equally matched. The cycle continues."
                        : winner === playerSymbol
                          ? "Outstanding performance. You have conquered the grid."
                          : `${getWinnerPlayer()?.name} has outmaneuvered you this time.`}
                    </p>
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onReset}
                        className="flex-1 bg-white text-dark-purple font-display font-black text-sm py-4 rounded-xl shadow-xl transition-all"
                      >
                        REMATCH
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.reload()}
                        className="px-6 border-2 border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all rounded-xl"
                      >
                        <span className="sr-only">Leave</span>
                        🚪
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="font-display text-xs font-bold text-white/40 uppercase tracking-[0.3em]">
                      Status Protocol
                    </p>
                    <div className="font-display text-xl font-bold text-white">
                      {isMyTurn ? (
                        <span className="flex items-center gap-2">
                          <span className="text-neon-cyan">Initiating</span>
                          <span className="px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan text-sm">
                            Targeting...
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-white/60">
                          Waiting for{" "}
                          <span className="text-electric-pink italic">
                            {getCurrentPlayer()?.name}
                          </span>
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: The Grid */}
        <div className="lg:col-span-7 flex justify-center items-center order-1 lg:order-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="relative p-2 rounded-4xl bg-linear-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Grid Background Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-neon-purple)_1px,transparent_1px)] bg-size-[24px_24px]" />
            </div>

            <div className="relative grid grid-cols-3 gap-4 p-4 md:p-6 bg-dark-purple/40 rounded-[28px] border border-white/5">
              {board.map((cell, index) => {
                const winning = isWinningCell(index);
                const canClick = isMyTurn && cell === "" && !gameOver;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={!canClick}
                    whileHover={
                      canClick
                        ? {
                            scale: 1.02,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderColor: "rgba(255,255,255,0.2)",
                          }
                        : {}
                    }
                    whileTap={canClick ? { scale: 0.95 } : {}}
                    className={`relative aspect-square w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                      winning
                        ? cell === "X"
                          ? "border-electric-pink shadow-[0_0_30px_rgba(255,0,127,0.4)] z-20"
                          : "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4)] z-20"
                        : "border-white/10 bg-white/2"
                    } ${canClick ? "cursor-crosshair border-white/20" : "cursor-default"}`}
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, rotate: 45 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className={`font-display text-5xl md:text-7xl font-black ${
                            cell === "X"
                              ? "text-electric-pink drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]"
                              : "text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]"
                          }`}
                        >
                          {cell}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Winning Strike Connection Line (Abstracted) */}
                    {winning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 rounded-2xl border-4 ${
                          cell === "X"
                            ? "border-electric-pink"
                            : "border-neon-cyan"
                        } animate-pulse`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Decals */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-neon-yellow opacity-40" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-neon-yellow opacity-40" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-8 hidden md:flex items-center gap-6 text-[10px] font-display font-medium text-white/30 uppercase tracking-[0.4em]"
      >
        <span>Secure Connection Established</span>
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <span>Sync: 0.2ms</span>
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <span>v2.0.4-Neo</span>
      </motion.div>
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default GameBoard;
