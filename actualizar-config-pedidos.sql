-- =========================================================
-- Actualización COMPLETA de configuración de pedidos
-- =========================================================

-- 1. Agregar columnas si no existen
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS delivery_zones JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[
  {"id": "yape", "name": "Yape", "enabled": true},
  {"id": "plin", "name": "Plin", "enabled": true},
  {"id": "efectivo", "name": "Efectivo", "enabled": true}
]'::jsonb,
ADD COLUMN IF NOT EXISTS order_types JSONB DEFAULT '{
  "delivery": true,
  "takeaway": true,
  "dineIn": true
}'::jsonb;

-- 2. Asegurar valores por defecto en registros existentes
UPDATE restaurants 
SET order_types = '{
  "delivery": true,
  "takeaway": true,
  "dineIn": true
}'::jsonb
WHERE order_types IS NULL;

UPDATE restaurants 
SET payment_methods = '[
  {"id": "yape", "name": "Yape", "enabled": true},
  {"id": "plin", "name": "Plin", "enabled": true},
  {"id": "efectivo", "name": "Efectivo", "enabled": true}
]'::jsonb
WHERE payment_methods IS NULL OR payment_methods = '[]'::jsonb;

SELECT 'Configuración de pedidos actualizada correctamente' as resultado;
