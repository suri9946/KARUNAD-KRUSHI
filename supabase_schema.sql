-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables to perform a clean reset
drop table if exists product_variants cascade;
drop table if exists products cascade;
drop table if exists blogs cascade;
drop table if exists scientific_articles cascade;
drop table if exists inquiries cascade;
drop table if exists gallery cascade;
drop table if exists orders cascade;
drop table if exists site_content cascade;
drop table if exists seo_settings cascade;

-- ========================================================
-- 1. Create Tables
-- ========================================================

-- Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  ingredients text[],
  application_guide text,
  scientific_backing text,
  main_image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product Variants Table
create table if not exists product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  price numeric(10, 2) not null,
  stock integer not null default 0
);

-- Blogs Table
create table if not exists blogs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  featured_image text,
  published_at timestamp with time zone,
  status text not null default 'draft',
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Scientific Articles Table
create table if not exists scientific_articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  authors text,
  category text,
  abstract text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inquiries Table
create table if not exists inquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery Table
create table if not exists gallery (
  id uuid default uuid_generate_v4() primary key,
  title text,
  image_url text not null,
  caption text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_address text not null,
  billing_address text not null,
  payment_status text not null default 'pending',
  payment_method text not null,
  transaction_id text not null unique,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null,
  total numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site Content Table
create table if not exists site_content (
  key text primary key,
  value jsonb not null
);

-- SEO Settings Table
create table if not exists seo_settings (
  page_id text primary key,
  title text not null,
  meta_description text,
  keywords text,
  og_image text
);

-- ========================================================
-- 2. Insert Default Data (Seeding)
-- ========================================================

-- Seed Products and Variants
with inserted_products as (
  insert into products (name, slug, short_description, description, ingredients, application_guide, scientific_backing, main_image_url, is_active)
  values 
    (
      'General BioBlend Booster', 
      'general-bioblend', 
      'Premium multi-action organic soil amendment containing proprietary bacterial concentrates for all crop species.', 
      'Our core formulation is engineered to reconstruct dead soil matrices. Containing concentrated Humic acids, mycorrhizal cultures, and a diverse range of plant-growth-promoting rhizobacteria (PGPR), this booster activates biological cycles natively to rebuild soil structures.',
      array['Humic & Fulvic Acids (45%)', 'Glomus Intradices Mycorrhiza', 'Bacillus Subtilis Spores', 'Organic Carrier Matrix (50%)'],
      'Apply 25kg per acre during land preparation or early vegetative stage. Mix evenly with compost or topsoil. Ensure adequate soil moisture for microbial activation.',
      'Field trials in partnership with regional agricultural universities show a 28% increase in organic carbon accumulation and a 15% reduction in synthetic NPK dependency over a 12-month period.',
      '/assets/products/general_blend.png',
      true
    ),
    (
      'Tomato Growth Accelerator', 
      'tomato-accelerator', 
      'Targeted microbial inoculant optimized for Solanaceous crops, boosting root absorption and sugar accumulation.', 
      'Formulated specifically to maximize Lycopersicon esculentum yields. This dynamic amendment contains specific potassium-solubilizing strains (Frateuria aurantia) and iron-chelating siderophores that ensure tomatoes develop thick stems, dense root systems, and sweet, disease-resistant harvests.',
      array['Frateuria Aurantia Culture', 'Zinc Solubilizing Bacteria', 'Seaweed Extract (15%)', 'Organic Compost Carrier'],
      'Apply 5kg per acre near the root zone at transplanting. Repeat another 5kg at flowering stage. Integrate with drip irrigation systems if applicable.',
      'Documented root network expansion of up to 340% within 30 days of application. Fruits showed an average increase of 1.8 degrees Brix in sweetness tests.',
      '/assets/products/tomato.png',
      true
    ),
    (
      'Chilli Veggie Vitalizer', 
      'chilli-vitalizer', 
      'High-nitrogen organic soil builder designed to intensify capsaicin levels, flowering density, and crop vitality.', 
      'Engage the full productive potential of chilli and pepper crops. Packed with nitrogen-fixing Azotobacter strains, phosphorus-solubilizing Pseudomonas, and key biological catalysts, this vitalizer reduces flower dropping, strengthens plants against viral wilting, and improves pungency scores.',
      array['Azotobacter Chroococcum Spores', 'Pseudomonas Striata', 'Amino Acid Complexes (8%)', 'Neem Cake Base'],
      'Apply 10kg per acre as a band placement 2 inches away from plant stems 15 days after transplantation. Reapply at fruit set.',
      'Suppressed root-knot nematode populations by 68% in controlled testing. Enhanced average flower-to-fruit conversion efficiency by 22%.',
      '/assets/products/chilli.png',
      true
    ),
    (
      'Brinjal Healthy Bloom', 
      'brinjal-bloom', 
      'Soil microbial revitalizer crafted to defend brinjal crops from shoot borer damage and root wilting.', 
      'Designed specifically for eggplant species. This biological formulation introduces Bacillus thuringiensis and vesicular-arbuscular mycorrhiza (VAM) which build root protection fields, enrich mineral uptake, and stimulate lush, healthy flowering structures that lead to uniform, shiny fruits.',
      array['Vesicular Arbuscular Mycorrhiza (VAM)', 'Bacillus Thuringiensis Conidia', 'Humic Extracts (10%)', 'Castor Cake Soil Conditioner'],
      'Apply 15kg per acre along crop rows during ridge forming. Repeat 10kg per acre during mid-crop cycle weeding.',
      'Showed a 40% reduction in typical bacterial wilt incidence in endemic test plots. Promoted uniform fruit size distribution with less seed count.',
      '/assets/products/brinjal.png',
      true
    )
  returning id, slug
)
insert into product_variants (product_id, sku, size, price, stock)
select 
  id,
  case 
    when slug = 'general-bioblend' then 'KK-GB-5KG'
    when slug = 'tomato-accelerator' then 'KK-TA-1KG'
    when slug = 'chilli-vitalizer' then 'KK-CV-2KG'
    when slug = 'brinjal-bloom' then 'KK-BB-5KG'
  end,
  case 
    when slug = 'general-bioblend' then '5 Kg'
    when slug = 'tomato-accelerator' then '1 Kg'
    when slug = 'chilli-vitalizer' then '2 Kg'
    when slug = 'brinjal-bloom' then '5 Kg'
  end,
  case 
    when slug = 'general-bioblend' then 450.00
    when slug = 'tomato-accelerator' then 220.00
    when slug = 'chilli-vitalizer' then 380.00
    when slug = 'brinjal-bloom' then 650.00
  end,
  case 
    when slug = 'general-bioblend' then 120
    when slug = 'tomato-accelerator' then 350
    when slug = 'chilli-vitalizer' then 210
    when slug = 'brinjal-bloom' then 150
  end
from inserted_products
union all
select 
  id,
  case 
    when slug = 'general-bioblend' then 'KK-GB-25KG'
    when slug = 'tomato-accelerator' then 'KK-TA-5KG'
    when slug = 'chilli-vitalizer' then 'KK-CV-10KG'
    when slug = 'brinjal-bloom' then 'KK-BB-20KG'
  end,
  case 
    when slug = 'general-bioblend' then '25 Kg'
    when slug = 'tomato-accelerator' then '5 Kg'
    when slug = 'chilli-vitalizer' then '10 Kg'
    when slug = 'brinjal-bloom' then '20 Kg'
  end,
  case 
    when slug = 'general-bioblend' then 1800.00
    when slug = 'tomato-accelerator' then 950.00
    when slug = 'chilli-vitalizer' then 1550.00
    when slug = 'brinjal-bloom' then 2200.00
  end,
  case 
    when slug = 'general-bioblend' then 85
    when slug = 'tomato-accelerator' then 140
    when slug = 'chilli-vitalizer' then 60
    when slug = 'brinjal-bloom' then 45
  end
from inserted_products;

-- Seed Blogs
insert into blogs (title, slug, featured_image, published_at, status, content)
values
  (
    'Understanding Soil Organic Carbon: The Metric of Soil Life',
    'understanding-soil-organic-carbon',
    '/assets/products/general_blend.png',
    timezone('utc'::text, now()),
    'published',
    'Soil Organic Carbon (SOC) is the absolute foundation of soil fertility. In depleted soils, carbon drops below 0.3%, rendering it sterile. Rebuilding this carbon requires organic matrix networks that trap humidity, house mycelial hyphae, and store microbial enzymes. Through systematic restoration using BioBlend, we trigger natural humification cycles that increase SOC to healthy target ranges (>0.8%) within a single agricultural season. Healthy carbon creates spongy structures that save irrigation water by up to 40%.'
  ),
  (
    'Mycorrhiza: The Subterranean Internet Linking Crop Roots',
    'mycorrhiza-subterranean-internet',
    '/assets/products/tomato.png',
    timezone('utc'::text, now()),
    'published',
    'Underneath the soil lies a symbiotic network of fungal threads called Mycorrhiza. These fungi bind to plant roots, extending their microscopic search fingers deep into dry soils. They extract locked phosphorus and micronutrients, offering them to the plant in exchange for simple sugars. In modern chemically-treated farms, this network is completely broken. Re-introducing active mycorrhizal spores restores this mutual communication channel, strengthening crop immunity and drought tolerance.'
  ),
  (
    'Rebuilding Rhizosphere Biology in Intensive Vegetable Farming',
    'rebuilding-rhizosphere-biology',
    '/assets/products/chilli.png',
    timezone('utc'::text, now()),
    'published',
    'The rhizosphere—the narrow zone of soil surrounding plant roots—is an area of intense chemical and biological activity. Intensive vegetable production using heavy chemical nitrogen inputs sterilizes this critical zone. Inoculating the rhizosphere with key plant-growth-promoting rhizobacteria (PGPR) like Bacillus subtilis and Pseudomonas fluorescens creates a biological shield. These bacteria secrete plant hormones that stimulate root division while solubilizing insoluble minerals, creating robust crop growth.'
  );

-- Seed Scientific Articles
insert into scientific_articles (title, slug, authors, category, abstract, content)
values
  (
    'Isolation and Efficacy Testing of Phosphate-Solubilizing Rhizobacteria (PSB) in Depleted Soils',
    'efficacy-phosphate-solubilizing-bacteria',
    'Dr. K. Raghavendra, Prof. S. Patil',
    'Soil Biology',
    'Phosphorus is frequently locked in soils as insoluble calcium phosphate. This research isolates native strains of Pseudomonas striata and evaluates their rate of phosphorus mineralization in clay-loam soils with low organic matter. Results demonstrate that inoculation increases active phosphate availability by 34% within 45 days.',
    'Insoluble phosphorus binds tightly with soil minerals, making it unavailable to plant roots. In this study, we evaluated the performance of specific bacterial inoculants isolated from undisturbed forest clays. The isolates were fermented and mixed with organic carriers to build BioBlend amendments. Testing across 12 field units showed a high correlation between PSB counts and crop root dry-weight, showing that organic acids secreted by PSB successfully unlocked bound phosphates.'
  ),
  (
    'Role of Humic-Clay Complexes in Restoring Cation Exchange Capacity (CEC) of Sandy Soils',
    'humic-clay-complexes-cec-restoration',
    'M. Gowda, Dr. Helena Ross',
    'Soil Physics',
    'Sandy loam soils suffer from nutrient leaching due to low cation exchange capacity. This study explores the structural changes induced in sandy profiles when treated with humic-fulvic acid lattices. X-ray diffraction confirms the formation of stable clay-humic complexes that double nutrient retention profiles.',
    'CEC represents the soil''s ability to hold onto key nutrients like potassium, calcium, and magnesium. By applying rich carbon matrices (derived from humification of organic substrates), we introduce dense negatively-charged carboxyl groups. These groups hold positively-charged fertilizer cations, preventing leaching from monsoon rains. Our study reports a 112% increase in potassium retention in sand-heavy zones after treatment.'
  );

-- Seed Inquiries
insert into inquiries (name, email, phone, message, status)
values
  (
    'Ramesh Hegde',
    'ramesh.hegde@agrilink.in',
    '+91 9845012345',
    'Interested in bulk order of General BioBlend Booster (25kg variants) for my 15-acre pomegranate orchard in Chitradurga. Please send quotation.',
    'new'
  ),
  (
    'Dr. Sunitha Prasad',
    'sunithap@agrires.org',
    '+91 8023456789',
    'Would like to request sample packs of Tomato Growth Accelerator to conduct validation trials at our research station. Please contact.',
    'resolved'
  );

-- Seed Gallery
insert into gallery (title, image_url, caption, display_order)
values
  ('Brand Logo', '/assets/logo.png', 'Official Karunad Krushi brand logo asset.', 1),
  ('General BioBlend Pack', '/assets/products/general_blend.png', 'Product visualization for General BioBlend soil booster.', 2),
  ('Tomato Accelerator Pack', '/assets/products/tomato.png', 'Product package rendering for tomato biological booster.', 3),
  ('Chilli Vitalizer Pack', '/assets/products/chilli.png', 'Product package rendering for chilli biological booster.', 4),
  ('Brinjal Bloom Pack', '/assets/products/brinjal.png', 'Product package rendering for brinjal biological booster.', 5);

-- Seed SEO Settings
insert into seo_settings (page_id, title, meta_description, keywords, og_image)
values
  ('home', 'Karunad Krushi | Reclaiming Dead Soil Intelligently', 'Restore sterile, depleted agricultural soils to rich living ecosystems using scientific bioblend formulas.', 'BioBlend, soil restoration, organic farming, biostimulant, India, Karunad Krushi', '/assets/og-home.jpg'),
  ('science', 'Scientific Hub | Soil Biology & Research | Karunad Krushi', 'Explore our peer-reviewed research papers and lab reports documenting the activation of nitrogen and phosphorus soil cycles.', 'soil microbiology, mycorrhiza, trichoderma, biostimulant science, soil health research', '/assets/og-science.jpg'),
  ('blog', 'Agri Knowledge Base | Karunad Krushi Blog', 'Practical guides, agricultural case studies, and insights on organic soil rebuilding and plant nutrition.', 'farming blog, organic farming tips, soil health, agriculture insights', '/assets/og-blog.jpg'),
  ('products', 'BioBlend Products | Shop | Karunad Krushi', 'Explore BioBlend''s range of biological soil activators for home gardeners, organic farmers, nurseries, and urban growers.', 'BioBlend buy, soil activator, biological fertilizer, organic crop booster', '/assets/og-products.jpg');

-- Seed Site Content
insert into site_content (key, value)
values
  ('splashText', '{"en": "INITIATING SOIL RECONSTRUCTION SEQUENCE...", "kn": "ಮಣ್ಣಿನ ಪುನರ್ನಿರ್ಮಾಣ ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ..."}'),
  ('stageHeroTitle', '{"en": "TEASER: THE SPARK OF LIFE", "kn": "ಟೀಸರ್: ಜೀವನದ ಕಿಡಿ"}'),
  ('stageHeroDesc', '{"en": "Teasing the visual journey of microbial activation.", "kn": "ಮೈಕ್ರೋಬಿಯಲ್ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆಯ ದೃಶ್ಯ ಪ್ರಯಾಣದ ಪರಿಚಯ."}'),
  ('stageDeadTitle', '{"en": "STAGE 1: THE DEAD SOIL", "kn": "ಹಂತ ೧: ನಿರ್ಜೀವ ಮಣ್ಣು"}'),
  ('stageDeadDesc', '{"en": "Vast expanses of depleted, sterile agricultural soils across our country require dynamic, structured restoration.", "kn": "ನಮ್ಮ ದೇಶದಾದ್ಯಂತ ಸವಕಳಿಯಾದ, ಬಂಜರು ಕೃಷಿ ಭೂಮಿಗೆ ವ್ಯವಸ್ಥಿತ ಮತ್ತು ಕ್ರಿಯಾತ್ಮಕ ಮರುಸ್ಥಾಪನೆಯ ಅವಶ್ಯಕತೆಯಿದೆ."}'),
  ('stageCrisisTitle', '{"en": "STAGE 2: THE HIDDEN CRISIS", "kn": "ಹಂತ ೨: ಅಡಗಿರುವ ಬಿಕ್ಕಟ್ಟು"}'),
  ('stageCrisisDesc', '{"en": "Chemical abuse and mechanical tilling have eroded the native microbial network. Soil organic carbon is approaching critical minimums.", "kn": "ರಾಸಾಯನಿಕಗಳ ಅತಿಯಾದ ಬಳಕೆ ಮತ್ತು ಯಾಂತ್ರಿಕ ಉಳುಮೆಯು ನೈಸರ್ಗಿಕ ಮೈಕ್ರೋಬಿಯಲ್ ಜಾಲವನ್ನು ನಾಶಪಡಿಸಿದೆ. ಸಾವಯವ ಇಂಗಾಲವು ತಳಮಟ್ಟ ತಲುಪಿದೆ."}'),
  ('stageScienceTitle', '{"en": "STAGE 3: SCIENTIFIC REGENERATION", "kn": "ಹಂತ ೩: ವೈಜ್ಞಾನಿಕ ಪುನರುಜ್ಜೀವನ"}'),
  ('stageScienceDesc', '{"en": "Through biology and research, we isolate specific bacterial strains to kickstart the nitrogen and phosphorus cycles natively.", "kn": "ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ಸಂಶೋಧನೆಯ ಮೂಲಕ, ನಾವು ಸಾರಜನಕ ಮತ್ತು ರಂಜಕ ಚಕ್ರಗಳನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಪ್ರಾರಂಭಿಸಲು ನಿರ್ದಿಷ್ಟ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸುತ್ತೇವೆ."}'),
  ('stageBioblendTitle', '{"en": "STAGE 4: BIOBLEND FORMULATION", "kn": "ಹಂತ ೪: ಬಯೋಬ್ಲೆಂಡ್ ಫಾರ್ಮುಲೇಶನ್"}'),
  ('stageBioblendDesc', '{"en": "Our proprietary BioBlend formula concentrates billions of active spores inside a nutrient-rich organic carrier grid.", "kn": "ನಮ್ಮದೇ ಆದ ಬಯೋಬ್ಲೆಂಡ್ ಸೂತ್ರವು ಶತಕೋಟಿ ಸಕ್ರಿಯ ಸ್ಪೋರ್‌ಗಳನ್ನು ಪೌಷ್ಟಿಕಾಂಶ ಭರಿತ ಸಾವಯವ ವಾಹಕ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಸಾಂದ್ರೀಕರಿಸುತ್ತದೆ."}'),
  ('stageLivingTitle', '{"en": "STAGE 5: THE LIVING SOIL", "kn": "ಹಂತ ೫: ಜೀವಂತ ಮಣ್ಣು"}'),
  ('stageLivingDesc', '{"en": "Re-introducing organic matter stimulates root fungi, earthworms, and rich biodiverse microbes, creating porous living humus.", "kn": "ಸಾವಯವ ಪದಾರ್ಥಗಳನ್ನು ಮರುಪರಿಚಯಿಸುವುದರಿಂದ ಬೇರು ಶಿಲೀಂಧ್ರಗಳು, ಎರೆಹುಳುಗಳು ಮತ್ತು ವೈವಿಧ್ಯಮಯ ಸೂಕ್ಷ್ಮಜೀವಿಗಳನ್ನು ಉತ್ತೇಜಿಸಿ, ಫಲವತ್ತಾದ ಮಣ್ಣನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ."}'),
  ('stageRootsTitle', '{"en": "STAGE 6: DEEP ROOT NETWORKS", "kn": "ಹಂತ ೬: ಆಳವಾದ ಬೇರುಗಳ ಜಾಲ"}'),
  ('stageRootsDesc', '{"en": "Mycorrhizal networks link directly to crop roots, extending water absorption capacity up to 1000% dynamically.", "kn": "ಮೈಕೋರೈಜಲ್ ಜಾಲಗಳು ನೇರವಾಗಿ ಬೆಳೆ ಬೇರುಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ, ನೀರು ಹೀರಿಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಶೇಕಡಾ ೧೦೦೦ ರಷ್ಟು ಹೆಚ್ಚಿಸುತ್ತದೆ."}'),
  ('stageCropsTitle', '{"en": "STAGE 7: THRIVING CANOPY", "kn": "ಹಂತ ೭: ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತಿರುವ ಬೆಳೆ"}'),
  ('stageCropsDesc', '{"en": "Restored soil delivers rich, disease-resistant crop canopies, yielding higher weights and highly nutritious harvest results.", "kn": "ಮರುಸ್ಥಾಪಿತ ಮಣ್ಣು ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯುಳ್ಳ ಬೆಳೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ, ಇದರಿಂದಾಗಿ ಹೆಚ್ಚಿನ ಇಳುವರಿ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶಯುಕ್ತ ಕೊಯ್ಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ."}'),
  ('stageTrustTitle', '{"en": "STAGE 8: TRUST & RESTORATION", "kn": "ಹಂತ ೮: ವಿಶ್ವಾಸ ಮತ್ತು ಮರುಸ್ಥಾಪನೆ"}'),
  ('stageTrustDesc', '{"en": "Empowering farmers globally with science and organic solutions. Let us claim our soil back, intelligently.", "kn": "ವೈಜ್ಞಾನಿಕ ಮತ್ತು ಸಾವಯವ ಪರಿಹಾರಗಳ ಮೂಲಕ ಜಾಗತಿಕವಾಗಿ ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು. ನಮ್ಮ ಮಣ್ಣನ್ನು ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮರುಪಡೆಯೋಣ."}'),
  ('footerAddress', '{"en": "Karunad Krushi Office, Bangalore, Karnataka, India", "kn": "ಕರುನಾಡು ಕೃಷಿ ಕಚೇರಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ, ಭಾರತ"}'),
  ('footerEmail', '{"en": "contact@karunadkrushi.com", "kn": "contact@karunadkrushi.com"}'),
  ('footerPhone', '{"en": "+91 9946000000", "kn": "+91 9946000000"}'),
  ('gstin', '{"en": "29AAAAA1111A1Z1", "kn": "29AAAAA1111A1Z1"}'),
  ('brandName', '{"en": "KARUNAD KRUSHI", "kn": "ಕರುನಾಡು ಕೃಷಿ"}'),
  ('tagline', '{"en": "Building Intelligent Agri Solutions", "kn": "ಬುದ್ಧಿವಂತ ಕೃಷಿ ಪರಿಹಾರಗಳ ನಿರ್ಮಾಣ"}'),
  ('mission', '{"en": "Restore Soil Intelligently", "kn": "ಮಣ್ಣನ್ನು ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮರುಸ್ಥಾಪಿಸಿ"}'),
  ('heroVideoUrl', '{"en": "/assets/hero_video.mp4", "kn": "/assets/hero_video.mp4"}'),
  ('audiences', '{"value": [
    {
      "title_en": "Urban Farmers",
      "title_kn": "ನಗರ ರೈತರು",
      "image": "/assets/audience/urban.png",
      "color": "hsl(175, 80%, 45%)",
      "points": [
        {"label_en": "Maximized Space Efficiency", "label_kn": "ಗರಿಷ್ಠ ಸ್ಥಳ ದಕ್ಷತೆ", "desc_en": "Deepens root branching to get the highest yield out of compact vertical and rooftop setups.", "desc_kn": "ಕಡಿಮೆ ಜಾಗದ ಲಂಬ ಮತ್ತು ಮೇಲ್ಛಾವಣಿಯ ಕೃಷಿಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಇಳುವರಿ ಪಡೆಯಲು ಬೇರುಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ."},
        {"label_en": "Smart Moisture Retention", "label_kn": "ಬುದ್ಧಿವಂತ ತೇವಾಂಶ ಧಾರಣ", "desc_en": "Upgrades soil structure to hold water longer, preventing quick drying in shallow containers.", "desc_kn": "ಕಡಿಮೆ ಆಳದ ಕುಂಡಗಳಲ್ಲಿ ನೀರು ಬೇಗನೆ ಒಣಗದಂತೆ ತಡೆಯಲು ಮಣ್ಣಿನ ತೇವಾಂಶ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ."}
      ]
    },
    {
      "title_en": "Organic Farmers",
      "title_kn": "ಸಾವಯವ ರೈತರು",
      "image": "/assets/audience/organic.png",
      "color": "hsl(135, 45%, 45%)",
      "points": [
        {"label_en": "Certified Biological Integrity", "label_kn": "ಪ್ರಮಾಣೀಕೃತ ಜೈವಿಕ ಸಮಗ್ರತೆ", "desc_en": "100% natural recovery blend that perfectly respects organic standards and zero-chemical soil life.", "desc_kn": "ಸಾವಯವ ಗುಣಮಟ್ಟ ಮತ್ತು ಶೂನ್ಯ-ರಾಸಾಯನಿಕ ಮಣ್ಣಿನ ಜೀವನವನ್ನು ಗೌರವಿಸುವ ೧೦೦% ನೈಸರ್ಗಿಕ ಮಿಶ್ರಣ."},
        {"label_en": "Revived Living Soil", "label_kn": "ಪುನರುಜ್ಜೀವನಗೊಂಡ ಜೀವಂತ ಮಣ್ಣು", "desc_en": "Rebuilds native microbial populations to bring exhausted, intensively farmed land back to life.", "desc_kn": "ಅತಿಯಾದ ಕೃಷಿಯಿಂದ ದಣಿದ ಭೂಮಿಯನ್ನು ಪುನರುಜ್ಜೀವನಗೊಳಿಸಲು ಸ್ಥಳೀಯ ಸೂಕ್ಷ್ಮಜೀವಿಗಳ ಸಂಖ್ಯೆಯನ್ನು ಮರುನಿರ್ಮಾಣ ಮಾಡುತ್ತದೆ."}
      ]
    },
    {
      "title_en": "Plant Nurseries",
      "title_kn": "ಸಸ್ಯ ನರ್ಸರಿಗಳು",
      "image": "/assets/audience/nursery.png",
      "color": "hsl(45, 90%, 55%)",
      "points": [
        {"label_en": "Rapid Sapling Growth", "label_kn": "ವೇಗದ ಸಸ್ಯಗಳ ಬೆಳವಣಿಗೆ", "desc_en": "Accelerates early root-zone activation so young hybrid plants reach market readiness much faster.", "desc_kn": "ಹೈಬ್ರಿಡ್ ಸಸ್ಯಗಳು ಮಾರುಕಟ್ಟೆಗೆ ಬೇಗನೆ ಸಿದ್ಧವಾಗಲು ಆರಂಭಿಕ ಬೇರು-ವಲಯದ ಬೆಳವಣಿಗೆಯನ್ನು ವೇಗಗೊಳಿಸುತ್ತದೆ."},
        {"label_en": "Zero Transplant Shock", "label_kn": "ಸ್ಥಳಾಂತರದ ಆಘಾತ ಮುಕ್ತ", "desc_en": "Strengthens natural plant biostimulation to drastically reduce seedling mortality and stress.", "desc_kn": "ಸಸಿಗಳ ಮರಣ ಪ್ರಮಾಣ ಮತ್ತು ಒತ್ತಡವನ್ನು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆ ಮಾಡಲು ನೈಸರ್ಗಿಕ ಜೈವಿಕ ಪ್ರಚೋದನೆಯನ್ನು ಬಲಪಡಿಸುತ್ತದೆ."}
      ]
    },
    {
      "title_en": "Home Gardeners",
      "title_kn": "ಮನೆ ತೋಟಗಾರರು",
      "image": "/assets/audience/home_garden.png",
      "color": "hsl(12, 60%, 50%)",
      "points": [
        {"label_en": "Premium 1 kg Packs", "label_kn": "ಪ್ರೀಮಿಯಂ ೧ ಕೆಜಿ ಪ್ಯಾಕ್‌ಗಳು", "desc_en": "Tailored, clean, and mess-free packaging designed explicitly for simple home and balcony pot application.", "desc_kn": "ಮನೆ ಮತ್ತು ಬಾಲ್ಕನಿ ಕುಂಡಗಳಲ್ಲಿ ಬಳಸಲು ಸುಲಭ ಮತ್ತು ಸ್ವಚ್ಛವಾದ ವಿಶೇಷ ಪ್ಯಾಕೇಜಿಂಗ್ ವಿನ್ಯಾಸ."},
        {"label_en": "Vibrant Leaf & Bloom Vigor", "label_kn": "ಎಲೆ ಮತ್ತು ಹೂವುಗಳ ಚೈತನ್ಯ", "desc_en": "Naturally triggers efficient nutrient cycling, giving everyday growers visibly greener and healthier potted plants.", "desc_kn": "ನೈಸರ್ಗಿಕವಾಗಿ ಪೋಷಕಾಂಶಗಳ ಚಕ್ರವನ್ನು ಪ್ರಚೋದಿಸಿ, ಕುಂಡದಲ್ಲಿ ಬೆಳೆಯುವ ಸಸ್ಯಗಳನ್ನು ಹೆಚ್ಚು ಹಸಿರಾಗಿ ಮತ್ತು ಆರೋಗ್ಯಕರವಾಗಿ ಮಾಡುತ್ತದೆ."}
      ]
    }
  ]}');

-- ========================================================
-- 3. Create Storage Bucket
-- ========================================================

-- Create the site-assets bucket if it does not exist
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;


