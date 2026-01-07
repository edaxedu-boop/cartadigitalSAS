-- ================================================
-- MENUPE - NEON POSTGRESQL (VERSIÓN SIMPLE)
-- ================================================
-- Ejecuta TODO de una vez
-- ================================================

-- 1. CREAR TABLAS
-- ================================================

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  whatsapp_number VARCHAR(20),
  primary_color VARCHAR(7) DEFAULT '#dc2626',
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  username VARCHAR(100),
  password VARCHAR(100),
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  option_groups JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSERTAR RESTAURANTE
-- ================================================

INSERT INTO restaurants (name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, username, password, instagram, facebook)
VALUES (
  'Pollería El Sabor Peruano',
  'sabor',
  'El mejor pollo a la brasa de Lima.',
  '51987654321',
  '#dc2626',
  'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
  'Av. Arequipa 1234, Miraflores, Lima',
  'demo',
  'demo',
  'https://instagram.com/elsaborperuano',
  'https://facebook.com/elsaborperuano'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERTAR CATEGORÍAS
-- ================================================

INSERT INTO categories (restaurant_id, name)
SELECT id, '🍗 Pollos a la Brasa' FROM restaurants WHERE slug = 'sabor'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name)
SELECT id, '🥩 Parrillas' FROM restaurants WHERE slug = 'sabor'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name)
SELECT id, '🥗 Entradas' FROM restaurants WHERE slug = 'sabor'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name)
SELECT id, '🥤 Bebidas' FROM restaurants WHERE slug = 'sabor'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name)
SELECT id, '🍰 Postres' FROM restaurants WHERE slug = 'sabor'
ON CONFLICT DO NOTHING;

-- 4. INSERTAR PRODUCTOS
-- ================================================

-- Pollos
INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available)
SELECT 
  r.id,
  c.id,
  'Pollo Entero',
  'Pollo a la brasa dorado y jugoso con papas fritas y ensalada fresca',
  45.00,
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
  true
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
WHERE r.slug = 'sabor' AND c.name = '🍗 Pollos a la Brasa';

INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available)
SELECT 
  r.id,
  c.id,
  'Medio Pollo',
  'Media porción de nuestro delicioso pollo a la brasa',
  25.00,
  'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
  true
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
WHERE r.slug = 'sabor' AND c.name = '🍗 Pollos a la Brasa';

INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available)
SELECT 
  r.id,
  c.id,
  '1/4 de Pollo',
  'Porción individual perfecta con papas y ensalada',
  15.00,
  'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=400',
  true
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
WHERE r.slug = 'sabor' AND c.name = '🍗 Pollos a la Brasa';

-- Parrillas
INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available)
SELECT 
  r.id,
  c.id,
  'Churrasco a lo Pobre',
  'Jugoso churrasco con papas, huevo frito, plátano y arroz',
  32.00,
  'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
  true
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
WHERE r.slug = 'sabor' AND c.name = '🥩 Parrillas';

-- Bebidas
INSERT INTO products (restaurant_id, category_id, name, description, price, image_url, is_available)
SELECT 
  r.id,
  c.id,
  'Inca Kola 1.5L',
  'La bebida del Perú',
  7.50,
  'https://images.unsplash.com/photo-1581098365948-6a5a912b2227?w=400',
  true
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
WHERE r.slug = 'sabor' AND c.name = '🥤 Bebidas';

-- 5. VERIFICAR
-- ================================================

SELECT 'Restaurantes: ' || COUNT(*) as resultado FROM restaurants
UNION ALL
SELECT 'Categorías: ' || COUNT(*) FROM categories
UNION ALL
SELECT 'Productos: ' || COUNT(*) FROM products;
