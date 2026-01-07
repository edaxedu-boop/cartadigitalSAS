-- =========================================================
-- Agregar campo de horarios a la tabla restaurants
-- =========================================================

-- Agregar columna para horarios (JSON)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}';

-- Ejemplo de estructura JSON para business_hours:
-- {
--   "monday": {"open": "09:00", "close": "22:00", "closed": false},
--   "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
--   "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
--   "thursday": {"open": "09:00", "close": "22:00", "closed": false},
--   "friday": {"open": "09:00", "close": "22:00", "closed": false},
--   "saturday": {"open": "10:00", "close": "23:00", "closed": false},
--   "sunday": {"open": "10:00", "close": "20:00", "closed": false}
-- }

-- Actualizar restaurantes existentes con horarios por defecto
UPDATE restaurants 
SET business_hours = '{
  "monday": {"open": "09:00", "close": "22:00", "closed": false},
  "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
  "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
  "thursday": {"open": "09:00", "close": "22:00", "closed": false},
  "friday": {"open": "09:00", "close": "23:00", "closed": false},
  "saturday": {"open": "10:00", "close": "23:00", "closed": false},
  "sunday": {"open": "10:00", "close": "20:00", "closed": false}
}'::jsonb
WHERE business_hours IS NULL OR business_hours = '{}'::jsonb;

SELECT 'Horarios agregados exitosamente' as resultado;
