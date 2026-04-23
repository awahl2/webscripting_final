# API Descriptions

---

## Core Data: `books.json`

The heart of the app is a local `books.json` file that serves as the initial dataset for the book shelf. Each entry follows a consistent shape:

```json
{
  "id": 54,
  "title": "The Secret History",
  "author": "Donna Tartt",
  "pages": 573,
  "read": true,
  "rating": 5,
  "genre": "Fiction, Dark Academia, Mystery, Classics, Thriller"
}
```

**Fields:**

- `id`: unique numeric identifier for each book
- `title` / `author` / `pages`: core bibliographic info
- `read`: boolean tracking whether the book has been read
- `rating`: numeric score (0–5); defaults to `0` for unread books
- `genre`: comma-separated string used for filtering and passing context to the recommendation engine
  **How it's used:**

`books.json` is imported directly into the app as `INITIAL_BOOKS` and loaded into React state on startup. It acts as the default shelf: if a user isn't logged in (or has no saved books in the database), the app always falls back to this dataset. When a user _is_ logged in and has saved books, their Supabase data takes priority.

```js
const [books, setBooks] = useState(INITIAL_BOOKS);

// After auth, replace with user's saved data if available
const userBooks = await fetchUserBooks();
setBooks(userBooks.length > 0 ? userBooks : INITIAL_BOOKS);
```

A suite of runtime assertions also validates the dataset on load, checking that all required fields are present, types are correct, IDs are unique, and the original array is never mutated during the app lifecycle.

---

## Authentication: Supabase

User accounts are handled with [Supabase Auth](https://supabase.com/docs/guides/auth). The app supports sign-up and login via email/password.

```js
// Sign up a new user
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

// Log in an existing user
export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}
```

Once authenticated, each user's shelf is stored in a `user_books` table in Supabase, enabling full CRUD, creating, reading, updating, and deleting books, all scoped to their account.

---

## AI Recommendations: Anthropic API

After rating a book, the app calls the Anthropic API to suggest one real published book the reader might enjoy next. The prompt passes in the book's title, author, rating, and genre tags, and asks for a structured JSON response.

````js
export async function fetchRecommendation(book) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content:
            `A reader rated "${book.title}" by ${book.author} ${book.rating}/5 stars. ` +
            `The genres are: ${book.genre}. Recommend ONE real published book...`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.find((c) => c.type === "text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
````

The response is parsed into a structured object containing a title, author, short reason, genre tags, and a phrase, all displayed on the recommendation card.

---

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ANTHROPIC_API_KEY=
```
