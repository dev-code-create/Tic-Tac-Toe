import { useState } from "react";
import { motion } from "framer-motion";

const Lobby = ({ onJoinRoom }) => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(true);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }

    const finalRoomId = isCreating
      ? generateRoomId()
      : roomId.trim().toUpperCase();

    if (!isCreating && !finalRoomId) {
      alert("Please enter a roomID");
      return;
    }
    onJoinRoom(finalRoomId, playerName.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 md:py-16"
    >
      <div className="flex w-full max-w-2xl flex-col gap-12">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 bg-linear-to-r from-electric-pink via-neon-purple to-neon-cyan bg-clip-text font-display text-5xl font-bold leading-none text-transparent animate-glow-pulse md:text-6xl">
            Tic Tac Toe
          </h1>
          <p className="font-body text-lg text-neon-yellow/90 md:text-xl">
            Play online
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="relative overflow-hidden rounded-[28px] border-2 border-fuchsia-500/80 bg-dark-purple/85 px-8 py-10 shadow-neon-yellow backdrop-blur-xl md:px-12 md:py-12"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-r from-electric-pink/18 via-neon-purple/12 to-neon-cyan/18 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 top-10 h-36 w-36 rounded-full bg-neon-cyan/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-electric-pink/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 md:gap-10">
            <div className="flex items-center justify-between gap-6">
              <p className="font-display text-3xl font-bold leading-none text-white md:text-4xl">
                {isCreating ? "Create Room" : "Join Room"}
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 font-display text-xs tracking-[0.2em] text-neon-yellow uppercase">
                Online
              </div>
            </div>

            {/* toggle between create and join */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-deep-indigo/70 p-3">
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className={`rounded-xl px-4 py-3 font-display text-base font-bold tracking-wide transition-all md:text-lg ${
                  isCreating
                    ? "bg-electric-pink text-white shadow-neon-pink"
                    : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className={`rounded-xl px-4 py-3 font-display text-base font-bold tracking-wide transition-all md:text-lg ${
                  !isCreating
                    ? "bg-neon-cyan text-deep-indigo shadow-neon-cyan"
                    : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                Join
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="space-y-3">
                <label className="block font-body text-sm font-medium tracking-[0.12em] text-white/80 uppercase">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={15}
                  className="w-full rounded-2xl border border-white/10 bg-deep-indigo/90 px-6 py-5 font-body text-lg leading-relaxed text-white placeholder:text-gray-500 focus:border-electric-pink focus:outline-none focus:shadow-neon-pink transition-all"
                />
              </div>

              {!isCreating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="block font-body text-sm font-medium tracking-[0.12em] text-white/80 uppercase">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full rounded-2xl border border-white/10 bg-deep-indigo/90 px-6 py-5 font-display text-lg tracking-[0.12em] text-white placeholder:text-gray-500 focus:border-neon-cyan focus:outline-none focus:shadow-neon-cyan transition-all"
                  />
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full rounded-2xl bg-linear-to-r from-electric-pink via-neon-purple to-neon-cyan px-6 py-5 font-display text-lg font-bold tracking-[0.08em] text-white shadow-neon-purple transition-all hover:shadow-neon-pink md:text-xl"
              >
                {isCreating ? "CREATE ROOM" : "JOIN ROOM"}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 font-body text-sm"
        >
          Powered by Socket.io • Real-time multiplayer
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Lobby;
