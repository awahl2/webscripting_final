import { createClient } from "@supabase/supabase-js";

// ── Supabase Setup ──
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// ── Authentication ──
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── User Books (Shelf) ──
export async function fetchUserBooks() {
  const { data, error } = await supabase
    .from("user_books")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addUserBook(book) {
  const { data, error } = await supabase
    .from("user_books")
    .insert([book])
    .select();
  
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updateUserBook(bookId, updates) {
  const { data, error } = await supabase
    .from("user_books")
    .update(updates)
    .eq("id", bookId)
    .select();
  
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deleteUserBook(bookId) {
  const { error } = await supabase
    .from("user_books")
    .delete()
    .eq("id", bookId);
  
  if (error) throw new Error(error.message);
}

// ── Anthropic Recommendations (existing) ──
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
            `The genres are: ${book.genre}.\n\n` +
            `Recommend ONE real published book they would likely enjoy. ` +
            `Respond ONLY with valid JSON, no markdown, no extra text:\n` +
            `{\n` +
            `  "title": "...",\n` +
            `  "author": "...",\n` +
            `  "reason": "One sentence explaining why fans of the source book would love this (under 20 words)",\n` +
            `  "tags": ["tag1", "tag2", "tag3", "tag4"],\n` +
            `  "vibe": "A single evocative 3-5 word mood phrase (e.g. 'slow burn gothic tension')"\n` +
            `}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.find((c) => c.type === "text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}