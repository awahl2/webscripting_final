# Story Stack

## Project Description

Story Stack is a personal reading tracker built with React that lets you manage your book shelf, log what you've read, and rate finished books. The app pulls from a local JSON dataset as its default book list and displays your shelf in a clean, browsable interface, separating books you've read from your to-read pile.

Beyond the assignment, I extended the project with Supabase authentication so users can create accounts and persist their own shelf data, and integrated the Anthropic API to generate personalized book recommendations based on a book's rating and genre tags. A "Blind Date with a Book" feature also lets users discover a mystery pick.

---

## Mini API Schema

The core data lives in `books.json`, an array of book objects used as the app's initial dataset and default shelf state.

```json
{
  "id": 54,
  "title": "The Secret History",
  "author": "Donna Tartt",
  "pages": 573,
  "read": true,
  "rating": 5,
  "genre": "Fiction, Dark Academia, Mystery, Classics, Thriller, Contemporary, Literary Fiction"
}
```

| Field    | Type    | Description |
|----------|---------|-------------|
| `id`     | number  | Unique identifier for each book. Used as a stable key for lookups and Supabase updates, if Supabase were to be used later on. |
| `title`  | string  | Full book title. |
| `author` | string  | Author's name. |
| `pages`  | number  | Page count — used for display and could support reading stats. |
| `read`   | boolean | Whether the book has been read. Drives shelf tab filtering (Read vs. To-Read). |
| `rating` | number  | Score from 0–5. Defaults to `0` for unread books; set by the user after reading. Passed to the AI recommendation prompt. |
| `genre`  | string  | Comma-separated genre tags. Used for filtering, display, and as context in the Anthropic API prompt. Some entries use `"Unlisted"` where genre data wasn't available. |

---

## Component Model

| Component / File | Responsibility |
|---|---|
| `App.jsx` | Root component. Manages global `books` state, auth state, page routing, and the Supabase session listener. Handles fallback from user data → `INITIAL_BOOKS`. |
| `Header` | Top navigation bar. Shows page links and login/logout controls depending on auth state. |
| `HomePage` | Landing page. Entry point for unauthenticated users; surfaces app features and CTAs. |
| `ShelfPage` | Main shelf view. Renders the full book list with Read / To-Read tabs, search/filter, and controls to mark books read, set ratings, and trigger recommendations. |
| `BlindDatePage` | "Blind Date with a Book" feature. Randomly selects an unread book from the shelf and reveals it after a fun interaction. |
| `AuthPage` | Login and sign-up form. Handles client-side validation, error display, and calls to Supabase auth helpers. |
| `books.json` | Static data file. Serves as the seed dataset and fallback shelf when no user is logged in or no saved books exist. |
| `api.js` | Utility module. Exports all Supabase auth functions (`signUp`, `logIn`, `logOut`), shelf CRUD functions (`fetchUserBooks`, `addUserBook`, `updateUserBook`, `deleteUserBook`), and the Anthropic recommendation fetch. |

---

## Test Plan

Tests run as console assertions in `App.jsx` at load time, with a second batch running after books are loaded into state.

| Assert | What It Proves |
|---|---|
| **1. Data Shape** | Every book object has all required fields (`id`, `title`, `author`, `pages`, `genre`, `rating`, `read`). Proves the JSON wasn't accidentally truncated or malformed. |
| **2. Data Length** | The initial books array contains more than 40 entries. Proves the full dataset loaded and wasn't partially lost during import. |
| **3. Field Types** | `id` is a number, `title` is a string, `rating` is a number on every book. Proves no silent type coercion occurred during JSON parsing. |
| **4. Non-Mutation Baseline** | A deep copy of `INITIAL_BOOKS` is taken at startup and compared. Proves the raw data object is not modified before the app even mounts. |
| **5. Unread Count** | More than 30 books have `read: false`. Proves the shelf has meaningful data to display in the To-Read tab. |
| **6. Genre Non-Empty** | Every book's `genre` field is a non-empty string. Proves filtering and AI prompt context won't break on blank genre values. |
| **7. State Populated** | After loading, `books` state contains at least one entry. Proves the state transition from load → render succeeded. |
| **8. Unique IDs** | All book IDs in state are unique (no duplicates). Proves no ID collisions were introduced during a Supabase fetch or merge with local data. |
| **9. Rating Defaults** | Unread books have a rating of `0`. Proves default values weren't corrupted during data load or state initialization. |
| **10. Post-Mount Non-Mutation** | Original `INITIAL_BOOKS` structure is unchanged after the component mounts. Proves no child component or effect accidentally mutated the source array. |

---

## Test Results

Console Output:

```
ASSERT 1: [Data Shape] Verify each book object has all required fields (id, title, author, pages, genre, rating, read) ✓ PASS
App.jsx:28 ASSERT 2: [Data Length] Verify initial books array contains expected minimum count (>40 books) ✓ PASS (65 books found)
App.jsx:34 ASSERT 3: [Data Types] Verify critical fields have correct types (id=number, title=string, rating=number) ✓ PASS
App.jsx:45 ASSERT 4: [Non-Mutation] Verify initial books data is NOT mutated during app lifecycle (baseline snapshot created) ✓ PASS (Baseline created)
App.jsx:52 ASSERT 5: [UI Expectation] Verify expected count of unread books for shelf display (should be high initially) ✓ PASS (52 unread books ready to display)
App.jsx:58 ASSERT 6: [Data Integrity] Verify all books have non-empty genre field for filtering/display ✓ PASS
App.jsx:144 ASSERT 7: [State Validation] Verify books state is populated after loading (not empty) ✓ PASS (65 books in state)
App.jsx:152 ASSERT 8: [Non-Mutation] Verify all book IDs remain unique (no duplicates or ID mutations) ✓ PASS (65 unique IDs)
App.jsx:159 ASSERT 9: [Data Integrity] Verify unread books have default rating of 0 (not corrupted) ✓ PASS (52 unread books with rating=0)
App.jsx:169 ASSERT 10: [Non-Mutation] Verify original INITIAL_BOOKS object structure unchanged after mount ✓ PASS (Original data preserved)
```

---

## LLM Collaboration Snippets

### Snippet 1: Authentication

**Prompt given:**
> "Can you give me a starting point for creating authentication for my website in a jsx file?"

**Excerpt of what it produced:**
```jsx
export default function AuthPage({ setPage, setUser }) {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
 
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null, api: null }));
  };
 
  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Please enter a valid email.";
    if (form.password.length < 6)  e.password = "Password must be at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords don't match.";
    return e;
  };
 
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
 
    setLoading(true);
    try {
      const user = mode === "login"
        ? await logIn(form.email, form.password)
        : await signUp(form.email, form.password);
      setUser(user);
      setPage("home");
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  };
 
  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ email: "", password: "", confirm: "" });
    setErrors({});
  };
  ...
}
```

**What I changed and why:**

I did use this as a starting point, but I corrected a few errors. (If you'd like to see the final product, go to AuthPage.jsx.) I'm not going to list all of them, because I made quite a few changes since this segment. There was an infinite loading issue which was the major error that needed to be fixed. It did suggest I use Supabase, which I did end up using.

**Final File:**

See [AuthPage.jsx](src\pages\AuthPage.jsx)

---

### Snippet 2: Starting Point

**Prompt given:**
> "Using this image, can you give me a starting point for my web scripting project?" (Note: The image was a sketch of what I wanted it to look like.)

**Excerpt of what it produced:**
```js
import { useState, useMemo } from "react";

// Place book.png in your /public folder — Vite serves it at /book.png
const LOGO_SRC = "/book.png";

const BOOKS = [
  { id: 1,  title: "The Secret History",             author: "Donna Tartt",              pages: 559, read: true,  rating: 5, genre: "Literary Fiction"  },
  { id: 2,  title: "Jonathan Strange & Mr Norrell",  author: "Susanna Clarke",            pages: 846, read: true,  rating: 4, genre: "Fantasy"           },
  { id: 3,  title: "A Little Life",                  author: "Hanya Yanagihara",          pages: 720, read: false, rating: 0, genre: "Literary Fiction"  },
  { id: 4,  title: "Piranesi",                       author: "Susanna Clarke",            pages: 272, read: true,  rating: 5, genre: "Fantasy"           },
  { id: 5,  title: "Ninth House",                    author: "Leigh Bardugo",             pages: 458, read: false, rating: 0, genre: "Dark Fantasy"      },
  { id: 6,  title: "The Name of the Rose",           author: "Umberto Eco",               pages: 502, read: true,  rating: 4, genre: "Mystery"           },
  { id: 7,  title: "If We Were Villains",            author: "M.L. Rio",                  pages: 354, read: true,  rating: 5, genre: "Thriller"          },
  { id: 8,  title: "House of Leaves",                author: "Mark Z. Danielewski",       pages: 709, read: false, rating: 0, genre: "Horror"            },
  { id: 9,  title: "Possession",                     author: "A.S. Byatt",                pages: 555, read: true,  rating: 4, genre: "Literary Fiction"  },
  { id: 10, title: "The Historian",                  author: "Elizabeth Kostova",         pages: 642, read: false, rating: 0, genre: "Historical Fiction" },
  { id: 11, title: "Gormenghast",                    author: "Mervyn Peake",              pages: 476, read: true,  rating: 3, genre: "Gothic Fantasy"    },
  { id: 12, title: "Mexican Gothic",                 author: "Silvia Moreno-Garcia",      pages: 301, read: true,  rating: 4, genre: "Gothic Horror"     },
];

// Thin-line cover colors — muted, like a hand-drawn palette
const COVER_COLORS = [
  "#C8C0B4", "#B4C0C0", "#C4BAC8", "#B8C4B4",
  "#C8BCBC", "#BCC0C8", "#C4C4B4", "#C0C4BC",
];

function StarRating({ rating, onChange }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onClick={e => { e.stopPropagation(); onChange(s); }}
          onMouseEnter={() => setHov(s)}
          onMouseLeave={() => setHov(0)}
          style={{ fontSize: "13px", cursor: "pointer", userSelect: "none",
            color: s <= (hov || rating) ? "#2C2620" : "#D4CEC8",
            transition: "color 0.1s" }}
        >★</span>
      ))}
    </div>
  );
}

function BookCover({ book, index }) {
  const col = COVER_COLORS[index % COVER_COLORS.length];
  return (
    <div style={{
      width: "100%", aspectRatio: "2/3",
      background: "#F9F7F4",
      border: `1px solid ${col}`,
      borderLeft: `4px solid ${col}`,
      borderRadius: "2px 4px 4px 2px",
      position: "relative", overflow: "hidden",
      boxShadow: `2px 2px 6px rgba(0,0,0,0.07)`,
    }}>
      {/* Minimal ruled lines, like a plain book cover */}
      <div style={{ position: "absolute", top: "18%", left: "12%", right: "10%",
        height: "1px", background: `${col}CC` }} />
      <div style={{ position: "absolute", top: "22%", left: "12%", right: "25%",
        height: "1px", background: `${col}88` }} />
      <div style={{ position: "absolute", bottom: "16%", left: "12%", right: "10%",
        height: "1px", background: `${col}88` }} />
      <div style={{
        position: "absolute", top: "28%", left: "12%", right: "10%",
        fontFamily: "'Lora', serif", fontSize: "7px", color: "#4A4440",
        lineHeight: 1.5, letterSpacing: "0.02em",
      }}>
        {book.title}
      </div>
      <div style={{
        position: "absolute", bottom: "20%", left: "12%", right: "8%",
        fontFamily: "'DM Sans', sans-serif", fontSize: "6px",
        color: "#8A8480", letterSpacing: "0.05em",
      }}>
        {book.author}
      </div>
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "#2C2620" : "transparent",
      border: `1px solid ${active ? "#2C2620" : "#D4CEC8"}`,
      borderRadius: "100px",
      padding: "5px 16px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px", letterSpacing: "0.03em",
      color: active ? "#F6F4F0" : "#6A6460",
      cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
    }}>
      {label}
    </button>
  );
}

function BookCard({ book, index, onToggleRead, onRate }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DE",
        borderRadius: "6px",
        padding: "14px 12px",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: open ? "0 8px 28px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: open ? "translateY(-4px)" : "none",
        display: "flex", flexDirection: "column", gap: "10px",
        position: "relative",
      }}
    >
      {book.read && (
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#2C2620",
        }} />
      )}

      <BookCover book={book} index={index} />

      {!open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", fontWeight: 600,
            color: "#1A1614", lineHeight: 1.35 }}>
            {book.title}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
            color: "#8A8480", letterSpacing: "0.01em" }}>
            {book.author}
          </div>
          <div style={{ marginTop: "3px" }}>
            {book.read
              ? <StarRating rating={book.rating} onChange={r => onRate(book.id, r)} />
              : <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
                  color: "#C0BAB4", letterSpacing: "0.05em" }}>unread</span>
            }
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "12px", fontWeight: 600, color: "#1A1614" }}>
            {book.title}
          </div>
          <div style={{ borderTop: "1px solid #EDE9E4", paddingTop: "8px",
            display: "flex", flexDirection: "column", gap: "6px" }}>
            {[["Author", book.author], ["Genre", book.genre], ["Pages", book.pages]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
                  color: "#B0AAA4", letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>
                <span style={{ fontFamily: "'Lora', serif", fontSize: "11px", color: "#3A3430",
                  textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onToggleRead(book.id); }}
            style={{
              background: book.read ? "transparent" : "#2C2620",
              border: `1px solid ${book.read ? "#D4CEC8" : "#2C2620"}`,
              borderRadius: "4px", padding: "6px 0",
              fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
              letterSpacing: "0.04em", color: book.read ? "#8A8480" : "#F6F4F0",
              cursor: "pointer", width: "100%",
            }}
          >
            {book.read ? "Mark as unread" : "Mark as read"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyShelf() {
  const [books, setBooks] = useState(BOOKS);
  const [sortBy, setSortBy] = useState("title-asc");
  const [readFilter, setReadFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleRead = id => setBooks(b => b.map(x =>
    x.id === id ? { ...x, read: !x.read, rating: x.read ? 0 : x.rating } : x
  ));
  const rateBook = (id, r) => setBooks(b => b.map(x => x.id === id ? { ...x, rating: r } : x));

  const sortOpts = [
    { v: "title-asc",   l: "Title A–Z"   }, { v: "title-desc",  l: "Title Z–A"  },
    { v: "author-asc",  l: "Author A–Z"  }, { v: "author-desc", l: "Author Z–A" },
    { v: "pages-asc",   l: "Fewest pages"}, { v: "pages-desc",  l: "Most pages" },
  ];

  const displayed = useMemo(() => {
    let list = books.filter(b => {
      if (readFilter === "read" && !b.read) return false;
      if (readFilter === "unread" && b.read) return false;
      const q = search.toLowerCase();
      if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
      return true;
    });
    const [f, d] = sortBy.split("-");
    list.sort((a, b) => {
      let va = f === "pages" ? a.pages : (f === "author" ? a.author : a.title);
      let vb = f === "pages" ? b.pages : (f === "author" ? b.author : b.title);
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return d === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [books, sortBy, readFilter, search]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#F6F4F0", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Navbar */}
        <header style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E4DE",
          padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "68px",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* mix-blend-mode: multiply makes the gray PNG background disappear on white */}
            <img
              src={LOGO_SRC}
              alt="Story Stack"
              style={{ height: "44px", width: "44px", objectFit: "contain", mixBlendMode: "multiply" }}
            />
            <div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 600,
                color: "#1A1614", letterSpacing: "0.01em", lineHeight: 1 }}>
                Story Stack
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
                color: "#B0AAA4", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}>
                Your reading life
              </div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
            {["My Shelf", "Discover", "Lists", "Stats"].map((item, i) => (
              <span key={item} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                color: i === 0 ? "#1A1614" : "#9A9490",
                cursor: "pointer", letterSpacing: "0.02em",
                borderBottom: i === 0 ? "1.5px solid #1A1614" : "none",
                paddingBottom: "2px",
              }}>{item}</span>
            ))}
          </nav>
        </header>

        {/* Page header */}
        <div style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E4DE",
          padding: "36px 48px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: "36px", fontWeight: 500,
              color: "#1A1614", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
              My Shelf
            </h1>
            {/* Stats inline */}
            <div style={{ display: "flex", gap: "28px" }}>
              {[
                { l: "total",     v: books.length },
                { l: "read",      v: books.filter(b => b.read).length },
                { l: "to read",   v: books.filter(b => !b.read).length },
                { l: "pages read",v: books.filter(b => b.read).reduce((s, b) => s + b.pages, 0).toLocaleString() },
              ].map(({ l, v }) => (
                <div key={l}>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: "20px",
                    fontWeight: 500, color: "#1A1614" }}>{v}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                    color: "#B0AAA4", marginLeft: "5px", letterSpacing: "0.04em" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <button style={{
            background: "#2C2620", border: "none", borderRadius: "6px",
            padding: "10px 22px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
            color: "#F6F4F0", letterSpacing: "0.03em",
          }}>
            + Add book
          </button>
        </div>

        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 48px 60px" }}>

          {/* Filter + sort + search */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px",
            alignItems: "center", marginBottom: "24px" }}>
            {[{ v: "all", l: "All" }, { v: "read", l: "Read" }, { v: "unread", l: "Unread" }].map(f => (
              <Pill key={f.v} label={f.l} active={readFilter === f.v} onClick={() => setReadFilter(f.v)} />
            ))}
            <div style={{ width: "1px", height: "22px", background: "#E4DED8", margin: "0 4px" }} />
            {sortOpts.map(o => (
              <Pill key={o.v} label={o.l} active={sortBy === o.v} onClick={() => setSortBy(o.v)} />
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
              {searchOpen && (
                <input
                  autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  style={{
                    background: "#FFFFFF", border: "1px solid #E0DAD4",
                    borderRadius: "100px", padding: "6px 16px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                    color: "#1A1614", outline: "none", width: "180px",
                  }}
                />
              )}
              <button
                onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearch(""); }}
                style={{
                  background: "transparent", border: "1px solid #D4CEC8",
                  borderRadius: "100px", padding: "5px 16px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6A6460",
                }}
              >
                {searchOpen ? "✕" : "Search"}
              </button>
            </div>
          </div>

          {/* Count */}
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
            color: "#C0BAB4", letterSpacing: "0.05em", marginBottom: "20px" }}>
            {displayed.length} {displayed.length === 1 ? "book" : "books"}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(142px, 1fr))", gap: "20px" }}>
            {displayed.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} onToggleRead={toggleRead} onRate={rateBook} />
            ))}
          </div>

          {displayed.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px",
              color: "#C0BAB4", fontSize: "16px", fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              No books found.
            </div>
          )}
        </main>

        <footer style={{
          borderTop: "1px solid #E8E4DE", background: "#FFFFFF",
          padding: "24px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={LOGO_SRC} alt="" style={{ height: "28px", mixBlendMode: "multiply", opacity: 0.5 }} />
            <span style={{ fontFamily: "'Lora', serif", fontSize: "14px", color: "#B0AAA4" }}>Story Stack</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
            color: "#C0BAB4", letterSpacing: "0.06em" }}>
            Your reading life
          </span>
        </footer>
      </div>
    </>
  );
}
```

**What I changed and why:**

I thought this was a good start, and it gave me the idea to have stats. It looked clunky and outdated, though. I edited it to be more modern with a light mode. 

Final Code after Changes:

See [ShelfPage.jsx](src\pages\ShelfPage.jsx)

---

## Reflection

**Where did I understand more than the LLM?**

The LLM gave me errors fairly often when I used it. I used LLMs to give me starting points, then I debugged and edited porportions/sizing/colors/etc. from there. I understood how I wanted it to look and how to debug much better than it did.

**Where did I let the LLM help me go faster?**

As I stated in the previous question, I used LLMs to give me starting points. This was helpful in that it got the major aspects of the code out of the way, enabling me to spend time on the details. I also, at this point, had never set up an authentication system. It helped me find a free, reliable authentication system and set it up.