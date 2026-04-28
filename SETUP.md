# Project Setup Guide

## 1. Git Clone

Clone the project using Git Clone

```bash
git clone <repository_url>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Authentication Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details and click "Create new project"
5. Wait for the project to be created (takes ~2 minutes)

### 2. Get Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Create a `.env.local` file in the root of your project:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 3. Setup User Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Paste the following SQL:

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now()
);

-- Create user books table
CREATE TABLE IF NOT EXISTS user_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text NOT NULL,
  pages integer DEFAULT 0,
  read boolean DEFAULT false,
  rating integer DEFAULT 0,
  genre text DEFAULT '',
  cover_url text,
  isbn text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, title, author)
);

-- Enable Row Level Security
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own books"
  ON user_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
  ON user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
  ON user_books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books"
  ON user_books FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. Setup Cover Image Storage

1. In your Supabase project, go to **Storage** → **New bucket**
2. Name it `covers` and set it to **Public**, then click **Create**
3. Go to **SQL Editor** → **New Query** and paste the following:

```sql
CREATE POLICY "Users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'covers'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'covers'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Covers are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');
```

### 5. Enable Email Auth

1. In your Supabase project, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Go to **Settings** and note the **Site URL** (should be your dev server URL like `http://localhost:5173`)

## 4. Run the project

```bash
npm run dev
```
