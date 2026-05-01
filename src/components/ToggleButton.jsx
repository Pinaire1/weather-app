function ToggleButton({ darkMode, setDarkMode }) {
  return (
    <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ToggleButton;