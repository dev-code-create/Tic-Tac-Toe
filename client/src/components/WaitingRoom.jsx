import { motion } from "framer-motion";

const WaitingRoom = ({ roomId, playerName }) => {
  const displayName = playerName?.trim() || "PLAYER 1";
  const displayRoomId = roomId?.trim() || "------";

  const copyRoomId = () => {
    if (!roomId?.trim()) {
      return;
    }
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to Clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 text-center"
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-10">
        {/* Animated Logo */}
        <motion.div className="mb-2">
          <div className="inline-block">
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 0, 127, 0.5)",
                  "0 0 40px rgba(0, 243, 255, 0.5)",
                  "0 0 20px rgba(255, 0, 127, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-linear-to-r from-electric-pink via-neon-purple to-neon-cyan bg-clip-text font-display text-5xl font-bold text-transparent md:text-6xl"
            >
              TIC TAC TOE
            </motion.h1>
          </div>
        </motion.div>

        {/* Waiting Card */}
        <motion.div className="flex w-full flex-col gap-8 rounded-[28px] border-2 border-fuchsia-500/80 bg-dark-purple/85 px-8 py-10 shadow-neon-yellow backdrop-blur-xl md:px-12 md:py-12">
          {/* Status */}
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-5 text-4xl"
            >
              ⏳
            </motion.div>

            <h2 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
              WAITING FOR OPPONENT
            </h2>

            <p className="font-body text-gray-400">
              Share the room code with your friend
            </p>
          </div>

          {/* Room Info */}
          <div className="rounded-2xl border-2 border-neon-purple bg-deep-indigo px-6 py-8">
            <div className="mb-8 text-center">
              <p className="mb-3 font-body text-sm text-gray-400">YOUR NAME</p>
              <p className="font-display text-xl text-white font-bold">
                {displayName}
              </p>
            </div>

            <div className="text-center">
              <p className="mb-3 font-body text-sm text-gray-400">ROOM CODE</p>
              <div className="flex items-center justify-center gap-3">
                <motion.p
                  animate={{
                    color: ["#ff007f", "#00f3ff", "#f3f315", "#ff007f"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="font-display text-3xl font-bold tracking-[0.25em] md:text-4xl"
                >
                  {displayRoomId}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyRoomId}
            className="w-full rounded-2xl bg-linear-to-r from-electric-pink to-neon-purple py-5 text-lg font-display font-bold text-white shadow-neon-purple transition-all hover:shadow-neon-pink disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!roomId?.trim()}
          >
            📋 COPY ROOM CODE
          </motion.button>

          {/* Animated Dots */}
          <div className="mt-2 flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="h-3 w-3 rounded-full bg-neon-cyan"
              />
            ))}
          </div>

          {/* Cancel Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-2 text-center"
          >
            <button
              onClick={() => window.location.reload()}
              className="font-body text-sm text-gray-400 underline transition-colors hover:text-white"
            >
              Cancel and go back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WaitingRoom;
