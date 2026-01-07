# 🚀 Guía de Despliegue - MenuPe con Supabase

## Paso 1: Configurar Supabase

### 1.1 Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Crea una cuenta (puedes usar GitHub)

### 1.2 Crear un nuevo proyecto

1. Click en "New Project"
2. Completa los datos:
   - **Name**: MenuPe (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Escoge la más cercana (South America - São Paulo)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras Supabase configura la base de datos

### 1.3 Obtener las credenciales

1. En el dashboard de tu proyecto, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public** key (la clave pública)

### 1.4 Crear las tablas

1. En el dashboard, ve a **SQL Editor**
2. Click en "New Query"
3. Pega el siguiente SQL y ejecuta:

```sql
-- Tabla de Restaurantes
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  whatsapp_number VARCHAR(20),
  primary_color VARCHAR(7) DEFAULT '#dc2626',
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  "restaurantId" UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  "restaurantId" UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  "categoryId" UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  "imageUrl" TEXT,
  is_available BOOLEAN DEFAULT true,
  "isAvailable" BOOLEAN DEFAULT true,
  option_groups JSONB,
  "optionGroups" JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar datos de ejemplo (opcional)
INSERT INTO restaurants (id, name, slug, description, whatsapp_number, primary_color, logo_url, banner_url, address, instagram, facebook)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Pollería El Sabor',
  'sabor',
  'El mejor pollo a la brasa de la ciudad',
  '51987654321',
  '#dc2626',
  'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'Av. Principal 123, Lima',
  'https://instagram.com/elsabor',
  'https://facebook.com/elsabor'
);

INSERT INTO categories (id, restaurant_id, "restaurantId", name)
VALUES 
  ('cat-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pollos'),
  ('cat-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bebidas');

INSERT INTO products (id, restaurant_id, "restaurantId", category_id, "categoryId", name, description, price, image_url, "imageUrl", is_available, "isAvailable")
VALUES 
  ('prod-1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-1', 'cat-1', 'Pollo entero', 'Pollo a la brasa con papas y ensalada', 45.00, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', true, true),
  ('prod-2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cat-2', 'cat-2', 'Inca Kola 1.5L', 'Bebida refrescante', 7.50, 'https://images.unsplash.com/photo-1581098365948-6a5a912b2227', 'https://images.unsplash.com/photo-1581098365948-6a5a912b2227', true, true);
```

### 1.5 Configurar políticas de seguridad (RLS)

1. Ve a **Authentication** → **Policies**
2. Para cada tabla, habilita Row Level Security (RLS)
3. Crea políticas para lectura pública:

```sql
-- Permitir lectura pública de restaurantes
CREATE POLICY "Permitir lectura pública de restaurantes"
ON restaurants FOR SELECT
TO public
USING (true);

-- Permitir lectura pública de categorías
CREATE POLICY "Permitir lectura pública de categorías"
ON categories FOR SELECT
TO public
USING (true);

-- Permitir lectura pública de productos
CREATE POLICY "Permitir lectura pública de productos"
ON products FOR SELECT
TO public
USING (true);
```

---

## Paso 2: Configurar localmente

1. Crea el archivo `.env.local` en la raíz del proyecto:

```env
VITE_GEMINI_API_KEY=tu_gemini_api_key_opcional
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

2. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

3. Prueba que funcione accediendo a: `http://localhost:3000/menu/sabor`

---

## Paso 3: Obtener API Key de Gemini (Opcional)

Si quieres usar la funcionalidad de IA para generar descripciones:

1. Ve a [ai.google.dev](https://ai.google.dev)
2. Click en "Get API key"
3. Crea una API key
4. Agrégala a tu `.env.local`

---

## Paso 4: Desplegar en Vercel

### Opción A: Desde la Interfaz Web (Más fácil)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Proyecto MenuPe listo para deploy"
   git branch -M main
   # Crea un repo en GitHub primero
   git remote add origin https://github.com/TU-USUARIO/menupe.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com) y crea una cuenta
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Vite

3. **Configura las variables de entorno:**
   - Antes de hacer deploy, click en "Environment Variables"
   - Agrega:
     - `VITE_SUPABASE_URL` → tu URL de Supabase
     - `VITE_SUPABASE_ANON_KEY` → tu anon key
     - `VITE_GEMINI_API_KEY` → tu API key de Gemini (opcional)
   - Selecciona que apliquen para Production, Preview y Development

4. **Deploy:**
   - Click en "Deploy"
   - Espera 1-2 minutos
   - ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

### Opción B: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones y agregar las variables de entorno cuando te pregunte
```

---

## Paso 5: Verificar el Despliegue

1. Abre la URL de Vercel
2. Prueba acceder al menú: `https://tu-proyecto.vercel.app/#/menu/sabor`
3. Verifica que:
   - Se cargue el restaurante
   - Se muestren las categorías y productos
   - Funcione el carrito de compras
   - El botón de WhatsApp funcione

---

## Paso 6: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

---

## 🎯 Resumen de URLs Importantes

- **Dashboard de Supabase**: https://app.supabase.com
- **Tu proyecto en Vercel**: https://vercel.com/dashboard
- **Gemini API**: https://ai.google.dev
- **Tu app en producción**: https://tu-proyecto.vercel.app

---

## 🐛 Troubleshooting

### "Error: Database connection failed"
- Verifica que las credenciales de Supabase sean correctas
- Confirma que las tablas estén creadas
- Revisa que RLS esté configurado correctamente

### "CORS error"
- Ve a Supabase → Settings → API
- Asegúrate de que la URL de Vercel esté permitida

### "Variables de entorno no funcionan"
- Verifica que tengan el prefijo `VITE_`
- Reinicia el servidor después de cambiarlas
- En Vercel, redeploy después de agregar variables

### "No se muestran datos"
- Verifica que hayamos insertado los datos de ejemplo
- Abre la consola del navegador para ver errores
- Revisa los logs en Vercel

---

## 📱 Próximos Pasos

1. **Personaliza tu restaurante:**
   - Modifica los datos en Supabase
   - Cambia colores, logos, imágenes

2. **Agrega más funcionalidades:**
   - Sistema de autenticación para dueños
   - Panel de administración completo
   - Analytics de pedidos

3. **Optimiza:**
   - Comprime imágenes
   - Configura caché
   - Agrega SEO

---

¿Necesitas ayuda con algún paso específico? 🚀
