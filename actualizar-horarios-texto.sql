-- =========================================================
-- Actualizar campo de horarios a TEXT simple
-- =========================================================

-- Modificar columna business_hours de JSONB a TEXT
ALTER TABLE restaurants 
ALTER COLUMN business_hours TYPE TEXT USING business_hours::text;

-- Actualizar restaurantes existentes con horarios por defecto en formato texto
UPDATE restaurants 
SET business_hours = 'Lun-Vie: 9:00am - 10:00pm
Sáb-Dom: 10:00am - 8:00pm'
WHERE business_hours IS NULL OR business_hours = '' OR business_hours = '{}';

SELECT 'Horarios actualizados a formato de texto' as resultado;
