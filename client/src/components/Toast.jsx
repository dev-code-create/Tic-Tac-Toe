import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Toast = ({ message, type = "success", isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  const config = {
    success: {
      bg: "bg-neon-cyan/90",
      border: "border-neon-cyan",
      shadow: "shadow-neon-cyan",
      icon: "✨",
      text: "text-dark-purple"
    },
    error: {
      bg: "bg-electric-pink/90",
      border: "border-electric-pink",
      shadow: "shadow-neon-pink",
      icon: "⚠️",
      text: "text-white"
    },
    info: {
      bg: "bg-neon-purple/90",
      border: "border-neon-purple",
      shadow: "shadow-neon-purple",
      icon: "📬",
      text: "text-white"
    }
  };

  const current = config[type] || config.success;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.8, y: 20, x: "-50%" }}
          className={`fixed bottom-10 left-1/2 z-9999 min-w-75 border-2 ${current.border} ${current.bg} ${current.shadow} px-6 py-4 rounded-2xl backdrop-blur-xl flex items-center gap-4`}
        >
          <span className="text-2xl">{current.icon}</span>
          <p className={`font-display text-sm font-bold tracking-wider ${current.text} uppercase`}>
            {message}
          </p>
          <button 
            onClick={onClose}
            className={`ml-auto ${current.text} opacity-50 hover:opacity-100 transition-opacity`}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
