import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import AnimatedIcon from "./AnimatedIcon";

const TIME_LABELS = ["Morning", "Afternoon", "Evening", "Night"];

function TimeSlider({ forecast }) {
  const slots = forecast?.list?.slice(0, 4) || [];

  const [index, setIndex] = useState(0);
  const current = slots[index];

  if (!slots.length) return null;

  return (
    <div className="time-slider">
      <h3>Time of Day</h3>
      <div className="slider-labels">
        {TIME_LABELS.map((label, i) => (
          <span key={label} className={i === index ? "active-label" : ""}>
            {label}
          </span>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={slots.length - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="slider"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="slider-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="slider-icon">
            <AnimatedIcon condition={current?.weather?.[0]?.description} />
          </div>
          <p className="slider-temp">{Math.round(current?.main?.temp)}°F</p>
          <p className="slider-desc">{current?.weather?.[0]?.description}</p>
          <div className="slider-details">
            <span>💧 {current?.main?.humidity}%</span>
            <span>💨 {Math.round(current?.wind?.speed)} mph</span>
            <span>🌡️ Feels {Math.round(current?.main?.feels_like)}°F</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default TimeSlider;