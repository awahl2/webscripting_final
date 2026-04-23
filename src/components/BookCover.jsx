import { COVER_COLORS } from "../constants";

export default function BookCover({ book, index }) {
  const col = COVER_COLORS[index % COVER_COLORS.length];

  if (book.coverUrl) {
    return (
      <div style={{ width: "100%", aspectRatio: "2/3", borderRadius: "2px 4px 4px 2px", overflow: "hidden", boxShadow: "2px 2px 6px rgba(0,0,0,0.07)" }}>
        <img src={book.coverUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "2/3", background: "#F9F7F4", border: `1px solid ${col}`, borderLeft: `4px solid ${col}`, borderRadius: "2px 4px 4px 2px", position: "relative", overflow: "hidden", boxShadow: "2px 2px 6px rgba(0,0,0,0.07)" }}>
      <div style={{ position: "absolute", top: "18%", left: "12%", right: "10%", height: "1px", background: `${col}CC` }} />
      <div style={{ position: "absolute", top: "22%", left: "12%", right: "25%", height: "1px", background: `${col}88` }} />
      <div style={{ position: "absolute", bottom: "16%", left: "12%", right: "10%", height: "1px", background: `${col}88` }} />
      <div style={{ position: "absolute", top: "28%", left: "12%", right: "10%", fontFamily: "'Lora', serif", fontSize: "7px", color: "#4A4440", lineHeight: 1.5, letterSpacing: "0.02em" }}>{book.title}</div>
      <div style={{ position: "absolute", bottom: "20%", left: "12%", right: "8%", fontFamily: "'DM Sans', sans-serif", fontSize: "6px", color: "#8A8480", letterSpacing: "0.05em" }}>{book.author}</div>
    </div>
  );
}