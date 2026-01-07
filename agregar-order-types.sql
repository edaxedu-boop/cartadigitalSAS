-- Agregar columna order_types si no existe
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS order_types JSONB DEFAULT '{"delivery": true, "takeaway": true, "dineIn": true}'::jsonb;

COMMENT ON COLUMN restaurants.order_types IS 'Configuración de tipos de pedido habilitados: delivery, takeaway, dineIn';
