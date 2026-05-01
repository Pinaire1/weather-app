import { motion } from "framer-motion";

function AnimatedIcon({ condition }) {
  const c = condition?.toLowerCase() || "";

  if (c.includes("clear")) return <SunIcon />;
  if (c.includes("cloud")) return <CloudIcon />;
  if (c.includes("rain") || c.includes("drizzle")) return <RainIcon />;
  if (c.includes("snow")) return <SnowIcon />;
  if (c.includes("thunder")) return <ThunderIcon />;
  return <SunIcon />;
}

function SunIcon() {
  return (
    <motion.div
      className="icon-sun"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      ☀️
    </motion.div>
  );
}

function CloudIcon() {
  return (
    <motion.div
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      ⛅
    </motion.div>
  );
}

function RainIcon() {
  return (
    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      🌧️
    </motion.div>
  );
}

function SnowIcon() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0], rotate: [0, 20, -20, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      ❄️
    </motion.div>
  );
}

function ThunderIcon() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      ⛈️
    </motion.div>
  );
}

export default AnimatedIcon;