-- Agregar columna de estado activo/inactivo
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Asegurar que existe created_at (generalmente Supabase lo crea, pero por si acaso)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN restaurants.is_active IS 'Indica si el restaurante tiene acceso al sistema';
