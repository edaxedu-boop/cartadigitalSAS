-- =========================================================
-- FIX: PERMISOS PARA QUE SUPER ADMIN ASIGNE ROLES
-- =========================================================

-- 1. Habilitar seguridad RLS en tabla de roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas antiguas que podrían bloquear
DROP POLICY IF EXISTS "Super admin gestiona todos los roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_roles;

-- 3. POLÍTICA CLAVE: 
-- Permite al Super Admin CREAR y GESTIONAR roles de otros.
-- El código de la App usará este permiso para asignar 'restaurant_admin'.
CREATE POLICY "Super admin gestiona todos los roles"
ON user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'super_admin'
  )
);

-- 4. POLÍTICA DE LECTURA:
-- Permite que cada usuario (incluido el nuevo restaurant admin)
-- pueda LEER su propio rol para poder iniciar sesión.
CREATE POLICY "Users can read their own role"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Verificación
DO $$
BEGIN
  RAISE NOTICE '✅ Permisos actualizados correctamente.';
  RAISE NOTICE 'Ahora el Super Admin puede asignar roles.';
END $$;
