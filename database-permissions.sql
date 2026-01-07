-- ================================================
-- PERMISOS DE ESCRITURA PARA MENUPE
-- Ejecuta este script en Supabase SQL Editor
-- ================================================

-- ============================================
-- ELIMINAR POLÍTICAS EXISTENTES (si existen)
-- ============================================

DROP POLICY IF EXISTS "Permitir insertar restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir actualizar restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir eliminar restaurantes" ON restaurants;

DROP POLICY IF EXISTS "Permitir insertar categorías" ON categories;
DROP POLICY IF EXISTS "Permitir actualizar categorías" ON categories;
DROP POLICY IF EXISTS "Permitir eliminar categorías" ON categories;

DROP POLICY IF EXISTS "Permitir insertar productos" ON products;
DROP POLICY IF EXISTS "Permitir actualizar productos" ON products;
DROP POLICY IF EXISTS "Permitir eliminar productos" ON products;

-- ============================================
-- RESTAURANTES - Políticas de Escritura
-- ============================================

-- Permitir crear restaurantes
CREATE POLICY "Permitir insertar restaurantes"
ON restaurants FOR INSERT
TO public
WITH CHECK (true);

-- Permitir actualizar restaurantes
CREATE POLICY "Permitir actualizar restaurantes"
ON restaurants FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Permitir eliminar restaurantes
CREATE POLICY "Permitir eliminar restaurantes"
ON restaurants FOR DELETE
TO public
USING (true);

-- ============================================
-- CATEGORÍAS - Políticas de Escritura
-- ============================================

-- Permitir crear categorías
CREATE POLICY "Permitir insertar categorías"
ON categories FOR INSERT
TO public
WITH CHECK (true);

-- Permitir actualizar categorías
CREATE POLICY "Permitir actualizar categorías"
ON categories FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Permitir eliminar categorías
CREATE POLICY "Permitir eliminar categorías"
ON categories FOR DELETE
TO public
USING (true);

-- ============================================
-- PRODUCTOS - Políticas de Escritura
-- ============================================

-- Permitir crear productos
CREATE POLICY "Permitir insertar productos"
ON products FOR INSERT
TO public
WITH CHECK (true);

-- Permitir actualizar productos
CREATE POLICY "Permitir actualizar productos"
ON products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Permitir eliminar productos
CREATE POLICY "Permitir eliminar productos"
ON products FOR DELETE
TO public
USING (true);

-- ================================================
-- VERIFICACIÓN
-- ================================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('restaurants', 'categories', 'products')
ORDER BY tablename, cmd;

-- ================================================
-- ✅ LISTO!
-- ================================================
-- Ahora puedes:
-- 1. Crear, editar y eliminar restaurantes desde Super Admin
-- 2. Crear, editar y eliminar categorías desde el Dashboard
-- 3. Crear, editar y eliminar productos desde el Dashboard
-- ================================================
