-- Agregar columna email a restaurants para visualización fácil
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Actualizar el email para el restaurante de prueba (pollo rojo) si tiene user_id
-- (Esto es un ejemplo, se llenará con los nuevos registros)
UPDATE restaurants 
SET email = 'No disponible (creado antes de actualización)' 
WHERE email IS NULL;
