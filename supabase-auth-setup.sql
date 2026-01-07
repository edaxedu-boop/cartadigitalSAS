-- ================================================
-- CONFIGURACIÓN DE AUTENTICACIÓN CON SUPABASE
-- MenuPe - Sistema de Login para Admin y Restaurantes
-- ================================================

-- ================================================
-- 1. CREAR TABLAS
-- ================================================

-- Tabla de Restaurantes (actualizada con user_id)
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  whatsapp_number VARCHAR(20),
  primary_color VARCHAR(7) DEFAULT '#dc2626',
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
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

-- Tabla de Roles de Usuario (para distinguir entre super admin y restaurant admin)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'restaurant_admin',
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'restaurant_admin'))
);

-- ================================================
-- 2. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir lectura pública de restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categories;
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON products;
DROP POLICY IF EXISTS "Super admin acceso total restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurant admin acceso a su restaurant" ON restaurants;
DROP POLICY IF EXISTS "Super admin acceso total categories" ON categories;
DROP POLICY IF EXISTS "Restaurant admin acceso a sus categories" ON categories;
DROP POLICY IF EXISTS "Super admin acceso total products" ON products;
DROP POLICY IF EXISTS "Restaurant admin acceso a sus products" ON products;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;

-- ================================================
-- POLÍTICAS PARA RESTAURANTS
-- ================================================

-- Lectura pública (todos pueden ver los menús)
CREATE POLICY "Permitir lectura pública de restaurantes"
ON restaurants FOR SELECT
TO public
USING (true);

-- Super Admin puede hacer todo
CREATE POLICY "Super admin acceso total restaurants"
ON restaurants FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
);

-- Restaurant Admin puede editar su propio restaurante
CREATE POLICY "Restaurant admin acceso a su restaurant"
ON restaurants FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ================================================
-- POLÍTICAS PARA CATEGORIES
-- ================================================

-- Lectura pública
CREATE POLICY "Permitir lectura pública de categorías"
ON categories FOR SELECT
TO public
USING (true);

-- Super Admin puede hacer todo
CREATE POLICY "Super admin acceso total categories"
ON categories FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
);

-- Restaurant Admin puede gestionar categorías de su restaurante
CREATE POLICY "Restaurant admin acceso a sus categories"
ON categories FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants 
    WHERE restaurants.id = categories.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM restaurants 
    WHERE restaurants.id = categories.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
);

-- ================================================
-- POLÍTICAS PARA PRODUCTS
-- ================================================

-- Lectura pública
CREATE POLICY "Permitir lectura pública de productos"
ON products FOR SELECT
TO public
USING (true);

-- Super Admin puede hacer todo
CREATE POLICY "Super admin acceso total products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'super_admin'
  )
);

-- Restaurant Admin puede gestionar productos de su restaurante
CREATE POLICY "Restaurant admin acceso a sus products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants 
    WHERE restaurants.id = products.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM restaurants 
    WHERE restaurants.id = products.restaurant_id 
    AND restaurants.user_id = auth.uid()
  )
);

-- ================================================
-- POLÍTICAS PARA USER_ROLES
-- ================================================

-- Los usuarios pueden leer su propio rol
CREATE POLICY "Users can read their own role"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ================================================
-- 3. CREAR FUNCIÓN PARA REGISTRAR SUPER ADMIN
-- ================================================

CREATE OR REPLACE FUNCTION create_super_admin(
  email TEXT,
  password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Nota: Esta función debe ser llamada manualmente solo una vez
  -- para crear el super admin inicial
  
  INSERT INTO user_roles (user_id, role)
  VALUES (
    (SELECT id FROM auth.users WHERE email = email LIMIT 1),
    'super_admin'
  )
  ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  
  RETURN json_build_object('success', true);
END;
$$;

-- ================================================
-- 4. DATOS DE EJEMPLO
-- ================================================

-- INSTRUCCIONES PARA CREAR USUARIOS:
-- 
-- 1. CREAR SUPER ADMIN:
--    - Ve a Authentication → Users en Supabase Dashboard
--    - Clic en "Add user" → "Create new user"
--    - Email: admin@menupe.com
--    - Password: tu-password-seguro
--    - Después ejecuta:
--    INSERT INTO user_roles (user_id, role) 
--    VALUES ((SELECT id FROM auth.users WHERE email = 'admin@menupe.com'), 'super_admin');
--
-- 2. CREAR RESTAURANT ADMIN (ejemplo):
--    - Ve a Authentication → Users
--    - Clic en "Add user"
--    - Email: sabor@restaurant.com
--    - Password: demo123
--    - Luego crea el restaurante asociado (ver abajo)

-- Ejemplo de restaurante (descomenta y ajusta después de crear el usuario)
/*
DO $$
DECLARE
  restaurant_uuid UUID;
  user_uuid UUID;
  cat_pollos_uuid UUID;
  cat_parrillas_uuid UUID;
BEGIN
  -- Obtener el ID del usuario creado
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'sabor@restaurant.com' LIMIT 1;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado. Primero crea el usuario en Authentication.';
  END IF;
  
  -- Insertar restaurante
  INSERT INTO restaurants (user_id, name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, instagram, facebook)
  VALUES (
    user_uuid,
    'Pollería El Sabor Peruano',
    'sabor',
    'El mejor pollo a la brasa de Lima. Más de 20 años deleitando paladares con nuestro sabor único y tradicional.',
    '51987654321',
    '#dc2626',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
    'Av. Arequipa 1234, Miraflores, Lima',
    'https://instagram.com/elsaborperuano',
    'https://facebook.com/elsaborperuano'
  )
  RETURNING id INTO restaurant_uuid;
  
  -- Crear rol de restaurant admin
  INSERT INTO user_roles (user_id, role, restaurant_id)
  VALUES (user_uuid, 'restaurant_admin', restaurant_uuid);
  
  -- Insertar categorías
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🍗 Pollos a la Brasa')
  RETURNING id INTO cat_pollos_uuid;
  
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥩 Parrillas')
  RETURNING id INTO cat_parrillas_uuid;
  
  -- Insertar productos de ejemplo
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 'Pollo Entero', 'Pollo a la brasa dorado y jugoso con papas fritas y ensalada fresca', 45.00, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', true, true),
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 'Medio Pollo', 'Media porción de nuestro delicioso pollo a la brasa', 25.00, 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', true, true);
  
  RAISE NOTICE '✅ Restaurante creado exitosamente asociado al usuario';
END $$;
*/

-- ================================================
-- ¡LISTO! 🎉
-- ================================================
