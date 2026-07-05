# MASTER DOCUMENTATION: KARUNAD KRUSHI
## Project Architecture & Master Plan (Single Source of Truth)

---

## 1. Project Overview & Mission

### 1.1 Company Identity
- **Company Name:** KARUNAD KRUSHI
- **Tagline:** Building Intelligent Agri Solutions
- **Mission:** Restore Soil Intelligently
- **Core Value:** Reclaiming depleted, sterile "Dead Soil" and restoring it to rich, biodiverse "Living Soil" using scientific principles and Karunad Krushi's proprietary **BioBlend** formulas.

### 1.2 Product Focus
Karunad Krushi provides high-end agricultural solutions focused on soil health restoration, microbial rejuvenation, and crop optimization. The platform acts as both a premium brand website and an interactive storytelling canvas designed to build trust among modern agriculturalists, scientific partners, and commercial growers.

---

## 2. Core Project Goals

1. **Premium Cinematic Storytelling:** Craft an immersive, scroll-driven visual narrative that guides the user emotionally from the ecological crisis of "Dead Soil" to the hope of "Living Soil" and thriving crops.
2. **Scientific Authority:** Establish credibility through a high-fidelity "Scientific Hub" containing interactive diagrams, research findings, and whitepapers.
3. **Actionable Conversion:** Guide the user seamlessly from education to the "Buy Flow" (initially structured mock checkout, scalable to live e-commerce).
4. **Admin Empowerment:** Provide a production-quality Admin Dashboard to edit products, manage scientific publications, update blogs, manage media, and tune homepage SEO and content dynamically.
5. **Scale & Maintainability:** Build a clean, decoupled architecture with a React frontend and Supabase backend, adhering to strict coding standards.

---

## 3. Immersive User Journey (Scroll-Bound Narrative)

The homepage is structured as a continuous vertical scroll story. Each section transitions visually to the next, representing the transformation of soil:

```
[Splash Screen] 
      ↓
[Hero: The Spark of Life] (Video Integration)
      ↓
[Stage 1: Dead Soil] (Grey, cracked, lifeless ground; visual representation of depletion)
      ↓
[Stage 2: The Hidden Crisis] (Red/brown alert tones; text/graphics showing chemical and microbial erosion)
      ↓
[Stage 3: Scientific Understanding] (Deep technical blue; micro-imaging schemas, cellular/bacterial outlines)
      ↓
[Stage 4: BioBlend Formulation] (Organic greens and rich compost browns; the formula that bridges death and life)
      ↓
[Stage 5: Living Soil] (Dark, rich organic matter; active earthworms and microbial network indicators)
      ↓
[Stage 6: Healthy Roots] (Golden-hued subterranean visualization of deep root networks absorbing nutrients)
      ↓
[Stage 7: Thriving Crops] (Lush, green, light-filled agricultural canopy; harvest and high-yield results)
      ↓
[Stage 8: Trust & Brand Core] (Full color palette; Karunad Krushi solutions, client testimonials, and calls to action)
```

---

## 4. Brand Design System & Assets

### 4.1 Asset Analysis & Guidelines
- **Official Company Logo:** Currently missing in the project folder (to be supplied by the user). Once provided, it must be used **exactly** without modification to typography, spacing, shape, or colors. If SVG optimization is required, it must only affect code structure and file size, never the render appearance.
- **Hero Video (`Create_an_ultra_premium_cinema.mp4`):** Located in the project root. This file defines the core mood, motion flow, and lighting reference. It will be preloaded and played in the Hero section, and we will stream/scrub its content or keyframes for seamless transitions.
- **Extracted Frames (`ezgif-frame-001.jpg` to `ezgif-frame-050.jpg`):** Used to build a high-performance scroll-linked canvas animation. The website's sections will follow the frame-by-frame narrative progression.

### 4.2 Visual Palette & Color Tokens
We define a highly tailored, HSL-based palette reflecting the journey from sterile soil to lush growth:

| Token Name | Color Archetype | HSL Value | Description / Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-dead` | Dusty Charcoal | `hsl(30, 8%, 10%)` | Main background for "Dead Soil" stage |
| `--color-text-dead` | Desaturated Clay | `hsl(30, 10%, 65%)` | Text color for "Dead Soil" stage |
| `--color-crisis` | Warning Rust | `hsl(12, 60%, 40%)` | Highlights for "Hidden Crisis" stage |
| `--color-science` | Deep Cyan | `hsl(200, 70%, 15%)` | Background for "Scientific Hub" & microbiology |
| `--color-science-glow` | Bioluminescent Teal| `hsl(175, 80%, 45%)` | Glowing borders, UI elements in science hub |
| `--color-bioblend` | Rich Forest Green | `hsl(135, 45%, 15%)` | Background for "BioBlend" presentation |
| `--color-living` | Dark Humus Brown | `hsl(24, 25%, 12%)` | Background for "Living Soil" stage |
| `--color-roots` | Golden Amber | `hsl(42, 75%, 20%)` | Background for "Healthy Roots" stage |
| `--color-roots-glow` | Mycorrhizal Gold | `hsl(45, 90%, 55%)` | Radiant root systems and nutrients |
| `--color-crops` | Vibrant Leaf Green | `hsl(145, 55%, 35%)` | Accent elements for "Healthy Crops" and buttons |
| `--color-text-primary`| Premium Off-White | `hsl(0, 0%, 94%)` | Primary typography for dark backgrounds |
| `--color-text-muted` | Mist Grey | `hsl(0, 0%, 70%)` | Secondary/caption typography |
| `--color-card-bg` | Glassmorphism Core | `hsla(0, 0%, 100%, 0.03)`| Card containers with backdrop blur |

### 4.3 Typography
- **Primary Headers:** `'Outfit'`, Sans-Serif (Google Fonts). Sleek, geometric, modern.
- **Storytelling Headers & Serifs:** `'Playfair Display'`, Serif (Google Fonts). Elegant, classic, establishing heritage and gravity.
- **Body & Technical Text:** `'Inter'`, Sans-Serif (Google Fonts). Clean, legible at small sizes, optimal for data tables.

---

## 5. Site Architecture & Routing

The application is structured as a hybrid: a scroll-bound Single-Page App for the primary landing experience, with dedicated sub-routes for deeper content, and a fully functional Admin Dashboard.

### 5.1 Frontend Routes (Public)
- `/` - Main landing page (Scroll narrative: Splash Screen → Hero → Stages 1-8 → Footer)
- `/products/:slug` - Detailed product showcase page (Application guides, ingredients, scientific backing, Buy Flow trigger)
- `/science` - Scientific Hub main page (Research studies, Interactive 3D/2D models, PDF downloads)
- `/science/:slug` - Research paper reading layout
- `/blog` - Knowledge base listing page
- `/blog/:slug` - Blog post reading layout (SEO optimized)
- `/404` - Custom animated 404 page

### 5.2 Dashboard Routes (Admin)
- `/admin/login` - Secure login layout
- `/admin` - Main Analytics & Overview panel
- `/admin/products` - Product & variant management list
- `/admin/products/new` & `/admin/products/edit/:id` - Product CRUD forms
- `/admin/science` - Scientific articles management
- `/admin/blog` - Blog post writer and scheduler
- `/admin/media` - Image, video, and PDF library with asset optimizer
- `/admin/gallery` - Homepage slideshow and media gallery manager
- `/admin/content/home` - Dynamic text editor for landing page storytelling stages
- `/admin/content/about` - About page mission/vision editor
- `/admin/seo` - Dynamic page titles, meta tags, and alt tag administrator
- `/admin/inquiries` - Client messages and custom orders manager
- `/admin/settings` - Language properties, global alert bars, API configurations

---

## 6. Frontend Folder Structure (Vite React Project)

```
/
├── docs/
│   └── MASTER_DOCUMENTATION.md      # Single source of truth (this file)
├── public/
│   ├── assets/
│   │   ├── logo.svg                 # Official Logo (once supplied)
│   │   ├── hero_video.mp4           # Create_an_ultra_premium_cinema.mp4
│   │   └── frames/                  # ezgif-frame-001.jpg to ezgif-frame-050.jpg
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/                  # Static localized icons and fallback images
│   ├── components/                  # Global Reusable Components
│   │   ├── ui/                      # Pure UI Components (Buttons, Modals, inputs)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Toast.jsx
│   │   ├── Layout/                  # Shell components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── Narrative/               # Storytelling Stages
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── StageDeadSoil.jsx
│   │   │   ├── StageCrisis.jsx
│   │   │   ├── StageScience.jsx
│   │   │   ├── StageBioBlend.jsx
│   │   │   ├── StageLivingSoil.jsx
│   │   │   ├── StageRoots.jsx
│   │   │   ├── StageCrops.jsx
│   │   │   └── StageTrust.jsx
│   │   ├── Chart/                   # Rich Dashboard Charts
│   │   │   └── DashboardChart.jsx
│   │   └── Three/                   # 3D canvas assemblies
│   │       ├── SoilCanvas.jsx
│   │       └── BioBlendParticles.jsx
│   ├── context/                     # Global State contexts
│   │   ├── AuthContext.jsx          # Admin authentication state
│   │   └── LanguageContext.jsx      # Multi-lingual UI state
│   ├── hooks/                       # Custom utility hooks
│   │   ├── useScrollDirection.js
│   │   └── useSupabase.js
│   ├── pages/                       # Route Containers
│   │   ├── Public/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ScienceHub.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   └── NotFound.jsx
│   │   └── Admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ProductManager.jsx
│   │       ├── ProductForm.jsx
│   │       ├── ScienceManager.jsx
│   │       ├── BlogManager.jsx
│   │       ├── MediaLibrary.jsx
│   │       ├── ContentEditor.jsx
│   │       ├── SEOManager.jsx
│   │       └── Inquiries.jsx
│   ├── services/                    # API client layers
│   │   ├── supabaseClient.js        # Supabase client instantiation
│   │   ├── productApi.js
│   │   ├── blogApi.js
│   │   ├── scienceApi.js
│   │   └── mediaApi.js
│   ├── utils/                       # Common JS utility functions
│   │   ├── helpers.js
│   │   └── seo.js
│   ├── index.css                    # Main design system variables & utility classes
│   ├── App.jsx                      # Router & Context provider definitions
│   └── main.jsx                     # Entry point
│   └── README.md
```

---

## 7. Motion Design & Animation Strategy

To provide an elite, premium user experience, animations will be smooth, natural, and carefully calibrated to **7/10 Intensity** (never distracting or flashy, but highly polished).

```
   Splash Screen (Fades out)
            ↓
    Hero Title Scale-In (Framer Motion)
            ↓
  [GSAP ScrollTrigger Canvas Sequence] ──> Scrubs through ezgif-frame-001.jpg to ezgif-frame-050.jpg
            ↓
   Stage-Specific Fade-Ins & Parallax (Framer Motion / GSAP)
            ↓
    BioBlend Particles (Three.js WebGL canvas simulation in background)
            ↓
    Golden Root Network Growth (Lottie/SVG Path Animation triggered by ScrollTrigger)
```

### 7.1 Scroll-Bound Frame sequence (Hero -> Dead Soil -> BioBlend)
- **Technology:** HTML5 Canvas + GSAP ScrollTrigger.
- **Implementation:** Preload all 50 frames (`ezgif-frame-001.jpg` to `ezgif-frame-050.jpg`) on Splash Screen. On scroll, a ScrollTrigger pins the container and draws the frame indices corresponding to scroll progress directly to a full-screen background canvas. This creates an ultra-smooth, responsive cinema scrubbing effect.

### 7.2 Framer Motion Strategy (Micro-interactions & page transitions)
- **Hover effects:** Subtle scale (`scale: 1.02`), micro-shifts, and color transitions for navigation links and buttons.
- **Page Transitions:** `<AnimatePresence>` handles smooth fade-ins (`opacity: [0, 1]`, `y: [15, 0]`) for subpage changes.
- **UI Elements:** Expandable menus, filter tabs, and admin modals utilize Framer Motion spring physics for realistic weight.

### 7.3 Three.js Strategy (BioBlend & Micro-Imaging Section)
- **Technology:** React Three Fiber (R3F) + Drei.
- **Component:** `BioBlendParticles.jsx`.
- **Implementation:** A WebGL container containing 2,000 organic-colored point particles (using a custom shader).
  - Normal state: Particles float gently in Brownian motion.
  - Scroll state: As the user scrolls into the "BioBlend" and "Living Soil" stages, the particles morph and cluster together to form structured matrices representing soil microbial networks.

### 7.4 Performance & Frame Management
- Implement an image preloader that waits until all 50 frames are cached in memory before allowing the Splash Screen to fade out.
- Wrap Three.js elements in dynamic `<Suspense>` containers with low-polygon count fallbacks for mobile devices.
- Disable heavy WebGL elements when not in viewport to conserve GPU cycles.

---

## 8. Responsive UI & Accessibility (a11y) Plan

### 8.1 Grid & Layout
- Use CSS Grid and Flexbox with fluid scaling units (`rem`, `em`, `vh`, `vw`, `clamp()`) to avoid broken boundaries on small displays.
- Breakpoints:
  - Mobile: `< 768px` (Canvas overlays scale down; UI controls adjust to thumb-friendly layouts)
  - Tablet: `768px - 1024px`
  - Desktop: `1024px - 1440px`
  - Ultra-Wide: `> 1440px` (Containers max out at `1440px` centered to maintain text readability)

### 8.2 Accessibility Standard (WCAG 2.1 AA)
- **Contrast:** Maintain contrast ratios >= 4.5:1 for body copy.
- **Keyboard Navigation:** Custom focus rings (`:focus-visible`) for all buttons and dashboard inputs. Modal traps for dashboard overlay forms.
- **Semantic Tags:** `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` used properly.
- **Aria Attributes:** Implement `aria-expanded` on accordion menus, `aria-live="polite"` for dynamic form feedback, and correct `alt` attributes dynamically fetched from the database for all content images.

---

## 9. SEO & Performance Strategy

### 9.1 Technical SEO
- **Dynamic Meta Injector:** A utility function `utils/seo.js` that maps active routes to a schema mapping `title`, `description`, `keywords`, and `og:image`. This maps directly to a `seo_metadata` table in Supabase.
- **Structured Data (Schema.org):** JSON-LD blocks injected for Article metadata (in blogs), Product metadata (in products), and Organization metadata (globally).
- **Robots.txt & Sitemap:** Automatically generated dynamic endpoints targeting active slugs.

### 9.2 Performance Optimizations
- **Image Optimization:** Source assets must use modern compressed extensions (`.webp`, `.svg`). Frame sequences are highly compressed JPEGs (~30-50kb each).
- **Code Splitting:** Lazy load the Admin Dashboard (`/admin/*`) and three.js canvas components using standard React `lazy()` and `Suspense`.
- **Preloading:** Pre-resolve Google Fonts connections and preload the hero video file.
- **Lighthouse Goals:** Aim for >95% score across Performance, Accessibility, Best Practices, and SEO.

---

## 10. Database Schema & Architecture (Supabase / PostgreSQL)

Below is the entity-relationship model and table structure designed to support the dynamic website, content management, and future e-commerce capabilities.

```
                  +-------------------+
                  |     PROFILES      |
                  +-------------------+
                  | id (PK, UUID)     |
                  | email (TEXT)      |
                  | role (TEXT)       |
                  +---------+---------+
                            |
                            | 1
                            |
                            | 1..*
                  +---------v---------+
                  |      BLOGS        |
                  +-------------------+
                  | id (PK, UUID)     |
                  | title (TEXT)      |
                  | slug (TEXT, Unique|
                  | content (TEXT)    |
                  | author_id (FK)    |
                  | status (TEXT)     |
                  +-------------------+
```

### 10.1 Database Tables

#### Table: `profiles`
Tracks authorized users, separating editors from super admins.
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('super_admin', 'editor')) DEFAULT 'editor' NOT NULL,
    full_name TEXT
);
```

#### Table: `products`
Stores primary product variants and informational highlights.
```sql
CREATE TABLE public.products (
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
```

#### Table: `product_variants`
Manages product sizing, inventory levels, and prices.
```sql
CREATE TABLE public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL, -- e.g., "5kg", "25kg", "1 Litre"
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL
);
```

#### Table: `blogs`
Tracks articles, scheduling, and publication states.
```sql
CREATE TABLE public.blogs (
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
```

#### Table: `scientific_articles`
Manages formal academic articles, lab results, and research whitepapers.
```sql
CREATE TABLE public.scientific_articles (
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
```

#### Table: `gallery`
Controls the presentation assets loaded on the public website layout.
```sql
CREATE TABLE public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL
);
```

#### Table: `homepage_content`
Stores customizable text properties corresponding to the 8 storytelling stages.
```sql
CREATE TABLE public.homepage_content (
    section_key TEXT PRIMARY KEY, -- e.g., "dead_soil", "bioblend"
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    body_text TEXT NOT NULL,
    meta_json JSONB DEFAULT '{}'::jsonb
);
```

#### Table: `inquiries`
Collects incoming contact queries and customization requests.
```sql
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'contacted', 'resolved')) DEFAULT 'new' NOT NULL
);
```

#### Table: `seo_metadata`
Stores canonical titles, description tags, and tracking coordinates per route.
```sql
CREATE TABLE public.seo_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_path TEXT UNIQUE NOT NULL, -- e.g., "/", "/science", "/products/soil-booster"
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    keywords TEXT,
    og_image TEXT
);
```

### 10.2 Row-Level Security (RLS) Policies

All tables will have Row-Level Security enabled. Public routes execute read operations anonymously, while write access is constrained to authenticated admin roles.

- **Read Operations (SELECT):**
  - Allowed for everyone (anon and authenticated users) on: `products`, `product_variants`, `blogs` (where status = 'published'), `scientific_articles`, `gallery`, `homepage_content`, `seo_metadata`.
  - Restricted to authenticated roles on: `profiles`, `inquiries`.
- **Write Operations (INSERT, UPDATE, DELETE):**
  - Denied for anonymous users on all tables except `inquiries` (INSERT allowed for anyone to permit contact form submissions).
  - Allowed for authenticated profiles where `role` matches `super_admin` or `editor`.

#### Policy Structure Example (SQL):
```sql
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for Select (Public access)
CREATE POLICY "Allow public read access" 
ON public.products FOR SELECT 
USING (is_active = true);

-- Create policy for Write (Admin roles only)
CREATE POLICY "Allow authenticated administrators modifications" 
ON public.products FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'editor')
  )
);
```

### 10.3 Storage Buckets Schema
1. `products-media` - Holds main and supplementary product variant images.
2. `blog-images` - Holds banner assets and body content diagrams.
3. `scientific-docs` - Holds PDF downloads of research publications and soil test analysis forms.
4. `site-assets` - Holds general UI templates, brand banners, and optimized canvas frame sequences.

---

## 11. Admin Dashboard Functional Architecture

The admin module is designed to give staff total autonomy over brand messaging, research documents, dynamic page settings, and sales catalogs without editing frontend code.

```
                           +-------------------------+
                           |   ADMIN DASHBOARD UI    |
                           +-------------------------+
                                        |
        +------------------+-----------+-----------+-------------------+
        |                  |                       |                   |
+-------v-------+  +-------v-------+       +-------v-------+   +-------v-------+
| Catalog Crud  |  | Content/SEO   |       | Media Manager |   | Inbox/Inquiry |
+---------------+  +---------------+       +---------------+   +---------------+
| Product specs |  | Home stages   |       | drag-drop upload|   | read status   |
| pricing tiers |  | Meta variables|       | auto-compress   |   | resolve lead  |
+---------------+  +---------------+       +---------------+   +---------------+
```

### 11.1 Key Modules
- **Analytics Panel:** Tracks landing page conversions, sample downloads, and geographic origins of contact leads.
- **Product Manager:** Interface to add and edit catalog entries, configure specifications, ingredients list, and link SKU weight variants with inventory totals.
- **Content Studio:** Dynamic input systems mapping to homepage stages and mission parameters. Allows quick copywriting updates and image exchanges.
- **Media Vault:** Drag-and-drop file uploading utility. Auto-detects upload type (PDF vs Image) and routes to correct storage bucket.
- **Inquiry Hub:** Lead intake list. Admins can flag inquiries as "new", "in progress", or "resolved".
- **SEO & Localization Manager:** Form fields modifying description tags, meta keywords, and layout titles for target routes, reducing manual configuration.

---

## 12. Coding Standards & Conventions

### 12.1 JavaScript & React Standards
- Write clean, modular, and declarative components. Focus on functional architecture.
- Keep components focused on a single responsibility. Extract logic to custom hooks when reusable.
- Use explicit prop validation (using JSDoc comments or manual checks).
- Avoid mutating state directly. Always use the setState functional update when depending on previous state.

### 12.2 Naming Conventions
- **Component Files:** PascalCase (e.g., `ProductCard.jsx`, `SoilCanvas.jsx`).
- **Component Folders:** CamelCase or PascalCase.
- **Helper Utilities & Hooks:** camelCase (e.g., `useSupabase.js`, `helpers.js`).
- **CSS Variables:** kebab-case (e.g., `--color-text-primary`, `--transition-smooth`).
- **Database Tables & Columns:** snake_case (e.g., `product_variants`, `author_id`).

### 12.3 CSS Architecture
- Style exclusively with Vanilla CSS.
- Establish central styling tokens inside `src/index.css` using CSS custom properties (`:root`).
- Use CSS Modules (`[Component].module.css`) or scope CSS cleanly using specific class wrapper systems to prevent namespace collisions.
- No inline styles allowed unless calculating dynamic elements (e.g., ScrollTrigger transform percentages or canvas rendering widths).

---

## 13. Future Ecommerce Architecture Roadmap

While Phase 1 & 2 prioritize mock conversion funnels and inquiry submissions, the database schema is built to scale into full e-commerce during subsequent updates:

```
[Customer Selects Product] -> [Cart Context Session] -> [Checkout Details Screen]
                                                                ↓
[Invoice Ledger Formed] <--- [Stripe/Razorpay Webhook] <--- [Secure Gateway API]
        ↓
[Inventory Deduction]
        ↓
[Shipping API Update]
```

- **Gateway Integration:** Integrates Stripe or Razorpay API through custom Netlify/Vercel serverless functions or Supabase Edge Functions.
- **Order Tracking:** Creates an `orders` table storing checkout details, payment intents, fulfillment statuses (`pending`, `packed`, `shipped`, `delivered`), and payment status.
- **Dynamic Stocks:** Creates atomic transactions on the database utilizing Postgres functions to check stock and subtract counts safely upon payment verification.

---

## 14. Deployment & Hosting Strategy

- **Frontend Hosting:** Vercel or Netlify. Connects directly to the GitHub repository to enable automatic staging builds on pull requests.
- **Backend & Database:** Supabase Cloud platform. Databases will be hosted in the regional location closest to target customers (e.g., Mumbai, India region for Karunad Krushi).
- **Domain & SSL:** Strict HTTPS validation, automated SSL certificate renewal through Let's Encrypt managed by the hosting provider.
- **CI/CD Pipeline:** GitHub Actions trigger to run linting steps, test suites, and build checks before allowing integration changes into the main branch.

---

## 15. Testing & Verification Strategy

- **Static Analysis:** ESLint for syntax standard checking and Prettier for layout styling uniform validation.
- **Component Testing:** Vitest and React Testing Library to test isolated UI widgets, language switches, and input states.
- **Integration Validation:** Automated verification of API responses, database RLS policies, and Auth route protections.
- **Visual & Performance Quality Check:** Run Lighthouse builds locally and in staging to verify performance budgets remain within boundaries. Perform cross-browser verification on Safari, Chrome, and Firefox to confirm canvas motion scripts execute reliably.

---

## 16. Project Execution Timeline (Phases Summary)

- **Phase 0: Project Planning & Master Documentation** (Complete - Current Phase)
- **Phase 1: Public Website Frontend** (Immersive animations, storytelling stages, static mock datasets, responsive layouts, product pages)
- **Phase 2: Admin Dashboard UI** (Mock data, full CMS screens, charts, Rich Text editor layout)
- **Phase 3: Backend Architecture** (Supabase schema initialization, RLS policies config, auth roles definition)
- **Phase 4: Supabase Integration** (Connecting frontend UI with real tables, live media fetching, asset queries)
- **Phase 5: Admin Functionality** (Connecting Dashboard controls to database CRUD operations, real media upload, authentication gates)
- **Phase 6: Optimization** (SEO, a11y, image compression, canvas performance Tuning)
- **Phase 7: Production Readiness** (Console clear-out, build verifications, deployment guides handoff)
