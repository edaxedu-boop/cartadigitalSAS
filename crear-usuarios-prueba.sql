-- ================================================
-- SCRIPT RÁPIDO: CREAR USUARIOS DE PRUEBA
-- Ejecuta esto DESPUÉS de crear los usuarios en Authentication
-- ================================================

-- ⚠️ IMPORTANTE: 
-- Primero debes crear los usuarios en Supabase Dashboard:
-- Authentication → Users → Add user
-- 
-- 1. admin@menupe.com (Super Admin)
-- 2. sabor@restaurant.com (Restaurant Admin ejemplo)
--

-- ================================================
-- 1. ASIGNAR ROL DE SUPER ADMIN
-- ================================================

INSERT INTO user_roles (user_id, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@menupe.com'), 
  'super_admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- ================================================
-- 2. CREAR RESTAURANTE Y ASIGNAR RESTAURANT ADMIN
-- ================================================

DO $$
DECLARE
  restaurant_uuid UUID;
  user_uuid UUID;
  cat_pollos_uuid UUID;
  cat_parrillas_uuid UUID;
  cat_entradas_uuid UUID;
  cat_bebidas_uuid UUID;
BEGIN
  -- Obtener el ID del usuario
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'sabor@restaurant.com' 
  LIMIT 1;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION '❌ Usuario sabor@restaurant.com no encontrado. Créalo primero en Authentication → Users';
  END IF;
  
  -- Crear restaurante
  INSERT INTO restaurants (
    user_id, 
    name, 
    slug, 
    description, 
    whatsapp_number, 
    primary_color, 
    logo_url, 
    banner_url, 
    address, 
    instagram, 
    facebook
  )
  VALUES (
    user_uuid,
    'Pollería El Sabor Peruano',
    'sabor',
    'El mejor pollo a la brasa de Lima. Más de 20 años deleitando paladares.',
    '51987654321',
    '#dc2626',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
    'Av. Arequipa 1234, Miraflores, Lima',
    'https://instagram.com/elsaborperuano',
    'https://facebook.com/elsaborperuano'
  )
  ON CONFLICT (slug) DO UPDATE 
  SET user_id = EXCLUDED.user_id,
      name = EXCLUDED.name
  RETURNING id INTO restaurant_uuid;
  
  -- Asignar rol
  INSERT INTO user_roles (user_id, role, restaurant_id)
  VALUES (user_uuid, 'restaurant_admin', restaurant_uuid)
  ON CONFLICT (user_id) DO UPDATE 
  SET role = 'restaurant_admin', 
      restaurant_id = EXCLUDED.restaurant_id;
  
  -- Crear categorías
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🍗 Pollos a la Brasa')
  ON CONFLICT DO NOTHING
  RETURNING id INTO cat_pollos_uuid;
  
  IF cat_pollos_uuid IS NULL THEN
    SELECT id INTO cat_pollos_uuid FROM categories 
    WHERE restaurant_id = restaurant_uuid AND name = '🍗 Pollos a la Brasa' LIMIT 1;
  END IF;
  
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥩 Parrillas')
  ON CONFLICT DO NOTHING
  RETURNING id INTO cat_parrillas_uuid;
  
  IF cat_parrillas_uuid IS NULL THEN
    SELECT id INTO cat_parrillas_uuid FROM categories 
    WHERE restaurant_id = restaurant_uuid AND name = '🥩 Parrillas' LIMIT 1;
  END IF;
  
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥗 Entradas')
  ON CONFLICT DO NOTHING
  RETURNING id INTO cat_entradas_uuid;
  
  IF cat_entradas_uuid IS NULL THEN
    SELECT id INTO cat_entradas_uuid FROM categories 
    WHERE restaurant_id = restaurant_uuid AND name = '🥗 Entradas' LIMIT 1;
  END IF;
  
  INSERT INTO categories (restaurant_id, "restaurantId", name)
  VALUES (restaurant_uuid, restaurant_uuid, '🥤 Bebidas')
  ON CONFLICT DO NOTHING
  RETURNING id INTO cat_bebidas_uuid;
  
  IF cat_bebidas_uuid IS NULL THEN
    SELECT id INTO cat_bebidas_uuid FROM categories 
    WHERE restaurant_id = restaurant_uuid AND name = '🥤 Bebidas' LIMIT 1;
  END IF;
  
  -- Crear productos de ejemplo
  INSERT INTO products (restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
  VALUES 
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 
     'Pollo Entero', 
     'Pollo a la brasa dorado y jugoso con papas fritas y ensalada fresca', 
     45.00, 
     'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 
     'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', 
     true, true),
    (restaurant_uuid, restaurant_uuid, cat_pollos_uuid, cat_pollos_uuid, 
     'Medio Pollo', 
     'Media porción de nuestro delicioso pollo a la brasa', 
     25.00, 
     'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', 
     'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', 
     true, true),
    (restaurant_uuid, restaurant_uuid, cat_parrillas_uuid, cat_parrillas_uuid, 
     'Churrasco a lo Pobre', 
     'Jugoso churrasco con papas, huevo frito, plátano y arroz', 
     32.00, 
     'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', 
     'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', 
     true, true),
    (restaurant_uuid, restaurant_uuid, cat_entradas_uuid, cat_entradas_uuid, 
     'Ensalada César', 
     'Lechuga fresca, crutones, queso parmesano y aderezo césar', 
     18.00, 
     'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 
     'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 
     true, true),
    (restaurant_uuid, restaurant_uuid, cat_bebidas_uuid, cat_bebidas_uuid, 
     'Chicha Morada', 
     'Refrescante chicha morada casera', 
     5.00, 
     'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 
     'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 
     true, true)
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ Restaurante creado: %', restaurant_uuid;
  RAISE NOTICE '✅ Usuario sabor@restaurant.com es ahora Restaurant Admin';
  RAISE NOTICE '✅ Categorías: 4';
  RAISE NOTICE '✅ Productos: 5';
  RAISE NOTICE '🔗 Accede al menú en: /#/menu/sabor';
END $$;

-- ================================================
-- VERIFICAR QUE TODO ESTÁ BIEN
-- ================================================

-- Ver todos los usuarios y sus roles
SELECT 
  u.email,
  ur.role,
  r.name as restaurant_name,
  r.slug
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN restaurants r ON ur.restaurant_id = r.id
ORDER BY ur.role, u.email;

-- ================================================
-- ✅ LISTO!
-- ================================================
-- Ahora puedes hacer login con:
-- 
-- Super Admin:
--   Email: admin@menupe.com
--   Password: (la que configuraste)
-- 
-- Restaurant Admin:
--   Email: sabor@restaurant.com
--   Password: (la que configuraste)
-- ================================================
