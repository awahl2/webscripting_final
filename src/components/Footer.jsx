import book from "../assets/book.png";

const LOGO_SRC = book;

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #E8E4DE", background: "#FFFFFF",
      padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={LOGO_SRC} alt="" style={{ height: "28px", mixBlendMode: "multiply", opacity: 0.5 }} />
        <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#B0AAA4" }}>Story Stack</span>
      </div>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#C0BAB4", letterSpacing: "0.06em" }}>
        Your reading life
      </span>
    </footer>
  );
}