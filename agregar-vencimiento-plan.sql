-- Agregar columna para fecha de expiración del plan
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN restaurants.plan_expires_at IS 'Fecha y hora en que vence la suscripción actual';
