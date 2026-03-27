import { motion } from "framer-motion";

const Logo = ({ className = "w-24 h-24", animated = true }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Glow Filters */}
        <defs>
          <filter id="glowX" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowO" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* X Element */}
        <motion.path
          d="M28 28L72 72"
          stroke="var(--color-electric-pink, #ff007f)"
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ filter: "url(#glowX)" }}
        />
        <motion.path
          d="M72 28L28 72"
          stroke="var(--color-electric-pink, #ff007f)"
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ filter: "url(#glowX)" }}
        />

        {/* O Element */}
        <motion.circle
          cx="50"
          cy="50"
          r="36"
          stroke="var(--color-neon-cyan, #00f3ff)"
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ filter: "url(#glowO)" }}
        />
      </svg>
    </motion.div>
  );
};

export default Logo;
