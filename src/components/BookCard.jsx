import { useState } from "react";
import BookCover from "./BookCover";
import StarRating from "./StarRating";
import EditBookModal from "./EditBookModal";

export default function BookCard({ book, index, onToggleRead, onRate, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      {editOpen && (
        <EditBookModal
          book={book}
          onClose={() => setEditOpen(false)}
          onSave={updated => { onEdit(updated); setEditOpen(false); }}
        />
      )}
      <div
        onClick={() => setOpen(!open)}
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: "6px", padding: "14px 12px", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s", boxShadow: open ? "0 8px 28px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", transform: open ? "translateY(-4px)" : "none", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}
      >
        <BookCover book={book} index={index} />

        {!open ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", fontWeight: 600, color: "#1A1614", lineHeight: 1.35 }}>{book.title}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8A8480", letterSpacing: "0.01em" }}>{book.author}</div>
            <div style={{ marginTop: "3px" }}>
              {book.read
                ? <StarRating rating={book.rating} onChange={r => onRate(book.id, r)} />
                : <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#C0BAB4", letterSpacing: "0.05em" }}>unread</span>
              }
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", fontWeight: 600, color: "#1A1614", flex: 1 }}>{book.title}</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={e => { e.stopPropagation(); setEditOpen(true); }}
                  style={{ background: "none", border: "1px solid #E8E4DE", borderRadius: "4px", cursor: "pointer", padding: "3px 5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#B0AAA4", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2C2620"; e.currentTarget.style.color = "#2C2620"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E4DE"; e.currentTarget.style.color = "#B0AAA4"; }}
                  title="Edit book"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(book.id); }}
                  style={{ background: "none", border: "1px solid #E8E4DE", borderRadius: "4px", cursor: "pointer", padding: "3px 5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#B0AAA4", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#D4594E"; e.currentTarget.style.color = "#D4594E"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E4DE"; e.currentTarget.style.color = "#B0AAA4"; }}
                  title="Delete book"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #EDE9E4", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {[["Author", book.author], ["Genre", book.genre], ["Pages", book.pages]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#B0AAA4", letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: "11px", color: "#3A3430", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onToggleRead(book.id); }}
              style={{ background: book.read ? "transparent" : "#2C2620", border: `1px solid ${book.read ? "#D4CEC8" : "#2C2620"}`, borderRadius: "4px", padding: "6px 0", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.04em", color: book.read ? "#8A8480" : "#F6F4F0", cursor: "pointer", width: "100%" }}
            >
              {book.read ? "Mark as unread" : "Mark as read"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}