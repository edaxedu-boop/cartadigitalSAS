-- ================================================
-- MIGRACIÓN: AGREGAR AUTENTICACIÓN A BD EXISTENTE
-- MenuPe - Sistema de Login con Supabase Auth
-- ================================================
-- Este script actualiza una base de datos existente
-- para agregar soporte de autenticación
-- ================================================

-- ================================================
-- 1. AGREGAR COLUMNA user_id A RESTAURANTS
-- ================================================

-- Agregar columna user_id si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE '✅ Columna user_id agregada a restaurants';
  ELSE
    RAISE NOTICE '⚠️ Columna user_id ya existe en restaurants';
  END IF;
END $$;

-- Eliminar columnas antiguas de username y password si existen (ya no las necesitamos)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'username'
  ) THEN
    ALTER TABLE restaurants DROP COLUMN username;
    RAISE NOTICE '✅ Columna username eliminada de restaurants';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'password'
  ) THEN
    ALTER TABLE restaurants DROP COLUMN password;
    RAISE NOTICE '✅ Columna password eliminada de restaurants';
  END IF;
END $$;

-- ================================================
-- 2. CREAR TABLA user_roles
-- ================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'restaurant_admin',
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'restaurant_admin'))
);

-- ================================================
-- 3. ACTUALIZAR ROW LEVEL SECURITY
-- ================================================

-- Habilitar RLS en user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Permitir lectura pública de restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categories;
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON products;
DROP POLICY IF EXISTS "Permitir todo a todos - restaurants" ON restaurants;
DROP POLICY IF EXISTS "Permitir todo a todos - categories" ON categories;
DROP POLICY IF EXISTS "Permitir todo a todos - products" ON products;
DROP POLICY IF EXISTS "Super admin acceso total restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurant admin acceso a su restaurant" ON restaurants;
DROP POLICY IF EXISTS "Super admin acceso total categories" ON categories;
DROP POLICY IF EXISTS "Restaurant admin acceso a sus categories" ON categories;
DROP POLICY IF EXISTS "Super admin acceso total products" ON products;
DROP POLICY IF EXISTS "Restaurant admin acceso a sus products" ON products;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
DROP POLICY IF EXISTS "Public insert restaurants" ON restaurants;
DROP POLICY IF EXISTS "Public insert categories" ON categories;
DROP POLICY IF EXISTS "Public insert products" ON products;
DROP POLICY IF EXISTS "Public update restaurants" ON restaurants;
DROP POLICY IF EXISTS "Public update products" ON products;
DROP POLICY IF EXISTS "Public delete restaurants" ON restaurants;
DROP POLICY IF EXISTS "Public delete categories" ON categories;
DROP POLICY IF EXISTS "Public delete products" ON products;

-- ================================================
-- NUEVAS POLÍTICAS - RESTAURANTS
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

-- Permitir INSERT público temporalmente (para el super admin crear restaurantes)
CREATE POLICY "Public insert restaurants"
ON restaurants FOR INSERT
TO authenticated
WITH CHECK (true);

-- ================================================
-- NUEVAS POLÍTICAS - CATEGORIES
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

-- Permitir operaciones públicas (insertar, eliminar)
CREATE POLICY "Public insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Public delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);

-- ================================================
-- NUEVAS POLÍTICAS - PRODUCTS
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

-- Permitir operaciones públicas
CREATE POLICY "Public insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Public update products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete products"
ON products FOR DELETE
TO authenticated
USING (true);

-- ================================================
-- POLÍTICAS - USER_ROLES
-- ================================================

-- Los usuarios pueden leer su propio rol
CREATE POLICY "Users can read their own role"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ================================================
-- 4. ÍNDICES PARA MEJOR PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_restaurant_id ON user_roles(restaurant_id);

-- ================================================
-- ✅ MIGRACIÓN COMPLETADA
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRACIÓN COMPLETADA EXITOSAMENTE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Próximos pasos:';
  RAISE NOTICE '1. Crear usuarios en Authentication → Users';
  RAISE NOTICE '   - Super Admin: admin@menupe.com';
  RAISE NOTICE '   - Restaurant: sabor@restaurant.com';
  RAISE NOTICE '';
  RAISE NOTICE '2. Ejecutar: crear-usuarios-prueba.sql';
  RAISE NOTICE '';
  RAISE NOTICE '3. Probar login en tu aplicación';
  RAISE NOTICE '';
END $$;
