import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import BlindDateCard from "../components/BlindDateCard";
import RecommendModal from "../components/RecommendModal";
import { fetchRecommendation } from "../utils/api";

// ── Cache helpers ─────────────────────────────────────────────────────────────
// Saves successful recommendations to localStorage so they survive page reloads.
// On your presentation day, everything loads instantly from cache.

const CACHE_KEY = "storystack_recs_v1";

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveToCache(bookId, rec) {
  try {
    const cache = loadCache();
    cache[bookId] = rec;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or unavailable — fail silently
  }
}

// ── Fetch with auto-retry ─────────────────────────────────────────────────────
// Tries up to 3 times with a short delay between attempts before giving up.

async function fetchWithRetry(book, attempts = 3, delayMs = 1000) {
  for (let i = 0; i < attempts; i++) {
    try {
      const rec = await fetchRecommendation(book);
      return rec;
    } catch (err) {
      if (i < attempts - 1) {
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BlindDatePage({ books }) {
  const [recs, setRecs] = useState(() => {
    // Pre-populate state from cache on first render
    const cache = loadCache();
    const initial = {};
    Object.entries(cache).forEach(([id, rec]) => {
      initial[id] = { loading: false, rec, error: false };
    });
    return initial;
  });

  const [manualRecs, setManualRecs] = useState([]);
  const [recommendModalOpen, setRecommendModalOpen] = useState(false);

  const ratedBooks = books
    .filter(b => b.read && b.rating > 0)
    .sort((a, b) => b.rating - a.rating);

  const fetchAndStore = (book) => {
    setRecs(r => ({ ...r, [book.id]: { loading: true, rec: null, error: false } }));
    fetchWithRetry(book)
      .then(rec => {
        saveToCache(book.id, rec);
        setRecs(r => ({ ...r, [book.id]: { loading: false, rec, error: false } }));
      })
      .catch(() => {
        setRecs(r => ({ ...r, [book.id]: { loading: false, rec: null, error: true } }));
      });
  };

  useEffect(() => {
    ratedBooks.forEach(book => {
      // Skip if already loaded (from cache or a previous fetch this session)
      if (recs[book.id] && !recs[book.id].error) return;
      // Skip if currently loading
      if (recs[book.id]?.loading) return;
      fetchAndStore(book);
    });
  }, [ratedBooks.length]);

  const addManualRec = ({ sourceBookId, sourceTitle, sourceAuthor, sourceRating, rec }) => {
    setManualRecs(m => [...m, { sourceBookId, sourceTitle, sourceAuthor, sourceRating, rec }]);
  };

  const allCards = [
    ...ratedBooks.map(book => ({ key: `ai-${book.id}`, sourceBook: book, ...recs[book.id] })),
    ...manualRecs.map((m, i) => ({
      key: `manual-${i}`,
      sourceBook: books.find(b => b.id === m.sourceBookId) || {
        id: m.sourceBookId, title: m.sourceTitle,
        author: m.sourceAuthor, rating: m.sourceRating, coverUrl: null,
      },
      loading: false,
      error: false,
      rec: m.rec,
    })),
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 110px)", background: "#F6F4F0", display: "flex", flexDirection: "column" }}>
      {recommendModalOpen && (
        <RecommendModal books={books} onClose={() => setRecommendModalOpen(false)} onAdd={addManualRec} />
      )}

      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E4DE", padding: "36px 48px 32px", textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B0AAA4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Discover</div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: "36px", fontWeight: 500, color: "#1A1614", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Blind Date with a Book</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#8A8480", margin: "0 auto", maxWidth: "440px", lineHeight: 1.6 }}>Based on books you've loved, here are some mystery reads — peek at the hints, then reveal when you're ready.</p>
      </div>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 48px 80px", flex: 1, width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "28px" }}>
          <button
            onClick={() => setRecommendModalOpen(true)}
            style={{ background: "#2C2620", border: "none", borderRadius: "6px", padding: "10px 22px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F6F4F0", letterSpacing: "0.03em" }}
          >
            + Recommend a book
          </button>
        </div>

        {allCards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#C0BAB4", fontFamily: "'Lora', serif", fontSize: "16px", fontStyle: "italic" }}>
            Rate some books on your shelf first — your blind dates will appear here.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {allCards.map(card => (
              <BlindDateCard
                key={card.key}
                sourceBook={card.sourceBook}
                rec={card.rec}
                loading={card.loading}
                error={card.error}
                onRetry={() => fetchAndStore(card.sourceBook)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}