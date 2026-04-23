import Footer from "../components/Footer";
import bookOpen from "../assets/book-open.png";

const SPINE_COLORS = ["#C8C0B4","#B4C0C0","#C4BAC8","#B8C4B4","#C8BCBC","#BCC0C8","#C4C4B4","#C0C4BC"];

export default function HomePage({ setPage }) {
  return (
    <div style={{ minHeight: "calc(100vh - 110px)", background: "#F6F4F0", display: "flex", flexDirection: "column" }}>

      <link href="https://fonts.googleapis.com/css2?family=Passions+Conflict&display=swap" rel="stylesheet" />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: "#FDFAF6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "52px",
        overflow: "hidden",
        width: "100%",
        position: "relative",
      }}>

        {/* Bubble decorations */}
        {[
          { top: "10%", left: "6%",   size: 38, color: "#C4BAC8", opacity: 0.35 },
          { top: "32%", left: "3%",   size: 22, color: "#B8C4B4", opacity: 0.45 },
          { top: "52%", left: "9%",   size: 48, color: "#C8C0B4", opacity: 0.28 },
          { top: "20%", left: "16%",  size: 18, color: "#BCC0C8", opacity: 0.50 },
          { top: "68%", left: "5%",   size: 30, color: "#C4C4B4", opacity: 0.38 },
          { top: "42%", left: "1%",   size: 16, color: "#C8BCBC", opacity: 0.55 },
          { top: "10%", right: "6%",  size: 42, color: "#B4C0C0", opacity: 0.30 },
          { top: "34%", right: "3%",  size: 20, color: "#C8BCBC", opacity: 0.48 },
          { top: "54%", right: "10%", size: 44, color: "#C4BAC8", opacity: 0.28 },
          { top: "22%", right: "18%", size: 16, color: "#C0C4BC", opacity: 0.55 },
          { top: "70%", right: "6%",  size: 28, color: "#B8C4B4", opacity: 0.40 },
          { top: "44%", right: "1%",  size: 18, color: "#C8C0B4", opacity: 0.50 },
        ].map((dot, i) => (
          <div key={i} style={{
            position: "absolute",
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            borderRadius: "50%",
            background: dot.color,
            opacity: dot.opacity,
            border: `2px solid ${dot.color}`,
          }} />
        ))}

        {/* Thin color stripe row — like a row of book spines at the very top of the hero */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          display: "flex",
        }}>
          {SPINE_COLORS.concat(SPINE_COLORS).map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Passions Conflict', cursive",
          fontSize: "96px",
          fontWeight: 400,
          color: "#1A1614",
          margin: "0",
          lineHeight: 1.0,
          letterSpacing: "0.02em",
          textAlign: "center",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}>
          Story Stack
        </h1>

        {/* Book illustration */}
        <img
          src={bookOpen}
          alt="An open book with a plant growing out of it"
          style={{
            width: "580px",
            maxWidth: "80vw",
            display: "block",
            mixBlendMode: "multiply",
            marginTop: "-8px",
            position: "relative",
            zIndex: 4,
          }}
        />

        {/* Gradient fade — hero blends smoothly into the features section */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #F6F4F0)",
          zIndex: 3,
          pointerEvents: "none",
        }} />

      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px", width: "100%", boxSizing: "border-box" }}>

        {/* Row 1: Track your shelf */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center", marginBottom: "88px" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>My Shelf</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "34px", fontWeight: 500, color: "#1A1614", margin: "0 0 20px", lineHeight: 1.2 }}>Track your shelf</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {[
                { label: "Read",       desc: "Log every book you've finished and rate it." },
                { label: "To Be Read", desc: "Keep your TBR pile organised and ready." },
                { label: "Owned",      desc: "Know exactly what's already on your shelves." },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2C2620", flexShrink: 0, marginTop: "7px" }} />
                  <div>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", fontWeight: 600, color: "#1A1614" }}>{label}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8A8480" }}> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("shelf")}
              style={{ background: "#2C2620", border: "none", borderRadius: "6px", padding: "11px 26px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", cursor: "pointer", letterSpacing: "0.03em" }}
            >
              Go to my shelf →
            </button>
          </div>

          {/* Shelf grid mockup */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              {["#E8E4DE", "#D4CEC8", "#2C2620"].map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[
                ["#C8C0B4", "Her Body and Other Parties"],
                ["#B4C0C0", "The Secret History"],
                ["#C4BAC8", "Bunny"],
                ["#B8C4B4", "Caraval"],
                ["#C8BCBC", "Lights Out"],
                ["#BCC0C8", "Butcher & Blackbird"],
                ["#C4C4B4", "Milk and Honey"],
                ["#C0C4BC", "Punk 57"],
              ].map(([col, title], i) => (
                <div key={i} style={{ aspectRatio: "2/3", background: "#F9F7F4", border: `1px solid ${col}`, borderLeft: `3px solid ${col}`, borderRadius: "2px 3px 3px 2px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "10%", left: "10%", right: "10%", height: "1px", background: `${col}BB` }} />
                  <div style={{ position: "absolute", top: "18%", left: "10%", right: "8%", fontFamily: "'Lora', serif", fontSize: "5px", color: "#4A4440", lineHeight: 1.4 }}>{title}</div>
                  <div style={{ position: "absolute", bottom: "12%", left: "10%", right: "10%", height: "1px", background: `${col}88` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#E8E4DE", marginBottom: "88px" }} />

        {/* Row 2: Blind Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E4DE", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {["#E8E4DE", "#D4CEC8", "#2C2620"].map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            {[
              { col: "#C8C0B4", title: "Her Body and Other Parties", vibe: "dark academic tension" },
              { col: "#B4C0C0", title: "The Secret History",          vibe: "slow burn gothic mystery" },
            ].map(({ col, title, vibe }, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "14px", background: "#F9F7F4", borderRadius: "8px", marginBottom: i === 0 ? "10px" : 0 }}>
                <div style={{ width: "38px", height: "54px", flexShrink: 0, background: "#F9F7F4", border: `1px solid ${col}`, borderLeft: `3px solid ${col}`, borderRadius: "2px 3px 3px 2px" }}>
                  <div style={{ padding: "3px 2px", fontFamily: "'Lora', serif", fontSize: "4px", color: "#4A4440", lineHeight: 1.4 }}>{title}</div>
                </div>
                <div style={{ color: "#C0BAB4", fontSize: "14px", flexShrink: 0 }}>→</div>
                <div style={{ width: "38px", height: "54px", flexShrink: 0, background: "#2C2620", borderRadius: "2px 3px 3px 2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: "18px", color: "#F6F4F0", opacity: 0.5 }}>?</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "#B0AAA4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>you might like…</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: "11px", fontStyle: "italic", color: "#6A6460", lineHeight: 1.4 }}>{vibe}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", marginTop: "14px", border: "1px solid #E8E4DE", borderRadius: "6px", overflow: "hidden" }}>
              {["reveal book", "read reason"].map((label, i) => (
                <div key={label} style={{ flex: 1, padding: "8px", background: "#F6F4F0", borderRight: i === 0 ? "1px solid #E8E4DE" : "none", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#8A8480", textAlign: "center" }}>{label}</div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Discover</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "34px", fontWeight: 500, color: "#1A1614", margin: "0 0 20px", lineHeight: 1.2 }}>Blind Date with a Book</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {[
                "Rate books you've read to unlock personalised recommendations.",
                "Get AI-matched suggestions based on your taste — author, genre, and vibe.",
                "Peek at hints before you reveal the title for a true blind date experience.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2C2620", flexShrink: 0, marginTop: "7px" }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8A8480", margin: 0, lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("blinddate")}
              style={{ background: "#2C2620", border: "none", borderRadius: "6px", padding: "11px 26px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", cursor: "pointer", letterSpacing: "0.03em" }}
            >
              Find my next read →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}