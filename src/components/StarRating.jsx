import { useState } from "react";

export default function StarRating({ rating, onChange }) {
  const [hov, setHov] = useState(0);

  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          onClick={e => { e.stopPropagation(); onChange(s); }}
          onMouseEnter={() => setHov(s)}
          onMouseLeave={() => setHov(0)}
          style={{ fontSize: "13px", cursor: "pointer", userSelect: "none", color: s <= (hov || rating) ? "#2C2620" : "#D4CEC8", transition: "color 0.1s" }}
        >★</span>
      ))}
    </div>
  );
}