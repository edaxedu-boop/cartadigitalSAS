-- SOLUCIÓN RÁPIDA: Deshabilitar RLS temporalmente para pruebas
-- SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN

-- Opción 1: Deshabilitar RLS (MÁS SIMPLE PARA TESTING)
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Opción 2: Si prefieres mantener RLS activo, ejecuta estas políticas
-- (Descomenta las líneas de abajo si quieres usar Opción 2)

/*
CREATE POLICY IF NOT EXISTS "Permitir todo en restaurantes"
ON restaurants FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Permitir todo en categorías"
ON categories FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Permitir todo en productos"
ON products FOR ALL TO public USING (true) WITH CHECK (true);
*/

-- Verificar que quedó deshabilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('restaurants', 'categories', 'products');

-- Si dice 'f' (false), RLS está deshabilitado y funcionará
