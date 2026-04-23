import { useState } from "react";
import BookCover from "./BookCover";
import { COVER_COLORS } from "../constants";

export default function BlindDateCard({ sourceBook, rec, loading, error, onRetry }) {
  const [revealed, setRevealed] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const col = COVER_COLORS[sourceBook.id % COVER_COLORS.length];

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: "10px", padding: "28px 22px 22px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

      {/* Two-column book covers */}
      <div style={{ display: "flex", gap: "12px" }}>

        {/* Source book */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#B0AAA4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            If you liked…
          </div>
          <div style={{ width: "100%" }}>
            <BookCover book={sourceBook} index={sourceBook.id} />
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "11px", fontWeight: 600, color: "#1A1614", textAlign: "center", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {sourceBook.title}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#8A8480" }}>
            {"★".repeat(sourceBook.rating)}{"☆".repeat(5 - sourceBook.rating)}
          </div>
        </div>

        {/* Rec book */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#B0AAA4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            You might like
          </div>

          {loading ? (
            <div style={{ width: "100%", aspectRatio: "2/3", background: "#EDE9E4", borderRadius: "4px" }} />
          ) : error ? (
            <div style={{ width: "100%", aspectRatio: "2/3", background: "#F9F7F4", border: "1px solid #E8E4DE", borderRadius: "4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ color: "#C0BAB4", fontFamily: "'Lora', serif", fontSize: "20px" }}>?</span>
              <button
                onClick={onRetry}
                style={{ background: "none", border: "1px solid #D4CEC8", borderRadius: "4px", padding: "4px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#8A8480", cursor: "pointer", letterSpacing: "0.03em" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2C2620"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#D4CEC8"}
              >
                retry
              </button>
            </div>
          ) : rec ? (
            <div
              onClick={() => setRevealed(!revealed)}
              style={{ width: "100%", aspectRatio: "2/3", background: revealed ? "#F9F7F4" : "#C8C0B4", border: revealed ? `1px solid ${col}` : `1px solid ${col}`, borderLeft: `4px solid ${col}`, borderRadius: "2px 4px 4px 2px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 6px rgba(0,0,0,0.06)", transition: "all 0.4s ease", overflow: "hidden", cursor: "pointer" }}
            >
              {revealed ? (
                <div style={{ padding: "8px 6px", fontFamily: "'Lora', serif", fontSize: "6px", color: "#4A4440", lineHeight: 1.5 }}>{rec.title}</div>
              ) : (
                <div style={{ fontFamily: "'Lora', serif", fontSize: "30px", color: "#FFFFFF", opacity: 0.7 }}>?</div>
              )}
            </div>
          ) : null}

          {/* Vibe / title text */}
          <div style={{ fontFamily: "'Lora', serif", fontSize: "11px", fontWeight: 600, color: revealed ? "#1A1614" : "#6A6460", textAlign: "center", lineHeight: 1.35, fontStyle: revealed ? "normal" : "italic", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "42px", transition: "color 0.3s" }}>
            {loading ? "Finding a match…" : error ? "Unavailable" : revealed ? rec?.title : (rec?.vibe || "A mystery read awaits…")}
          </div>

          {/* Author — shown once revealed */}
          {revealed && rec?.author && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#8A8480", textAlign: "center", marginTop: "-4px" }}>
              {rec.author}
            </div>
          )}
        </div>
      </div>

      {/* Reason expand */}
      {showReason && rec && !loading && !error && (
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6A6460", lineHeight: 1.6, padding: "10px 12px", background: "#F9F7F4", borderRadius: "6px", border: "1px solid #EDE9E4" }}>
          {rec.reason}
          {rec.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
              {rec.tags.map(tag => (
                <span key={tag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#8A8480", background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: "100px", padding: "2px 8px" }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Split button bar */}
      {!loading && !error && rec && (
        <div style={{ display: "flex", borderRadius: "6px", overflow: "hidden", border: "1px solid #E8E4DE", marginTop: "auto" }}>
          <button
            onClick={() => setRevealed(!revealed)}
            style={{ flex: 1, padding: "9px 0", background: "#F6F4F0", border: "none", borderRight: "1px solid #E8E4DE", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.03em", color: "#3A342F", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#EDE9E4"}
            onMouseLeave={e => e.currentTarget.style.background = "#F6F4F0"}
          >
            {revealed ? "hide title" : "reveal book"}
          </button>
          <button
            onClick={() => setShowReason(!showReason)}
            style={{ flex: 1, padding: "9px 0", background: "#F6F4F0", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.03em", color: "#3A342F", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#EDE9E4"}
            onMouseLeave={e => e.currentTarget.style.background = "#F6F4F0"}
          >
            {showReason ? "hide reason" : "read reason"}
          </button>
        </div>
      )}
    </div>
  );
}