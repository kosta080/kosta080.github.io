# Counter App with Supabase

A simple React counter application that uses Supabase for persistent storage and real-time updates.

## Features

- Increment counter with persistent storage
- Real-time counter updates
- Beautiful, responsive UI
- Error handling and loading states
- Secure database functions with Row Level Security

## Setup Instructions

### 1. Set Up Environment Variables

Create a `.env.local` file in the root of your project (same level as `package.json`) with your Supabase credentials:

```bash
# .env.local
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-public-anon-key
```

**Important Security Notes:**
- The `.env.local` file is automatically ignored by Git
- Never commit your actual API keys to version control
- For production, set these as environment variables in your hosting platform

### 2. Alternative: Update env.config.js

If you prefer not to use environment variables, you can directly edit `env.config.js`:

```javascript
export const ENV_CONFIG = {
  SUPABASE_URL: "https://YOUR_ACTUAL_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "your-actual-public-anon-key"
};
```

**⚠️ Warning:** This method is less secure and not recommended for production.

### 3. Database Setup

The app expects the following database structure in Supabase. Run these SQL commands in your Supabase SQL editor:

```sql
-- Drop existing table if it exists
drop table if exists public.counters;

-- Create counters table
create table public.counters(
  namespace text not null,
  key text not null,
  value int not null default 0,
  primary key(namespace, key)
);

-- Enable Row Level Security
alter table public.counters enable row level security;

-- Create increment function
create or replace function public.increment_counter(ns text, k text)
returns int
language plpgsql
security definer
as $$
declare v int;
begin
  insert into public.counters(namespace, key, value)
  values (ns, k, 1)
  on conflict (namespace, key) do update
    set value = public.counters.value + 1
  returning value into v;
  return v;
end $$;

-- Create get function
create or replace function public.get_counter(ns text, k text)
returns int
language sql
security definer
as $$
  select coalesce(value, 0) from public.counters
  where namespace = ns and key = k;
$$;

-- Grant permissions to anonymous users
grant execute on function public.increment_counter(text,text) to anon;
grant execute on function public.get_counter(text,text) to anon;
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

1. **Initial Load**: The app fetches the current counter value using the `get_counter` function
2. **Increment**: Clicking the increment button calls the `increment_counter` function
3. **Real-time Updates**: The counter value updates immediately after each increment
4. **Error Handling**: Displays user-friendly error messages if operations fail
5. **Loading States**: Shows loading indicators during database operations

## Security Features

- Row Level Security (RLS) enabled on the counters table
- Database functions use `security definer` to run with elevated privileges
- Anonymous users can only execute the specific functions they need
- No direct table access for anonymous users

## Customization

You can easily customize the counter by modifying the `COUNTER_CONFIG` in `src/config.js`:

```javascript
export const COUNTER_CONFIG = {
  namespace: "your-namespace",  // Change this to group related counters
  key: "your-counter-key"       // Change this for different counter types
};
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch counter value"**: Check your environment variables or `env.config.js`
2. **"Failed to increment counter"**: Ensure the database functions are properly created
3. **CORS errors**: Verify your Supabase project settings allow your domain

### Debug Mode

Open the browser console to see detailed error messages and API responses.

## Technologies Used

- React 19
- Supabase (PostgreSQL + Real-time)
- Vite
- Modern CSS with gradients and animations
