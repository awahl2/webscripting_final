import { useState } from "react";

const inputStyle = { width: "100%", border: "1px solid #E8E4DE", borderRadius: "6px", padding: "10px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", background: "#FDFCFB", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" };
const labelStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", display: "block" };

export default function RecommendModal({ books, onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [sourceId, setSourceId] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", reason: "", tags: "" });

  const ratedBooks = books.filter(b => b.read && b.rating > 0);
  const source = ratedBooks.find(b => b.id === sourceId);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim() || !source) return;
    onAdd({
      sourceBookId: source.id,
      sourceTitle: source.title,
      sourceAuthor: source.author,
      sourceRating: source.rating,
      rec: {
        title: form.title.trim(),
        author: form.author.trim(),
        reason: form.reason.trim() || "A great read for fans of this book.",
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        vibe: "",
        manual: true,
      },
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,22,20,0.35)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "16px", width: "500px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ padding: "28px 32px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #F0EDE8" }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "20px", fontWeight: 600, color: "#1A1614" }}>Recommend a Book</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B0AAA4", marginTop: "3px" }}>
              {step === 1 ? "Which book did you enjoy?" : `For readers of "${source?.title}"`}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0AAA4", fontSize: "20px", padding: "2px 6px" }}>✕</button>
        </div>

        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {step === 1 ? (
            <>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8A8480", marginBottom: "4px" }}>Select from your rated books:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                {ratedBooks.length === 0
                  ? <div style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "#C0BAB4", fontSize: "13px", padding: "20px 0", textAlign: "center" }}>Rate some books first to add recommendations.</div>
                  : ratedBooks.map(b => (
                    <div key={b.id} onClick={() => setSourceId(b.id)} style={{ padding: "12px 14px", borderRadius: "8px", border: `1px solid ${sourceId === b.id ? "#2C2620" : "#E8E4DE"}`, background: sourceId === b.id ? "#F6F4F0" : "#FDFCFB", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", fontWeight: 600, color: "#1A1614" }}>{b.title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8A8480", marginTop: "2px" }}>{b.author} · {"★".repeat(b.rating)}{"☆".repeat(5 - b.rating)}</div>
                    </div>
                  ))
                }
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid #F0EDE8" }}>
                <button onClick={onClose} style={{ background: "transparent", border: "1px solid #D4CEC8", borderRadius: "6px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6A6460", cursor: "pointer", marginRight: "10px" }}>Cancel</button>
                <button onClick={() => sourceId && setStep(2)} style={{ background: sourceId ? "#2C2620" : "#D4CEC8", border: "none", borderRadius: "6px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", cursor: sourceId ? "pointer" : "not-allowed" }}>Next →</button>
              </div>
            </>
          ) : (
            <>
              <div><label style={labelStyle}>Recommended Title *</label><input style={inputStyle} placeholder="e.g. The Midnight Library" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
              <div><label style={labelStyle}>Author *</label><input style={inputStyle} placeholder="e.g. Matt Haig" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
              <div><label style={labelStyle}>Why they'd like it</label><input style={inputStyle} placeholder="e.g. Same slow-burn" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
              <div>
                <label style={labelStyle}>Tags</label>
                <input style={inputStyle} placeholder="e.g. Romance, Slow-burn" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#C0BAB4", marginTop: "5px" }}>Separate with commas</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #F0EDE8" }}>
                <button onClick={() => setStep(1)} style={{ background: "transparent", border: "1px solid #D4CEC8", borderRadius: "6px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6A6460", cursor: "pointer" }}>← Back</button>
                <button onClick={handleSubmit} disabled={!form.title.trim() || !form.author.trim()} style={{ background: form.title.trim() && form.author.trim() ? "#2C2620" : "#D4CEC8", border: "none", borderRadius: "6px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", cursor: form.title.trim() && form.author.trim() ? "pointer" : "not-allowed" }}>Add Recommendation</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}