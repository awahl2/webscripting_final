import { useState, useMemo } from "react";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
import Pill from "../components/Pill";

const SORT_OPTIONS = [
  { v: "title",  asc: "Title A–Z",        desc: "Title Z–A" },
  { v: "author", asc: "Author A–Z",       desc: "Author Z–A" },
  { v: "pages",  asc: "Pages least–most", desc: "Pages most–least" },
];

// Helper to save books to localStorage
const saveBooks = (booksArray) => {
  localStorage.setItem("books", JSON.stringify(booksArray));
};

export default function ShelfPage({ books, setBooks, user }) {
  const [sortField, setSortField] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [readFilter, setReadFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const toggleRead = (id) => {
    const book = books.find(x => x.id === id);
    const updated = { ...book, read: !book.read, rating: book.read ? 0 : book.rating };
    const newBooks = books.map(x => x.id === id ? updated : x);
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const rateBook = (id, r) => {
    const newBooks = books.map(x => x.id === id ? { ...x, rating: r } : x);
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const editBook = (updated) => {
    const newBooks = books.map(x => x.id === updated.id ? updated : x);
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const addBook = (newBook) => {
    const bookWithId = { ...newBook, id: Math.max(...books.map(b => b.id), 0) + 1 };
    const newBooks = [...books, bookWithId];
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const deleteBook = (id) => {
    const newBooks = books.filter(x => x.id !== id);
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const displayed = useMemo(() => {
    let list = books.filter(b => {
      if (readFilter === "read"   && !b.read) return false;
      if (readFilter === "unread" &&  b.read) return false;
      const q = search.toLowerCase();
      if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
      return true;
    });
    list.sort((a, b) => {
      if (!sortDir) return 0;
      let va = sortField === "pages" ? a.pages : (sortField === "author" ? a.author : a.title);
      let vb = sortField === "pages" ? b.pages : (sortField === "author" ? b.author : b.title);
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [books, sortField, sortDir, readFilter, search]);

  return (
    <div style={{ minHeight: "calc(100vh - 110px)", background: "#F6F4F0", display: "flex", flexDirection: "column" }}>
      {addModalOpen && <AddBookModal onClose={() => setAddModalOpen(false)} onAdd={addBook} />}

      {/* Page header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E4DE", padding: "36px 48px 28px" }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: "36px", fontWeight: 500, color: "#1A1614", margin: "0 0 28px", letterSpacing: "-0.01em", textAlign: "center" }}>My Shelf</h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 250px" }}>
          {[
            { l: "total",      v: books.length },
            { l: "read",       v: books.filter(b => b.read).length },
            { l: "to read",    v: books.filter(b => !b.read).length },
            { l: "pages read", v: books.filter(b => b.read).reduce((s, b) => s + b.pages, 0).toLocaleString() },
          ].map(({ l, v }) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1.5px solid #2C2620", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 500, color: "#1A1614" }}>{v}</div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.04em" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 48px 60px", flex: 1, width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <button onClick={() => setAddModalOpen(true)} style={{ background: "#2C2620", border: "none", borderRadius: "6px", padding: "10px 22px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>+ Add book</button>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author…" style={{ background: "#FFFFFF", border: "1px solid #E0DAD4", borderRadius: "6px", padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1A1614", outline: "none", width: "280px" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
          {[{ v: "all", l: "All" }, { v: "read", l: "Read" }, { v: "unread", l: "Unread" }].map(f => (
            <Pill key={f.v} label={f.l} active={readFilter === f.v} onClick={() => setReadFilter(f.v)} />
          ))}
          <div style={{ width: "1px", height: "22px", background: "#E4DED8", margin: "0 4px" }} />
          {SORT_OPTIONS.map(opt => {
            const isActive = sortField === opt.v && sortDir;
            const handleClick = () => {
              if (sortField !== opt.v) { setSortField(opt.v); setSortDir("asc"); }
              else if (sortDir === "asc")  setSortDir("desc");
              else if (sortDir === "desc") setSortDir(null);
              else setSortDir("asc");
            };
            return (
              <button key={opt.v} onClick={handleClick} style={{ background: isActive ? "#2C2620" : "transparent", border: `1px solid ${isActive ? "#2C2620" : "#D4CEC8"}`, borderRadius: "100px", padding: "5px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.03em", color: isActive ? "#F6F4F0" : "#6A6460", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "5px" }}>
                {sortField === opt.v && sortDir === "desc" ? opt.desc : opt.asc}
                {sortField === opt.v && sortDir && (
                  <span style={{ fontSize: "10px", lineHeight: 1 }}>{sortDir === "asc" ? "↓" : "↑"}</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#C0BAB4", letterSpacing: "0.05em", marginBottom: "20px" }}>
          {displayed.length} {displayed.length === 1 ? "book" : "books"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(142px, 1fr))", gap: "20px" }}>
          {displayed.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} onToggleRead={toggleRead} onRate={rateBook} onEdit={editBook} onDelete={deleteBook} />
          ))}
        </div>

        {displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#C0BAB4", fontSize: "16px", fontFamily: "'Lora', serif", fontStyle: "italic" }}>No books found.</div>
        )}
      </main>

      <Footer />
    </div>
  );
}