# Project Setup Guide

## 1. Git Clone

Clone the project using Git Clone

```bash
git clone <repository_url>
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Authentication Setup

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
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp default now()
);

-- Create user books table
create table if not exists user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  pages integer default 0,
  read boolean default false,
  rating integer default 0,
  genre text default '',
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(user_id, title, author)
);

-- Enable Row Level Security
alter table user_books enable row level security;

-- Create policies
create policy "Users can view own books"
  on user_books for select
  using (auth.uid() = user_id);

create policy "Users can insert own books"
  on user_books for insert
  with check (auth.uid() = user_id);

create policy "Users can update own books"
  on user_books for update
  using (auth.uid() = user_id);

create policy "Users can delete own books"
  on user_books for delete
  using (auth.uid() = user_id);
```

### 4. Enable Email Auth

1. In your Supabase project, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Go to **Settings** and note the **Site URL** (should be your dev server URL like `http://localhost:5173`)

## 5. Run the project

```bash
npm run dev
```
