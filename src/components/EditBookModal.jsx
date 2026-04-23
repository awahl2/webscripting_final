import { useState, useEffect, useRef } from "react";

const inputStyle = { width: "100%", border: "1px solid #E8E4DE", borderRadius: "6px", padding: "10px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", background: "#FDFCFB", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" };
const labelStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px", display: "block" };

export default function EditBookModal({ book, onClose, onSave }) {
  const [tab, setTab] = useState("details");
  const [form, setForm] = useState({ title: book.title, author: book.author, pages: book.pages || "", genre: book.genre || "", read: book.read });
  const [coverFile, setCoverFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFile = file => { if (file) setCoverFile(file); };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim()) return;
    onSave({ ...book, title: form.title.trim(), author: form.author.trim(), pages: parseInt(form.pages) || 0, genre: form.genre.trim() || "Unlisted", read: form.read, coverUrl: coverFile ? URL.createObjectURL(coverFile) : book.coverUrl });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,22,20,0.35)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "16px", width: "520px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 32px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #F0EDE8" }}>
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "20px", fontWeight: 600, color: "#1A1614" }}>Edit Book</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B0AAA4", marginTop: "3px" }}>Update the details for this book.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0AAA4", fontSize: "20px", padding: "2px 6px" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "4px", padding: "16px 32px 0", background: "#F6F4F0", borderBottom: "1px solid #EDE9E4" }}>
          {[{ v: "details", l: "Details" }, { v: "cover", l: "Cover" }].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)} style={{ background: tab === t.v ? "#FFFFFF" : "transparent", border: "none", borderRadius: "8px 8px 0 0", padding: "9px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: tab === t.v ? 500 : 400, color: tab === t.v ? "#1A1614" : "#8A8480", cursor: "pointer", transition: "all 0.15s", boxShadow: tab === t.v ? "0 -1px 0 0 #EDE9E4, 1px 0 0 0 #EDE9E4, -1px 0 0 0 #EDE9E4" : "none" }}>{t.l}</button>
          ))}
        </div>

        <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {tab === "details" && (
            <>
              <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
              <div><label style={labelStyle}>Author *</label><input style={inputStyle} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Pages</label><input style={inputStyle} type="number" value={form.pages} onChange={e => setForm(f => ({ ...f, pages: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} /></div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Status</label>
                  <div style={{ display: "flex", gap: "8px", paddingTop: "2px" }}>
                    {[{ v: false, l: "Unread" }, { v: true, l: "Read" }].map(opt => (
                      <button key={String(opt.v)} onClick={() => setForm(f => ({ ...f, read: opt.v }))} style={{ flex: 1, padding: "9px 0", border: `1px solid ${form.read === opt.v ? "#2C2620" : "#E8E4DE"}`, borderRadius: "6px", background: form.read === opt.v ? "#2C2620" : "transparent", color: form.read === opt.v ? "#F6F4F0" : "#8A8480", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>{opt.l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Genre</label>
                <input style={inputStyle} value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} onFocus={e => (e.target.style.borderColor = "#2C2620")} onBlur={e => (e.target.style.borderColor = "#E8E4DE")} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#C0BAB4", marginTop: "5px" }}>Separate multiple genres with commas</div>
              </div>
            </>
          )}
          {tab === "cover" && (
            <>
              {book.coverUrl && !coverFile && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", border: "1px solid #EDE9E4", borderRadius: "8px", background: "#FDFCFB" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}><img src={book.coverUrl} alt="current cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ flex: 1 }}><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", fontWeight: 500 }}>Current cover</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", marginTop: "2px" }}>Upload a new image to replace it</div></div>
                </div>
              )}
              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${dragOver ? "#2C2620" : "#D4CEC8"}`, borderRadius: "10px", padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#F6F4F0" : "#FDFCFB", transition: "all 0.15s" }}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                <div style={{ marginBottom: "14px" }}><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 26V14M20 14L15 19M20 14L25 19" stroke="#C0BAB4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 28C7.24 28 5 25.76 5 23C5 20.52 6.84 18.48 9.24 18.08C9.08 17.44 9 16.74 9 16C9 11.58 12.58 8 17 8C20.16 8 22.9 9.84 24.28 12.52C24.84 12.18 25.4 12 26 12C28.76 12 31 14.24 31 17C31 17.34 30.96 17.68 30.9 18C33.2 18.46 35 20.52 35 23C35 25.76 32.76 28 30 28" stroke="#C0BAB4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                {coverFile ? (<div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", fontWeight: 500 }}>{coverFile.name}</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", marginTop: "4px" }}>{(coverFile.size / 1024).toFixed(1)} KB · Click to change</div></div>) : (<><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#3A3430", fontWeight: 500 }}>Choose a file or drag & drop it here.</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B0AAA4", marginTop: "6px" }}>JPEG, PNG, up to 10 MB</div><button onClick={e => { e.stopPropagation(); fileRef.current.click(); }} style={{ marginTop: "16px", background: "transparent", border: "1px solid #D4CEC8", borderRadius: "6px", padding: "7px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6A6460", cursor: "pointer" }}>Browse files</button></>)}
              </div>
              {coverFile && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", border: "1px solid #EDE9E4", borderRadius: "8px", background: "#FDFCFB" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}><img src={URL.createObjectURL(coverFile)} alt="cover preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{coverFile.name}</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", marginTop: "2px" }}>{(coverFile.size / 1024).toFixed(2)} KB</div></div>
                  <button onClick={() => setCoverFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0BAB4", fontSize: "16px", padding: "4px" }}>✕</button>
                </div>
              )}
            </>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid #F0EDE8" }}>
            <button onClick={onClose} style={{ background: "transparent", border: "1px solid #D4CEC8", borderRadius: "6px", padding: "10px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6A6460", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={!form.title.trim() || !form.author.trim()} style={{ background: form.title.trim() && form.author.trim() ? "#2C2620" : "#D4CEC8", border: "none", borderRadius: "6px", padding: "10px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", cursor: form.title.trim() && form.author.trim() ? "pointer" : "not-allowed", transition: "background 0.15s" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}