-- Agregar columna 'plan' a la tabla restaurants
-- Valores posibles: 'basic', 'standard', 'premium'
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'basic';

COMMENT ON COLUMN restaurants.plan IS 'Plan de suscripción: basic (50 platos), standard (100 platos), premium (ilimitado)';

-- Agregar columna 'subscription_status' por si acaso se necesita en el futuro (active, inactive, past_due)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

SELECT 'Columnas de plan agregadas correctamente' as resultado;
