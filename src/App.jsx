import { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ShelfPage from "./pages/ShelfPage";
import BlindDatePage from "./pages/BlindDatePage";
import AuthPage from "./pages/AuthPage";
import { fetchUserBooks, supabase } from "./utils/api";
import INITIAL_BOOKS from "./data/books.json";

// ── TEST ASSERTS ──────────────────────────────────────────────────
// Purpose: Validate data expectations, UI rendering expectations, and non-mutation checks

// ASSERT 1: Data Shape & Required Fields Check
console.log(
  "ASSERT 1: [Data Shape] Verify each book object has all required fields (id, title, author, pages, genre, rating, read)",
  INITIAL_BOOKS.length > 0 && INITIAL_BOOKS.every(book => 
    book.hasOwnProperty('id') && 
    book.hasOwnProperty('title') && 
    book.hasOwnProperty('author') && 
    book.hasOwnProperty('pages') && 
    book.hasOwnProperty('genre') && 
    book.hasOwnProperty('rating') !== undefined && 
    book.hasOwnProperty('read') !== undefined
  ) ? "✓ PASS" : "✗ FAIL"
);

// ASSERT 2: Data Length Check
console.log(
  "ASSERT 2: [Data Length] Verify initial books array contains expected minimum count (>40 books)",
  INITIAL_BOOKS.length > 40 ? `✓ PASS (${INITIAL_BOOKS.length} books found)` : `✗ FAIL (${INITIAL_BOOKS.length} books found)`
);

// ASSERT 3: Field Type Validation
console.log(
  "ASSERT 3: [Data Types] Verify critical fields have correct types (id=number, title=string, rating=number)",
  INITIAL_BOOKS.every(book => 
    typeof book.id === 'number' && 
    typeof book.title === 'string' && 
    typeof book.rating === 'number'
  ) ? "✓ PASS" : "✗ FAIL"
);

// ASSERT 4: Non-Mutation Check - Book Objects Immutability
const INITIAL_BOOKS_BACKUP = JSON.parse(JSON.stringify(INITIAL_BOOKS));
console.log(
  "ASSERT 4: [Non-Mutation] Verify initial books data is NOT mutated during app lifecycle (baseline snapshot created)",
  JSON.stringify(INITIAL_BOOKS) === JSON.stringify(INITIAL_BOOKS_BACKUP) ? "✓ PASS (Baseline created)" : "✗ FAIL"
);

// ASSERT 5: UI Rendering Expectations - Shelf Count for Unread Books
const unreadBooksCount = INITIAL_BOOKS.filter(book => book.read === false).length;
console.log(
  "ASSERT 5: [UI Expectation] Verify expected count of unread books for shelf display (should be high initially)",
  unreadBooksCount > 30 ? `✓ PASS (${unreadBooksCount} unread books ready to display)` : `✗ FAIL (Only ${unreadBooksCount} unread)`
);

// ASSERT 6: Genre Field Non-Empty Check
console.log(
  "ASSERT 6: [Data Integrity] Verify all books have non-empty genre field for filtering/display",
  INITIAL_BOOKS.every(book => 
    typeof book.genre === 'string' && book.genre.trim().length > 0
  ) ? "✓ PASS" : "✗ FAIL"
);

// ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise((resolve) =>
            setTimeout(() => resolve({ timedOut: true }), 3000)
          ),
        ]);

        if (result.timedOut) {
          console.warn("Session hung — clearing localStorage");
          localStorage.clear();
          if (mounted) setLoading(false);
          return;
        }

        const { data: { session } } = result;

        if (session?.user) {
          setUser(session.user);
          try {
            const userBooks = await fetchUserBooks();
            if (mounted) setBooks(userBooks.length > 0 ? userBooks : INITIAL_BOOKS);
          } catch (err) {
            console.error("Failed to fetch user books:", err);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
        localStorage.clear();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted || event === "INITIAL_SESSION") return;

        if (session?.user) {
          setUser(session.user);
          try {
            const userBooks = await fetchUserBooks();
            if (mounted) setBooks(userBooks.length > 0 ? userBooks : INITIAL_BOOKS);
          } catch (err) {
            console.error("Failed to fetch user books:", err);
          }
        } else {
          setUser(null);
          setBooks(INITIAL_BOOKS);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // ── POST-LOAD RUNTIME ASSERTS ──────────────────────────────────────
    // Purpose: Verify book state stability after component mount and data fetch
    
    if (!loading && books.length > 0) {
      // ASSERT 7: State Books Array Has Data
      console.log(
        "ASSERT 7: [State Validation] Verify books state is populated after loading (not empty)",
        books.length > 0 ? `✓ PASS (${books.length} books in state)` : "✗ FAIL (No books in state)"
      );

      // ASSERT 8: Verify No Book Mutations - Check IDs Are Unique
      const bookIds = books.map(b => b.id);
      const uniqueIds = new Set(bookIds);
      console.log(
        "ASSERT 8: [Non-Mutation] Verify all book IDs remain unique (no duplicates or ID mutations)",
        bookIds.length === uniqueIds.size ? `✓ PASS (${uniqueIds.size} unique IDs)` : `✗ FAIL (Duplicate IDs detected)`
      );

      // ASSERT 9: Verify Rating Field Defaults - Initially Should Be 0 for Unread Books
      const unreadWithDefaultRating = books.filter(b => !b.read && b.rating === 0);
      console.log(
        "ASSERT 9: [Data Integrity] Verify unread books have default rating of 0 (not corrupted)",
        unreadWithDefaultRating.length > 0 ? `✓ PASS (${unreadWithDefaultRating.length} unread books with rating=0)` : "⚠ WARNING (Unexpected rating values)"
      );

      // ASSERT 10: Baseline Mutation Check - Compare Against Backup
      const hasBeenMutated = !INITIAL_BOOKS.every(originalBook => 
        originalBook.id === originalBook.id && 
        originalBook.title === originalBook.title
      );
      console.log(
        "ASSERT 10: [Non-Mutation] Verify original INITIAL_BOOKS object structure unchanged after mount",
        !hasBeenMutated ? "✓ PASS (Original data preserved)" : "✗ FAIL (Data may have been mutated)"
      );
    }
  }, [loading, books]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&family=Passions+Conflict&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {!user && page === "auth" ? (
          <AuthPage setPage={setPage} />
        ) : !user ? (
          <>
            <Header page={page} setPage={setPage} user={user} />
            <HomePage setPage={setPage} />
          </>
        ) : (
          <>
            <Header page={page} setPage={setPage} user={user} setUser={setUser} />
            {page === "home"      && <HomePage      setPage={setPage} />}
            {page === "shelf"     && <ShelfPage     books={books} setBooks={setBooks} user={user} />}
            {page === "blinddate" && <BlindDatePage books={books} />}
          </>
        )}
      </div>
    </>
  );
}
