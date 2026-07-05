-- Karunad Krushi — Database Schema Definitions
-- Target: Supabase / PostgreSQL Database Setup

-- Enable uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('super_admin', 'editor')) DEFAULT 'editor' NOT NULL,
    full_name TEXT
);

-- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile entry when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (new.id, new.email, 'editor', new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. TABLE: products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    ingredients TEXT[],
    application_guide TEXT,
    scientific_backing TEXT,
    main_image_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Admin / Editor CRUD on products" ON public.products
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 3. TABLE: product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Product Variants Policies
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Admin / Editor CRUD on product_variants" ON public.product_variants
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 4. TABLE: blogs
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    featured_image TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Blogs Policies
CREATE POLICY "Blogs are viewable by everyone if published" ON public.blogs
    FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Admin / Editor CRUD on blogs" ON public.blogs
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 5. TABLE: scientific_articles
CREATE TABLE IF NOT EXISTS public.scientific_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    abstract TEXT NOT NULL,
    content TEXT NOT NULL,
    authors TEXT NOT NULL,
    pdf_url TEXT,
    media_url TEXT,
    category TEXT DEFAULT 'Soil Biology' NOT NULL
);

ALTER TABLE public.scientific_articles ENABLE ROW LEVEL SECURITY;

-- Scientific Articles Policies
CREATE POLICY "Scientific articles are viewable by everyone" ON public.scientific_articles
    FOR SELECT USING (true);

CREATE POLICY "Admin / Editor CRUD on scientific_articles" ON public.scientific_articles
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 6. TABLE: gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery Policies
CREATE POLICY "Gallery assets are viewable by everyone" ON public.gallery
    FOR SELECT USING (true);

CREATE POLICY "Admin / Editor CRUD on gallery" ON public.gallery
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 7. TABLE: homepage_content
CREATE TABLE IF NOT EXISTS public.homepage_content (
    section_key TEXT PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    body_text TEXT NOT NULL,
    meta_json JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Homepage Content Policies
CREATE POLICY "Homepage content is viewable by everyone" ON public.homepage_content
    FOR SELECT USING (true);

CREATE POLICY "Admin / Editor CRUD on homepage_content" ON public.homepage_content
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 8. TABLE: inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'contacted', 'resolved')) DEFAULT 'new' NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiries Policies
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin / Editor view and update inquiries" ON public.inquiries
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 9. TABLE: seo_metadata
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_path TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    keywords TEXT,
    og_image TEXT
);

ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- SEO Metadata Policies
CREATE POLICY "SEO metadata is viewable by everyone" ON public.seo_metadata
    FOR SELECT USING (true);

CREATE POLICY "Admin / Editor CRUD on seo_metadata" ON public.seo_metadata
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- 10. TABLE: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending' NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    items JSONB NOT NULL, -- Holds variant snapshots [{sku, size, price, quantity}]
    subtotal NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Anyone can create an order" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin/editors can view orders" ON public.orders
    FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('super_admin', 'editor')));


-- STORAGE BUCKETS CONFIGURATION (Documented for Supabase Dashboard setup)
-- Run the following under Supabase Storage to define policies or execute via postgres functions if available:
-- Buckets to create manually or via setup script:
-- 1. 'products-media' (public: true)
-- 2. 'blog-images' (public: true)
-- 3. 'scientific-docs' (public: true)
-- 4. 'site-assets' (public: true)
