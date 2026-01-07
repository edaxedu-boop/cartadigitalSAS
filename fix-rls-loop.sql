-- =========================================================
-- FIX: ROMPER BUCLE INFINITO RLS (ERROR 500)
-- =========================================================

-- 1. Crear una función segura que se salta el RLS para verificar admin
-- (Esto rompe el bucle infinito)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER -- 👈 La clave: se ejecuta con permisos de sistema
SET search_path = public -- Seguridad recomendada
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$;

-- 2. Limpiar políticas recursivas de user_roles
DROP POLICY IF EXISTS "Super admin gestiona todos los roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;

-- 3. Crear políticas limpias usando la función segura

-- A) Admin puede hacer todo (usando la función segura)
CREATE POLICY "Super admin gestiona todos los roles"
ON user_roles FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- B) Usuarios normales pueden leer SU propio rol
CREATE POLICY "Users can read their own role"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 4. Actualizar políticas de otras tablas para usar la función optimizada
-- (Opcional pero recomendado para performance)

DROP POLICY IF EXISTS "Super admin acceso total restaurants" ON restaurants;
CREATE POLICY "Super admin acceso total restaurants"
ON restaurants FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "Super admin acceso total categories" ON categories;
CREATE POLICY "Super admin acceso total categories"
ON categories FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "Super admin acceso total products" ON products;
CREATE POLICY "Super admin acceso total products"
ON products FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

DO $$
BEGIN
  RAISE NOTICE '✅ Bucle infinito reparado. Las políticas ahora son seguras.';
END $$;
