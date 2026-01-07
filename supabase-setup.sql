-- ================================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE
-- MenuPe - Cartas Digitales para Restaurantes
-- ================================================

-- 1. CREAR TABLAS
-- ================================================

-- Tabla de Restaurantes
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
  username VARCHAR(255),
  password VARCHAR(255),
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  "restaurantId" UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  "restaurantId" UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  "categoryId" UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  "imageUrl" TEXT,
  is_available BOOLEAN DEFAULT true,
  "isAvailable" BOOLEAN DEFAULT true,
  option_groups JSONB,
  "optionGroups" JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir todo a todos - restaurants" ON restaurants;
DROP POLICY IF EXISTS "Permitir todo a todos - categories" ON categories;
DROP POLICY IF EXISTS "Permitir todo a todos - products" ON products;

-- ⚡ POLÍTICAS PERMISIVAS - Permitir todas las operaciones
-- NOTA: En producción, deberías implementar autenticación y políticas más estrictas

-- Políticas para RESTAURANTS (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir todo a todos - restaurants"
ON restaurants
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Políticas para CATEGORIES (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir todo a todos - categories"
ON categories
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Políticas para PRODUCTS (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir todo a todos - products"
ON products
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. DATOS DE EJEMPLO
-- ================================================

-- Insertar restaurante de ejemplo
DO $$
DECLARE
  restaurant_uuid UUID;
  cat_pollos_uuid UUID;
  cat_parrillas_uuid UUID;
  cat_entradas_uuid UUID;
  cat_bebidas_uuid UUID;
  cat_postres_uuid UUID;
BEGIN
  -- Insertar restaurante y obtener su ID
  INSERT INTO restaurants (name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, instagram, facebook, username, password)
  VALUES (
    'Pollería El Sabor Peruano',
    'sabor',
    'El mejor pollo a la brasa de Lima. Más de 20 años deleitando paladares con nuestro sabor único y tradicional.',
    '51987654321',
    '#dc2626',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
    'Av. Arequipa 1234, Miraflores, Lima',
    'https://instagram.com/elsaborperuano',
    'https://facebook.com/elsaborperuano',
    'sabor',
    'demo123'
  )
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO restaurant_uuid;

  -- Insertar categorías
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🍗 Pollos a la Brasa')
  RETURNING id INTO cat_pollos_uuid;

  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥩 Parrillas')
  RETURNING id INTO cat_parrillas_uuid;

  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥗 Entradas')
  RETURNING id INTO cat_entradas_uuid;

  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥤 Bebidas')
  RETURNING id INTO cat_bebidas_uuid;

  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🍰 Postres')
  RETURNING id INTO cat_postres_uuid;

  -- Insertar productos - Pollos
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 'Pollo Entero', 'Pollo a la brasa dorado y jugoso con papas fritas y ensalada fresca', 45.00, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 'Medio Pollo', 'Media porción de nuestro delicioso pollo a la brasa con acompañamientos', 25.00, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, '1/4 de Pollo', 'Porción individual perfecta con papas y ensalada', 15.00, 'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=400', 'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=400', true, true);

  -- Insertar productos - Parrillas
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_parrillas_uuid, cat_parrillas_uuid, 'Churrasco a lo Pobre', 'Jugoso churrasco con papas, huevo frito, plátano y arroz', 32.00, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_parrillas_uuid, cat_parrillas_uuid, 'Anticuchos', 'Brochetas de corazón marinadas con ají panca, papas y choclo', 28.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', true, true);

  -- Insertar productos - Entradas
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_entradas_uuid, cat_entradas_uuid, 'Ensalada César', 'Lechuga fresca, crutones, queso parmesano y aderezo césar', 18.00, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_entradas_uuid, cat_entradas_uuid, 'Tequeños (6 und)', 'Deliciosos tequeños rellenos de queso con salsas', 12.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, true);

  -- Insertar productos - Bebidas
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_bebidas_uuid, cat_bebidas_uuid, 'Inca Kola 1.5L', 'La bebida del Perú', 7.50, 'https://images.unsplash.com/photo-1581098365948-6a5a912b2227?w=400', 'https://images.unsplash.com/photo-1581098365948-6a5a912b2227?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_bebidas_uuid, cat_bebidas_uuid, 'Chicha Morada', 'Refrescante chicha morada casera', 5.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', true, true);

  -- Insertar productos - Postres
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_postres_uuid, cat_postres_uuid, 'Suspiro Limeño', 'El clásico postre peruano con merengue suave', 10.00, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_postres_uuid, cat_postres_uuid, 'Mazamorra Morada', 'Postre tradicional peruano especiado', 8.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', true, true);

  -- Mensaje de confirmación
  RAISE NOTICE '✅ Base de datos configurada correctamente';
  RAISE NOTICE '✅ Restaurante creado: Pollería El Sabor Peruano';
  RAISE NOTICE '✅ Categorías creadas: 5';
  RAISE NOTICE '✅ Productos creados: 12';
  RAISE NOTICE '🔑 Usuario demo: sabor / demo123';
END $$;

-- ================================================
-- ¡LISTO! 🎉
-- ================================================
-- INSTRUCCIONES:
-- 1. Copia este código completo
-- 2. Ve a tu proyecto de Supabase → SQL Editor
-- 3. Pega y ejecuta este código
-- 4. Configura tus variables de entorno en .env.local:
--    VITE_SUPABASE_URL=tu-url-de-supabase
--    VITE_SUPABASE_ANON_KEY=tu-anon-key
-- 5. Accede a tu menú en: /#/menu/sabor
-- ================================================
