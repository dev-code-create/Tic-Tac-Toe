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

  return <motion.div></motion.div>;
};

export default lobby;
