-- Enable Row Level Security (RLS) is recommended, but for initial setup we can keep it open or public for anon if we handle auth manually.
-- For this migration, we will use a simple table structure storing data as JSONB to preserve existing application structure.

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_code TEXT UNIQUE,
    data JSONB NOT NULL, -- Stores the full Order object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL, -- Stores the full Supplier object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL, -- Stores the full Package object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Users Table (since we are using custom auth/session logic)
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    name TEXT,
    data JSONB, -- Stores extra user info
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS (Row Level Security) - Optional but good practice
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 6. Create Policy to allow anonymous access (since we use custom auth/API key from client)
-- WARNING: This allows anyone with the anon key to read/write. 
-- In production, you should restrict this to authenticated users via Supabase Auth.
CREATE POLICY "Allow Public Access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow Public Access" ON public.suppliers FOR ALL USING (true);
CREATE POLICY "Allow Public Access" ON public.packages FOR ALL USING (true);
CREATE POLICY "Allow Public Access" ON public.app_users FOR ALL USING (true);

-- 7. Create Realtime Publication (so dashboard updates live)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.orders, public.suppliers, public.packages;
