import { useState, useEffect } from "react";
import { logOut } from "../utils/api";
import book from "../assets/book.png";

const LOGO_SRC = book;

const NAV_ITEMS = [
  { key: "home",      label: "Home" },
  { key: "shelf",     label: "My Shelf" },
  { key: "blinddate", label: "Blind Date with a Book" },
];

export default function Header({ page, setPage, user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    if (menuOpen) window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logOut();
      setUser(null);
      setPage("home");
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header style={{
      background: "#FFFFFF", borderBottom: "1px solid #E8E4DE",
      padding: "0 60px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: "80px",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: "30px", cursor: "pointer" }}
      >
        <img src={LOGO_SRC} alt="Story Stack" style={{ height: "70px", width: "70px", objectFit: "contain", mixBlendMode: "multiply" }} />
        <div style={{ fontFamily: "'Lora', serif", fontSize: "28px", fontWeight: 500, color: "#3A342F", letterSpacing: "0.01em" }}>
          Story Stack
        </div>
      </div>

      {/* Right side: Sign in / User menu + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* Sign in button (only show if not logged in) */}
        {!user && (
          <button
            onClick={() => setPage("auth")}
            style={{
              background: "transparent",
              border: "1px solid #D4CEC8",
              borderRadius: "6px",
              padding: "8px 22px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#3A342F",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#2C2620";
              e.currentTarget.style.color = "#F6F4F0";
              e.currentTarget.style.borderColor = "#2C2620";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#3A342F";
              e.currentTarget.style.borderColor = "#D4CEC8";
            }}
          >
            Sign in
          </button>
        )}

        {/* User email (only show if logged in) */}
        {user && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#6A6460",
            padding: "0 12px",
            borderRight: "1px solid #E8E4DE",
          }}>
            {user.email}
          </div>
        )}

        {/* Hamburger */}
        <div style={{ position: "relative" }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            style={{ width: "32px", height: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {[0, 1, 2].map(i => {
              const isMid = i === 1;
              let rotation = 0, translateY = 0;
              if (menuOpen) {
                if (i === 0) { rotation = 45;  translateY = 11; }
                if (i === 2) { rotation = -45; translateY = -11; }
              }
              return (
                <span key={i} style={{
                  display: "block", height: "2px", width: "100%",
                  background: "#3A342F", borderRadius: "2px", transformOrigin: "center",
                  transform: `rotate(${rotation}deg) translateY(${translateY}px) scaleX(${isMid && menuOpen ? 0 : 1})`,
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }} />
              );
            })}
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: "40px", background: "#FFFFFF",
              border: "1px solid #E8E4DE", borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "8px 0",
              minWidth: "220px", display: "flex", flexDirection: "column",
            }}>
              {NAV_ITEMS.filter(item => item.key === "home" || user).map(item => (
                <div
                  key={item.key}
                  onClick={() => { setPage(item.key); setMenuOpen(false); }}
                  style={{
                    padding: "11px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                    color: page === item.key ? "#1A1614" : "#3A342F",
                    fontWeight: page === item.key ? 500 : 400,
                    cursor: "pointer",
                    background: page === item.key ? "#F6F4F0" : "transparent",
                    display: "flex", alignItems: "center", gap: "10px",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (page !== item.key) e.currentTarget.style.background = "#F6F4F0"; }}
                  onMouseLeave={e => { if (page !== item.key) e.currentTarget.style.background = "transparent"; }}
                >
                  {page === item.key
                    ? <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#2C2620", flexShrink: 0 }} />
                    : <span style={{ width: "4px" }} />
                  }
                  {item.label}
                </div>
              ))}
              
              {/* Logout button (only show if logged in) */}
              {user && (
                <>
                  <div style={{ height: "1px", background: "#E8E4DE", margin: "8px 0" }} />
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                      padding: "11px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                      color: loggingOut ? "#B0AAA4" : "#A08888",
                      cursor: loggingOut ? "not-allowed" : "pointer",
                      background: "transparent", border: "none",
                      textAlign: "left", display: "flex", alignItems: "center", gap: "10px",
                      transition: "background 0.1s",
                      width: "100%",
                    }}
                    onMouseEnter={e => { !loggingOut && (e.currentTarget.style.background = "#FEF5F0"); }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}