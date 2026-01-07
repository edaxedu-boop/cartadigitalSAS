# 🔐 Configuración de Autenticación con Supabase

Este documento explica cómo configurar el sistema de login con **Supabase Auth** para MenuPe. El sistema soporta dos tipos de usuarios:

- 🔑 **Super Admin**: Puede crear y gestionar múltiples restaurantes
- 🏪 **Restaurant Admin**: Puede gestionar solo su propio restaurante

---

## 📋 Requisitos Previos

1. ✅ Tener un proyecto en Supabase creado
2. ✅ Variables de entorno configuradas (`.env.local`)
3. ✅ Haber ejecutado el script `supabase-auth-setup.sql`

---

## 🚀 Paso 1: Ejecutar el Script SQL

1. Ve a tu proyecto de Supabase
2. Abre **SQL Editor**
3. Copia TODO el contenido de `supabase-auth-setup.sql`
4. Ejecuta el script (**Run** o `Ctrl/Cmd + Enter`)

Esto creará:
- ✅ Tablas actualizadas con `user_id`
- ✅ Tabla `user_roles` para gestionar roles
- ✅ Políticas RLS basadas en roles
- ✅ Funciones helper

---

## 👤 Paso 2: Crear el Super Admin

### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa los datos:
   - **Email**: `admin@menupe.com` (o el que prefieras)
   - **Password**: elige una contraseña segura
   - **Auto Confirm User**: ✅ Activa esta opción
4. Haz clic en **"Create user"**

5. **Asignar el rol de Super Admin**:
   - Ve a **SQL Editor**
   - Ejecuta este comando (reemplaza el email si usaste otro):

```sql
INSERT INTO user_roles (user_id, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@menupe.com'), 
  'super_admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

6. ✅ ¡Ya tienes tu Super Admin creado!

---

## 🏪 Paso 3: Crear un Restaurant Admin

### 3.1. Crear el Usuario

1. Ve a **Authentication** → **Users**
2. **"Add user"** → **"Create new user"**
3. Datos:
   - **Email**: `sabor@restaurant.com` (ejemplo)
   - **Password**: tu contraseña
   - **Auto Confirm User**: ✅
4. **"Create user"**

### 3.2. Crear el Restaurante y Asignar Permisos

Ve a **SQL Editor** y ejecuta este código (personaliza los datos):

```sql
DO $$
DECLARE
  restaurant_uuid UUID;
  user_uuid UUID;
BEGIN
  -- Obtener el ID del usuario que acabas de crear
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'sabor@restaurant.com' 
  LIMIT 1;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado. Primero crea el usuario en Authentication.';
  END IF;
  
  -- Crear el restaurante asociado al usuario
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
    'Pollería El Sabor Peruano',                    -- Nombre del restaurante
    'sabor',                                         -- Slug (URL amigable)
    'El mejor pollo a la brasa de Lima',            -- Descripción
    '51987654321',                                   -- WhatsApp
    '#dc2626',                                       -- Color primario
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',  -- Logo
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200', -- Banner
    'Av. Arequipa 1234, Miraflores, Lima',          -- Dirección
    'https://instagram.com/elsaborperuano',         -- Instagram
    'https://facebook.com/elsaborperuano'           -- Facebook
  )
  RETURNING id INTO restaurant_uuid;
  
  -- Asignar el rol de restaurant_admin
  INSERT INTO user_roles (user_id, role, restaurant_id)
  VALUES (user_uuid, 'restaurant_admin', restaurant_uuid);
  
  RAISE NOTICE '✅ Restaurante creado con ID: %', restaurant_uuid;
  RAISE NOTICE '✅ Usuario % es ahora Restaurant Admin', 'sabor@restaurant.com';
END $$;
```

---

## 🧪 Paso 4: Probar el Login

### 4.1. Iniciar la Aplicación

```bash
npm run dev
```

### 4.2. Probar Super Admin

1. Ve a `http://localhost:5173/#/login`
2. Ingresa:
   - **Email**: `admin@menupe.com`
   - **Password**: tu contraseña
3. Deberías ser redirigido a `/super-admin`

### 4.3. Probar Restaurant Admin

1. Cierra sesión (haz logout)
2. Ve a `/#/login`
3. Ingresa:
   - **Email**: `sabor@restaurant.com`
   - **Password**: tu contraseña
4. Deberías ser redirigido a `/dashboard`

---

## 🔍 Verificar que Todo Funciona

Abre la consola del navegador (F12) y busca estos mensajes:

```
✅ Cliente Supabase inicializado correctamente
✅ Login exitoso: admin@menupe.com
```

---

## 🎯 Flujo de Autenticación

### Super Admin:
1. Login con email/password
2. Supabase Auth verifica credenciales
3. App consulta `user_roles` → detecta `super_admin`
4. Redirección a `/super-admin`
5. Puede crear/editar/eliminar cualquier restaurante

### Restaurant Admin:
1. Login con email/password
2. Supabase Auth verifica credenciales
3. App consulta `user_roles` → detecta `restaurant_admin`
4. Obtiene su `restaurant_id`
5. Redirección a `/dashboard`
6. Solo puede editar SU restaurante (RLS lo protege)

---

## 🔐 Seguridad (Row Level Security)

Las políticas RLS garantizan:

- ✅ **Lectura pública**: Cualquiera puede ver los menús
- ✅ **Super Admin**: Acceso total a todo
- ✅ **Restaurant Admin**: Solo puede modificar su propio restaurante
- ✅ **No autenticados**: Solo lectura

---

## ⚙️ Variables de Entorno Necesarias

Asegúrate de tener en `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🆘 Solución de Problemas

### ❌ "Email o contraseña incorrectos"
- Verifica que el usuario exista en **Authentication → Users**
- Asegúrate de que el usuario esté **confirmado** (Auto Confirm activado)

### ❌ "No se pudo determinar tu rol de usuario"
- Verifica que el usuario tenga un registro en `user_roles`:
  ```sql
  SELECT * FROM user_roles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'tu@email.com'
  );
  ```

### ❌ "Usuario sin permisos asignados"
- El usuario existe pero no tiene rol asignado
- Ejecuta el INSERT INTO user_roles correspondiente

### ❌ "Supabase no está configurado"
- Verifica las variables de entorno en `.env.local`
- Reinicia el servidor de desarrollo

### ❌ No me redirige después del login
- Abre la consola del navegador (F12)
- Busca errores relacionados con `user_roles`
- Verifica que el RLS permita leer la tabla `user_roles`

---

## 📝 Crear Más Restaurantes

### Como Super Admin en la App:
1. Login como super admin
2. Ve a `/super-admin`
3. Usa el formulario para crear nuevos restaurantes
4. Los usuarios se crean automáticamente

### Manualmente con SQL:
Repite el Paso 3 con diferentes emails y datos de restaurante.

---

## 🔄 Cerrar Sesión (Logout)

Para implementar logout, en cualquier componente:

```typescript
const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  // Limpiar estado local
  logout();
  navigate('/login');
};
```

---

## ✅ Checklist Final

- [ ] Script `supabase-auth-setup.sql` ejecutado
- [ ] Super Admin creado en Authentication
- [ ] Rol de Super Admin asignado en `user_roles`
- [ ] Al menos un Restaurant Admin creado
- [ ] Restaurante asociado al Restaurant Admin
- [ ] Variables de entorno configuradas
- [ ] Login funciona para ambos roles
- [ ] Redirecciones correctas
- [ ] RLS protege los datos correctamente

---

**¡Listo!** 🎉 Tu sistema de autenticación con Supabase está completamente configurado.
