-- Agregar columna para banners promocionales (array de textos)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS promo_banners JSONB DEFAULT '[]';

COMMENT ON COLUMN restaurants.promo_banners IS 'Array de URLs de imagenes para el carrusel: ["url1", "url2"]';

SELECT 'Columna promo_banners agregada correctamente' as resultado;
