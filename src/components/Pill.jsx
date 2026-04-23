export default function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#2C2620" : "transparent",
        border: `1px solid ${active ? "#2C2620" : "#D4CEC8"}`,
        borderRadius: "100px", padding: "5px 16px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
        letterSpacing: "0.03em", color: active ? "#F6F4F0" : "#6A6460",
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}