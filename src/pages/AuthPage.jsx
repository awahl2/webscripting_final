import { useState } from "react";
import { logIn, signUp } from "../utils/api";
import bookStack from "../assets/book-stack.png";
import book from "../assets/book.png";

const inputStyle = {
  width: "100%",
  border: "1px solid #E8E4DE",
  borderRadius: "8px",
  padding: "12px 16px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#1A1614",
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "12px",
  color: "#6A6460",
  marginBottom: "6px",
  display: "block",
  fontWeight: 500,
};

export default function AuthPage({ setPage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Please enter a valid email.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords don't match.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setLoading(true);
    try {
      if (mode === "login") {
        await logIn(form.email, form.password);
      } else {
        await signUp(form.email, form.password);
      }
      setPage("home");
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ email: "", password: "", confirm: "" });
    setErrors({});
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "#F6F4F0",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    }}>

      {/* Minimal top bar */}
      <div
        onClick={() => setPage("home")}
        style={{
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <img src={book} alt="" style={{ height: "40px", mixBlendMode: "multiply" }} />
        <span style={{ fontFamily: "'Lora', serif", fontSize: "18px", color: "#3A342F", fontWeight: 500 }}>
          Story Stack
        </span>
      </div>

      {/* Main content — flex row instead of grid for safer layout */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 48px 60px",
        boxSizing: "border-box",
        gap: "80px",
        flexWrap: "wrap",
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
          maxWidth: "400px",
          flexShrink: 0,
        }}>

          {/* Heading */}
          <div>
            <h1 style={{
              fontFamily: "'Lora', serif",
              fontSize: "36px",
              fontWeight: 500,
              color: "#1A1614",
              margin: "0 0 8px",
            }}>
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#8A8480",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {mode === "login"
                ? "Sign in to access your shelf and recommendations."
                : "Start tracking your reading life."}
            </p>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={set("email")}
                style={{ ...inputStyle, borderColor: errors.email ? "#C8BCBC" : "#E8E4DE" }}
                onFocus={e => e.target.style.borderColor = "#2C2620"}
                onBlur={e => e.target.style.borderColor = errors.email ? "#C8BCBC" : "#E8E4DE"}
              />
              {errors.email && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#A08888", marginTop: "5px" }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                style={{ ...inputStyle, borderColor: errors.password ? "#C8BCBC" : "#E8E4DE" }}
                onFocus={e => e.target.style.borderColor = "#2C2620"}
                onBlur={e => e.target.style.borderColor = errors.password ? "#C8BCBC" : "#E8E4DE"}
              />
              {errors.password && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#A08888", marginTop: "5px" }}>
                  {errors.password}
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set("confirm")}
                  style={{ ...inputStyle, borderColor: errors.confirm ? "#C8BCBC" : "#E8E4DE" }}
                  onFocus={e => e.target.style.borderColor = "#2C2620"}
                  onBlur={e => e.target.style.borderColor = errors.confirm ? "#C8BCBC" : "#E8E4DE"}
                />
                {errors.confirm && (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#A08888", marginTop: "5px" }}>
                    {errors.confirm}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading ? "#A89C94" : "#2C2620",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "#F6F4F0",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.03em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => !loading && (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Loading..." : (mode === "login" ? "Log in" : "Create account")}
          </button>

          {errors.submit && (
            <div style={{
              background: "#F6E5E5",
              border: "1px solid #E0BFBF",
              borderRadius: "6px",
              padding: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#8A4545",
            }}>
              {errors.submit}
            </div>
          )}

          {/* Toggle mode */}
          <div style={{
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "#8A8480",
          }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => switchMode("signup")}
                  style={{ color: "#2C2620", cursor: "pointer", fontWeight: 500 }}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => switchMode("login")}
                  style={{ color: "#2C2620", cursor: "pointer", fontWeight: 500 }}
                >
                  Log in
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Illustration ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            src={bookStack}
            alt="A stack of books"
            style={{
              width: "380px",
              maxWidth: "90vw",
              mixBlendMode: "multiply",
            }}
          />
        </div>

      </div>
    </div>
  );
}