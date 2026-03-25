import { useState } from "react";
import { motion } from "framer-motion";

const lobby = ({ onJoinRoom }) => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState("");

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert("Please enter your name");
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
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        //Title
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default lobby;
