-- =========================================================
-- Agregar configuración de delivery y pagos
-- =========================================================

-- Agregar columnas para zonas de delivery y métodos de pago
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS delivery_zones JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[
  {"id": "yape", "name": "Yape", "enabled": true},
  {"id": "plin", "name": "Plin", "enabled": true},
  {"id": "efectivo", "name": "Efectivo", "enabled": true},
  {"id": "otro", "name": "Otro", "enabled": false}
]'::jsonb;

-- Actualizar restaurantes existentes con métodos de pago por defecto
UPDATE restaurants 
SET payment_methods = '[
  {"id": "yape", "name": "Yape", "enabled": true},
  {"id": "plin", "name": "Plin", "enabled": true},
  {"id": "efectivo", "name": "Efectivo", "enabled": true},
  {"id": "otro", "name": "Otro", "enabled": false}
]'::jsonb
WHERE payment_methods IS NULL OR payment_methods = '[]'::jsonb;

-- Ejemplo de zonas de delivery (puedes modificarlo desde el panel)
COMMENT ON COLUMN restaurants.delivery_zones IS 'Ejemplo: [{"id":"z1","name":"Centro","price":5},{"id":"z2","name":"Norte","price":8}]';

SELECT 'Configuración de delivery y pagos agregada exitosamente' as resultado;
